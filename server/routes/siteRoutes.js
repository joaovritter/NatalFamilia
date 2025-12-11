import express from 'express';
import prisma from '../config/prisma.js';
import { validateCreateSite } from '../validators/siteValidator.js';
import { createPreference } from '../services/mercadopago.js';
import { SITE_PRICE } from '../config/constants.js';
import { createSiteLimiter } from '../middleware/security.js';
import { nanoid } from 'nanoid';

const router = express.Router();

/**
 * POST /api/create
 * Criar novo site de Natal
 * Validação: Preço hardcoded no backend, inputs sanitizados
 */
router.post('/create', createSiteLimiter, validateCreateSite, async (req, res) => {
  try {
    const { familyName, message, photoUrl } = req.validatedData;

    // PREÇO HARDCODED - NUNCA CONFIE NO FRONTEND
    const price = SITE_PRICE;

    // Gerar ID manualmente (NanoID 21 chars)
    const siteId = nanoid(21);

    // Criar documento no PostgreSQL com status PENDING
    const site = await prisma.christmasSite.create({
      data: {
        id: siteId,
        familyName,
        message,
        photoUrl,
        price,
        paymentStatus: 'PENDING',
        mp_preference_id: 'TEMP' // Será atualizado logo abaixo
      }
    });

    // Criar preferência no Mercado Pago vinculando o ID
    const mpPreference = await createPreference({
      external_reference: site.id,
      price: price,
      familyName: familyName
    });

    // Atualizar documento com o preference_id
    await prisma.christmasSite.update({
      where: { id: site.id },
      data: { mp_preference_id: mpPreference.preference_id }
    });

    // Retornar dados para o frontend (sem informações sensíveis)
    res.status(201).json({
      success: true,
      siteId: site.id,
      preferenceId: mpPreference.preference_id,
      initPoint: mpPreference.init_point || mpPreference.sandbox_init_point,
      price: price
    });
  } catch (error) {
    console.error('Erro ao criar site:', error);
    res.status(500).json({
      error: 'Erro ao criar site',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

/**
 * GET /api/site/:id
 * Buscar site por ID
 * Validação: Só retorna se paymentStatus for APPROVED
 */
router.get('/site/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato do ID (NanoID tem 21 caracteres)
    if (!id || id.length !== 21) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const site = await prisma.christmasSite.findUnique({
      where: { id }
    });

    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    // VALIDAÇÃO CRÍTICA: Só retornar se pagamento foi aprovado
    if (site.paymentStatus !== 'APPROVED') {
      return res.status(402).json({
        error: 'Pagamento pendente',
        paymentStatus: site.paymentStatus,
        preferenceId: site.mp_preference_id,
        message: 'O pagamento ainda não foi aprovado. Complete o pagamento para visualizar o site.'
      });
    }

    // Retornar apenas dados públicos (sem informações sensíveis)
    res.json({
      id: site.id,
      familyName: site.familyName,
      message: site.message,
      photoUrl: site.photoUrl,
      createdAt: site.createdAt
    });
  } catch (error) {
    console.error('Erro ao buscar site:', error);
    res.status(500).json({
      error: 'Erro ao buscar site',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

/**
 * GET /api/site/:id/status
 * Verificar status do pagamento (para polling no frontend)
 */
router.get('/site/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length !== 21) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const site = await prisma.christmasSite.findUnique({
      where: { id }
    });

    if (!site) {
      return res.status(404).json({ error: 'Site não encontrado' });
    }

    res.json({
      paymentStatus: site.paymentStatus,
      preferenceId: site.mp_preference_id
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      error: 'Erro ao verificar status',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno do servidor'
    });
  }
});

export default router;

