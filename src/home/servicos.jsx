import React from "react";

function Servicos(){
    return(
        <div>
            <hr/>
      
                <article> 
                    <section class="serviço" id="serviço">

                        <div class="nome">
                            <h1>Serviços</h1>
                            <p>Nossos serviços são a Marcação de Horários e Cardápio. É cobrada uma mensalidade para a utilização de cada serviço ou de ambos.</p>
                        </div>
                        <div class="serviços">
                            <h2>Cardápio</h2>
                            <p>Dentro de nosso site é possivel fazer a atualização, excluir ou adicionar novas informações do seu cardápio. O seu cardápio contara com um design intuitivo ao seu cliente.</p>
                        </div>

                        <div class="serviços">
                            <h2>Marcação de Horário</h2>
                            <p>Seus clientes poderão fazer marcações dentro do seu site e receberam uma mensagem de confirmação com as informações de sua marcação, já você podera visualizar as marcações de horário feitas dentro do nosso site. Podendo cancelar os horários de determinados dias ou o dia inteiro também em caso de feriados.</p>
                        </div>

                    </section>
                </article>
        </div>
    )
};

export default Servicos;