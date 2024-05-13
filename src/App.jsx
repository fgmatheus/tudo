import React, { useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Theuz from './theuz/theuz';
import Agenda from './agenda/agenda';


/* import Visualizacao from './visualizacao/visualizacao';
import Atualizacao from './atualizacao/atualizacao'
import Home from './home/home';
import EditPage from './teste/atua';
import CreatePage from './teste/criar'; */

function App() {

  return (
    <div>
      
      <BrowserRouter>
        <Routes>

          {/* <Route path='/home' element={<Home/>}/> */}
          <Route path='/' element={<Theuz/>}/>
          <Route path='/agenda' element={<Agenda/>} />
          {/* <Route path='/view' element={<Visualizacao/>}/>
          <Route path='/att' element={<Atualizacao/>}/>
          <Route path='/teste' element={< EditPage/>}/>
          <Route path='/teste2' element={< CreatePage/>}/> */}
      
        </Routes>
      </BrowserRouter>

    </div>
  );
};

export default App;
