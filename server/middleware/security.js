import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting para criação de sites (prevenir spam/bots)
export const createSiteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP a cada 15 minutos
  message: {
    error: 'Muitas tentativas. Por favor, tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para webhook (mais permissivo, mas ainda protegido)
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requisições por minuto (webhooks do MP podem ser frequentes)
  message: {
    error: 'Muitas requisições. Tente novamente mais tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting geral para outras rotas
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP a cada 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuração do Helmet para segurança HTTP
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.mercadopago.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Permite recursos externos se necessário
});

