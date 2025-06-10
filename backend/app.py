from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import requests
import json
from dotenv import load_dotenv
from groq_ai import gerar_resposta

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir requisições do frontend

# Obter chave da API da Groq do ambiente
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Configurações do banco de dados
# Exemplo de URI para usuário padrão:
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://usuario_teste:flavio123@localhost:5432/integrador'
# Se criou outro usuário:
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://salesinho_user:SENHA@localhost:5432/integrador'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Avaliacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nota = db.Column(db.Integer, nullable=False)
    comentario = db.Column(db.String(500))
    data = db.Column(db.DateTime, default=db.func.current_timestamp())

@app.route('/api/mensagem', methods=['POST'])
def processar_mensagem():
    """
    Processa a mensagem recebida do usuário e retorna uma resposta da IA.
    """
    try:
        dados = request.get_json()
        mensagem = dados.get('mensagem', '')
        
        if not mensagem:
            return jsonify({'erro': 'Mensagem não fornecida'}), 400
        
        mensagem_usuario = mensagem

        # Prompt detalhado para a IA
        prompt_extra = (
            "Seu nome é Salesinho, você é um assistente virtual cordial e prestativo da Central de Atendimento da Unisales. "
            "Responda sempre de forma clara e objetiva. "
            "Seja breve, mas forneça informações completas. "
            "Se não souber a resposta, oriente o usuário a procurar o setor responsável. "
            "Nunca invente informações. "
            "Seja sempre respeitoso e mantenha o foco em ajudar o estudante da Unisales. "
            "O site da instituição é https://unisales.br/. "
            "Endereço: Av Vitória, 950, Forte São João - Vitória/ES, CEP: 29017-950. "
            "Telefone: 27 3331-8500. "
            "WhatsApp: (27) 9 8123-4566. "
            "E-mail: comercial@unisales.br."
        )

        resposta_ia = gerar_resposta(mensagem_usuario, prompt_extra=prompt_extra)
        
        return jsonify({'resposta': resposta_ia})
    
    except Exception as e:
        print(f"Erro: {str(e)}")
        return jsonify({'erro': 'Erro ao processar mensagem'}), 500

@app.route('/api/avaliacao', methods=['POST'])
def receber_avaliacao():
    """
    Recebe uma avaliação do usuário e salva no banco de dados.
    Espera um JSON com: nota (int) e comentario (str, opcional).
    """
    try:
        dados = request.get_json()
        nota = dados.get('nota')
        comentario = dados.get('comentario', '')

        if nota is None:
            return jsonify({'erro': 'Nota não fornecida'}), 400

        avaliacao = Avaliacao(nota=nota, comentario=comentario)
        db.session.add(avaliacao)
        db.session.commit()

        return jsonify({'mensagem': 'Avaliação registrada com sucesso!'}), 201

    except Exception as e:
        print(f"Erro ao salvar avaliação: {str(e)}")
        return jsonify({'erro': 'Erro ao registrar avaliação'}), 500


def consultar_groq(mensagem):
    """
    Consulta a API da Groq para obter resposta para a mensagem do usuário.
    
    Args:
        mensagem (str): Mensagem do usuário
        
    Returns:
        str: Resposta da IA
    """
    if not GROQ_API_KEY:
        return "Erro: Chave da API Groq não configurada. Configure a variável de ambiente GROQ_API_KEY."
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama3-8b-8192",  # Modelo da Groq (pode ser alterado conforme disponibilidade)
        "messages": [
            {"role": "system", "content": "Você é um assistente de atendimento ao cliente prestativo, amigável e eficiente. Forneça respostas claras e precisas. Se não souber a resposta, seja honesto e ofereça alternativas de contato."},
            {"role": "user", "content": mensagem}
        ],
        "temperature": 0.7,
        "max_tokens": 800
    }
    
    try:
        resposta = requests.post(GROQ_API_URL, headers=headers, data=json.dumps(payload))
        resposta.raise_for_status()  # Lança exceção para códigos HTTP de erro
        
        dados = resposta.json()
        texto_resposta = dados["choices"][0]["message"]["content"]
        return texto_resposta
    
    except requests.exceptions.RequestException as e:
        print(f"Erro na requisição para Groq API: {str(e)}")
        return "Desculpe, não foi possível processar sua solicitação no momento. Por favor, tente novamente mais tarde."

def iniciar_servidor():
    """
    Inicia o servidor Flask para a API.
    """
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    iniciar_servidor()