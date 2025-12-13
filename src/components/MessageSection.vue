<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'O Nosso Maior Tesouro'
  }
});
const messageCard = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  if (messageCard.value) {
    observer.observe(messageCard.value);
  }
});
</script>

<template>
  <section class="message-section" id="mensagem">
    <div class="message-card" ref="messageCard">
      <h2 class="message-title">{{ title }}</h2>
      
      <div v-if="text">
        <p class="message-text" style="white-space: pre-line;">{{ text }}</p>
      </div>
      <div v-else>
        <p class="message-text">
          Neste Natal, celebramos o presente mais valioso de todos: a nossa família. Mais do que as luzes ou a
          ceia, o que realmente brilha é a alegria de estarmos juntos.
        </p>
        <p class="message-text">
          Que esta noite renove as nossas esperanças e que o Ano Novo abra portas para uma prosperidade sem
          limites. Que nunca nos falte o pão na mesa, o amor no coração e a sabedoria para transformarmos nossos
          sonhos em realidade.
        </p>
        <p class="message-text">
          Juntos, somos a força que constrói um futuro brilhante.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.message-section {
  padding: 40px 20px 80px 20px;
  background: linear-gradient(to bottom, #fff5f5 0%, #ffffff 50%, #e8f5e9 100%);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.message-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px 20px; /* Mobile padding */
  border-radius: 20px;
  border: 1px solid rgba(248, 178, 41, 0.3);
  box-shadow: 0 0 60px rgba(255, 215, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.8s ease-out;
  backdrop-filter: blur(5px);
}

@media (min-width: 768px) {
  .message-card {
    padding: 60px 40px; /* Desktop padding */
  }
}

.message-card.visible {
  transform: translateY(0);
  opacity: 1;
}

.message-card::before {
  content: "★";
  font-size: 2rem;
  color: var(--color-gold, #F8B229);
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  padding: 0 10px;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(248, 178, 41, 0.5);
}

.message-title {
  font-family: var(--font-title, 'Great Vibes', cursive);
  font-size: clamp(2.5rem, 2rem + 2vw, 3.5rem); /* Fluid title size */
  color: var(--color-red, #D42426);
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

.message-text {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.2rem); /* Fluid body text */
  color: #555;
  margin-bottom: 20px;
}
</style>
