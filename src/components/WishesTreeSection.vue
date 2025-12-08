<script setup>
import { ref, computed } from 'vue';

// Prop para a imagem de fundo - você pode passar a URL da imagem
const props = defineProps({
  backgroundImage: {
    type: String,
    default: '' // URL da imagem de fundo - deixe vazio ou passe a URL
  }
});

// Posições calculadas para formar um triângulo (Árvore)
// top: % de cima para baixo, left: % da esquerda
const ornaments = [
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

const activeWish = ref(null);
const isVisible = ref(false);

const openWish = (wish) => {
  activeWish.value = wish;
  isVisible.value = true;
};

const closeWish = () => {
  isVisible.value = false;
  // Pequeno delay para limpar os dados após a animação de saída
  setTimeout(() => {
    activeWish.value = null;
  }, 300);
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
      
      <!-- Sombra do tronco de árvore -->
      <div class="tree-trunk-shadow"></div>

      <button 
        v-for="ornament in ornaments" 
        :key="ornament.id"
        class="ornament-btn"
        :style="{ top: ornament.top, left: ornament.left }"
        @click="openWish(ornament)"
        aria-label="Ver desejo"
      >
        <div class="glow-effect"></div>
      </button>
    </div>

    <Transition name="scale-up">
      <div v-if="isVisible && activeWish" class="wish-overlay" @click.self="closeWish">
        <div class="wish-card">
          <button class="close-btn" @click="closeWish">×</button>
          
          <div class="wish-icon-wrapper">
            <span class="wish-icon">{{ activeWish.icon }}</span>
          </div>
          
          <h3 class="wish-title">{{ activeWish.title }}</h3>
          <p class="wish-text">{{ activeWish.text }}</p>
          
          <div class="wish-footer">
            Família &copy; 2025
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.tree-section {
  padding: 60px 20px 100px;
  /* Fallback: cor de fundo caso não tenha imagem */
  background-color: #1a2a1d;
  position: relative;
  overflow: hidden;
  text-align: center;
  min-height: 80vh;
}

/* Overlay escuro para melhorar legibilidade */
.tree-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Ajuste a opacidade (0.0 a 1.0) para controlar o escurecimento */
  z-index: 0;
  pointer-events: none;
}

/* Garantir que o conteúdo fique acima do overlay */
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

/* Container da Árvore */
.tree-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 600px; /* Altura fixa para manter proporção */
  margin: 0 auto;
}

/* Imagem da árvore substituindo o triângulo */
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
  pointer-events: none; /* Permite clicar nos ornamentos acima */
}

/* Sombra do tronco de árvore */
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

/* O Formato Triangular (Fundo sutil) - Fallback quando não há imagem */
.tree-shape {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 300px solid transparent;
  border-right: 300px solid transparent;
  border-bottom: 500px solid rgba(22, 91, 51, 0.1); /* Verde muito sutil */
  filter: drop-shadow(0 0 20px rgba(248, 178, 41, 0.1));
}

/* Linha central decorativa (Tronco etéreo) - apenas quando usar triângulo */
.tree-shape::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  width: 2px;
  height: 500px;
  background: linear-gradient(to bottom, transparent, rgba(248, 178, 41, 0.3), transparent);
}

/* Os Botões (Luzes) */
.ornament-btn {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #fff, #F8B229);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transform: translate(-50%, -50%); /* Centralizar no ponto */
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 0 15px rgba(248, 178, 41, 0.6);
  animation: float 3s ease-in-out infinite;
}

/* Animação de Flutuação */
@keyframes float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-10px); }
}

/* Efeito de brilho pulsante */
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

/* Modal de Revelação (Wish Card) */
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

/* Ícone grande no topo do card */
.wish-icon-wrapper {
  font-size: 4rem;
  margin-bottom: 20px;
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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .tree-section {
    padding: 40px 15px 80px;
  }
  
  .tree-container {
    height: 400px; /* Menor no mobile */
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