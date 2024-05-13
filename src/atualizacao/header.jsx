import React from "react";
import './index.css';

function Header(){
    return(
        <div>

            <header>    
                <a href="visualização.html"><img src="Screenshot_1-removebg-preview.png" alt="" width="200px"/></a>
                <h2>Nome ou Imagem do Site do Cliente</h2>
                    <section className="botoes">
                        <button className="voltar"><a href="/view">Voltar</a></button>
                        <button className="salvar" type="submit">Salvar Alterações</button>
                    </section>
            </header>

        <hr />

        </div>
    )
};

export default Header;