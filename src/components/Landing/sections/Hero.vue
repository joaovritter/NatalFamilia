<script setup>
import { ref, onMounted } from 'vue';
import gifCorreto from '@/assets/Celular/GifCorreto.gif';

const typedText = ref('');
const fullText = 'com sua família';
const typingSpeed = 150; // ms per char

const startTyping = () => {
  let i = 0;
  typedText.value = '';
  
  const type = () => {
    if (i < fullText.length) {
      typedText.value += fullText.charAt(i);
      i++;
      setTimeout(type, typingSpeed);
    } else {
        // Wait 3 seconds then reset
        setTimeout(() => {
            startTyping();
        }, 3000);
    }
  };
  
  type();
};

onMounted(() => {
  // Start after a small delay to sync with page load
  setTimeout(startTyping, 500);
});
</script>

<template>
  <section class="w-full py-12 md:py-20 lg:py-32 relative bg-white">
    <!-- Gradient Blobs -->
    <!-- Gradient Blobs -->
    <div class="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-[120px] opacity-80 pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-accent/25 to-primary/20 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
    <div class="absolute top-[30%] left-[-2%] w-[250px] h-[250px] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-[90px] opacity-40 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <!-- Left Column: Copy -->
        <div class="space-y-6">
          <!-- Main Heading -->
          <div class="space-y-4">
            <h1 class="font-poppins text-4xl md:text-5xl lg:text-7xl font-bold text-text-primary leading-[1.1]">
          Crie um site de Natal <br>
          <span class="text-accent font-dancing relative">
            {{ typedText }}
            <span class="animate-pulse">|</span>
          </span>
        </h1>
          </div>

          <!-- Supporting Copy -->
          <p class="text-text-light text-lg md:text-xl lg:text-2xl leading-relaxed max-w-lg">
            Crie um site de Natal exclusivo com fotos, mensagens e momentos especiais para compartilhar com quem você ama nesta data tão especial.
          </p>

          <!-- CTA Button -->
          <router-link to="/configurar" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cta text-cta-foreground font-semibold rounded-xl hover:bg-cta/90 transition-all active:scale-95 text-lg">
            Criar meu Site de Natal
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>

          <!-- Social Proof -->
          <div class="pt-4 space-y-2">
            <div class="flex items-center gap-3">
              <div class="flex -space-x-2">
                <div class="w-10 h-10 rounded-full bg-accent/20 border-2 border-background flex items-center justify-center text-sm font-bold text-accent">
                  🎅
                </div>
                <div class="w-10 h-10 rounded-full bg-accent/30 border-2 border-background flex items-center justify-center text-sm font-bold text-accent">
                  🎄
                </div>
                <div class="w-10 h-10 rounded-full bg-accent/40 border-2 border-background flex items-center justify-center text-sm font-bold text-accent">
                  🎁
                </div>
              </div>
              <p class="text-sm text-text-light font-medium">
                +2.000 famílias conectadas
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: GIF Mockup -->
        <div class="relative h-full min-h-96 lg:min-h-full flex items-center justify-center">
            <!-- Decorative Glow -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>

            <!-- GIF Container -->
            <!-- Increased size by another 10% (240px -> 264px) -->
            <div class="relative z-10 w-full max-w-[264px] mx-auto transition-transform hover:scale-[1.02] duration-500">
                 <!-- The GIF itself, styled to look like a floating device/screen -->
                 <img 
                    :src="gifCorreto" 
                    alt="App Demo Preview" 
                    class="w-full h-auto rounded-[2.5rem] shadow-2xl border-4 border-slate-900"
                 />
            </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
