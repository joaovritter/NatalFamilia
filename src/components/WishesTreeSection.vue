<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  backgroundImage: {
    type: String,
    default: '' 
  },
  customOrnaments: {
    type: Array,
    default: null
  }
});

const defaultOrnaments = [
  { id: 1, top: '15%', left: '50%', icon: '🌟', title: 'Esperança', text: 'Que a fé guie cada passo do seu novo ano.' },
  { id: 2, top: '35%', left: '40%', icon: '✈️', title: 'Viagens', text: 'Novos destinos e horizontes para explorar.' },
  { id: 3, top: '35%', left: '60%', icon: '❤️', title: 'Amor', text: 'Laços mais fortes e corações aquecidos.' },
  { id: 4, top: '55%', left: '30%', icon: '💰', title: 'Prosperidade', text: 'Sucesso financeiro e abundância em 2026.' },
  { id: 5, top: '55%', left: '50%', icon: '🕊️', title: 'Paz', text: 'Serenidade para enfrentar qualquer desafio.' },
  { id: 6, top: '55%', left: '70%', icon: '💪', title: 'Saúde', text: 'Energia vital para viver o melhor da vida.' },
  { id: 7, top: '75%', left: '20%', icon: '🏠', title: 'Lar', text: 'Que nossa casa seja sempre um refúgio de alegria.' },
  { id: 8, top: '75%', left: '40%', icon: '🚀', title: 'Conquistas', text: 'Projetos saindo do papel e sonhos realizados.' },
  { id: 9, top: '75%', left: '60%', icon: '🎉', title: 'Alegria', text: 'Muitos motivos para sorrir todos os dias.' },
  { id: 10, top: '75%', left: '80%', icon: '✨', title: 'Sabedoria', text: 'Clareza para as melhores escolhas.' },
];

const ornaments = computed(() => {
    return props.customOrnaments && props.customOrnaments.length > 0 
        ? props.customOrnaments.map((o, i) => ({
            ...o,
            top: defaultOrnaments[i]?.top || '50%',
            left: defaultOrnaments[i]?.left || '50%',
            id: defaultOrnaments[i]?.id || i
        }))
        : defaultOrnaments;
});

const activeWish = ref(null);
const isVisible = ref(false);

const openWish = (wish) => {
  activeWish.value = wish;
  isVisible.value = true;
};

const closeWish = () => {
  isVisible.value = false;
  activeWish.value = null;
};

const getDelay = (index) => {
    return `${(index * 0.2) % 2}s`;
};
</script>

<template>
  <section class="tree-section">
    <h2 class="section-title">A Árvore dos Desejos</h2>
    <p class="section-subtitle">Toque nas luzes para revelar o que desejamos para você.</p>

    <div class="tree-container">
      <img 
        v-if="backgroundImage" 
        :src="backgroundImage" 
        alt="Árvore de Desejos" 
        class="tree-image"
      />
      <div v-else class="tree-shape"></div>
      
      <div class="tree-trunk-shadow"></div>

      <button 
        v-for="(ornament, index) in ornaments" 
        :key="ornament.id"
        class="ornament-btn"
        :style="{ top: ornament.top, left: ornament.left, animationDelay: getDelay(index) }"
        @click="openWish(ornament)"
        aria-label="Ver desejo"
      >
        <img v-if="ornament.image" :src="ornament.image" class="ornament-image" />
        
        
        <div class="glow-effect"></div>
      </button>
    </div>

    <Transition name="scale-up">
      <div v-if="isVisible && activeWish" class="wish-overlay" @click.self="closeWish">
        <div class="wish-card">
          <button class="close-btn" @click="closeWish">×</button>
          
          <h3 class="wish-title">{{ activeWish.title }}</h3>

          <div class="wish-content-wrapper" style="display: flex; justify-content: center;">
             <img v-if="activeWish.image" :src="activeWish.image" class="wish-modal-image" />
          </div>
          
          <p class="wish-text">{{ activeWish.text }}</p>
          
          <div class="wish-footer">
            Família &copy; 2025
          </div>
        </div>
      </div>
    </Transition>
    
    <div class="bottom-gradient"></div>
  </section>
</template>

<style scoped>
.tree-section {
  padding: 280px 20px 100px; /* Significantly increased top padding to clear the 400px/150px gradient overlap */
  background: linear-gradient(to bottom, #1a2a1d 0%, #0f1c13 100%);
  position: relative;
  overflow: hidden;
  text-align: center;
  min-height: 80vh;
}

.bottom-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background: linear-gradient(to bottom, transparent, #0f1c13);
    pointer-events: none;
    z-index: 5;
}

.tree-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Fade-in overlay to avoid hard line at top */
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 15%);
  z-index: 0;
  pointer-events: none;
}

.tree-section > * {
  position: relative;
  z-index: 1;
}

.section-title {
  font-family: var(--font-title, 'Great Vibes', cursive);
  color: var(--color-gold, #F8B229);
  font-size: 3.5rem;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(248, 178, 41, 0.4);
}

.section-subtitle {
  color: rgba(255,255,255,0.7);
  margin-bottom: 40px;
  font-weight: 300;
}

.tree-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 600px;
  margin: 0 auto;
}

.tree-image {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 500px;
  width: 100%;
  height: auto;
  object-fit: contain;
  z-index: 0;
  filter: drop-shadow(0 0 20px rgba(248, 178, 41, 0.2));
  pointer-events: none;
}

.tree-trunk-shadow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 80px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 70%);
  border-radius: 50% 50% 0 0;
  z-index: 1;
  pointer-events: none;
  filter: blur(8px);
}

.tree-shape {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 300px solid transparent;
  border-right: 300px solid transparent;
  border-bottom: 500px solid rgba(22, 91, 51, 0.1);
  filter: drop-shadow(0 0 20px rgba(248, 178, 41, 0.1));
}

.tree-shape::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  width: 2px;
  height: 500px;
  background: linear-gradient(to bottom, transparent, rgba(248, 178, 41, 0.3), transparent);
}

.ornament-btn {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #fff, #F8B229);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 0 15px rgba(248, 178, 41, 0.6);
  box-shadow: 0 0 15px rgba(248, 178, 41, 0.6);
  animation: float 4s ease-in-out infinite, twinkle 2s ease-in-out infinite alternate;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
}

.ornament-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ornament-icon {
  font-size: 1.2rem;
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-15px); }
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { width: 100%; height: 100%; opacity: 1; }
  100% { width: 200%; height: 200%; opacity: 0; }
}

.ornament-btn:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 11;
  box-shadow: 0 0 30px rgba(248, 178, 41, 1);
}

.wish-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.wish-card {
  background: #fff;
  width: 100%;
  max-width: 350px;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 0 50px rgba(248, 178, 41, 0.4);
  border: 2px solid var(--color-gold, #F8B229);
}

.wish-icon-wrapper {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.wish-modal-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-gold, #F8B229);
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.wish-title {
  color: var(--color-red, #D42426);
  font-family: var(--font-title);
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.wish-text {
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
}

.wish-footer {
  font-size: 0.8rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
}

@media (max-width: 768px) {
  .tree-section {
    padding: 40px 15px 80px;
  }
  
  .tree-container {
    height: 400px;
  }
  
  .tree-image {
    max-width: 100%;
    height: auto;
  }
  
  .tree-trunk-shadow {
    width: 40px;
    height: 60px;
  }
  
  .tree-shape {
    border-left-width: 150px;
    border-right-width: 150px;
    border-bottom-width: 350px;
  }
  
  .ornament-btn {
    width: 30px;
    height: 30px;
  }
}

/* Vue Transitions */
.scale-up-enter-active,
.scale-up-leave-active {
  transition: all 0.3s ease;
}

.scale-up-enter-from,
.scale-up-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>