import cors from 'cors';

// Configuração CORS restritiva - permitir apenas domínio do frontend
const allowedOrigins = [
  process.env.FRONTEND_URL ||
  'http://localhost:5173',
  "https://natal-familia-main.vercel.app",
  'http://localhost:5173', // Vite dev server padrão
  'http://localhost:3000', // Caso frontend rode na mesma porta
  'http://3.143.252.42:5173', // AWS
];

// Adicionar domínio de produção se existir
if (process.env.PRODUCTION_FRONTEND_URL) {
  allowedOrigins.push(process.env.PRODUCTION_FRONTEND_URL);
}

export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc) apenas em desenvolvimento
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning'],
};

export default cors(corsOptions);

