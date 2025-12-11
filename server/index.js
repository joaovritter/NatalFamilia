import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Importar configurações de segurança
import { helmetConfig, generalLimiter } from './middleware/security.js';
import corsOptions from './middleware/cors.js';

// Importar Prisma Client (conexão é gerenciada internamente)
import prisma from './config/prisma.js';

// Importar rotas
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES DE SEGURANÇA
// ============================================

// Helmet - Proteção de headers HTTP
app.use(helmetConfig);

// CORS restritivo - Permitir apenas domínios autorizados
app.use(corsOptions);

// Rate limiting geral
app.use('/api', generalLimiter);

// Body parser com limite de tamanho
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// ROTAS
// ============================================

// Rotas da API
app.use('/api', routes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

const startServer = async () => {
  try {
    // Tentar conectar ao banco de dados (opcional, o Prisma conecta na primeira query)
    await prisma.$connect();
    console.log('🗄️  PostgreSQL (Prisma): Conectado');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);

      const token = process.env.MP_ACCESS_TOKEN;
      console.log('🔑 Token MP:', token ? `${token.substring(0, 10)}...` : '⚠️  NÃO ENCONTRADO');

      console.log('🔒 Middlewares de segurança ativados:');
      console.log('   - Helmet (headers HTTP)');
      console.log('   - CORS restritivo');
      console.log('   - Rate limiting');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
