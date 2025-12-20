<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
let pollingInterval = null;


const router = useRouter();
const currentStep = ref(0);
const loading = ref(false);

/* --- Form Data --- */
const form = ref({
    familyName: '',
    message: '',
    youtubeLink: '',
    youtubeLink: '',
    photos: [], // General Carousel Photos
    timelinePhotos: [], // Timeline Photos with Metadata
    wishes: []
});

const newWish = ref({
    title: '',
    text: '',
    image: null,
    imagePreview: null
});

const addWish = () => {
    if (!newWish.value.title || !newWish.value.text) return;
    
    form.value.wishes.push({
        id: Date.now(),
        title: newWish.value.title,
        text: newWish.value.text,
        image: newWish.value.image,
        imagePreview: newWish.value.imagePreview
    });
    
    // Reset new wish input
    newWish.value = { title: '', text: '', image: null, imagePreview: null };
};

const removeWish = (index) => {
    form.value.wishes.splice(index, 1);
};

const handleWishImage = (event) => {
    const file = event.target.files[0];
    if (file) {
        newWish.value.image = file;
        newWish.value.imagePreview = URL.createObjectURL(file);
    }
};

/* --- Steps Configuration --- */
const steps = [
    {
        id: 'intro',
        message: 'Para começar a criar esse presente especial, me conta... qual o sobrenome da sua família?',
        inputType: 'text',
        placeholder: 'Ex: Silva',
        field: 'familyName',
        buttonText: 'Continuar'
    },
    {
        id: 'message',
        message: 'Que lindo! Agora, escreva uma mensagem de Natal para aparecer no início do site.',
        inputType: 'textarea',
        placeholder: 'Desejamos a todos um Feliz Natal...',
        field: 'message',
        buttonText: 'Continuar'
    },
    {
        id: 'music',
        message: 'Você quer adicionar uma música especial? Se sim, cole o link do YouTube aqui. (Opcional)',
        inputType: 'text',
        placeholder: 'Cole o link do YouTube aqui (ou deixe em branco)',
        field: 'youtubeLink',
        buttonText: 'Continuar'
    },
    {
        id: 'photos',
        message: 'Vamos criar um albúm lindo! Escolha fotos da família para o albúm de fotos.',
        inputType: 'file',
        field: 'photos',
        buttonText: 'Continuar'
    },
    {
        id: 'timeline',
        message: 'Agora, vamos montar a Linha do Tempo da Família! Adicione fotos que marcaram o ano, com datas e legendas.',
        inputType: 'timeline',
        field: 'timeline',
        buttonText: 'Continuar'
    },
    {
        id: 'wishes',
        message: 'Vamos decorar a árvore de Natal! Adicione bolinhas com desejos para sua família. (Ex: Amor, Paz, Saúde...)',
        inputType: 'wishes',
        field: 'wishes',
        buttonText: 'Continuar para Pagamento'
    },
    {
        id: 'payment',
        message: 'Tudo pronto! Agora escolha a forma de pagamento para gerar o site!',
        inputType: 'payment',
        field: null,
        buttonText: null // Button handled by payment brick
    }
];

const currentStepData = computed(() => steps[currentStep.value]);
const progress = computed(() => ((currentStep.value + 1) / steps.length) * 100);

/* --- Payment Logic --- */
const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY || 'APP_USR-ebd17192-32c4-4db4-8c7b-5db8618d8013';
let brickBuilder = null;
const pixData = ref(null);
const showPixModal = ref(false);

const initBrick = async () => {
  console.log("Tentando iniciar o Payment Brick...");
  if (!window.MercadoPago) {
      console.error("SDK do Mercado Pago não encontrado no window.");
      return;
  }
  
  // Clean up existing brick if any
  if (window.paymentBrickController) {
      console.log("Desmontando brick anterior...");
      try { // try-catch to prevent errors if unmount fails
        await window.paymentBrickController.unmount();
      } catch (e) {
        console.warn("Erro ao desmontar brick:", e);
      }
      window.paymentBrickController = null;
  }

  try {
      const mp = new window.MercadoPago(mpPublicKey, { locale: 'pt-BR' });
      brickBuilder = mp.bricks();
      
      console.log("Configurando e criando novo brick...");
      const settings = {
          initialization: {
            amount: 1,
            payer: { 
                email: 'cliente@natalfamilia.com',
                entity_type: 'individual'
            },
          },
          customization: {
            paymentMethods: {
              ticket: [],
              bankTransfer: ['pix'], 
              creditCard: [],
              debitCard: [],
              mercadoPago: [],
            },
            visual: {
                style: { theme: 'bootstrap' }
            }
          },
          callbacks: {
            onSubmit: async (cardFormData) => {
               console.log("Brick onSubmit chamado", cardFormData);
               try {
                 loading.value = true;
                 const paymentResponse = await api.post('/payment', cardFormData);
                 const responseData = paymentResponse.data;
    
                 if (responseData.status === 'approved') {
                     await saveFamilyAndRedirect(responseData.id);
                 } else if (responseData.status === 'pending') {
                     if (responseData.qr_code && responseData.qr_code_base64) {
                        pixData.value = { 
                            qrCode: responseData.qr_code, 
                            qrCodeBase64: responseData.qr_code_base64,
                            paymentId: responseData.id 
                        };
                        showPixModal.value = true;
                        startPolling();
                     } else {
                        alert("Pagamento pendente. Verifique seu email.");
                     }
                 }
               } catch (error) {
                 console.error("Erro no processo de pagamento:", error);
                 alert("Erro no pagamento.");
               } finally {
                 loading.value = false;
               }
            },
            onError: (error) => {
                console.error("Callback onError do Brick:", error);
            },
            onReady: () => {
                console.log("Brick pronto para uso (onReady).");
                loading.value = false;
            },
          },
        };
        
        window.paymentBrickController = await brickBuilder.create("payment", "paymentBrick_container", settings);
        console.log("Brick criado com sucesso via controller.");
  } catch (err) {
      console.error("Falha fatal ao criar o brick:", err);
  }
};

const saveFamilyAndRedirect = async (paymentId) => {
    const formData = new FormData();
    formData.append('name', form.value.familyName);
    formData.append('message', form.value.message);
    formData.append('youtubeLink', form.value.youtubeLink);
    formData.append('paymentId', paymentId);
    
    // Prepare wishes data and files
    const wishesData = form.value.wishes.map(w => ({
        title: w.title,
        text: w.text,
        hasNewImage: !!w.image
    }));
    formData.append('wishes', JSON.stringify(wishesData));

    // Append wish images
    form.value.wishes.forEach(w => {
        if (w.image) {
            formData.append('wish_images', w.image);
        }
    });

    // Prepare Timeline Metadata
    const timelineMetadata = form.value.timelinePhotos.map(p => ({
        date: p.date,
        caption: p.caption
    }));
    formData.append('timeline_metadata', JSON.stringify(timelineMetadata));

    // Append Timeline Files
    form.value.timelinePhotos.forEach(p => {
        formData.append('timeline_photos', p.file);
    });

    // Append General Photos
    form.value.photos.forEach(file => {
        formData.append('photos', file);
    });

    try {
        const response = await api.post('/family', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        router.push(`/sucesso/${response.data.slug}`);
    } catch (e) {
        alert("Erro ao criar o site.");
    }
};



const checkPixStatus = async () => {
    if (!pixData.value) return;


    try {
        loading.value = true;
        console.log(`Verificando status do pagamento Pix... ID:${pixData.value.paymentId}`);


        const response = await api.get(`/payment/${pixData.value.paymentId}`);
        const pgto = response.data;

        console.log(`Status do pagamento recebido: ${pgto}`);

        if (pgto.status === 'approved' || pgto.status === 'APPROVED') {
            console.log("Pagamento aprovado! Salvando família e redirecionando...");
            clearInterval(pollingInterval);
            await saveFamilyAndRedirect(pixData.value.paymentId);
        } else {
            console.warn(`Pagamento ainda não aprovado. Status: ${pgto.status}`);
            alert("Pagamento ainda não aprovado. Por favor, aguarde alguns instantes.");
        }
    } catch (e) {
        console.error("Erro ao verificar status do pagamento Pix:", e);
        alert("Erro ao verificar status do pagamento.");
    } finally {
        loading.value = false;
    }
};


const startPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval);

    pollingInterval = setInterval(async () => {
        if (!pixData.value) return;
        console.log("Polling: Verificando status do pagamento Pix...");
        try {
            const response = await api.get(`/payment/${pixData.value.paymentId}`);
            const status = response.data.status;

            if (status === 'approved' || status === 'APPROVED') {
                console.log("Pagamento aprovado via polling! Salvando família e redirecionando...");
                clearInterval(pollingInterval);
                await saveFamilyAndRedirect(pixData.value.paymentId);

            }

        } catch (e) {
            console.error("Erro ao verificar status do pagamento via polling:", e);
        }
    }, 3000); 

};


onMounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
});

/* --- Navigation & Inputs --- */
const handleNext = () => {
    if (currentStepData.value.inputType === 'text' && !form.value.familyName) return;
    if (currentStepData.value.inputType === 'textarea' && !form.value.message) return;
    if (currentStepData.value.inputType === 'file' && form.value.photos.length === 0) return;
    if (currentStepData.value.inputType === 'wishes' && form.value.wishes.length === 0) {
        alert("Adicione pelo menos um desejo na árvore!");
        return;
    }

    if (currentStep.value < steps.length - 1) {
        currentStep.value++;
        if (steps[currentStep.value].inputType === 'payment') {
            // Increased timeout to ensure DOM is ready and prevent race conditions
            setTimeout(initBrick, 500);
        }
    }
};

const handleFiles = (event) => {
    // General Album Photos (Simple Array)
    const newFiles = Array.from(event.target.files);
    form.value.photos = [...form.value.photos, ...newFiles];
};

const handleTimelineFiles = (event) => {
    // Timeline Photos (Objects with Metadata)
    const newFiles = Array.from(event.target.files).map(file => ({
        file: file,
        preview: URL.createObjectURL(file), 
        date: '',
        caption: ''
    }));
    form.value.timelinePhotos = [...form.value.timelinePhotos, ...newFiles];
};

const moveTimelinePhoto = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < form.value.timelinePhotos.length) {
        const temp = form.value.timelinePhotos[index];
        form.value.timelinePhotos[index] = form.value.timelinePhotos[newIndex];
        form.value.timelinePhotos[newIndex] = temp;
    }
};

const removeTimelinePhoto = (index) => {
    form.value.timelinePhotos.splice(index, 1);
};

const handleBack = () => {
    if (currentStep.value > 0) currentStep.value--;
};
</script>

<template>
<div class="min-h-screen bg-background flex flex-col font-manrope">
    
    <!-- Top Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-2 bg-gray-100 z-50">
        <div class="h-full bg-accent transition-all duration-500 ease-out" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Back Button -->
    <div class="fixed top-6 left-6 z-40">
        <button v-if="currentStep > 0" @click="handleBack" class="text-text-light hover:text-accent transition-colors flex items-center gap-2 text-sm font-bold">
            ← Voltar
        </button>
        <router-link v-else to="/" class="text-text-light hover:text-accent transition-colors flex items-center gap-2 text-sm font-bold">
            ← Ver Início
        </router-link>
    </div>

    <!-- Main Content Wizard -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto mt-8 mb-20">
        
        <!-- Character & Bubble -->
        <div class="flex flex-col items-center w-full mb-12 animate-fade-in-up">
            <!-- Avatar -->
            <div class="w-24 h-24 rounded-full bg-accent/10 border-4 border-white shadow-lg flex items-center justify-center relative z-10 mb-[-20px]">
                <img src="@/assets/Alces/Icone.png" alt="Avatar" class="w-full h-full object-cover rounded-full" />
            </div>
            
            <!-- Bubble -->
            <div class="bg-white px-8 py-6 rounded-2xl shadow-sm border border-border w-full text-center relative pt-10">
                <p class="text-lg md:text-xl text-text-primary font-medium leading-relaxed">
                    {{ currentStepData.message }}
                </p>
            </div>
        </div>

        <!-- Dynamic Inputs -->
        <div class="w-full animate-fade-in-up delay-100">
            
            <!-- Text Input -->
            <div v-if="currentStepData.inputType === 'text'" class="bg-white p-2 rounded-xl border border-border shadow-sm flex items-center">
                <div class="pl-4 text-accent text-xl">
                    ➜
                </div>
                <input 
                    v-model="form[currentStepData.field]"
                    type="text" 
                    :placeholder="currentStepData.placeholder"
                    @keyup.enter="handleNext"
                    class="w-full p-4 bg-transparent outline-none text-lg text-text-primary placeholder:text-gray-300"
                    autoFocus
                >
            </div>

            <!-- Textarea -->
            <div v-if="currentStepData.inputType === 'textarea'" class="bg-white p-2 rounded-xl border border-border shadow-sm">
                 <div class="pl-4 pt-2 text-accent text-xl mb-[-20px]">
                    ➜
                </div>
                <textarea 
                    v-model="form.message"
                    :placeholder="currentStepData.placeholder"
                    rows="4"
                    class="w-full p-4 pl-12 bg-transparent outline-none text-lg text-text-primary placeholder:text-gray-300 resize-none"
                    autoFocus
                ></textarea>
            </div>

            <!-- File Input (General Carousel) -->
            <div v-if="currentStepData.inputType === 'file'" class="bg-white p-8 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer group text-center relative">
                 <input type="file" multiple accept="image/*" @change="handleFiles" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10">
                 <div class="text-5xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">📸</div>
                 <p class="font-bold text-text-primary mb-1">Clique para enviar fotos do Álbum</p>
                 <p class="text-sm text-text-light" v-if="form.photos.length === 0">Selecione fotos gerais da família</p>
                 <p class="text-sm text-accent font-bold" v-else>{{ form.photos.length }} fotos selecionadas!</p>
            </div>

            <!-- Timeline Input (New Section) -->
            <div v-if="currentStepData.inputType === 'timeline'">
                <div class="bg-white p-6 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer group text-center relative mb-4">
                     <input type="file" multiple accept="image/*" @change="handleTimelineFiles" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10">
                     <div class="text-5xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">📅</div>
                     <p class="font-bold text-text-primary mb-1">Adicionar fotos à Timeline</p>
                     <p class="text-sm text-text-light">Fotos com datas especiais</p>
                </div>

                <!-- Timeline List -->
                <div v-if="form.timelinePhotos.length > 0" class="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                    <p class="text-xs text-center text-text-light mb-2">Organize a cronologia</p>
                    <div v-for="(photo, index) in form.timelinePhotos" :key="index" class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                        <div class="flex items-center justify-between mb-2">
                             <div class="flex items-center gap-3 overflow-hidden">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                    <img v-if="photo.preview" :src="photo.preview" class="w-full h-full object-cover">
                                    <span v-else class="flex items-center justify-center h-full text-xs">📷</span>
                                </div>
                                <span class="text-xs font-bold w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">{{ index + 1 }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <button @click="moveTimelinePhoto(index, -1)" :disabled="index === 0" class="p-1 hover:bg-gray-100 rounded disabled:opacity-30 text-lg">↑</button>
                                <button @click="moveTimelinePhoto(index, 1)" :disabled="index === form.timelinePhotos.length - 1" class="p-1 hover:bg-gray-100 rounded disabled:opacity-30 text-lg">↓</button>
                                <button @click="removeTimelinePhoto(index)" class="text-red-400 hover:text-red-600 p-1 ml-2">✕</button>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <input 
                                type="date" 
                                v-model="photo.date"
                                class="w-full p-2 bg-gray-50 rounded border border-gray-200 text-xs outline-none focus:border-accent"
                                placeholder="Data"
                            >
                            <input 
                                type="text" 
                                v-model="photo.caption"
                                class="w-full p-2 bg-gray-50 rounded border border-gray-200 text-xs outline-none focus:border-accent"
                                placeholder="Legenda (Opcional)"
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wishes Input -->
            <div v-if="currentStepData.inputType === 'wishes'" class="w-full">
                <!-- Add Wish Form -->
                <div class="bg-white p-4 rounded-xl border border-border shadow-sm mb-4">
                    <input 
                        v-model="newWish.title"
                        type="text" 
                        placeholder="Título (ex: Amor)"
                        class="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3 outline-none focus:border-accent"
                    >
                    <textarea 
                        v-model="newWish.text"
                        placeholder="Mensagem da bolinha..."
                        rows="2"
                        class="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 mb-3 outline-none focus:border-accent resize-none"
                    ></textarea>
                    
                    <div class="flex items-center gap-3 mb-3">
                        <label class="flex-1 cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-sm text-center text-text-light transition-colors relative overflow-hidden">
                            <span v-if="!newWish.imagePreview">📸 Adicionar Foto (Opcional)</span>
                            <span v-else class="text-accent font-bold">Foto selecionada ✔</span>
                            <input type="file" accept="image/*" @change="handleWishImage" class="absolute inset-0 opacity-0 cursor-pointer">
                        </label>
                        <div v-if="newWish.imagePreview" class="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                             <img :src="newWish.imagePreview" class="w-full h-full object-cover">
                        </div>
                    </div>

                    <button 
                        @click="addWish"
                        :disabled="!newWish.title || !newWish.text"
                        class="w-full py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        + Adicionar Desejo
                    </button>
                </div>

                <!-- Wishes List -->
                <div class="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <div v-for="(wish, index) in form.wishes" :key="index" class="bg-white p-3 rounded-lg border border-accent/20 flex items-center justify-between animate-fade-in">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xl shrink-0 border border-white shadow-sm overflow-hidden">
                                <img v-if="wish.imagePreview" :src="wish.imagePreview" class="w-full h-full object-cover">
                                <span v-else>🎄</span>
                            </div>
                            <div>
                                <p class="font-bold text-text-primary text-sm">{{ wish.title }}</p>
                                <p class="text-xs text-text-light truncate max-w-[180px]">{{ wish.text }}</p>
                            </div>
                        </div>
                        <button @click="removeWish(index)" class="text-red-400 hover:text-red-600 p-1">
                            ✕
                        </button>
                    </div>
                </div>
            </div>

            <!-- Payment Brick -->
            <div v-show="currentStepData.inputType === 'payment'" class="bg-white p-6 rounded-xl border border-border shadow-sm">
                <div id="paymentBrick_container"></div>
            </div>

            <!-- Pix Result Modal -->
            <Teleport to="body">
                <div v-if="showPixModal && pixData" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                     <div class="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <button @click="showPixModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
                        
                        <div class="text-center">
                            <div class="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                💠
                            </div>
                            <h3 class="font-bold text-xl text-text-primary mb-2">Pagamento Pix Gerado!</h3>
                            <p class="text-sm text-text-light mb-6">Escaneie o QR Code ou copie o código abaixo para pagar.</p>
                            
                            <div class="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                                <img :src="`data:image/png;base64,${pixData.qrCodeBase64}`" class="mx-auto max-w-[200px] mb-4 rounded-lg mix-blend-multiply" />
                            </div>

                            <div class="relative mb-6">
                                <textarea readonly :value="pixData.qrCode" class="w-full text-xs p-3 bg-gray-50 border rounded-lg resize-none pr-10 font-mono text-gray-600" rows="3"></textarea>
                                <button class="absolute top-2 right-2 text-accent hover:text-accent-dark" title="Copiar">
                                    📋
                                </button>
                            </div>

                             <button @click="checkPixStatus" class="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 shadow-lg mb-2">
                                Já realizei o pagamento
                            </button>
                            <button @click="showPixModal = false" class="w-full py-3 text-text-light font-medium text-sm hover:text-text-primary">
                                Fechar e aguardar
                            </button>
                        </div>
                     </div>
                </div>
            </Teleport>

        </div>

    </div>

    <!-- Bottom Bar (Fixed) -->
    <div v-if="currentStepData.buttonText && !pixData" class="fixed bottom-0 left-0 w-full bg-white border-t border-border p-4 flex justify-end z-50">
        <button 
            @click="handleNext"
            class="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-bold shadow-lg transform transition-all active:scale-95 flex items-center gap-2"
        >
            {{ currentStepData.buttonText }}
            <span>➜</span>
        </button>
    </div>

</div>
</template>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}
.delay-100 {
    animation-delay: 0.1s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
