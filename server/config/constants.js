// CONSTANTE DE PREÇO - NUNCA CONFIE NO VALOR DO FRONTEND
// Este valor deve ser definido aqui no backend e nunca aceito do cliente
export const SITE_PRICE = 1; // R$ 29,90

// URL de retorno após pagamento (frontend)
export const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || 'http://alcefamily.shop';
};

// URL do webhook (backend)
export const getWebhookUrl = () => {
  return process.env.WEBHOOK_URL || process.env.BACKEND_URL || 'http://api.alcefamily.shop';
};

