<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const faqs = [
  {
    question: 'O que é o Natal em Família?',
    answer: 'É uma plataforma que permite criar um site personalizado para sua família com fotos, mensagens de Natal e contagem regressiva, tudo em um formato digital lindo para compartilhar.'
  },
  {
    question: 'Quanto tempo demora para ficar pronto?',
    answer: 'Menos de 5 minutos! Basta preencher o formulário com o nome da família, fazer o upload da foto e escrever sua mensagem.'
  },
  {
    question: 'Como posso compartilhar o site?',
    answer: 'Você receberá um link exclusivo e um QR Code. Pode enviar no grupo da família no WhatsApp, postar no Instagram ou imprimir o QR Code para colocar na árvore de Natal.'
  },
  {
    question: 'Preciso saber programação?',
    answer: 'Não! Nossa ferramenta é super intuitiva e faz todo o trabalho técnico para você.'
  }
]

const toggleFAQ = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section id="faq" class="w-full py-16 md:py-24 lg:py-32 bg-secondary/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center space-y-4 mb-16">
        <h2 class="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
          Dúvidas Frequentes
        </h2>
        <p class="text-text-light text-lg max-w-2xl mx-auto">
          Tire suas dúvidas sobre o Natal em Família
        </p>
      </div>

      <!-- FAQ Items -->
      <div class="max-w-3xl mx-auto space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-white rounded-xl border border-border overflow-hidden transition-all"
        >
          <button
            @click="toggleFAQ(index)"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
          >
            <span class="text-lg font-semibold text-text-primary text-left">{{ faq.question }}</span>
            <svg
              :class="['w-5 h-5 text-accent transition-transform', openIndex === index && 'rotate-180']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          <!-- Answer -->
          <div
            v-if="openIndex === index"
            class="px-6 py-4 bg-secondary/20 border-t border-border"
          >
            <p class="text-text-light leading-relaxed">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
