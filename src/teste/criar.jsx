import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
/* import api from "../api"; */

const CreatePage = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const saveProduct = async(e) => {
        e.preventDefault();
        if(name === "" || description === "" || price === "" || image === ""){
            alert('Please fill out all input completely');
            return;
        }
        try{
            setIsLoading(true);
            const response = await axios.post('http://localhost:4000/api/products', {name: name, description: description, price: price, image: image});
            toast.success(`Save ${response.data.name} sucessfully`);
            setIsLoading(false);
            navigate("/");
        }catch (error){
            toast.error(error.message);
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h2>Criar um Produto</h2>
            <form onSubmit={saveProduct}>
                <div>
                    <div>
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name"/>
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />
                    </div>
                    <div>
                        <label>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter Price" />
                    </div>
                    <div>
                        <label>Image URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Enter Image URL" />
                    </div>
                    <div>
                        { !isLoading && ( <button>Save</button>)}         
                    </div>
                </div>
            </form>
        </div>
    )
}


export default CreatePage;