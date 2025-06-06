import { useState } from 'react';
import Cabecalho from './components/Cabecalho';
import FormularioMensagem from './components/FormularioMensagem';
import HistoricoConversa from './components/HistoricoConversa';

function App() {
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      texto: "Olá! Sou o assistente virtual da Central de Atendimento da Unisales. Como posso ajudar você hoje?",
      remetente: "ia",
      timestamp: new Date().toISOString()
    }
  ]);
  const [atendimentoFinalizado, setAtendimentoFinalizado] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hoverFeedback, setHoverFeedback] = useState(null);
  const [comentario, setComentario] = useState('');
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  // Função para limpar o chat
  const limparChat = () => {
    setMensagens([
      {
        id: 1,
        texto: "Olá! Sou o assistente virtual da Central de Atendimento da Unisales. Como posso ajudar você hoje?",
        remetente: "ia",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const adicionarMensagem = async (texto) => {
    if (!texto.trim()) return;

    // Adicionar mensagem do usuário
    const mensagemUsuario = {
      id: Date.now(),
      texto,
      remetente: "usuario",
      timestamp: new Date().toISOString()
    };
    
    setMensagens(prev => [...prev, mensagemUsuario]);
    setCarregando(true);

    try {
      // Enviar para o backend
      const resposta = await fetch('http://localhost:5000/api/mensagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensagem: texto }),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao comunicar com o serviço');
      }

      const dados = await resposta.json();
      
      // Adicionar resposta da IA
      const mensagemIA = {
        id: Date.now() + 1,
        texto: dados.resposta,
        remetente: "ia",
        timestamp: new Date().toISOString()
      };
      
      setMensagens(prev => [...prev, mensagemIA]);
    } catch (erro) {
      console.error('Erro:', erro);
      
      // Mensagem de erro para o usuário
      const mensagemErro = {
        id: Date.now() + 1,
        texto: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        remetente: "ia",
        timestamp: new Date().toISOString(),
        erro: true
      };
      
      setMensagens(prev => [...prev, mensagemErro]);
    } finally {
      setCarregando(false);
    }
  };

  const finalizarAtendimento = () => {
    setAtendimentoFinalizado(true);
  };

  const enviarFeedback = (nota) => {
    setFeedback(nota);
    // Aqui você pode enviar o feedback para o backend se quiser
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Cabecalho />
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <HistoricoConversa mensagens={mensagens} carregando={carregando} />
          {!atendimentoFinalizado && (
            <>
              <FormularioMensagem 
                enviarMensagem={adicionarMensagem}
                carregando={carregando}
              />
              <div className="flex justify-end p-2">
                <button
                  onClick={finalizarAtendimento}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  disabled={carregando}
                >
                  Finalizar atendimento
                </button>
              </div>
            </>
          )}
          {atendimentoFinalizado && (
            <div className="flex flex-col items-center py-6">
              <p className="mb-2 font-semibold">Como você avalia o atendimento?</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(nota => (
                  <button
                    key={nota}
                    onClick={() => setFeedback(nota)}
                    onMouseEnter={() => setHoverFeedback(nota)}
                    onMouseLeave={() => setHoverFeedback(null)}
                    className={`text-2xl transition-colors duration-150 ${
                      (hoverFeedback !== null
                        ? nota <= hoverFeedback
                        : feedback !== null
                          ? nota <= feedback
                          : false
                      )
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}
                    disabled={feedbackEnviado}
                    aria-label={`Avaliar com ${nota} estrela${nota > 1 ? 's' : ''}`}
                  >
                    {(hoverFeedback !== null ? nota <= hoverFeedback : feedback !== null && nota <= feedback) ? '★' : '☆'}
                  </button>
                ))}
              </div>
              {/* Caixa de comentário opcional */}
              <textarea
                className="mt-4 w-full max-w-md rounded border border-gray-300 p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                placeholder="Deixe um comentário (opcional)"
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                disabled={feedbackEnviado}
              />
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={() => {
                  // Aqui você pode enviar o feedback e o comentário para o backend se desejar
                  setFeedbackEnviado(true);
                }}
                disabled={!feedback || feedbackEnviado}
              >
                Enviar avaliação
              </button>
              {feedbackEnviado && (
                <p className="mt-4 text-green-700 font-medium">
                  Obrigado pelo seu feedback!
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-blue-600 text-white text-center py-4">
        <p className="text-sm">© {new Date().getFullYear()} CAC UniSales - IA</p>
      </footer>
    </div>
  );
}

export default App;