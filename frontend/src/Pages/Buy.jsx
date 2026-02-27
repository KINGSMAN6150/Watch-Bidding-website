import React, { useEffect, useState } from "react";
import Collection from "../Components/Collection/Collection";
import Receive from "../Components/Receive/Receive";
import Footer from "../Components/Footer/Footer";

const Buy = () => {
    const [collection, setCollection] = useState([]);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/collection'); // Fetch from the new endpoint
                const data = await response.json();
                setCollection(data);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };

        fetchCollection();
    }, []);

    return (
        <div>
            <Collection collection={collection} />
            <Receive />
            <Footer />
        </div>
    );
};

export default Buy;