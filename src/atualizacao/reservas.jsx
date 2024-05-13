import React from "react";
import './index.css';

function Reservas(){
    return(
        <div>
            <section className="reserva">
                <h2>Reserva de Mesa</h2>
                <form>
                    <label htmlFor="dia">Dia:</label>
                    <input type="date" id="dia" name="dia" required /><br />
                    <label htmlFor="horario">Horário:</label>
                        <select id="horario" name="horario">
                        /* Adicione as opções aqui */
                        </select>
                </form>
            </section>

        <hr />

        </div>
    )
};

export default Reservas;