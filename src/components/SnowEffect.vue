<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref(null);
let animationFrameId;

onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  let width, height;
  let snowflakes = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  class Snowflake {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = Math.random() * 1 - 0.5;
      this.vy = Math.random() * 1 + 1;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.y > height) {
        this.y = -10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initSnow = () => {
    resize();
    for (let i = 0; i < 100; i++) {
      snowflakes.push(new Snowflake());
    }
    animateSnow();
  };

  const animateSnow = () => {
    ctx.clearRect(0, 0, width, height);
    snowflakes.forEach(flake => {
      flake.update();
      flake.draw();
    });
    animationFrameId = requestAnimationFrame(animateSnow);
  };

  window.addEventListener('resize', resize);
  initSnow();

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
  });
});
</script>

<template>
  <canvas ref="canvasRef" id="snow-canvas"></canvas>
</template>

<style scoped>
#snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}
</style>
