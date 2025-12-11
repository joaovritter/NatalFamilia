<script setup>
import { inject, computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/* --- Componentes --- */
import GiftOverlay from '../components/GiftOverlay.vue';
import HeroSection from '../components/HeroSection.vue';
import CountdownSection from '../components/CountdownSection.vue';
import ImageCarousel from '../components/ImageCarousel.vue';
import MessageSection from '../components/MessageSection.vue';
import WishesTreeSection from '../components/WishesTreeSection.vue';
import GuestbookSection from '../components/GuestbookSection.vue';
import FooterSection from '../components/FooterSection.vue';

const router = useRouter();
const route = useRoute();
const playGlobalAudio = inject('playGlobalAudio');
const familyName = ref('Reis');
const familyPhotos = ref([]);

// Determina se é uma visualização personalizada
const isPersonalized = computed(() => !!route.params.familyName);

onMounted(async () => {
  if (isPersonalized.value) {
    try {
      // Tenta buscar dados da família do backend
      // O nome na URL pode ser usado para busca
      const name = route.params.familyName;
      // Em um cenário real, usaríamos um ID ou slug único, mas vamos usar o nome por enquanto
      // Se não tiver backend rodando ou falhar, usa o nome da URL e fotos padrão
      
      // Tenta buscar do backend (opcional, se falhar usa defaults)
      try {
        const response = await fetch(`http://localhost:3000/api/family/${encodeURIComponent(name)}`);
        if (response.ok) {
          const data = await response.json();
          familyName.value = data.name;
          // Adiciona prefixo do servidor para as imagens
          familyPhotos.value = data.photos.map(photo => `http://localhost:3000${photo}`);
        } else {
            familyName.value = name;
        }
      } catch (e) {
        console.warn('Backend não disponível ou erro ao buscar família:', e);
        familyName.value = name;
      }
    } catch (error) {
      console.error(error);
    }
  }
});

// Quando o usuário abrir o presente:
const handleGiftOpen = () => {
  // Atrasar levemente o áudio para sincronizar com a animação de saída da caixa
  setTimeout(() => {
    if (playGlobalAudio) {
      playGlobalAudio();
    }
  }, 500);
};
</script>

<template>
  <div class="home-view">
    <GiftOverlay @open="handleGiftOpen" />

    <main>
      <HeroSection :familyName="familyName" :showCreateButton="!isPersonalized" />
      
      <CountdownSection />
      <ImageCarousel :custom-images="familyPhotos" />
      <MessageSection />
      <WishesTreeSection background-image="/tree.png" />
      <GuestbookSection />
    </main>

    <FooterSection />
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
}

.create-magic-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.5));
}

.create-magic-btn {
  background: linear-gradient(45deg, #ff0000, #cc0000);
  color: white;
  border: 2px solid #ffd700;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5), 0 0 10px #ffd700;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: pulse 2s infinite;
}

.create-magic-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(255, 0, 0, 0.8), 0 0 20px #ffd700;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
