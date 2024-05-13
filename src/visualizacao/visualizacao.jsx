import React from "react";
import "./style.css";
import api from "../api";
import axios from "axios";
import { useState, useEffect } from "react";
import Product from "./product";

function Visualizacao(){

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getProducts = async () => {
        try{
           setIsLoading(true); 
           const response = await axios.get(`${api}/api/products/`);
           console.log(response.data);
           setProducts(response.data);
           setIsLoading(false);

        } catch (error){
           console.log(error);
        }
    }

    useEffect(() => {
        getProducts();
    }, [])

    return(
        <div>
            <body>
                <header>
                    <a href="visualização.html"><img src="Screenshot_1-removebg-preview.png" alt="logo" className="hamburguer"/></a>
                    
            
                    <div className="header-content" id="header-content">
                        <span id="menu" className="material-symbols-outlined" onclick="clickMenu()">menu</span>
                        <menu id="itens">
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/att">Atualizar</a></li>
                        </ul>
                        </menu>
                    </div>
                    
                    </header>

                    <main>
                        <section className="visu-nome">
                            <h1>Visualização</h1>
                            <p>Aqui você pode ver como está as sendo exibidas as informações em seu site ou confirmar suas marcações de horário.</p>
                        </section>

                        <article>
                            <h2>Marcação de Horário</h2>
                             <iframe src="#" frameborder="0" width="90%" height="500px"></iframe>
                        </article>
                        
                        <hr/>

                        <article>
                            <h2>Cardápio</h2>
                            <div>
                        {isLoading ? (
                            "Loading"
                ) : (
                    <>
                    {products.length > 0 ? (
                        <>

                            {
                                products.map((product, index) => {
                                   return (
                                     <Product key={index} product={product} getProducts={getProducts}/>
                                   )
                                })
                            }
                        </>
                    ) : (
                        <div>
                            There is no product
                        </div>
                    )}
                    
                    </>
                )}
            </div>
                        </article>

                    </main> 
            </body>

        

        </div>

     
    )
};

export default Visualizacao;