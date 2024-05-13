import React from "react";
import './index.css';
import axios from "axios";
import api from "../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Caixas(){

    let { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [ product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });

    const getProduct = async () => {
        setIsLoading(true);
        try{
            const response = await axios.get(`${api}/api/products/${id}`);
            setProduct({
                name: response.data.name,
                description: response.data.description,
                price: response.data.price,
                image: response.data.image,
            })
            setIsLoading(false);

        }catch(error){
            setIsLoading(false);
            toast.error(error.message);
        }
     

    }

    const updateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            await axios.put(`${api}/api/products/${id}`, product);
            toast.success("Update a product successfully");
            navigate('/att');
        }catch(error){
            setIsLoading(false);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProduct();
    }, [])


    return(
        <div>
            <div className="menu">

            <input type="button" value="+" className="especial"/>

            <input type="button" value="Prato Principal"/>
            <input type="button" value="Bebidas"/>
            <input type="button" value="Entradas"/>
            <input type="button" value="Sobremesas"/>
            <input type="button" value="Carta de Vinhos"/>

            <input type="button" value="-" className="especial"/>

            </div>

            <div className="pratos">
                <input type="image" src="" alt="#" id="image"/>
                
                <form action="" method="post" className="oi">
                    <input type="text" id="nome" name="nome" required placeholder="Nome do Prato"/><br/>

                    <input type="text" id="descricao" name="descricao" required placeholder="Descrição"/><br/>
            
                    <input type="number" id="numero" name="preço" required placeholder="00.00" value="" step="0.1"/><br/>
                </form>
            </div>

            <div className="pratos">
                <input type="image" src="" alt="#" id="image"/>
                
                <form action="" method="post" className="oi">
                    <input type="text" id="nome" name="nome" required placeholder="Nome do Prato"/><br/>

                    <input type="text" id="descricao" name="descricao" required placeholder="Descrição"/><br/>
            
                    <input type="number" id="numero" name="preço" required placeholder="00.00" value="" step="0.1"/><br/>
                </form>
            </div>


            <div className="pratos">
                <input type="image" src="" alt="#" id="image"/>
                
                <form action="" method="post" className="oi">
                    <input type="text" id="nome" name="nome" required placeholder="Nome do Prato"/><br/>

                    <input type="text" id="descricao" name="descricao" required placeholder="Descrição"/><br/>
            
                    <input type="number" id="numero" name="preço" required placeholder="00.00" value="" step="0.1"/><br/>
                </form>
            </div>

            <div className="botao-final">
                <button type="submit" className="especial">+</button>
                <button type="submit" className="especial">-</button>
            </div>

            {/*  */}










        </div>
       
    )
};

export default Caixas;