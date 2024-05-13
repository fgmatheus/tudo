import React, {useEffect} from "react";
import Header from "./header";
import Sobre from "./sobre";
import Projetos from "./projetos";
import Servicos from "./servicos";
import Contato from "./contato";

function Home(){

      function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    
      useEffect(() => {
        window.onscroll = function () {
          var scrollTopButton = document.getElementById("scrollTopButton");
          scrollTopButton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
        };
      }, []);

    return(
        <div>

            <Header />
            <Sobre />

            <main>
                     
                <Projetos />
                <Servicos />
                <Contato />
        

                <button onClick={scrollToTop} id="scrollTopButton"><i className="fas fa-arrow-up"></i></button>

            </main>

            <footer>
                <p>&copy; 2023 Dos Primos. Todos os direitos reservados.</p>
            </footer>
            
        </div>
    )
};

export default Home;