<script setup>
import { ref } from 'vue';
import LegalModal from '../LegalModal.vue';

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
  <footer class="w-full bg-card border-t border-border mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-16 h-16 flex items-center justify-center">
              <img src="@/assets/Alces/Icone.png" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <span class="font-poppins font-bold text-lg text-text-primary">Natal em Família</span>
          </div>
          <p class="text-text-light text-sm leading-relaxed">
            Crie sites de Natal personalizados e compartilhe a magia com sua família e amigos de forma única e digital.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h3 class="font-poppins font-bold text-text-primary mb-4">Produto</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-text-light hover:text-accent transition-colors text-sm">Criar Site</a></li>
            <li><a href="#" class="text-text-light hover:text-accent transition-colors text-sm">Exemplos</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h3 class="font-poppins font-bold text-text-primary mb-4">Legal</h3>
          <ul class="space-y-2">
            <li><button @click.prevent="openLegalModal('terms')" class="text-text-light hover:text-accent transition-colors text-sm text-left">Termos de Uso</button></li>
            <li><button @click.prevent="openLegalModal('privacy')" class="text-text-light hover:text-accent transition-colors text-sm text-left">Privacidade</button></li>
          </ul>
        </div>

        <!-- Social -->
        <div>
          <h3 class="font-poppins font-bold text-text-primary mb-4">Contato</h3>
          <ul class="space-y-2">
             <li><span class="text-text-light text-sm">contato.natalfamilia@gmail.com</span></li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-light">
        <p>© 2025 Natal em Família.</p>
      </div>
    </div>

    <LegalModal 
        :is-open="isLegalModalOpen"
        :title="modalTitle"
        :content="modalContent"
        @close="isLegalModalOpen = false"
    />
  </footer>
</template>

<style scoped></style>
