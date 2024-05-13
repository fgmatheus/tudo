import React from "react";
import './theuz.css';

import theuzBig from './imgTheuz/theuzBig.png';
import barba from './imgTheuz/img-barba.png';
import dente from './imgTheuz/img-dente.png';
import carro from './imgTheuz/img-carro.png';
import blocked from './imgTheuz/blocked.png';

import BackToTop from "./backToTop";
import {ImagemTeste} from "./maximizeImage";
import ContactForm from "./form";


function Theuz(){
    return(
        <>
            <header>
        <a href="#produto">produtos</a>

        <BackToTop />

        <a href="#contato">contato</a>
    </header>

    <main>
        
        <section class="inicio">
            <img src= {theuzBig} alt="" />
            <h1>Paginas Web, Land Page e Serviços de Reserva de Horário</h1>
        </section>

        <article>
            {/* class para className */}
            <section className="produtos colorido" id="produto">
                <div class="info">
                    <div class="titulo">
                        <h2>Pagina Web</h2>
                    </div>
                    <div class="lista">
                        <ul>
                            <li>Design Profissional e Personalizado</li>
                            <li>Responsividade e Acessibilidade</li>
                            <li>Funcionalidades Avançadas de Integração</li>
                            <li>Otimização para Motores de Busca</li>
                        </ul>
                    </div>
                </div>
                {/* <div class="imagem-junta">
                            <img src={barba} alt="" class="imagem-teste" />
                            <img src={dente} alt="" class="imagem-teste" />
                            <img src={carro} alt="" class="imagem-teste" />
                            <img src={blocked} alt="" class="imagem-teste" />
                    </div> */}
                    <div className="imagem-junta">
                        <ImagemTeste src={barba} alt=""/>
                        <ImagemTeste src={dente} alt=""/>
                        <ImagemTeste src={carro} alt=""/>
                        <ImagemTeste src={blocked} alt=""/>
                    </div>
            </section>
            
            <div id="imagem-maximizada"></div>
            

            <section class="produtos">
                <div class="info reverse">
                    <div class="lista">
                        <ul>
                            <li>Foco em Conversão</li>
                            <li>Design Atraente e Impactante</li>
                            <li>Teste e Otimização Contínua</li>
                        </ul>
                    </div>
                    <div class="titulo">
                        <h2>Land Page</h2>
                    </div>
                </div>
                <div class="imagem-junta">
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                </div>
            </section>

            <section class="produtos colorido">
                <div class="info">
                    <div class="titulo">
                        <h2>Reserva de Horário</h2>
                    </div>
                    <div class="lista">
                        <ul>
                            <li>Agendamento Simplificado</li>
                            <li>Personalização e Flexibilidade</li>
                            <li>Notificações Automatizadas</li>
                            <li>Integração com Calendários</li>
                        </ul>
                    </div>
                </div>
                <div class="imagem-junta">
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                </div>
            </section>

            <section class="produtos">
                <div class="info reverse">
                    <div class="lista">
                        <ul>
                            <li>Análise de Palavras-chave</li>
                            <li>Otimização On-Page</li>
                            <li>Link Building Estratégico</li>
                        </ul>
                    </div>
                    <div class="titulo">
                        <h2>SEO</h2>
                    </div>
                </div>
                <div class="imagem-junta">
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                    <img src={blocked} alt="" class="imagem-teste" />
                </div>
                <div class="block"></div>
            </section>

        </article>

        <ContactForm />
    
    </main>

    <footer>
        <p>direitos reservados</p>
    </footer>
        </>
    )
}

export default Theuz;