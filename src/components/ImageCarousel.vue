<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const props = defineProps({
  customImages: {
    type: Array,
    default: () => []
  }
});

const modules = [Autoplay, Pagination, EffectCoverflow];

const defaultImages = [
  { src: 'https://cdn.discordapp.com/attachments/1417313311556370655/1450300905541996634/Lolly_avos-bebe-1024x683.png?ex=6945fdf9&is=6944ac79&hm=6f5e8b827a36c48ca932a2de8449607d3af98ccd8ff10d3a30b969bed07a4f29&', alt: 'Família no Natal' },
  { src: 'https://cdn.discordapp.com/attachments/1417313311556370655/1450300776164491407/estudante-hispanico-e-familia-celebrando-a-formatura_1218270-4391.png?ex=6945fdda&is=6944ac5a&hm=31f4f0dbda294c374cb79f4b9084b7e0797979bf389c5b749d309f0702185e71&', alt: 'Ceia de Natal' },
  { src: 'https://cdn.discordapp.com/attachments/1417313311556370655/1450300537290625194/churrasco-em-casa-4-1024x683.png?ex=6945fda1&is=6944ac21&hm=3bfa44dbc887949c2f44f2ab8dacba9cdb07dc8888612953db4d4c92af6faf72&', alt: 'Decoração Natalina' },
  { src: 'https://cdn.discordapp.com/attachments/1417313311556370655/1450300413642539179/brincadeiras-criancas-idades-diferentes6.png?ex=6945fd83&is=6944ac03&hm=e484419fa3913ca918bf02efef8a2b2bda373f8e872afd7cab2909963beb0a21&', alt: 'Presentes de Natal' },
];

const images = computed(() => {
  if (props.customImages && props.customImages.length > 0) {
    return props.customImages.map((src, index) => ({
      src,
      alt: `Foto Família ${index + 1}`
    }));
  }
  return defaultImages;
});

const isModalOpen = ref(false);
const currentImageIndex = ref(0);
const modalImageRef = ref(null);

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const lastTouchDistance = ref(0);

const openModal = (index) => {
  currentImageIndex.value = index;
  isModalOpen.value = true;
  resetZoom();
  document.body.style.overflow = 'hidden';
};

// Close modal
const closeModal = () => {
  isModalOpen.value = false;
  resetZoom();
  document.body.style.overflow = '';
};

const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

const handleDoubleClick = (event) => {
  if (scale.value === 1) {
    scale.value = 2;
    const rect = modalImageRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    translateX.value = -x * (scale.value - 1);
    translateY.value = -y * (scale.value - 1);
  } else {
    resetZoom();
  }
};

const handleTouchStart = (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    lastTouchDistance.value = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  } else if (event.touches.length === 1 && scale.value > 1) {
    isDragging.value = true;
    dragStart.value = {
      x: event.touches[0].clientX - translateX.value,
      y: event.touches[0].clientY - translateY.value
    };
  }
};

const handleTouchMove = (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    if (lastTouchDistance.value > 0) {
      const scaleChange = distance / lastTouchDistance.value;
      const newScale = Math.min(Math.max(scale.value * scaleChange, 1), 4);
      scale.value = newScale;
      
      if (newScale > 1) {
        const rect = modalImageRef.value.getBoundingClientRect();
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left - rect.width / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top - rect.height / 2;
        translateX.value = -centerX * (newScale - 1);
        translateY.value = -centerY * (newScale - 1);
      }
    }
    lastTouchDistance.value = distance;
  } else if (isDragging.value && event.touches.length === 1) {
    event.preventDefault();
    translateX.value = event.touches[0].clientX - dragStart.value.x;
    translateY.value = event.touches[0].clientY - dragStart.value.y;
  }
};

const handleTouchEnd = () => {
  lastTouchDistance.value = 0;
  isDragging.value = false;
  
  if (scale.value < 1) {
    resetZoom();
  }
};

const handleMouseDown = (event) => {
  if (scale.value > 1) {
    isDragging.value = true;
    dragStart.value = {
      x: event.clientX - translateX.value,
      y: event.clientY - translateY.value
    };
  }
};

const handleMouseMove = (event) => {
  if (isDragging.value && scale.value > 1) {
    translateX.value = event.clientX - dragStart.value.x;
    translateY.value = event.clientY - dragStart.value.y;
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  resetZoom();
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
  resetZoom();
};

const handleKeyDown = (event) => {
  if (!isModalOpen.value) return;
  
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'ArrowRight') {
    nextImage();
  } else if (event.key === 'ArrowLeft') {
    prevImage();
  }
};

const swiperKey = ref(0);
import { watch } from 'vue';
watch(() => props.customImages, () => {
  swiperKey.value++;
}, { deep: true });

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>

<template>
  <section class="gallery-section">
    <h2 class="gallery-title">Nossos Momentos</h2>
    <div class="carousel-container">
      <swiper
        :effect="'coverflow'"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView="'auto'"
        :loop="true"
        :speed="5000"
        :coverflowEffect="{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }"
        :autoplay="{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }"
        :modules="modules"
        class="mySwiper"
        :key="swiperKey"
      >
        <swiper-slide v-for="(img, index) in images" :key="index" @click="openModal(index)">
          <img 
            :src="img.src" 
            :alt="img.alt" 
            @error="(e) => { e.target.src = 'https://placehold.co/800x450/333/white?text=Erro+Imagem'; }"
            class="carousel-image"
          />
        </swiper-slide>
      </swiper>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="isModalOpen" 
          class="image-modal"
          @click.self="closeModal"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
        >
          <button class="modal-close" @click="closeModal" aria-label="Fechar">
            ✕
          </button>
          
          <button 
            class="modal-nav modal-nav-prev" 
            @click.stop="prevImage"
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          
          <div class="modal-image-container">
            <img
              ref="modalImageRef"
              :src="images[currentImageIndex].src"
              :alt="images[currentImageIndex].alt"
              class="modal-image"
              :style="{
                transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }"
              @dblclick="handleDoubleClick"
              @click.stop
            />
          </div>
          
          <button 
            class="modal-nav modal-nav-next" 
            @click.stop="nextImage"
            aria-label="Próxima imagem"
          >
            ›
          </button>
          
          <div class="modal-indicator">
            {{ currentImageIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-section {
  padding: clamp(60px, 10vw, 80px) 0;
  background: linear-gradient(to bottom, #0f1c13 0%, #142419 100%);
  color: white;
  text-align: center;
  overflow-x: hidden;
  overflow-y: visible;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.gallery-title {
  font-family: var(--font-title, 'Great Vibes', cursive);
  font-size: clamp(2.5rem, 2rem + 3vw, 4rem);
  margin-bottom: 30px;
  color: var(--color-gold, #F8B229);
  text-shadow: 0 0 30px rgba(248, 178, 41, 0.4);
}

.carousel-container {
  width: 100%;
  max-width: 100vw;
  padding-top: 20px;
  padding-bottom: 40px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.swiper {
  width: 100%;
  max-width: 100%;
  padding-top: 40px;
  padding-bottom: 40px;
  box-sizing: border-box;
  overflow: visible;
}

:deep(.swiper-wrapper) {
  transition-timing-function: linear;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 70vw; 
  height: 50vh;
  max-height: 400px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  border: 3px solid var(--color-gold, #F8B229);
}

@media (min-width: 768px) {
  .swiper-slide {
    width: 400px;
    height: 300px;
    border: 4px solid var(--color-gold, #F8B229);
  }
}

@media (min-width: 1024px) {
  .swiper-slide {
    width: 600px;
    height: 400px;
  }
}

@media (min-width: 1400px) {
  .swiper-slide {
    width: 700px;
    height: 450px;
  }
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-box-reflect: below 1px linear-gradient(transparent, transparent, #0002, #0004);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.carousel-image:hover {
  transform: scale(1.02);
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 20001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.modal-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100vw;
  max-height: 100vh;
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: none;
  cursor: grab;
}

.modal-image:active {
  cursor: grabbing;
}

.modal-close {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.3s ease;
  line-height: 1;
  padding: 0;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  transition: all 0.3s ease;
  line-height: 1;
  padding: 0;
  user-select: none;
}

.modal-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.modal-nav-prev {
  left: 20px;
}

.modal-nav-next {
  right: 20px;
}

.modal-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  z-index: 10001;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 767px) {
  .modal-close {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .modal-nav {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .modal-nav-prev {
    left: 10px;
  }

  .modal-nav-next {
    right: 10px;
  }

  .modal-indicator {
    bottom: 20px;
    padding: 8px 16px;
    font-size: 12px;
  }

  .image-modal {
    padding: 10px;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-image-container,
.modal-leave-active .modal-image-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-image-container,
.modal-leave-to .modal-image-container {
  transform: scale(0.9);
}
</style>
