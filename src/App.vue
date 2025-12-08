<script setup>
import { ref } from 'vue';

/* --- Componentes --- */
import ChristmasLights from './components/ChristmasLights.vue';
import SnowEffect from './components/SnowEffect.vue';
import GoldDustEffect from './components/GoldDustEffect.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import GiftOverlay from './components/GiftOverlay.vue'; // NOVO

import HeroSection from './components/HeroSection.vue';
import CountdownSection from './components/CountdownSection.vue';
import ImageCarousel from './components/ImageCarousel.vue';
import MessageSection from './components/MessageSection.vue';
import WishesTreeSection from './components/WishesTreeSection.vue';
import GuestbookSection from './components/GuestbookSection.vue';
import FooterSection from './components/FooterSection.vue';

import './assets/base.css';

// Referência para controlar o AudioPlayer
const audioPlayerRef = ref(null);

// Quando o usuário abrir o presente:
const handleGiftOpen = () => {
  // Atrasar levemente o áudio para sincronizar com a animação de saída da caixa
  setTimeout(() => {
    if (audioPlayerRef.value) {
      audioPlayerRef.value.playAudio();
    }
  }, 500);
};
</script>

<template>
  <div class="app-wrapper">
    <GiftOverlay @open="handleGiftOpen" />

    <ChristmasLights />
    <SnowEffect />
    <GoldDustEffect />
    
    <AudioPlayer ref="audioPlayerRef" />

    <main>
      <HeroSection familyName="Reis" />
      <CountdownSection />
      <ImageCarousel />
      <MessageSection />
      <!-- 
        Para adicionar uma imagem de fundo na árvore de desejos, 
        passe a prop backgroundImage com a URL da imagem:
        
        Exemplo 1 - Imagem local (coloque a imagem na pasta public/):
        <WishesTreeSection background-image="/tree-background.jpg" />
        
        Exemplo 2 - Imagem de URL externa:
        <WishesTreeSection background-image="https://exemplo.com/imagem.jpg" />
        
        Exemplo 3 - Sem imagem (usa o fundo padrão):
        <WishesTreeSection />
      -->
      <WishesTreeSection background-image="/tree.png" />
      <GuestbookSection />
    </main>

    <FooterSection />
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

main {
  flex: 1;
  position: relative;
  z-index: 10;
}
</style>