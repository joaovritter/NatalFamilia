import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('--- Teste Isolado de Pagamento Backend ---');
console.log('Token lido:', process.env.MP_ACCESS_TOKEN ? process.env.MP_ACCESS_TOKEN.substring(0, 15) + '...' : 'NÃO ENCONTRADO');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const payment = new Payment(client);

const testPayment = async () => {
    try {
        const req = {
            transaction_amount: 15.50,
            description: 'Teste Isolado Backend',
            payment_method_id: 'pix',
            payer: {
                email: `test_backend_${Math.floor(Math.random() * 1000)}@test.com`
            }
        };

        console.log('Enviando requisição de teste para Mercado Pago...');
        console.log(JSON.stringify(req, null, 2));

        const result = await payment.create({ body: req });
        console.log('\n✅ SUCESSO! O Token do Backend está funcionando perfeitamente.');
        console.log('ID do Pagamento:', result.id);
        console.log('Status:', result.status);

        console.log('--- ESTRUTURA DO PIX ---');
        console.log('Has point_of_interaction?', !!result.point_of_interaction);
        if (result.point_of_interaction) {
            console.log(JSON.stringify(result.point_of_interaction, null, 2));
        } else {
            console.log('Objeto completo:', JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.error('\n❌ ERRO NA REQUISIÇÃO DIRETA.');
        console.error('Isso indica que o problema é a CONTA ou o TOKEN do Backend, não o Frontend.');
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        if (error.cause) console.error('Cause:', JSON.stringify(error.cause, null, 2));
    }
};

testPayment();
