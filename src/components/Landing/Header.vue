<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white border-b border-border">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-1 md:gap-2">
          <div class="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
            <img src="@/assets/Alces/Icone.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <span class="font-dancing font-bold text-xl md:text-3xl text-text-primary pt-1 md:pt-2 whitespace-nowrap">Natal em Família</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#como-funciona" class="text-text-light hover:text-accent transition-colors font-medium">Como Funciona</a>
          <a href="#faq" class="text-text-light hover:text-accent transition-colors font-medium">Dúvidas</a>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 md:gap-4">
          <router-link to="/configurar" class="px-3 py-1.5 md:px-6 md:py-2 bg-primary text-primary-foreground font-poppins font-bold rounded-lg hover:bg-primary/90 transition-colors text-xs md:text-sm">
            Criar Site
          </router-link>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMenu"
            class="md:hidden text-text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!menuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <nav v-if="menuOpen" class="md:hidden pb-4 space-y-2">
        <a href="#como-funciona" class="block text-text-light hover:text-accent transition-colors font-medium py-2">Como Funciona</a>
        <a href="#faq" class="block text-text-light hover:text-accent transition-colors font-medium py-2">Dúvidas</a>
      </nav>
    </div>
  </header>
</template>

<style scoped></style>
