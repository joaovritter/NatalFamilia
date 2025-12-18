import express from 'express';
import prisma from './config/prisma.js';
import { processPayment } from './payment.js';
import upload from './upload.js';
import { nanoid } from 'nanoid';


import siteRoutes from './routes/siteRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const router = express.Router();






router.use('/', siteRoutes);


router.use('/', webhookRoutes);









router.post('/payment', async (req, res) => {
  try {
    const paymentData = req.body;
    console.log('Recebido payload do Brick:', JSON.stringify(paymentData, null, 2));


    paymentData.description = 'Natal da Família';
    paymentData.transaction_amount = 14.90;

    const mpResponse = await processPayment(paymentData);



    const payment = mpResponse;

    const mpId = payment.id;
    const status = payment.status;
    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code || null;
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64 || null;

    const newPayment = await prisma.payment.create({
      data: {
        mp_payment_id: String(mpId),
        status: status,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64
      }
    });

    res.json({
      id: newPayment.id,
      mp_payment_id: mpId,
      status: status,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar pagamento', details: error.message, cause: error.cause });
  }
});


router.get('/payment/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: id }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }





    if (req.query.simular === 'true') {
      const updatedPayment = await prisma.payment.update({
        where: { id: id },
        data: { status: 'approved' }
      });
      return res.json(updatedPayment);
    }

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pagamento' });
  }
});



const uploadFields = upload.fields([
  { name: 'photos', maxCount: 20 },
  { name: 'wish_images', maxCount: 15 },
  { name: 'timeline_photos', maxCount: 20 }
]);

router.post('/family', uploadFields, async (req, res) => {
  const { name, paymentId } = req.body;

  const photosFiles = req.files['photos'] || [];
  const wishFiles = req.files['wish_images'] || [];
  const timelineFiles = req.files['timeline_photos'] || [];

  if (!name || !paymentId) {
    return res.status(400).json({ error: 'Nome e ID do pagamento são obrigatórios' });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) }
    });

    if (!payment) return res.status(400).json({ error: 'Pagamento inválido' });

    // 1. General Photos (Carousel) - Just paths
    const photoPaths = photosFiles.map(f => `/uploads/${f.filename}`);
    const photosJson = JSON.stringify(photoPaths);

    // 2. Timeline Photos (Metadata)
    const timelinePaths = timelineFiles.map(f => `/uploads/${f.filename}`);
    let timelineData = [];

    if (req.body.timeline_metadata) {
      try {
        const metadata = JSON.parse(req.body.timeline_metadata);
        // Map metadata to uploaded files. 
        // NOTE: The order of req.files['timeline_photos'] should match the client-side append order
        timelineData = timelinePaths.map((path, index) => ({
          src: path,
          date: metadata[index]?.date || null,
          caption: metadata[index]?.caption || null
        }));
      } catch (e) {
        console.error("Erro parsing timeline_metadata", e);
      }
    }
    const timelineJson = JSON.stringify(timelineData);


    let wishesData = [];
    if (req.body.wishes) {
      try {
        wishesData = JSON.parse(req.body.wishes);
        let fileIndex = 0;
        wishesData = wishesData.map(wish => {
          if (wish.hasNewImage && fileIndex < wishFiles.length) {
            const foundFile = wishFiles[fileIndex];
            fileIndex++;

            return { ...wish, image: `/uploads/${foundFile.filename}`, icon: null };
          }
          return wish;
        });
      } catch (e) {
        console.error('Erro ao processar wishes JSON', e);
      }
    }

    const shortCode = nanoid(6);


    const cleanName = name.trim().replace(/\s+/g, '-');


    const uniqueSlug = `${cleanName}-${shortCode}`;

    try {
      const newFamily = await prisma.family.create({
        data: {
          name: name,
          slug: uniqueSlug,
          payment_id: parseInt(paymentId),
          photos: photosJson, // General Carousel
          timeline: timelineJson, // Photo Timeline
          youtubeLink: req.body.youtubeLink || null,
          message: req.body.message || null,
          wishes: JSON.stringify(wishesData)
        }
      });

      res.json({
        success: true,
        id: newFamily.id,
        slug: newFamily.slug
      });

    } catch (err) {
      console.error('Erro ao criar família no banco:', err);
      throw err;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar família' });
  }
});


router.get('/family/:slug', async (req, res) => {
  try {
    const { slug } = req.params;


    const family = await prisma.family.findUnique({
      where: { slug: slug }
    });

    if (!family) {
      return res.status(404).json({ error: 'Família não encontrada' });
    }



    let processedWishes = [];
    if (family.wishes) {
      try {
        processedWishes = JSON.parse(family.wishes);
      } catch (e) {
        processedWishes = [];
      }
    }

    let processedPhotos = [];
    if (family.photos) {
      try {
        processedPhotos = JSON.parse(family.photos);
      } catch (e) {
        processedPhotos = [];
      }
    }

    let processedTimeline = [];
    if (family.timeline) {
      try {
        processedTimeline = JSON.parse(family.timeline);
      } catch (e) {
        processedTimeline = [];
      }
    }

    res.json({
      ...family,
      wishes: processedWishes,
      photos: processedPhotos,
      timeline: processedTimeline
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar família' });
  }
});

// --- Time Capsule Routes ---

router.post('/capsule', async (req, res) => {
  try {
    const { familySlug, sender, message } = req.body;

    const family = await prisma.family.findUnique({
      where: { slug: familySlug }
    });

    if (!family) return res.status(404).json({ error: 'Família não encontrada' });

    const newMsg = await prisma.capsuleMessage.create({
      data: {
        familyId: family.id,
        sender,
        message
      }
    });

    res.json(newMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar mensagem' });
  }
});

router.get('/capsule/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const family = await prisma.family.findUnique({
      where: { slug },
      include: {
        capsule_messages: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!family) return res.status(404).json({ error: 'Família não encontrada' });

    res.json(family.capsule_messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar cápsula' });
  }
});

export default router;
