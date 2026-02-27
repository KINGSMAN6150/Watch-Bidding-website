import React, { useEffect, useState } from "react";
import './popular.css';
import Item from "../items/Item.jsx";

const Popular = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from the backend API when the component mounts
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/collection"); // Replace with your API endpoint
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="popular">
            <h1>EXCLUSIVE</h1>
            <hr />
            <div className="popular-item">
                {products.map((item) => (
                    <Item
                        key={item.product_id}
                        id={item.product_id}
                        name={item.name}
                        brand={item.brand}
                        starting_bid={item.starting_bid}
                        auction_end_time={item.auction_end_time}
                        condition={item.condition}
                        image={item.image}
                        model={item.model}
                    />
                ))}
            </div>
        </div>
    );
};

export default Popular;