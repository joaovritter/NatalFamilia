<template>
  <footer>
    <p class="love-note">Feito com amor para o nosso Natal de 2025</p>
    
    <div class="saas-link">
      <p>Gostou? Crie um site mágico para sua família também.</p>
      <a href="#" class="cta-link">Criar Meu Natal Mágico ✨</a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: #1a1a1a;
  color: #888;
  text-align: center;
  padding: 40px 20px 80px 20px; /* Padding extra embaixo por causa do botão de áudio */
  font-size: 0.9rem;
  border-top: 1px solid #333;
}

.love-note {
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
}

.saas-link {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #333;
}

.saas-link p {
  font-size: 0.8rem;
  margin-bottom: 10px;
  color: #666;
}

.cta-link {
  display: inline-block;
  color: var(--color-gold, #F8B229);
  text-decoration: none;
  border: 1px solid var(--color-gold, #F8B229);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.cta-link:hover {
  background: var(--color-gold, #F8B229);
  color: #000;
  box-shadow: 0 0 15px rgba(248, 178, 41, 0.3);
}
</style>