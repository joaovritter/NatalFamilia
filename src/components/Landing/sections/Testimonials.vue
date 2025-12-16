<script setup>
import re1 from '@/assets/PessoasResenhas/re1.png'
import re2 from '@/assets/PessoasResenhas/re2.png'
import re3 from '@/assets/PessoasResenhas/re3.png'
import re4 from '@/assets/PessoasResenhas/re4.png'

const testimonials = [
  {
    name: 'Patrícia Lima',
    quote: 'gente, fiquei chocada com o resultado! comprei pra fzr surpresa na ceia e já to ansiosa pra ver a reação da minha avó... ficou emocionante dms',
    image: re1,
    date: 'Natal de 2025'
  },
  {
    name: 'Fernanda Costa',
    quote: 'Acabei de finalizar o meu e ficou lindo demais!!! super facil de montar e o visual é incrivel, vai ser sucesso aqui em casa',
    image: re2,
    date: 'Natal de 2025'
  },
  {
    name: 'Ana Cláudia',
    quote: 'amei mto! essa parte da linha do tempo com as fotos antigas deu um nó na garganta.. é o presente perfeito pra quem ja tem tudo, recomendo viu',
    image: re3,
    date: 'Natal de 2025'
  },
  {
    name: 'Ricardo Mendes',
    quote: 'Cara sensacional.. queria algo diferente pra minha esposa e pros filhos esse ano e o site ficou com uma cara super premium. vale muito a pena',
    image: re4,
    date: 'Natal de 2025'
  }
]
</script>

<template>
  <section class="w-full py-16 md:py-24 lg:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center space-y-4 mb-16">
        <h2 class="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
          Depoimentos de Famílias
        </h2>
        <p class="text-text-light text-lg max-w-2xl mx-auto">
          Veja quem já garantiu um Natal inesquecível
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="bg-card rounded-2xl p-6 border border-border hover:border-accent/30 transition-all flex flex-col h-full"
        >
          <!-- Quote -->
          <p class="text-text-light text-sm mb-6 italic leading-relaxed flex-1">
            "{{ testimonial.quote }}"
          </p>

          <!-- Author -->
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-accent/20">
                <img :src="testimonial.image" :alt="testimonial.name" class="w-full h-full object-cover object-center" />
              </div>
              <div>
                <p class="font-semibold text-text-primary text-sm">{{ testimonial.name }}</p>
                <p class="text-text-light text-xs">{{ testimonial.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
