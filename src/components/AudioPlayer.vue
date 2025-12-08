<script setup>
import { ref } from 'vue';

const isPlaying = ref(false);
const audioRef = ref(null);

// Função pública para iniciar o áudio
const playAudio = () => {
  if (audioRef.value) {
    audioRef.value.play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch(e => console.log("Auto-play prevented (waiting for interaction):", e));
  }
};

const toggleAudio = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play().catch(e => console.log("Audio play failed:", e));
  }
  isPlaying.value = !isPlaying.value;
};

// Expondo a função para o componente Pai (App.vue) usar
defineExpose({
  playAudio
});
</script>

<template>
  <div>
    <div class="audio-control" @click="toggleAudio" title="Tocar Música">
      <span class="audio-icon">{{ isPlaying ? '❚❚' : '▶' }}</span>
    </div>
    <audio ref="audioRef" loop>
      <source src="https://actions.google.com/sounds/v1/holidays/jingle_bells_orchestra.ogg" type="audio/ogg">
    </audio>
  </div>
</template>

<style scoped>
/* Mantenha o CSS que você já tem */
.audio-control {
  position: fixed;
  bottom: clamp(15px, 4vw, 20px);
  right: clamp(15px, 4vw, 20px);
  z-index: 1000;
  margin-bottom: env(safe-area-inset-bottom);
  margin-right: env(safe-area-inset-right);
  background: var(--color-red, #D42426);
  color: white;
  width: clamp(50px, 12vw, 60px);
  height: clamp(50px, 12vw, 60px);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(212, 36, 38, 0.6);
  transition: transform 0.3s ease, background 0.3s;
  border: 2px solid var(--color-gold, #F8B229);
}
.audio-control:hover { transform: scale(1.1); }
.audio-control:active { transform: scale(0.95); }
.audio-icon { font-size: clamp(20px, 5vw, 24px); user-select: none; }
</style>