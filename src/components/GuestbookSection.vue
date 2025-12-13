<script setup>
import { ref } from 'vue';

// Dados simulados (depois virão do banco de dados)
const messages = ref([]);

const isModalOpen = ref(false);
const newMessage = ref({ name: '', text: '' });

const openModal = () => isModalOpen.value = true;
const closeModal = () => isModalOpen.value = false;

const sendMessage = () => {
  if (!newMessage.value.name || !newMessage.value.text) return;
  // Lógica de envio virá depois
  messages.value.unshift({
    id: Date.now(),
    name: newMessage.value.name,
    text: newMessage.value.text,
    date: 'Agora mesmo'
  });
  newMessage.value = { name: '', text: '' };
  closeModal();
};
</script>

<template>
  <section class="guestbook-section">
    <div class="header-content">
      <h2 class="title">Mural do Amor</h2>
      <p class="subtitle">Deixe um pedacinho do seu coração aqui.</p>
      
      <button class="cta-button" @click="openModal">
        <span class="icon">✎</span> Deixar Recado
      </button>
    </div>

    <div class="masonry-grid">
      <div v-for="msg in messages" :key="msg.id" class="message-card">
        <div class="card-content">
          <p class="message-text">"{{ msg.text }}"</p>
          <div class="card-footer">
            <span class="author">{{ msg.name }}</span>
            <span class="date">{{ msg.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <h3>Escreva seu Desejo</h3>
          <input class="input-text" v-model="newMessage.name" placeholder="Seu Nome" type="text" />
          <textarea class="input-text" v-model="newMessage.text" placeholder="Sua mensagem carinhosa..." rows="4"></textarea>
          <div class="modal-actions">
            <button class="btn-cancel" @click="closeModal">Cancelar</button>
            <button class="btn-send" @click="sendMessage">Pendurar no Mural</button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.guestbook-section {
  padding: 80px 20px;
  background: linear-gradient(to bottom, #1a1a1a 0%, #2C3E50 100%); /* Fundo escuro para destacar os cartões */
  position: relative;
}

.header-content {
  text-align: center;
  margin-bottom: 50px;
}

.title {
  font-family: var(--font-title, 'Great Vibes', cursive);
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--color-gold, #F8B229);
  margin-bottom: 10px;
}

.subtitle {
  color: #ccc;
  font-weight: 300;
  margin-bottom: 30px;
}

/* O Botão de Ouro */
.cta-button {
  background: linear-gradient(45deg, #F8B229, #B38728);
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(248, 178, 41, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(248, 178, 41, 0.4);
}

/* Grid Masonry (O Segredo do Layout) */
.masonry-grid {
  column-count: 1; /* Mobile starts with 1 */
  column-gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 600px) {
  .masonry-grid { column-count: 2; }
}

@media (min-width: 900px) {
  .masonry-grid { column-count: 3; }
}

/* O Cartão de Vidro */
.message-card {
  break-inside: avoid; /* Evita que o cartão seja cortado entre colunas */
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05); /* Vidro escuro */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  transition: transform 0.3s ease, background 0.3s;
  position: relative;
}

.message-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-gold, #F8B229);
}

/* Detalhe "Prego Dourado" no topo do cartão */
.message-card::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: var(--color-gold, #F8B229);
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(248, 178, 41, 0.8);
}

.message-text {
  font-family: 'Dancing Script', cursive; /* Importante importar essa fonte no index.html */
  font-size: 1.4rem;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
}

.author {
  color: var(--color-gold, #F8B229);
  font-weight: bold;
  font-size: 0.9rem;
}

.date {
  color: #666;
  font-size: 0.8rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.modal-card {
  background: white;
  width: 100%;
  color: rgba(255, 255, 255, 0.08);
  max-width: 500px;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border-top: 5px solid var(--color-gold, #F8B229);
}
.input-text{
  color:#333;
}

.modal-card h3 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-family: var(--font-title);
}

input, textarea {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-family: inherit;
  box-sizing: border-box; /* Fix padding issues */
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-gold, #F8B229);
  background: #fff;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  border: none;
  color: #666;
  padding: 10px 20px;
  cursor: pointer;
}

.btn-send {
  background: var(--color-gold, #F8B229);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>