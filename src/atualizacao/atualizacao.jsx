import React from 'react';
import Header from './header';
import Reservas from './reservas';
import Caixas from './caixas';
import './index.css';

function Atualizacao() {

  return (
    <div>
      
      <Header/>

      <main>
        
        <Reservas/>

        <Caixas/>

      </main>
    </div>
  );
};

export default Atualizacao;
