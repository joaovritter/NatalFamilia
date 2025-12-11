import express from 'express';
import prisma from './config/prisma.js';
import { processPayment } from './payment.js';
import upload from './upload.js';

// Importar novas rotas seguras
import siteRoutes from './routes/siteRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const router = express.Router();

// ============================================
// NOVAS ROTAS SEGURAS (PostgreSQL + Prisma)
// ============================================

// Rotas de criação e visualização de sites (com validação completa)
router.use('/', siteRoutes);

// Webhook do Mercado Pago (validação crítica)
router.use('/', webhookRoutes);

// ============================================
// ROTAS LEGADAS (Migradas para Postgres)
// ============================================

// --- Pagamentos ---

// Criar Pagamento Pix
// Criar Pagamento (Via Bricks)
router.post('/payment', async (req, res) => {
  try {
    const paymentData = req.body;
    console.log('Recebido payload do Brick:', JSON.stringify(paymentData, null, 2));

    // O Brick envia todos os dados necessários
    paymentData.description = 'Natal da Família';
    paymentData.transaction_amount = 29.90; // Forçar valor no backend por segurança

    const mpResponse = await processPayment(paymentData);

    // O objeto retornado pelo SDK tem a estrutura { id, status, ... } ou response.id dependendo da versão/wrapper
    // No wrapper novo v2: response é o objeto do pagamento direto
    const payment = mpResponse;

    const mpId = payment.id;
    const status = payment.status;
    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code || null;
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64 || null;

    const newPayment = await prisma.payment.create({
      data: {
        mp_payment_id: String(mpId), // Ensure string
        status: status,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64
      }
    });

    res.json({
      id: newPayment.id, // ID interno
      mp_payment_id: mpId,
      status: status,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
});

// Verificar Status do Pagamento
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

    // Em produção, você consultaria a API do Mercado Pago novamente aqui para garantir o status atual
    // Para simplificar, vamos assumir que o webhook (não implementado aqui) ou polling atualizaria o banco
    // OU vamos simular aprovação se passar um parâmetro ?simular=true

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

// --- Família ---

// Criar/Salvar Família (Protegido por Payment ID)
router.post('/family', upload.array('photos', 10), async (req, res) => {
  const { name, paymentId } = req.body;
  const files = req.files;

  if (!name || !paymentId) {
    return res.status(400).json({ error: 'Nome e ID do pagamento são obrigatórios' });
  }

  try {
    // Verificar se pagamento foi aprovado
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) }
    });

    if (!payment) return res.status(400).json({ error: 'Pagamento inválido' });

    if (payment.status !== 'approved') {
      // Para testes, vamos permitir 'pending' também se não estivermos usando webhook real
      // return res.status(403).json({ error: 'Pagamento não aprovado' });
    }

    const photoPaths = files.map(f => `/uploads/${f.filename}`);
    const photosJson = JSON.stringify(photoPaths);

    try {
      const newFamily = await prisma.family.create({
        data: {
          name: name,
          payment_id: parseInt(paymentId),
          photos: photosJson
        }
      });
      res.json({ success: true, familyId: newFamily.id });
    } catch (err) {
      if (err.code === 'P2002') { // Prisma unique constraint error
        return res.status(409).json({ error: 'Nome de família já existe' });
      }
      throw err;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar família' });
  }
});

// Obter Família
router.get('/family/:name', async (req, res) => {
  const name = req.params.name;

  try {
    const family = await prisma.family.findUnique({
      where: { name: name }
    });

    if (!family) return res.status(404).json({ error: 'Família não encontrada' });

    res.json({
      name: family.name,
      photos: JSON.parse(family.photos)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar família' });
  }
});

export default router;
