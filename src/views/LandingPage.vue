<script setup>

import Header from '@/components/Landing/Header.vue'
import Footer from '@/components/Landing/Footer.vue'
import Hero from '@/components/Landing/sections/Hero.vue'
import ComoFunciona from '@/components/Landing/sections/ComoFunciona.vue'
import Testimonials from '@/components/Landing/sections/Testimonials.vue'
import FAQ from '@/components/Landing/sections/FAQ.vue'
import DemoCTA from '@/components/Landing/sections/DemoCTA.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />
    <main class="flex-1">
      <Hero />
      <ComoFunciona />
      <Testimonials />
      <DemoCTA />
      <FAQ />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
