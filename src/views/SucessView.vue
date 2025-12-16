<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const fullSlug = route.params.familyName;

const displayFamilyName = computed(() => {
  if (!fullSlug) return '';
  
  const parts = fullSlug.split('-');
  
  if (parts.length > 1) {
    parts.pop(); 
  }
  
  return parts.join(' ');
});

const siteUrl = computed(() => {
  return `${window.location.origin}/familia/${encodeURIComponent(fullSlug)}`;
});

const qrCodeImageUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(siteUrl.value)}&color=1a1a1a&bgcolor=ffffff`;
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(siteUrl.value);
    alert('Link copiado para a área de transferência!');
  } catch (err) {
    console.error('Falha ao copiar', err);
  }
};

const shareLink = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Natal da Família ${displayFamilyName.value}`,
        text: 'Veja nossa mensagem especial de Natal!',
        url: siteUrl.value,
      });
    } catch (err) {
      console.log('Compartilhamento cancelado');
    }
  } else {
    copyLink();
  }
};

const goToSite = () => {
  router.push(`/familia/${encodeURIComponent(fullSlug)}`);
};
</script>

<template>
  <div class="success-view">
    <div class="card-container">
      <div class="icon-check">✨</div>
      <h1>A Magia Aconteceu!</h1>
      
      <p class="subtitle">O site da <strong>Família {{ displayFamilyName }}</strong> foi criado com sucesso.</p>

      <div class="qr-section">
        <p class="qr-label">Escaneie para visitar</p>
        <div class="qr-frame">
          <img :src="qrCodeImageUrl" alt="QR Code do Site" />
        </div>
      </div>

      <div class="actions">
        <div class="link-display">
          <span>{{ siteUrl }}</span>
        </div>
        
        <div class="buttons-grid">
          <button @click="copyLink" class="btn secondary">
            📋 Copiar Link
          </button>
          <button @click="shareLink" class="btn primary share-btn">
            📤 Compartilhar com a Família
          </button>
        </div>

        <button @click="goToSite" class="btn magic-btn">
          Ver Meu Site Agora 🎄
        </button>
      </div>

      <p class="footer-msg">
        Que este Natal traga luz, amor e renovação para todos vocês.
      </p>
    </div>
  </div>
</template>

<style scoped>
.success-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  padding: 2rem;
  font-family: 'Montserrat', sans-serif;
  color: white;
}

.card-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  color: #333;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  border: 2px solid #ffd700;
  animation: slideUp 0.8s ease-out;
}

.icon-check {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

h1 {
  color: #c0392b;
  font-family: 'Great Vibes', cursive;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #555;
  margin-bottom: 2rem;
}

.qr-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: inline-block;
  border: 1px dashed #ccc;
}

.qr-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  color: #777;
}

.qr-frame img {
  width: 180px;
  height: 180px;
  display: block;
}

.link-display {
  background: #eee;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 15px;
  border: 1px solid #ddd;
}

.buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn:active {
  transform: scale(0.98);
}

.secondary {
  background: #e0e0e0;
  color: #333;
}

.primary {
  background: #27ae60;
  color: white;
}

.magic-btn {
  width: 100%;
  background: linear-gradient(45deg, #c0392b, #e74c3c);
  color: white;
  padding: 15px;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(192, 57, 43, 0.3);
}

.footer-msg {
  margin-top: 2rem;
  font-size: 0.9rem;
  font-style: italic;
  color: #888;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@media (max-width: 480px) {
  .card-container {
    padding: 2rem 1.5rem;
  }
  .buttons-grid {
    grid-template-columns: 1fr;
  }
  h1 { font-size: 2rem; }
}
</style>