<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref(null);
let animationFrameId;
let particles = [];
let mouse = { x: null, y: null, radius: 100 };

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  let width, height;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  
  // Limpar mouse ao sair da tela para não prender partículas
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.directionX = (Math.random() * 0.5) - 0.25; // Movimento lento lateral
      this.directionY = (Math.random() * 0.5) - 0.25; // Movimento lento vertical
      this.size = Math.random() * 2; // Partículas bem pequenas
      this.baseColor = '248, 178, 41'; // A cor Dourada (#F8B229) em RGB
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fadeSpeed = Math.random() * 0.01 + 0.002;
      this.fadingOut = Math.random() < 0.5;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      // Gradiente radial para parecer uma esfera de luz, não um ponto chapado
      let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`); // Centro branco (brilho)
      gradient.addColorStop(0.4, `rgba(${this.baseColor}, ${this.opacity})`); // Corpo dourado
      gradient.addColorStop(1, `rgba(${this.baseColor}, 0)`); // Borda transparente
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    update() {
      // 1. Movimento Base (Flutuar)
      this.x += this.directionX;
      this.y += this.directionY;

      // 2. Interação com Mouse (Física de repulsão suave)
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 3; // Força do empurrão
          const directionY = forceDirectionY * force * 3;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // 3. Efeito "Twinkle" (Piscar)
      if (this.fadingOut) {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0.1) this.fadingOut = false;
      } else {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.8) this.fadingOut = true;
      }

      // 4. Manter dentro da tela (Wrap around)
      if (this.x < 0 || this.x > width) this.directionX = -this.directionX;
      if (this.y < 0 || this.y > height) this.directionY = -this.directionY;
      
      // Reiniciar se sair muito da borda (opcional, mas bom para garantir)
      if (this.x < -10) this.x = width;
      if (this.x > width + 10) this.x = 0;
      if (this.y < -10) this.y = height;
      if (this.y > height + 10) this.y = 0;

      this.draw();
    }
  }

  const init = () => {
    particles = [];
    // Menos partículas que a neve para não poluir, foco na elegância
    let numberOfParticles = (width * height) / 15000; 
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  };

  const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
      particle.update();
    });
  };

  init();
  animate();

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
  });
});
</script>

<template>
  <canvas ref="canvasRef" class="gold-dust-canvas"></canvas>
</template>

<style scoped>
.gold-dust-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Essencial: permite clicar nos elementos abaixo */
  z-index: 9997; /* Logo abaixo da neve (9999) e dos menus */
  mix-blend-mode: screen; /* Faz o dourado brilhar mais sobre fundos escuros */
}
</style>