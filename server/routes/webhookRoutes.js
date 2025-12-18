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

    const localPayment = await prisma.payment.findFirst({
      where: { mp_payment_id: String(paymentId) }
    });

    if (!localPayment) {
      console.warn('Pagamento local não encontrado para ID MP:', paymentId);
      return;
    }
    
    const mpPayment = await getPayment(paymentId);


    if (mpPayment.status === 'approved' && localPayment.status !== 'approved') {
      await prisma.payment.update({
        where: { id: localPayment.id },
        data: { status: 'approved' }
      });
      console.log('Pagamento atualizado para aprovado no banco local:', localPayment.id);
    } else {
      if (localPayment.status !== mpPayment.status) {
        await prisma.payment.update({
          where: { id: localPayment.id },
          data: { status: mpPayment.status }
        });
        console.log('Pagamento atualizado no banco local:', localPayment.id, 'Status:', mpPayment.status);
      } else {
        console.log('Nenhuma atualização necessária para o pagamento local:', localPayment.id);
      }
      
    }
  }
  catch (error) {
    console.error('Erro ao processar pagamento:', error);
  }
}

/**
 * Processar notificação de merchant_order (alternativa)
 */
async function handleMerchantOrderNotification(orderId) {
  try {
    console.log('Processando notificação de merchant_order:', orderId);

  } catch (error) {
    console.error('Erro ao processar merchant_order:', error);
  }
}

export default router;

