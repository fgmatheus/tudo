import React, {useEffect} from "react";

function Header(){

    function toggleLoginArea() {
        var loginArea = document.querySelector('.login-area');
        loginArea.style.display = (loginArea.style.display === 'block') ? 'none' : 'block';
      }

    return(
        <div>
            <header>
      <a href="index.html"><img src="Screenshot_1-removebg-preview.png" alt="logo" class="hamburguer"/></a>
      

        <div class="header-content" id="header-content">
          <span id="menu" class="material-symbols-outlined" onclick="clickMenu()">menu</span>
          <menu id="itens">
            <ul>
              <li><a href="#somos">Quem somos</a></li>
              <li><a href="#projeto">Projetos</a></li>
              <li><a href="#serviço">Serviços</a></li>
              <li><a href="#contato">Contato</a></li>
              <li>
                <a href="#" class="login-link" onClick={toggleLoginArea}>Login</a>
                <ul class="dropdown">
                  <li class="login-area">
                  <input type="text" class="input-field" placeholder="Usuário" autocomplete="off"/>
                  <input type="password" class="input-field" placeholder="Senha" autocomplete="off"/>
                  <button type="submit"><a href="/view">Entrar</a></button>
                  </li>
                </ul>
              </li>
            </ul>
          </menu>
        </div>
        
      </header>
        </div>
    )
};

export default Header;