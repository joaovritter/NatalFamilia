<script setup>
defineProps({
  familyName: {
    type: String,
    default: '[Sobrenome]'
  }
});

const handleCreateNatal = () => {
  // Rolar suavemente para a próxima seção após o header
  const header = document.querySelector('header');
  if (header) {
    const nextSection = header.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Se não encontrar próxima seção, rola um pouco para baixo
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  }
};
</script>

<template>
  <header>
    <h1>Natal da Família {{ familyName }}</h1>
    <p class="subtitle">Celebrando o amor, a união e a alegria.</p>
    <button class="create-button" @click="handleCreateNatal">
      <span class="button-text">✨ Criar meu Natal Mágico</span>
      <span class="button-shine"></span>
    </button>
  </header>
</template>

<style scoped>
header {
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  /* Mobile-optimized background */
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1920&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: scroll; /* Fixed attachment can be buggy on mobile */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: clamp(15px, 4vw, 20px);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Parallax effect only for desktop where supported */
@media (min-width: 1024px) {
  header {
    background-attachment: fixed;
  }
}

header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px; /* Smaller gradient on mobile */
  background: linear-gradient(to bottom, transparent, #fff5f5);
  pointer-events: none;
}

@media (min-width: 768px) {
  header::after {
    height: 150px;
  }
}

h1 {
  font-family: var(--font-title, 'Great Vibes', cursive);
  /* Fluid font size for title: 3.5rem mobile -> 6rem desktop */
  font-size: clamp(3.5rem, 2.5rem + 4vw, 6rem);
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInDown 1.5s ease-out;
  padding: 0 10px; /* Prevent text touching edges */
  line-height: 1.1;
}

.subtitle {
  font-size: clamp(1.1rem, 1rem + 0.5vw, 1.5rem);
  font-weight: 300;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 1.5s ease-out 0.5s backwards;
  padding: 0 20px;
  margin-bottom: 30px;
}

.create-button {
  position: relative;
  margin-top: 40px;
  padding: clamp(14px, 3vw, 18px) clamp(32px, 8vw, 48px);
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.2rem);
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--color-red, #D42426) 0%, var(--color-green, #165B33) 100%);
  border: 3px solid var(--color-gold, #F8B229);
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  box-shadow: 
    0 0 30px rgba(248, 178, 41, 0.5),
    0 10px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  animation: fadeInUp 1.5s ease-out 1s backwards, pulse 2s ease-in-out infinite 2s;
  z-index: 1;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.create-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.create-button:hover::before {
  left: 100%;
}

.create-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 0 50px rgba(248, 178, 41, 0.8),
    0 15px 40px rgba(0, 0, 0, 0.4),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
  border-color: #ffd700;
}

.create-button:active {
  transform: translateY(-1px) scale(1.02);
}

.button-text {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.button-shine {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  pointer-events: none;
}

.create-button:active .button-shine {
  width: 300px;
  height: 300px;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(248, 178, 41, 0.5),
      0 10px 30px rgba(0, 0, 0, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 40px rgba(248, 178, 41, 0.7),
      0 12px 35px rgba(0, 0, 0, 0.35),
      inset 0 0 25px rgba(255, 255, 255, 0.15);
  }
}

/* Mobile optimizations */
@media (max-width: 767px) {
  .create-button {
    margin-top: 30px;
    padding: 14px 32px;
    font-size: 0.95rem;
    letter-spacing: 1px;
  }
  
  .create-button:hover {
    transform: translateY(-2px) scale(1.03);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
