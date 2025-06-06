import { useState } from 'react';

export function useChat() {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const enviarMensagem = async (texto) => {
    if (!texto.trim()) return;
    
    const novaMensagem = {
      id: Date.now(),
      texto,
      remetente: 'usuario',
      timestamp: new Date().toISOString()
    };

    setMensagens(msgs => [...msgs, novaMensagem]);
    setCarregando(true);
    
    try {
      const resposta = await fetch('http://localhost:5000/api/mensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem: texto }),
      });
      
      if (!resposta.ok) {
        throw new Error('Falha ao obter resposta');
      }
      
      const dados = await resposta.json();
      
      const respostaIA = {
        id: Date.now() + 1,
        texto: dados.resposta,
        remetente: 'ia',
        timestamp: new Date().toISOString()
      };
      
      setMensagens(msgs => [...msgs, respostaIA]);
      setErro(null);
    } catch (e) {
      console.error('Erro:', e);
      setErro('Não foi possível processar sua solicitação');
      
      const mensagemErro = {
        id: Date.now() + 1,
        texto: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        remetente: "ia",
        timestamp: new Date().toISOString(),
        erro: true
      };
      
      setMensagens(msgs => [...msgs, mensagemErro]);
    } finally {
      setCarregando(false);
    }
  };

  const limparConversa = () => {
    setMensagens([]);
    setErro(null);
  };
  
  return {
    mensagens,
    carregando,
    erro,
    enviarMensagem,
    limparConversa
  };
}

export default useChat;