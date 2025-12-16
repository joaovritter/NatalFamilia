<script setup>
import { ref, provide, computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

/* --- Componentes Globais --- */
import ChristmasLights from './components/ChristmasLights.vue';
import GoldDustEffect from './components/GoldDustEffect.vue';
import AudioPlayer from './components/AudioPlayer.vue';

import './assets/base.css';

// Referência para controlar o AudioPlayer
const audioPlayerRef = ref(null);
const route = useRoute();

const showGlobalEffects = computed(() => {
  return !route.path.includes('/configurar');
});

const playAudio = () => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.playAudio();
  }
};

const setAudioSource = (src) => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.setSource(src);
  }
};

// Provide para que os filhos possam controlar o áudio
provide('playGlobalAudio', playAudio);
provide('setAudioSource', setAudioSource);
</script>

<template>
  <div class="app-wrapper">
    <ChristmasLights v-if="showGlobalEffects" />
    <GoldDustEffect v-if="showGlobalEffects" />
    
    <AudioPlayer ref="audioPlayerRef" v-if="showGlobalEffects" />

    <RouterView />
  </div>
</template>

<style>
/* Reset global e estrutura */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  background-color: #1a1a1a;
}

.app-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>