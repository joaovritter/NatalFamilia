<script setup>
import { inject, computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/* --- Componentes --- */
import GiftOverlay from '../components/GiftOverlay.vue';
import HeroSection from '../components/HeroSection.vue';
import ImageCarousel from '../components/ImageCarousel.vue';
import MessageSection from '../components/MessageSection.vue';
import WishesTreeSection from '../components/WishesTreeSection.vue';
import TimeCapsuleSection from '../components/TimeCapsuleSection.vue';
import GuestbookSection from '../components/GuestbookSection.vue';
import FooterSection from '../components/FooterSection.vue';

const router = useRouter();
const route = useRoute();
const playGlobalAudio = inject('playGlobalAudio');
const setAudioSource = inject('setAudioSource');
const familyName = ref('');
const familyMessage = ref(null);
const familyWishes = ref(null);
const familyPhotos = ref([]);
const familyTimeline = ref([]);

const isPersonalized = computed(() => !!route.params.familyName);

onMounted(async () => {
  if (isPersonalized.value) {
    try {
  
      const slug = route.params.familyName;
      
      try {

        const response = await fetch(`http://api.alcefamily.shop/api/family/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          

          familyName.value = data.name; 
          familyMessage.value = data.message;


          familyWishes.value = Array.isArray(data.wishes) 
            ? data.wishes.map(w => ({
              ...w,
              image: w.image ? `http://api.alcefamily.shop${w.image}` : null
            })) 
            : [];

          // General Carousel Photos (Simple Paths)
          familyPhotos.value = Array.isArray(data.photos)
             ? data.photos.map(photo => `http://api.alcefamily.shop${photo}`)
             : [];
             
          // Timeline Photos (Objects)
          familyTimeline.value = Array.isArray(data.timeline)
            ? data.timeline.map(item => ({
                ...item,
                src: `http://api.alcefamily.shop${item.src}`
            }))
            : [];
             
           if (data.youtubeLink && setAudioSource) {
               setAudioSource(data.youtubeLink);
           }
             
        } else {
            console.error('Família não encontrada pelo ID:', slug);
            familyName.value = 'Família não encontrada';
        }
      } catch (e) {
        console.warn('Erro ao conectar com Backend:', e);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

const handleGiftOpen = () => {
  setTimeout(() => {
    if (playGlobalAudio) {
      playGlobalAudio();
    }
  }, 500);
};
</script>

<template>
  <div class="home-view">
    <GiftOverlay @open="handleGiftOpen" :sender-name="'Família ' + familyName" />

    <main>
      <HeroSection :familyName="familyName" :showCreateButton="!isPersonalized" />
      
      <ImageCarousel :custom-images="familyPhotos" />
      <MessageSection :text="familyMessage" />
      <WishesTreeSection background-image="/tree.png" :customOrnaments="familyWishes" />
      <TimeCapsuleSection :photos="familyTimeline" />
      <GuestbookSection />
    </main>

    <FooterSection :showMarketing="!isPersonalized" />
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
