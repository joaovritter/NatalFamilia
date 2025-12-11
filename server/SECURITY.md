# 🔒 Documentação de Segurança - Natal Família

Este documento descreve as medidas de segurança implementadas no sistema.

## 🛡️ Medidas de Segurança Implementadas

### 1. **Prevenção de IDOR (Insecure Direct Object Reference)**

- **NanoID**: IDs não sequenciais (21 caracteres aleatórios) dificultam adivinhação de URLs
- **Validação de Pagamento**: Sites só são acessíveis se `paymentStatus === 'APPROVED'`
- **Validação de Formato**: IDs são validados antes de consultas no banco

### 2. **Prevenção de Injection**

- **Mongoose**: Uso de ODM previne SQL/NoSQL injection
- **Validação Joi**: Todos os inputs são validados e sanitizados
- **Sanitização HTML**: DOMPurify remove scripts maliciosos (XSS)

### 3. **Proteção de Preço (Prevenção de Fraude)**

- **Preço Hardcoded**: Valor definido em `server/config/constants.js` (R$ 29,90)
- **Validação no Webhook**: Valor pago é verificado contra constante do backend
- **Nunca confia no Frontend**: Preço nunca é aceito do cliente

### 4. **Webhook Seguro**

- **Consulta à API MP**: Status sempre verificado diretamente no Mercado Pago
- **Validação de Valor**: Compara `transaction_amount` com preço esperado
- **Idempotência**: Processamento seguro mesmo com reenvios do webhook

### 5. **Rate Limiting**

- **Criação de Sites**: Máximo 5 tentativas por IP a cada 15 minutos
- **Webhook**: Máximo 100 requisições por minuto
- **Geral**: Máximo 100 requisições por IP a cada 15 minutos

### 6. **CORS Restritivo**

- Apenas domínios autorizados podem fazer requisições
- Configurado em `server/middleware/cors.js`

### 7. **Helmet**

- Headers HTTP seguros configurados
- Content Security Policy ativada

## 📋 Endpoints Seguros

### POST `/api/create`
- ✅ Validação de inputs (Joi)
- ✅ Sanitização XSS
- ✅ Preço hardcoded
- ✅ Rate limiting (5/15min)

### GET `/api/site/:id`
- ✅ Validação de formato de ID
- ✅ Verificação de pagamento (402 se pendente)
- ✅ Retorna apenas dados públicos

### POST `/api/webhook`
- ✅ Consulta API do MP antes de atualizar
- ✅ Validação de valor pago
- ✅ Rate limiting (100/min)

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
MP_ACCESS_TOKEN=seu_token_aqui
MONGODB_URI=sua_uri_mongodb
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

## ⚠️ Checklist de Segurança para Produção

- [ ] Alterar `SITE_PRICE` em `server/config/constants.js` se necessário
- [ ] Configurar `FRONTEND_URL` e `BACKEND_URL` corretos
- [ ] Configurar `PRODUCTION_FRONTEND_URL` no `.env`
- [ ] Usar token de produção do Mercado Pago
- [ ] Configurar webhook URL no painel do Mercado Pago
- [ ] Habilitar HTTPS
- [ ] Revisar rate limits conforme necessidade
- [ ] Configurar logs de segurança
- [ ] Fazer backup regular do MongoDB

## 🧪 Testando a Segurança

### Teste 1: Tentar acessar site sem pagamento
```bash
curl http://localhost:3000/api/site/ID_INVALIDO
# Deve retornar 404 ou 402
```

### Teste 2: Tentar criar site com preço alterado
```bash
curl -X POST http://localhost:3000/api/create \
  -H "Content-Type: application/json" \
  -d '{"familyName":"Teste","message":"Teste","photoUrl":"http://teste.com","price":1.00}'
# Preço será ignorado, sempre usará R$ 29,90
```

### Teste 3: Rate Limiting
```bash
# Fazer 6 requisições seguidas para /api/create
# A 6ª deve retornar erro de rate limit
```

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mercado Pago Webhooks](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
- [Mongoose Security](https://mongoosejs.com/docs/security.html)

