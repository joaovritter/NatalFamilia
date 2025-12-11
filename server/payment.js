import { MercadoPagoConfig, Payment } from 'mercadopago';

const processPayment = async (paymentData) => {
    // Inicializar o cliente AQUI para garantir que as variáveis de ambiente já foram carregadas
    // O import do index.js carrega o dotenv, mas por ser ESM, este arquivo pode ser avaliado antes.
    const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-00000000-0000-0000-0000-000000000000'
    });
    const payment = new Payment(client);

    try {
        console.log('Processando pagamento com dados:', JSON.stringify(paymentData, null, 2));

        // O Brick pode enviar os dados dentro de 'formData' (especialmente se for Pix/v2)
        const data = paymentData.formData || paymentData;

        // Payer pode vir aninhado em data.payer ou direto
        const payer = data.payer || paymentData.payer || {};

        const body = {
            transaction_amount: Number(data.transaction_amount || paymentData.transaction_amount),
            description: paymentData.description || 'Natal da Família',
            payment_method_id: data.payment_method_id,
            payer: {
                // EVITAR ERRO DE PAGAMENTO PROPRIO (PA_UNAUTHORIZED_RESULT_FROM_POLICIES)
                // Se o email for igual ao do vendedor, dá erro. Vamos gerar um aleatório para teste.
                email: `test_user_${Math.floor(Math.random() * 10000)}@test.com`,
                // identification: payer.identification // REMOVER para evitar erro de mesmo CPF/CNPJ
            },
            token: data.token,
            installments: data.installments ? Number(data.installments) : undefined,
            issuer_id: data.issuer_id
        };

        // Remove undefined keys (though MP SDK might handle them, cleaner to send what we have)
        Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

        console.log('Body enviado para MP:', JSON.stringify(body, null, 2));

        const response = await payment.create({ body });

        console.log('Pagamento MP Criado.');
        console.log('ID:', response.id);
        console.log('Tem point_of_interaction?', !!response.point_of_interaction);
        if (response.point_of_interaction) {
            console.log('POI Data:', JSON.stringify(response.point_of_interaction, null, 2));
        }

        return response;
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        if (error.cause) {
            console.error('Causa do erro (MP):', JSON.stringify(error.cause, null, 2));
        }
        if (error.response) {
            console.error('Resposta do erro (MP):', JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
};

export { processPayment };
