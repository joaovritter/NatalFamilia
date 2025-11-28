<script setup>
defineProps({
  familyName: {
    type: String,
    default: '[Sobrenome]'
  }
});
</script>

<template>
  <header>
    <h1>Natal da Família {{ familyName }}</h1>
    <p class="subtitle">Celebrando o amor, a união e a alegria.</p>
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
