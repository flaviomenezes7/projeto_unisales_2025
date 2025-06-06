import React from 'react';

function Cabecalho() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col items-center">
        <img
          src="/assets/image/salesinho.png"
          alt="Logo Salesinho Bot"
          className="w-16 h-16 mb-1"
          style={{ objectFit: 'contain' }}
        />
        <h1 className="text-2xl font-bold text-center">Central de Atendimento Unisales</h1>
        <p className="text-blue-100 text-center">Assistente virtual com inteligência artificial</p>
        <div className="bg-white/20 rounded-full px-4 py-1 backdrop-blur-sm mt-2">
          <p className="text-sm">Estamos online 24/7</p>
        </div>
      </div>
    </header>
  );
}

export default Cabecalho;