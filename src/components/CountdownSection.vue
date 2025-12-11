<script setup>
import { ref } from 'vue';

// Dados estáticos apenas para visualizar o DESIGN.
// A lógica real virá depois.
const days = ref('12');
const hours = ref('08');
const minutes = ref('45');
const seconds = ref('30');
</script>

<template>
  <section class="countdown-section">
    <div class="glass-container">
      <h2 class="countdown-title">A Magia Acontece em...</h2>
      
      <div class="timer-grid">
        <div class="time-block">
          <div class="number-wrapper">
            <span class="number">{{ days }}</span>
          </div>
          <span class="label">DIAS</span>
        </div>

        <div class="separator">:</div>

        <div class="time-block">
          <div class="number-wrapper">
            <span class="number">{{ hours }}</span>
          </div>
          <span class="label">HORAS</span>
        </div>

        <div class="separator">:</div>

        <div class="time-block">
          <div class="number-wrapper">
            <span class="number">{{ minutes }}</span>
          </div>
          <span class="label">MIN</span>
        </div>

        <div class="separator mobile-hide">:</div>

        <div class="time-block mobile-hide">
          <div class="number-wrapper">
            <span class="number">{{ seconds }}</span>
          </div>
          <span class="label">SEG</span>
        </div>
      </div>

      <p class="countdown-footer">Prepare o seu coração para o Natal</p>
    </div>
  </section>
</template>

<style scoped>
.countdown-section {
  position: relative;
  padding: 60px 20px;
  /* Fundo escuro temporário para realçar o dourado, 
     mas no site final ele vai sobrepor o background principal */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

/* O "Cartão" de Vidro */
.glass-container {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(248, 178, 41, 0.2);
  padding: 40px 60px;
  border-radius: 20px;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.2),
    inset 0 0 20px rgba(248, 178, 41, 0.05); /* Brilho interno sutil */
  text-align: center;
  max-width: 900px;
  width: 100%;
}

.countdown-title {
  font-family: var(--font-title, 'Great Vibes', cursive);
  color: #fff;
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 30px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

/* Grid do Relógio */
.timer-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: clamp(70px, 12vw, 120px);
}

/* O Segredo do Ouro: Gradiente no Texto */
.number {
  font-family: 'Montserrat', sans-serif; /* Fonte moderna e limpa */
  font-weight: 200; /* Super fina (Light) */
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 1;
  
  /* Efeito Dourado Metálico */
  background: linear-gradient(
    135deg, 
    #BF953F 0%, 
    #FCF6BA 40%, 
    #B38728 60%, 
    #FBF5B7 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  
  filter: drop-shadow(0 2px 0px rgba(0,0,0,0.3));
}

.label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  letter-spacing: 3px;
  margin-top: 10px;
  text-transform: uppercase;
  font-weight: 400;
}

.separator {
  font-size: clamp(2rem, 4vw, 3rem);
  color: rgba(248, 178, 41, 0.5);
  margin-bottom: 25px; /* Ajuste para alinhar com os números */
  font-weight: 200;
}

.countdown-footer {
  margin-top: 20px;
  color: #ccc;
  font-size: 0.9rem;
  font-style: italic;
  font-weight: 300;
  letter-spacing: 1px;
}

/* Ajustes Mobile */
@media (max-width: 768px) {
  .glass-container {
    padding: 30px 15px;
  }
  
  .timer-grid {
    gap: 5px;
  }
  
  /* Esconder segundos no mobile para não quebrar layout */
  .mobile-hide {
    display: none;
  }
}
</style>