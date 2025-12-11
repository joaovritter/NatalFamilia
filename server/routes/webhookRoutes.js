import express from 'express';
import prisma from '../config/prisma.js';
import { getPayment, getPreference } from '../services/mercadopago.js';
import { webhookLimiter } from '../middleware/security.js';
import { SITE_PRICE } from '../config/constants.js';

const router = express.Router();

/**
 * POST /api/webhook
 * Webhook do Mercado Pago para notificações de pagamento
 * VALIDAÇÃO CRÍTICA: Consultar API do MP antes de atualizar status
 */
router.post('/webhook', webhookLimiter, async (req, res) => {
  try {
    // O Mercado Pago envia diferentes tipos de notificações
    const { type, data } = req.body;

    console.log('Webhook recebido:', { type, data });

    // Responder rapidamente ao MP (dentro de 5 segundos)
    res.status(200).send('OK');

    // Processar webhook de forma assíncrona
    processWebhookNotification(type, data);
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    // Sempre retornar 200 para o MP para evitar reenvios
    res.status(200).send('OK');
  }
});

/**
 * Processar notificação do webhook de forma assíncrona
 */
async function processWebhookNotification(type, data) {
  try {
    // Tipos de notificação do Mercado Pago
    if (type === 'payment') {
      await handlePaymentNotification(data.id);
    } else if (type === 'merchant_order') {
      await handleMerchantOrderNotification(data.id);
    } else {
      console.log('Tipo de notificação não tratado:', type);
    }
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
  }
}

/**
 * Processar notificação de pagamento
 */
async function handlePaymentNotification(paymentId) {
  try {
    console.log('Processando notificação de pagamento:', paymentId);

    // VALIDAÇÃO CRÍTICA: Consultar API do Mercado Pago para confirmar status
    const payment = await getPayment(paymentId);

    if (!payment) {
      console.error('Pagamento não encontrado no Mercado Pago:', paymentId);
      return;
    }

    // Verificar status do pagamento
    if (payment.status !== 'approved') {
      console.log('Pagamento não aprovado:', payment.status);
      return;
    }

    // VALIDAÇÃO CRÍTICA: Verificar valor pago
    const paidAmount = payment.transaction_amount;
    const expectedAmount = SITE_PRICE;

    // Tolerância de 0.01 para diferenças de arredondamento
    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      console.error(`Valor pago (${paidAmount}) não corresponde ao esperado (${expectedAmount})`);
      return;
    }

    // Buscar site pelo external_reference (que é o ID do MongoDB)
    // O external_reference pode estar em payment.external_reference ou na preferência
    let siteId = payment.external_reference;

    // Se não tiver external_reference direto, buscar pela preferência
    if (!siteId && payment.preference_id) {
      const preference = await getPreference(payment.preference_id);
      siteId = preference.external_reference;
    }

    if (!siteId) {
      console.error('External reference não encontrado no pagamento');
      return;
    }

    // Buscar site no PostgreSQL
    const site = await prisma.christmasSite.findUnique({
      where: { id: siteId }
    });

    if (!site) {
      console.error('Site não encontrado no PostgreSQL:', siteId);
      return;
    }

    // Atualizar status apenas se ainda estiver PENDING (idempotência)
    if (site.paymentStatus === 'PENDING') {
      await prisma.christmasSite.update({
        where: { id: siteId },
        data: {
          paymentStatus: 'APPROVED',
          mp_payment_id: paymentId,
          // updatedAt é atualizado automaticamente pelo Prisma
        }
      });

      console.log(`✅ Site ${siteId} aprovado com sucesso!`);
    } else {
      console.log(`Site ${siteId} já estava aprovado anteriormente`);
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
  }
}

/**
 * Processar notificação de merchant_order (alternativa)
 */
async function handleMerchantOrderNotification(orderId) {
  try {
    console.log('Processando notificação de merchant_order:', orderId);
    // Implementar lógica similar se necessário
    // Por enquanto, focamos em payment notifications
  } catch (error) {
    console.error('Erro ao processar merchant_order:', error);
  }
}

export default router;

