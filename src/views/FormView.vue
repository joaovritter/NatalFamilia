<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const route = useRoute();
const familyName = ref('');
const familyMessage = ref('');
const loading = ref(false);
const files = ref([]);
const step = ref(1); // 1: Info, 2: Payment, 3: Pix Waiting
// const brickBuilder = ref(null); // REMOVIDO: Não colocar objetos do SDK em refs para evitar Proxy
let brickBuilder = null; // Variável local não reativa

const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-00000000-0000-0000-0000-000000000000';

// Default wishes to start with
const defaultWishes = [
  { id: 1, icon: '🌟', title: 'Esperança', text: 'Que a fé guie cada passo do seu novo ano.' },
  { id: 2, icon: '✈️', title: 'Viagens', text: 'Novos destinos e horizontes para explorar.' },
  { id: 3, icon: '❤️', title: 'Amor', text: 'Laços mais fortes e corações aquecidos.' },
  { id: 4, icon: '💰', title: 'Prosperidade', text: 'Sucesso financeiro e abundância em 2026.' },
  { id: 5, icon: '🕊️', title: 'Paz', text: 'Serenidade para enfrentar qualquer desafio.' },
  { id: 6, icon: '💪', title: 'Saúde', text: 'Energia vital para viver o melhor da vida.' },
  { id: 7, icon: '🏠', title: 'Lar', text: 'Que nossa casa seja sempre um refúgio de alegria.' },
  { id: 8, icon: '🚀', title: 'Conquistas', text: 'Projetos saindo do papel e sonhos realizados.' },
  { id: 9, icon: '🎉', title: 'Alegria', text: 'Muitos motivos para sorrir todos os dias.' },
  { id: 10, icon: '✨', title: 'Sabedoria', text: 'Clareza para as melhores escolhas.' },
];
const wishes = ref(JSON.parse(JSON.stringify(defaultWishes)));
const wishFilesMap = ref({});

const handleWishImageChange = (event, wishId) => {
  const file = event.target.files[0];
  if (file) {
    // 1. Store file for upload
    wishFilesMap.value[wishId] = file;
    
    // 2. Generate preview
    const wishIndex = wishes.value.findIndex(w => w.id === wishId);
    if (wishIndex !== -1) {
       wishes.value[wishIndex].previewUrl = URL.createObjectURL(file);
       wishes.value[wishIndex].hasNewImage = true;
    }
  }
};

const handleFileChange = (event) => {
  files.value = Array.from(event.target.files);
};

const initBrick = async () => {
  console.log('Iniciando Brick...');
  console.log('Public Key usada no Front:', mpPublicKey); // LOG ADICIONADO para conferência
  if (!window.MercadoPago) {
      console.error('MercadoPago SDK não encontrado no window!');
      alert('Erro: SDK do Mercado Pago não carregou. Recarregue a página.');
      return;
  }
  
  if (!mpPublicKey || mpPublicKey.includes('0000')) {
      console.error('Public Key inválida ou padrão detectada:', mpPublicKey);
  }

  try {
    const mp = new window.MercadoPago(mpPublicKey, {
      locale: 'pt-BR'
    });
    console.log('Instancia MercadoPago criada');
    
    console.log('Instancia MercadoPago criada');
    
    brickBuilder = mp.bricks();
    console.log('Bricks Builder inicializado');
  } catch (e) {
      console.error('Erro ao instanciar MercadoPago:', e);
      return;
  }

  const renderPaymentBrick = async (bricksBuilder) => {
    const settings = {
      initialization: {
        amount: 29.90, // Valor fixo
        // preferenceId: null, // REMOVIDO para evitar warning se for nulo
        payer: {
            email: 'test@test.com',
        },
      },
      customization: {
        paymentMethods: {
          ticket: "all",
          bankTransfer: "all",
          creditCard: "all",
          debitCard: "all",
          mercadoPago: "all",
        },
        visual: {
            style: {
                theme: 'bootstrap', // ou 'default', 'flat'
            }
        }
      },
      callbacks: {
        onReady: () => {
          // Brick renderizado
        },
        onSubmit: async (cardFormData) => {
           try {
             // 1. Processar pagamento
             const paymentResponse = await api.post('/payment', cardFormData);
             const responseData = paymentResponse.data;
             console.log('Status do pagamento:', responseData.status);

             if (responseData.status === 'approved') {
                 // Pagamento Aprovado (Cartão): Segue fluxo normal
                 await saveFamilyAndRedirect(responseData.id, familyName.value);
             } else if (responseData.status === 'pending') {
                 // Pagamento Pendente (Pix?): Checar se tem QR Code
                 // CORREÇÃO: O backend envia 'qr_code' e 'qr_code_base64' na raiz do objeto
                 if (responseData.qr_code && responseData.qr_code_base64) {
                    handlePixPayment(responseData);
                 } else if (responseData.point_of_interaction && responseData.point_of_interaction.transaction_data) {
                    handlePixPayment(responseData); // Fallback para structure original do MP se mudar
                 } else {
                    console.warn('Pagamento pendente sem QR Code:', responseData);
                    alert('Pagamento iniciado com status: ' + responseData.status + '. Verifique seu email.');
                 }
             } else {
                 // Outros status
                 console.warn('Status não tratado:', responseData.status);
                 alert('Pagamento processado com status: ' + responseData.status);
             }
           } catch (error) {
             console.error('Erro no fluxo de pagamento/criação:', error);
             // O Brick não tem um método nativo claro para mostrar erro customizado vindo do backend,
             // então alertamos o usuário
             alert('Ocorreu um erro ao processar. Verifique os dados e tente novamente.');
             // throw error; // Se lançar erro aqui, o Brick pode tratar visualmente dependendo da config
           }
        },

        onError: (error) => {
          console.error(error);
        },
      },
    };
    try {
        window.paymentBrickController = await bricksBuilder.create("payment", "paymentBrick_container", settings);
        console.log('Brick criado com sucesso no container #paymentBrick_container');
    } catch (e) {
        console.error('Erro ao criar Brick:', e);
    }
  };
  

  await renderPaymentBrick(brickBuilder);
};

const goToPayment = async () => {
    if (!familyName.value || files.value.length === 0) {
        alert('Por favor, preencha o nome e selecione fotos.');
        return;
    }
    
    // Opcional: Salvar ou validar dados antes
    step.value = 2;
    // Pequeno delay para o DOM atualizar e div existir
    setTimeout(() => {
        initBrick();
    }, 100);
};

// Modificado para salvar família APÓS o pagamento ou usar o ID
// Mas o user pediu "junto", então vamos fazer o fluxo:
// 1. Paga
// 2. Se aprovado, salva a família.
// O ideal é salvar a família como "pending" antes?
// Simplificação: User paga, se sucesso, salvamos a família vinculada ao pagamento.
// Função auxiliar para salvar e redirecionar
const saveFamilyAndRedirect = async (paymentId, name) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('message', familyMessage.value);
    formData.append('paymentId', paymentId);
    
    // Prepare wishes metadata (stripped of previews) to send as JSON
    // The backend uses 'hasNewImage' flag to pick files from the array
    const wishesPayload = wishes.value.map(w => ({
        id: w.id,
        title: w.title,
        text: w.text,
        hasNewImage: !!w.hasNewImage
    }));
    formData.append('wishes', JSON.stringify(wishesPayload));

    files.value.forEach(file => {
        formData.append('photos', file);
    });

    // Append wish images. ORDER MATTERS: Must match the order of 'hasNewImage' === true in the JSON
    wishes.value.forEach(w => {
        if (w.hasNewImage && wishFilesMap.value[w.id]) {
            formData.append('wish_images', wishFilesMap.value[w.id]);
        }
    });

    await api.post('/family', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    router.push(`/familia/${encodeURIComponent(name)}`);
};

// Estado para armazenar dados do Pix
const pixData = ref(null);

const handlePixPayment = (data) => {
    console.log('Dados do Pix:', data);
    
    // Tentar pegar do formato flat (nosso backend) ou aninhado (MP direto)
    const qrCode = data.qr_code || data.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = data.qr_code_base64 || data.point_of_interaction?.transaction_data?.qr_code_base64;
    const ticketUrl = data.ticket_url || data.point_of_interaction?.transaction_data?.ticket_url;

    if (qrCode && qrCodeBase64) {
        pixData.value = {
            qrCode: qrCode,
            qrCodeBase64: qrCodeBase64,
            ticketUrl: ticketUrl,
            paymentId: data.id
        };
        step.value = 3; // Step 3: Mostra o Pix
    } else {
        alert('Erro ao recuperar dados do Pix via Brick.');
    }
};

const checkPixStatus = async () => {
    if (!pixData.value) return;
    try {
        // Rota simples para checar status (assumindo GET /payment/:id)
        // Se nao tiver, o user clica em "Já paguei" e tentamos salvar
        // Como o backend ainda nao tem rota GET de status, vamos tentar salvar direto. 
        // Se o pagamento nao estiver approved, o ideal seria o backend checar no MP.
        
        // Poupando tempo: Vamos assumir que ele pagou e tentar criar a familia.
        // O ideal é implementar rota de check no backend.
        await saveFamilyAndRedirect(pixData.value.paymentId, familyName.value);
    } catch (e) {
        console.error(e);
        alert('Ainda não identificamos a confirmação. Aguarde alguns segundos e tente novamente.');
    }
};

</script>

<template>
  <div class="form-view">
    <div class="form-container">
      <header>
        <h1>{{ step === 1 ? 'Configuração' : 'Pagamento' }}</h1>
        <p>{{ step === 1 ? 'Personalize sua experiência mágica.' : ' finalize para criar seu site.' }}</p>
      </header>

      <!-- Step 1: Info -->
      <div v-show="step === 1" class="minimal-form">
        <div class="form-group">
          <label for="familyName">Sobrenome da Família</label>
          <input 
            id="familyName"
            v-model="familyName" 
            type="text" 
            placeholder="Ex: Silva"
            required
            class="minimal-input"
          >
        </div>

        <!-- Wishes Editing Section -->
        <div class="form-group">
          <label>Desejos da Árvore (Bolinhas)</label>
          <div class="wishes-grid">
            <div v-for="(wish, index) in wishes" :key="wish.id" class="wish-item">
               <div class="wish-header">
                 <span>Bolinha {{ index + 1 }}</span>
               </div>
               
               <!-- Image Upload for Wish -->
               <div class="wish-upload-container">
                    <label :for="'wish-file-'+wish.id" class="wish-upload-label">
                        <img v-if="wish.previewUrl" :src="wish.previewUrl" class="wish-preview" />
                        <div v-else class="wish-placeholder">
                            <span>📷 Foto</span>
                        </div>
                    </label>
                    <input 
                        :id="'wish-file-'+wish.id"
                        type="file" 
                        accept="image/*" 
                        @change="(e) => handleWishImageChange(e, wish.id)"
                        class="hidden-input"
                    />
               </div>

               <input 
                 v-model="wish.title" 
                 placeholder="Título (Ex: Amor)" 
                 class="minimal-input small-input" 
                 maxlength="20"
               />
               <textarea 
                 v-model="wish.text" 
                 placeholder="Mensagem do desejo..." 
                 class="minimal-input small-input" 
                 rows="2"
                 maxlength="100"
               ></textarea>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="familyMessage">Mensagem Especial (Opcional)</label>
          <textarea 
            id="familyMessage"
            v-model="familyMessage" 
            placeholder="Escreva uma mensagem carinhosa para o 'Nosso Maior Tesouro'..."
            rows="4"
            class="minimal-input"
            style="resize: vertical; min-height: 100px;"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Galeria de Fotos</label>
          <div class="file-upload-wrapper">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              @change="handleFileChange"
              class="file-input"
              id="fileInput"
            >
            <label for="fileInput" class="file-label">
              <span v-if="files.length === 0">Escolher fotos...</span>
              <span v-else>{{ files.length }} fotos selecionadas</span>
            </label>
          </div>
          <small>Selecione suas melhores lembranças.</small>
        </div>

        <button @click="goToPayment" class="minimal-btn">
          Continuar para Pagamento
        </button>
      </div>

      <!-- Step 2: Payment Brick -->
      <div v-show="step === 2" class="payment-step">
          <div id="paymentBrick_container"></div>
          <button @click="step = 1" class="back-link">Voltar</button>
      </div>

      <!-- Step 3: Pix QR Code -->
      <div v-show="step === 3" class="pix-step" v-if="pixData">
          <h2>Pagamento via Pix</h2>
          <p>Escaneie o QR Code ou copie o código abaixo:</p>
          
          <div class="qr-container" v-if="pixData.qrCodeBase64">
              <img :src="`data:image/png;base64,${pixData.qrCodeBase64}`" alt="QR Code Pix" />
          </div>

          <div class="copy-paste-container">
              <label>Copia e Cola:</label>
              <textarea readonly :value="pixData.qrCode" rows="4"></textarea>
          </div>

          <a :href="pixData.ticketUrl" target="_blank" class="ticket-link">Ver Comprovante / Link Externo</a>

          <button @click="checkPixStatus" class="minimal-btn success-btn">
              Já realizei o pagamento
          </button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* Mesmos estilos anteriores + alguns ajustes */
.form-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
  color: #333;
  font-family: 'Montserrat', sans-serif;
}

.form-container {
  background: white;
  padding: 4rem;
  border-radius: 8px;
  max-width: 600px; /* Aumentado para caber o Brick */
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  font-weight: 300;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.minimal-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
}

.minimal-input {
  padding: 1rem 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 1.1rem;
  color: #333;
  background: transparent;
  transition: border-color 0.3s;
  border-radius: 0;
}

.minimal-input:focus {
  outline: none;
  border-bottom-color: #1a1a1a;
}

.file-upload-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: block;
  padding: 1rem;
  border: 1px dashed #ddd;
  text-align: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
  border-radius: 4px;
}

.file-label:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

small {
  color: #999;
  font-size: 0.75rem;
}

.wishes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 10px;
}

.wish-item {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.wish-header {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #555;
}

.small-input {
  font-size: 0.9rem;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  width: 100%;
  resize: none;
}

.wish-upload-container {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
}

.wish-upload-label {
    cursor: pointer;
    display: block;
}

.hidden-input {
    display: none;
}

.wish-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    border: 2px dashed #ccc;
    color: #888;
}

.wish-preview {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #1a1a1a;
}

@media (min-width: 600px) {
  .wishes-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.minimal-btn {
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 1rem;
  transition: background 0.3s;
  border-radius: 4px;
}

.minimal-btn:hover {
  background: #333;
}

.payment-step {
  width: 100%;
  min-height: 400px; /* Evita colapso enquanto carrega */
  display: flex;
  flex-direction: column;
  align-items: center;
}

#paymentBrick_container {
    width: 100%;
}

.back-link {
    background: none;
    border: none;
    color: #666;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 20px;
    display: block;
    width: 100%;
}

.qr-container {
    margin: 20px 0;
    text-align: center;
}

.qr-container img {
    max-width: 100%;
    max-height: 250px;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    background: white;
}

.copy-paste-container {
    width: 100%;
    margin-bottom: 20px;
}

.copy-paste-container label {
    display: block;
    margin-bottom: 5px;
}

.copy-paste-container textarea {
    width: 100%;
    padding: 10px;
    background: #eee;
    border: none;
    border-radius: 4px;
    resize: none;
    font-size: 0.8rem;
    font-family: monospace;
}

.ticket-link {
    display: block;
    text-align: center;
    color: #009ee3;
    margin-bottom: 20px;
    font-size: 0.9rem;
}

.success-btn {
    background-color: #009ee3; /* Mercado Pago Blue */
}

.success-btn:hover {
    background-color: #007eb5;
}
</style>
