import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Inicializar cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-00000000-0000-0000-0000-000000000000'
});

const preference = new Preference(client);
const payment = new Payment(client);

/**
 * Criar preferência de pagamento no Mercado Pago
 * @param {Object} data - Dados do pagamento
 * @param {string} data.external_reference - ID do documento no MongoDB
 * @param {number} data.price - Valor do pagamento (hardcoded no backend)
 * @param {string} data.familyName - Nome da família
 * @returns {Promise<Object>} Resposta do Mercado Pago com preference_id
 */
export const createPreference = async ({ external_reference, price, familyName }) => {
  try {
    const { getFrontendUrl, getWebhookUrl } = await import('../config/constants.js');
    
    const body = {
      items: [
        {
          title: `Site de Natal - ${familyName}`,
          description: 'Criação de site personalizado de Natal para a família',
          quantity: 1,
          unit_price: price,
          currency_id: 'BRL'
        }
      ],
      external_reference: external_reference, // ID do documento MongoDB
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 1
      },
      back_urls: {
        success: `${getFrontendUrl()}/payment/success`,
        failure: `${getFrontendUrl()}/payment/failure`,
        pending: `${getFrontendUrl()}/payment/pending`
      },
      notification_url: `${getWebhookUrl()}/api/webhook`,
      auto_return: 'approved',
      statement_descriptor: 'Natal Familia'
    };

    const response = await preference.create({ body });
    
    return {
      preference_id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    };
  } catch (error) {
    console.error('Erro ao criar preferência no Mercado Pago:', error);
    throw error;
  }
};

/**
 * Consultar pagamento no Mercado Pago (para validação no webhook)
 * @param {string} paymentId - ID do pagamento no Mercado Pago
 * @returns {Promise<Object>} Dados do pagamento
 */
export const getPayment = async (paymentId) => {
  try {
    const response = await payment.get({ id: paymentId });
    return response;
  } catch (error) {
    console.error('Erro ao consultar pagamento no Mercado Pago:', error);
    throw error;
  }
};

/**
 * Consultar preferência no Mercado Pago
 * @param {string} preferenceId - ID da preferência
 * @returns {Promise<Object>} Dados da preferência
 */
export const getPreference = async (preferenceId) => {
  try {
    const response = await preference.get({ id: preferenceId });
    return response;
  } catch (error) {
    console.error('Erro ao consultar preferência no Mercado Pago:', error);
    throw error;
  }
};

