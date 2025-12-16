<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String, // Can be HTML
    default: ''
  }
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content animate-fade-in-up">
        <button class="close-button" @click="close">✕</button>
        
        <h2 class="modal-title">{{ title }}</h2>
        
        <div class="modal-body custom-scrollbar" v-html="content"></div>
        
        <div class="modal-footer">
            <button @click="close" class="close-action-button">Fechar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background-color: #1a1a1a;
  border: 1px solid #333;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  color: #e0e0e0;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 10;
}

.close-button:hover {
  color: #fff;
}

.modal-title {
  padding: 24px 24px 16px;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  color: var(--color-gold, #F8B229);
  border-bottom: 1px solid #333;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  font-family: 'Manrope', sans-serif;
  line-height: 1.6;
  font-size: 0.95rem;
  color: #ccc;
}

/* Styles for HTML content injected via v-html */
:deep(.modal-body h3) {
    color: #fff;
    font-size: 1.2rem;
    margin-top: 24px;
    margin-bottom: 12px;
}

:deep(.modal-body p) {
    margin-bottom: 16px;
}

:deep(.modal-body ul) {
    padding-left: 20px;
    margin-bottom: 16px;
}

:deep(.modal-body li) {
    margin-bottom: 8px;
}

:deep(.modal-body strong) {
    color: #fff;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #333;
    display: flex;
    justify-content: flex-end;
}

.close-action-button {
    padding: 8px 24px;
    background-color: transparent;
    border: 1px solid #444;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.close-action-button:hover {
    background-color: #333;
    border-color: #666;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #111;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
