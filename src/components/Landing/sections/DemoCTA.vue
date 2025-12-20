<script setup>
</script>

<template>
  <section class="w-full py-16 md:py-24 lg:py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Demo Teaser -->
        <div class="bg-gradient-to-br from-accent to-accent/70 rounded-3xl p-8 md:p-12 text-accent-foreground flex flex-col justify-between h-full">
          <div>
            <h2 class="font-poppins text-3xl md:text-4xl font-bold mb-4">
              Veja um Exemplo Real
            </h2>
            <p class="text-lg mb-6 opacity-90">
              Confira como ficou o site da Família Silva e imagine como ficará o da sua família!
            </p>
            <p class="text-sm opacity-75 mb-8">
              Interativo e emocionante
            </p>
          </div>
          <a href="http://alcefamily.shop/familia/Silva-Io0IvX" target="_blank" class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent-foreground text-accent font-semibold rounded-xl hover:bg-accent-foreground/90 transition-all w-fit">
            Ver Exemplo
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        <!-- CTA Box -->
        <div class="bg-card rounded-3xl p-8 md:p-12 border-2 border-accent/20 flex flex-col justify-between space-y-6 h-full">
          <div>
            <h2 class="font-poppins text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Pronto para emocionar?
            </h2>
            <p class="text-text-light text-lg">
              Crie seu site de Natal em minutos e receba o QR Code instantâneamente.
            </p>
          </div>

          <div class="space-y-4">
            <p class="text-sm text-text-light flex items-center gap-2">
              <svg class="w-4 h-4 text-cta" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Site disponível imediatamente
            </p>

            <router-link to="/configurar" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cta text-cta-foreground font-semibold rounded-xl hover:bg-cta/90 transition-all text-lg w-full md:w-auto">
              Criar meu Site
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
