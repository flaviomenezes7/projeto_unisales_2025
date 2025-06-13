# Salesinho BOT – Central de Atendimento ao Cliente com IA

Bem-vindo à Central de Atendimento UniSales! Este projeto oferece um sistema de atendimento automatizado utilizando Inteligência Artificial (API Groq) para responder dúvidas e auxiliar usuários de forma rápida e eficiente.

## ✨ Funcionalidades

- Chat em tempo real com assistente virtual (Salesinho BOT)
- Respostas automáticas usando IA Groq (modelos Llama/Gemma)
- Interface moderna com React e Tailwind CSS
- Feedback do atendimento com avaliação por estrelas e comentário
- Backend em Python (Flask) para integração com a API Groq

## 🗂️ Estrutura do Projeto

```
integrador/
├── backend/      # Backend Python + Flask
├── src/          # Frontend React
├── public/       # Arquivos estáticos (inclui a logo)
├── README.md
```

## 🚀 Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Python 3.8+, Flask, requests, python-dotenv
- **IA:** API Groq (gratuita, com limite mensal de tokens)

---

## ⚙️ Como Executar o Projeto

### 1. Backend

1. Acesse a pasta do backend:
   ```sh
   cd backend
   ```

2. Crie e ative um ambiente virtual:
   - **Windows:**
     ```sh
     python -m venv venv
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```sh
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Instale as dependências:
   ```sh
   pip install -r requirements.txt
   ```

4. Configure as variáveis de ambiente:
   - Copie o arquivo de exemplo:
     ```sh
     cp .env.example .env
     ```
   - Edite o arquivo `.env` e adicione sua chave da API Groq:
     ```
     GROQ_API_KEY=sua_chave_api_aqui
     ```

5. Inicie o backend:
   ```sh
   python app.py
   ```
   O backend estará disponível em `http://localhost:5000`.

---

### 2. Frontend

1. Na raiz do projeto, instale as dependências:
   ```sh
   pnpm install
   ```
   ou
   ```sh
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```sh
   pnpm run dev
   ```
   ou
   ```sh
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:5173`.

---

## 📝 Observações

- A API da Groq é gratuita, mas possui limite mensal de uso.
- Para personalizar o comportamento da IA, edite o prompt no backend (`app.py`).
- A logo do Salesinho BOT está em `public/assets/image/salesinho.png`.

---

## 📄 Licença

Este projeto é de uso acadêmico e livre para fins educacionais.
