import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../api";

const EditPage = () => {
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

    return (
    <div>
        <h2>
            Update a Product
        </h2>
        { isLoading ? ("Loading") : (
            <>
                <form onSubmit={updateProduct}>
                    <div>
                        <div>
                            <label>Name</label>
                            <input type="text" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})} placeholder="Enter Name" />
                        </div>
                        <div>
                            <label>Description</label>
                            <input type="text" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} placeholder="Enter description" />
                        </div>
                        <div>
                            <label>Price</label>
                            <input type="number" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})} placeholder="Enter Price" />
                        </div>
                        <div>
                            <label>Image URL</label>
                            <input type="text" value={product.image} onChange={(e) => setProduct({...product, image: e.target.value})} placeholder="Enter Image URL" />
                        </div>
                        <div>
                            { !isLoading && ( <button>Update</button>)}         
                        </div>
                    </div>
                </form>
            </>
        )}

    </div>
    )
}

export default EditPage;