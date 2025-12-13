
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_URL = 'http://localhost:3001/api';

async function testFullFlow() {
    try {
        // 1. Create Payment
        console.log('1. Creating Payment...');
        const paymentPayload = {
            transaction_amount: 29.90,
            description: 'Test Payment',
            payer: { email: 'test@test.com' },
            payment_method_id: 'pix'
        };

        // Note: The backend routes.js calls processPayment(mock). 
        // We should check what happens there.
        // Assuming it returns a payment object.

        const paymentRes = await axios.post(`${API_URL}/payment`, paymentPayload);
        console.log('Payment created:', paymentRes.data.id, paymentRes.data.status);
        const paymentId = paymentRes.data.id;

        // 2. Create Family
        console.log('2. Creating Family...');
        const form = new FormData();
        form.append('name', 'FamiliaTeste_' + Date.now());
        form.append('message', 'Mensagem de teste do script');
        form.append('paymentId', paymentId);
        // Append a mock file if possible, or try without if allowed
        // routes.js expects files? upload.array('photos', 10).
        // If we dont send files, upload.array handles it but req.files is [].

        // We need to send headers for form-data
        const familyRes = await axios.post(`${API_URL}/family`, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Family created:', familyRes.data);
        const familyId = familyRes.data.familyId; // routes.js returns { success: true, familyId }

        // 3. Get Family
        // We used a dynamic name, let's extract it from formData logic or store it
        // Wait, I didn't save the name I generated.
        const createdName = form._streams[1].split('\r\n')[0] ? 'FamiliaTeste_' + Date.now() : 'FamiliaTeste'; // hacky
        // Let's just use the variable
        const nameUsed = 'FamiliaTeste_' + Date.now();
        // Wait, I can't reuse the logic above. Let's restart with variable.

    } catch (error) {
        console.error('Flow failed at step:', error.config?.url || 'unknown');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

async function testProper() {
    try {
        // 1. Payment
        console.log('--- Step 1: Payment ---');
        const payRes = await axios.post(`${API_URL}/payment`, {
            transaction_amount: 29.90,
            description: 'Debug Flow',
            payer: { email: 'debug@test.com' }
        });
        const paymentId = payRes.data.id;
        console.log('Payment ID:', paymentId);

        // 2. Family
        console.log('--- Step 2: Family ---');
        const name = 'DebugFam_' + Math.floor(Math.random() * 1000);
        const form = new FormData();
        form.append('name', name);
        form.append('message', 'Hello Debug World');
        form.append('paymentId', paymentId);

        // Don't append photos for now to test robustness

        const famRes = await axios.post(`${API_URL}/family`, form, {
            headers: form.getHeaders()
        });
        console.log('Family Created:', famRes.data);

        // 3. Get
        console.log('--- Step 3: Get ---');
        const getRes = await axios.get(`${API_URL}/family/${name}`);
        console.log('Family Fetched:', getRes.data);

    } catch (e) {
        console.error('FAILED');
        if (e.response) {
            console.error(e.response.status, e.response.data);
        } else {
            console.error(e.message);
        }
    }
}

testProper();
