<script setup>
import AlceCamera from '@/assets/Alces/AlceCamera.png'
import AlceEscrevendo from '@/assets/Alces/AlceEscrevendo.png'
import AlcePresente from '@/assets/Alces/AlcePresente.JPG'
import AlceFeliz from '@/assets/Alces/AlceFeliz.png'

const steps = [
  {
    number: 1,
    title: 'Escolha suas fotos',
    description: 'Selecione as melhores fotos do ano da sua família e momentos especiais.',
    image: AlceCamera
  },
  {
    number: 2,
    title: 'Escreva sua mensagem',
    description: 'Adicione desejos de Feliz Natal e Próspero Ano Novo personalizados.',
    image: AlceEscrevendo
  },
  {
    number: 3,
    title: 'Gere seu Site',
    description: 'Nossa plataforma cria automaticamente um lindo site de Natal para sua família.',
    image: AlcePresente
  },
  {
    number: 4,
    title: 'Compartilhe a Magia',
    description: 'Envie o link ou QR Code para todos os parentes e amigos.',
    image: AlceFeliz
  }
]
</script>

<template>
  <section id="como-funciona" class="w-full py-16 md:py-24 lg:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center space-y-4 mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-primary/10 text-accent">
          <span class="text-sm font-medium uppercase tracking-wider">COMO FUNCIONA</span>
        </div>
        <h2 class="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
          Crie seu site de Natal em 4 passos
        </h2>
        <p class="text-text-light text-lg max-w-2xl mx-auto">
          É rápido, fácil e o resultado é encantador.
        </p>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="step in steps"
          :key="step.number"
          class="bg-white rounded-2xl p-6 border border-border hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <!-- Number Badge -->
          <div class="w-12 h-12 rounded-full bg-accent/10 text-accent font-poppins font-bold text-lg flex items-center justify-center mb-4">
            {{ step.number }}
          </div>

          <!-- Image -->
          <div class="mb-6 h-48 flex items-center justify-center">
            <img 
              :src="step.image" 
              :alt="step.title"
              class="h-full w-auto object-contain"
            />
          </div>

          <!-- Title -->
          <h3 class="font-poppins font-bold text-lg text-text-primary mb-3">
            {{ step.title }}
          </h3>

          <!-- Description -->
          <p class="text-text-light text-sm leading-relaxed">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
