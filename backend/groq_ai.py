import os
import requests
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "gemma2-9b-it"  # Altere para o modelo desejado

def gerar_resposta(mensagem_usuario, prompt_extra=None):
    messages = []
    if prompt_extra:
        messages.append({"role": "system", "content": prompt_extra})
    messages.append({"role": "user", "content": mensagem_usuario})

    payload = {
        "model": MODEL,
        "messages": messages
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }

    try:
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        logging.error(f"Erro ao se comunicar com a IA: {e}")
        if response is not None:
            logging.error(f"Resposta da IA: {response.text}")
        return "Erro ao se comunicar com a IA."