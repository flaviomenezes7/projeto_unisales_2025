import React from 'react';

function Mensagem({ mensagem }) {
  const { texto, remetente, erro } = mensagem;
  const isIA = remetente === 'ia';
  
  const formatarDataHora = (timestamp) => {
    if (!timestamp) return '';
    const data = new Date(timestamp);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isIA ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 ${
          isIA
            ? 'bg-gray-100 rounded-tl-none'
            : 'bg-blue-600 text-white rounded-tr-none'
        } ${erro ? 'border-l-4 border-red-500' : ''}`}
      >
        <div className="text-sm">{texto}</div>
        <div className={`text-xs ${isIA ? 'text-gray-500' : 'text-blue-200'} text-right mt-1`}>
          {formatarDataHora(mensagem.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default Mensagem;