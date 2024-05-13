import { useState } from "react";
import { formatDateToUTC } from "./utils/formatDateToUTC";

import './style.css'

function App() {
  // States
  const [nome, setNome] = useState<string>("");
  const [barberColorId, setBarberColorId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function createAppointment(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(import.meta.env.VITE_IDCLIENTE); // Variavel de ambiente
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await fetch("http://localhost:3000/createAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: name,
          clientEmail: "",
          clientPhone: "",
          calendarId: "",
          barberColorId: "",
          dateTimeStart: formatDateToUTC("dateTimeStart"), // Converte para UTC+0
          dateTimeEnd: formatDateToUTC("dateTimeEnd"), // Converte para UTC+0
        }),
      });
    } catch (error) {
      console.error("Erro ao enviar a solicitação:", error);
      // displayAlert("danger", "Erro ao enviar a solicitação.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form>
      {nome} {barberColorId}
      <div className="opcoes">
        <label>Nome: </label>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setNome(e.target.value);
          }}
        ></input>
      </div>

      <div className="opcoes">
        <label htmlFor="barber">Barbeiro:</label>
        <select
          id="barber"
          required
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setBarberColorId(e.target.value)
          }
        >
          <option value="">Escolha o Barbeiro</option>
          <option value="barbeiro1">Barbeiro 1</option>
          <option value="barbeiro2">Barbeiro 2</option>
          <option value="barbeiro3">Barbeiro 3</option>
        </select>
      </div>

      <div className="opcoes">
        <button
          id="submit-button"
          className="btn"
          type="submit"
          onClick={createAppointment}
        >
          <span>Agendar</span>
        </button>
      </div>
      {isLoading && <p>Carregendo....</p>}
    </form>
  );
}

export default App;
