<script setup>
import { ref } from 'vue';

const isPlaying = ref(false);
const audioRef = ref(null);

const toggleAudio = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play().catch(e => console.log("Audio play failed:", e));
  }
  isPlaying.value = !isPlaying.value;
};
</script>

<template>
  <div>
    <div class="audio-control" @click="toggleAudio" title="Tocar Música">
      <span class="audio-icon">{{ isPlaying ? '❚❚' : '▶' }}</span>
    </div>
    <audio ref="audioRef" loop>
      <source src="https://actions.google.com/sounds/v1/holidays/jingle_bells_orchestra.ogg" type="audio/ogg">
      Seu navegador não suporta áudio.
    </audio>
  </div>
</template>

<style scoped>
.audio-control {
  position: fixed;
  bottom: clamp(15px, 4vw, 20px);
  right: clamp(15px, 4vw, 20px);
  z-index: 1000;
  /* Safe area for iPhone X+ */
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.audio-control:hover {
  transform: scale(1.1);
  background: #b91d1f;
  box-shadow: 0 0 50px rgba(212, 36, 38, 0.9);
}

.audio-control:active {
  transform: scale(0.95);
}

.audio-icon {
  font-size: clamp(20px, 5vw, 24px);
  user-select: none;
}
</style>
