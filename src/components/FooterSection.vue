<script setup>
import { ref } from 'vue';
import LegalModal from './LegalModal.vue';

defineProps({
  showMarketing: {
    type: Boolean,
    default: true
  }
});

const isLegalModalOpen = ref(false);
const modalTitle = ref('');
const modalContent = ref('');

const openLegalModal = (type) => {
    isLegalModalOpen.value = true;
    if (type === 'terms') {
        modalTitle.value = 'Termos de Uso';
        modalContent.value = `
            <h3>Aceitação dos Termos</h3>
            <p>Ao utilizar o <strong>Natal Família</strong>, você concorda com os presentes Termos de Uso. Recomendamos a leitura atenta deste conteúdo antes de continuar navegando ou adquirindo qualquer produto oferecido em nossa plataforma.</p>

            <h3>Dados e Privacidade</h3>
            <p>Toda informação compartilhada conosco é tratada com máximo cuidado. As senhas e dados dos usuários são 100% criptografados em nossos servidores. Utilizamos cookies apenas para autenticação, respeitando sempre sua privacidade.</p>
            <p>A história de vocês é sagrada. Por isso, suas fotos são armazenadas com segurança e privacidade total em servidores em nuvem seguros, com acesso restrito e controle rigoroso.</p>

            <h3>Pagamentos</h3>
            <p>Todas as transações financeiras são realizadas por meio do Mercado Pago, garantindo segurança, confiabilidade e suporte em caso de dúvidas ou cancelamentos.</p>

            <h3>Disponibilidade dos Produtos</h3>
            <p>As experiências adquiridas permanecem disponíveis em nossos servidores por tempo indeterminado, podendo ser acessadas a qualquer momento através do link exclusivo enviado após a confirmação do pagamento.</p>

            <h3>Suporte e Contato</h3>
            <p>Em caso de dúvidas, suporte técnico ou qualquer outra necessidade, entre em contato com a gente pelo e-mail <strong>contato.natalfamilia@gmail.com</strong>.</p>

            <h3>Informações Legais</h3>
            <p>O <strong>Natal Família</strong> é um produto registrado sob o CPF 021.558.490-28. Qualquer uso indevido da marca, cópia de conteúdo ou reprodução sem autorização será tratado conforme as leis brasileiras de propriedade intelectual.</p>
        `;
    } else {
        modalContent.value = `
            <h3>Coleta de Informações</h3>
            <p>Coletamos informações fornecidas diretamente por você, como nome, e-mail, data comemorativa e imagens enviadas, exclusivamente para personalização da experiência e entrega do produto adquirido. Também coletamos dados técnicos automaticamente, como endereço IP, navegador e dispositivo, apenas para garantir o funcionamento correto da plataforma.</p>

            <h3>Uso das Informações</h3>
            <p>Utilizamos suas informações para:</p>
            <ul>
                <li>Personalizar e entregar sua experiência na plataforma</li>
                <li>Processar pagamentos via Mercado Pago</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Enviar comunicações essenciais (como confirmação de compra)</li>
            </ul>

            <h3>Compartilhamento de Dados</h3>
            <p>Não compartilhamos seus dados com terceiros, exceto quando necessário para a operação do serviço (como processadores de pagamento e armazenamento de arquivos em servidores em nuvem seguros). Em nenhum momento vendemos ou divulgamos suas informações para fins publicitários de terceiros.</p>

            <h3>Armazenamento e Segurança</h3>
            <p>Todos os dados são armazenados em servidores seguros, com criptografia de ponta a ponta. As imagens enviadas são hospedadas em servidores em nuvem seguros com controle de acesso. As senhas são criptografadas e nunca ficam visíveis, nem mesmo para a equipe do Natal Família.</p>

            <h3>Cookies e Tecnologias de Rastreamento</h3>
            <p>Utilizamos cookies apenas para autenticação de usuários, essenciais para o funcionamento seguro da sua conta. Você pode gerenciar a aceitação de cookies nas configurações do seu navegador. Não utilizamos ferramentas de rastreamento de terceiros para fins de marketing.</p>

            <h3>Seus Direitos (LGPD)</h3>
            <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:</p>
            <ul>
                <li>Acessar os dados que temos sobre você</li>
                <li>Corrigir informações pessoais</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimentos</li>
                <li>Portar seus dados para outro serviço, se desejar</li>
            </ul>
            <p>Para exercer seus direitos, entre em contato conosco pelo e-mail <strong>contato.natalfamilia@gmail.com</strong>.</p>

            <h3>Alterações nesta Política</h3>
            <p>Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças legais ou operacionais. A data da última atualização será sempre indicada no rodapé desta página. Recomendamos revisitar esta seção regularmente.</p>

            <h3>Informações Legais</h3>
            <p>Esta política é regida pela legislação brasileira. O <strong>Natal Família</strong> é operado sob o CPF 021.558.490-28, e qualquer questão legal poderá ser tratada conforme o foro da comarca de <strong>Santa Maria - RS</strong>.</p>
            
            <p><em>Última atualização: Dezembro de 2025</em></p>
        `;
    }
};
</script>

<template>
  <footer>
    <p class="love-note">Feito com amor para o nosso Natal de 2025</p>
    
    <div class="legal-links">
        <button @click.prevent="openLegalModal('terms')">Termos de Uso</button>
        <span class="separator">|</span>
        <button @click.prevent="openLegalModal('privacy')">Política de Privacidade</button>
    </div>

    <div v-if="showMarketing" class="saas-link">
      <p>Gostou? Crie um site mágico para sua família também.</p>
      <a href="#" class="cta-link">Criar Meu Natal Mágico ✨</a>
    </div>

    <LegalModal 
        :is-open="isLegalModalOpen"
        :title="modalTitle"
        :content="modalContent"
        @close="isLegalModalOpen = false"
    />
  </footer>
</template>

<style scoped>
footer {
  background-color: #020403; /* Matches end of Guestbook */
  color: #888;
  text-align: center;
  padding: 40px 20px 80px 20px; /* Padding extra embaixo por causa do botão de áudio */
  font-size: 0.9rem;
  border-top: 1px solid #1a2a1d;
}

.love-note {
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
}

.legal-links {
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.legal-links button {
    background: none;
    border: none;
    color: #666;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s;
    font-family: 'Manrope', sans-serif;
    padding: 0;
}

.legal-links button:hover {
    color: var(--color-gold, #F8B229);
}

.separator {
    color: #444;
    font-size: 0.8rem;
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
  text-decoration: none; 
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