<script setup>
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';

/* --- Componentes Globais --- */
import ChristmasLights from './components/ChristmasLights.vue';
import SnowEffect from './components/SnowEffect.vue';
import GoldDustEffect from './components/GoldDustEffect.vue';
import AudioPlayer from './components/AudioPlayer.vue';

import './assets/base.css';

// Referência para controlar o AudioPlayer
const audioPlayerRef = ref(null);

const playAudio = () => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.playAudio();
  }
};

// Provide para que os filhos possam controlar o áudio
provide('playGlobalAudio', playAudio);
</script>

<template>
  <div class="app-wrapper">
    <ChristmasLights />
    <SnowEffect />
    <GoldDustEffect />
    
    <AudioPlayer ref="audioPlayerRef" />

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