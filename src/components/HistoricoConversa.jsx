import Mensagem from './Mensagem';
import { useRef, useEffect } from 'react';

function HistoricoConversa({ mensagens, carregando }) {
  const fimDaConversaRef = useRef(null);
  
  // Rolar para o fim da conversa quando novas mensagens chegarem
  useEffect(() => {
    if (fimDaConversaRef.current) {
      fimDaConversaRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensagens]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {mensagens.map((mensagem) => (
        <Mensagem key={mensagem.id} mensagem={mensagem} />
      ))}
      
      {carregando && (
        <div className="flex justify-center py-4">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      
      <div ref={fimDaConversaRef} />
    </div>
  );
}

export default HistoricoConversa;