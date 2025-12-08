<script setup>
import { ref } from 'vue';

const emit = defineEmits(['open']);
const isOpened = ref(false);
const isHidden = ref(false); // Para remover do DOM depois da animação

const openGift = () => {
  if (isOpened.value) return;
  
  isOpened.value = true;
  
  // Emite o evento para o App.vue dar o play na música
  emit('open');
  
  // Espera a transição de opacidade (1.5s) para remover do DOM
  setTimeout(() => {
    isHidden.value = true;
  }, 1500);
};
</script>

<template>
  <div v-if="!isHidden" class="gift-overlay" :class="{ 'fade-out': isOpened }">
    <div class="content">
      <h1 class="sender-text">Você recebeu uma surpresa de<br><strong>Família Reis</strong></h1>
      
      <div class="gift-container" @click="openGift">
        <div class="gift-wrapper">
          <div class="gift-box">
            <div class="lid"></div>
            <div class="box">
              <div class="ribbon-vertical"></div>
              <div class="ribbon-horizontal"></div>
            </div>
          </div>
          <div class="click-instruction">
            <span class="instruction-text">Toque para abrir</span>
            <span class="instruction-glow"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gift-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Gradiente escuro e elegante */
  background: radial-gradient(circle at center, #2C3E50 0%, #000000 100%);
  z-index: 20000; /* Acima de tudo, inclusive da neve */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 1.5s ease-in-out;
}

.gift-overlay.fade-out {
  opacity: 0;
  pointer-events: none;
}

.content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatIn 1s ease-out;
}

.sender-text {
  color: #fff;
  font-family: var(--font-title, 'Great Vibes', cursive);
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 60px;
  line-height: 1.2;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.sender-text strong {
  color: var(--color-gold, #F8B229);
  font-size: 1.2em;
}

/* --- CSS DA CAIXA DE PRESENTE --- */
.gift-container {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.gift-container:hover {
  transform: scale(1.05);
}

.gift-container:hover .gift-box {
  animation: bounce 1.5s infinite, glow 2s ease-in-out infinite;
}

.gift-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.gift-box {
  position: relative;
  width: clamp(100px, 25vw, 140px);
  height: clamp(100px, 25vw, 140px);
  animation: bounce 2s infinite;
  z-index: 1;
}

.box {
  width: clamp(100px, 25vw, 140px);
  height: clamp(85px, 21vw, 120px);
  background: #D42426; /* Vermelho Natal */
  position: absolute;
  bottom: 0;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.lid {
  width: clamp(110px, 27vw, 150px);
  height: clamp(25px, 6vw, 35px);
  background: #B91D1F; /* Vermelho mais escuro */
  position: absolute;
  top: clamp(-12px, -3vw, -17px);
  left: clamp(-5px, -1.2vw, -5px);
  border-radius: 5px;
  z-index: 2;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.ribbon-vertical {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(18px, 4.5vw, 24px);
  height: 100%;
  background: #F8B229; /* Ouro */
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}

.ribbon-horizontal {
  position: absolute;
  top: 40%;
  left: 0;
  width: 100%;
  height: clamp(18px, 4.5vw, 24px);
  background: #F8B229;
}

.click-instruction {
  position: relative;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.instruction-text {
  position: relative;
  z-index: 2;
  color: var(--color-gold, #F8B229);
  text-transform: uppercase;
  letter-spacing: clamp(2px, 1vw, 4px);
  font-size: clamp(0.75rem, 2vw, 0.95rem);
  font-weight: 600;
  text-shadow: 
    0 0 10px rgba(248, 178, 41, 0.8),
    0 0 20px rgba(248, 178, 41, 0.6),
    0 0 30px rgba(248, 178, 41, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.5);
  animation: 
    pulseText 2s ease-in-out infinite,
    floatText 3s ease-in-out infinite;
  white-space: nowrap;
}

.instruction-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(248, 178, 41, 0.3) 0%,
    rgba(248, 178, 41, 0.1) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: pulseGlow 2s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.gift-container:hover .instruction-text {
  color: #ffd700;
  text-shadow: 
    0 0 15px rgba(255, 215, 0, 1),
    0 0 25px rgba(255, 215, 0, 0.8),
    0 0 35px rgba(255, 215, 0, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.5);
}

.gift-container:hover .instruction-glow {
  opacity: 1;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.5) 0%,
    rgba(255, 215, 0, 0.2) 40%,
    transparent 70%
  );
}

.gift-container:active .instruction-text {
  transform: scale(0.95);
}

/* Animações */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

@keyframes pulseText {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes floatText {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.02);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(248, 178, 41, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 15px rgba(248, 178, 41, 0.8)) drop-shadow(0 0 25px rgba(248, 178, 41, 0.4));
  }
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .click-instruction {
    margin-top: 35px;
  }
  
  .instruction-text {
    font-size: 0.75rem;
    letter-spacing: 2px;
  }
}

@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>