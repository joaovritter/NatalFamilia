<template>
  <div class="christmas-lights"></div>
</template>

<style scoped>
.christmas-lights {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 9998;
  background-image: url('data:image/svg+xml;utf8,<svg width="40" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5" fill="%23D42426" /><circle cx="30" cy="10" r="5" fill="%23165B33" /></svg>');
  animation: twinkle 2s infinite alternate;
  pointer-events: none;
}

@keyframes twinkle {
  0% {
    opacity: 0.5;
    filter: brightness(1);
  }
  100% {
    opacity: 1;
    filter: brightness(1.5);
  }
}
</style>
