import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import './ProductDisplay.css';
import Footer from '../Footer/Footer';
import { ShopContext } from "../../Context/Context";
import BiddingModal from '../BiddingModal/BiddingModal';
import { io } from "socket.io-client";

const ProductDisplay = () => {
    const { productName: rawProductName } = useParams();
    const productName = decodeURIComponent(rawProductName || '');
    const [product, setProduct] = useState(null);
    const [currentBid, setCurrentBid] = useState(null);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(ShopContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [canBid, setCanBid] = useState(false); // State for individual product bidding
    const userId = localStorage.getItem('userId');


    useEffect(() => {
        if (!product) return;

        const socket = io("http://localhost:3000");
        socket.emit("join-auction", product._id);
        socket.on("bid-updated", ({ watchId, newBid }) => {
            if (watchId === product._id) {
                setCurrentBid(newBid);
            }
        });
        return () => {
            socket.emit("leave-auction", product._id);
            socket.disconnect();
        }
    }, [product]);

    // Fetch product details initially
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/collection`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                // Backend returns an array — find the matching watch by name
                const watch = Array.isArray(data)
                    ? data.find(w => w.name === productName)
                    : data;

                if (watch) {
                    setProduct(watch);
                    setCurrentBid(watch.currentBid);
                    const auctionEndTime = new Date(watch.auction_end_time);
                    const timeLeft = (auctionEndTime - new Date()) / (1000 * 60);
                    setCanBid(timeLeft > 15);
                } else {
                    setError('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Failed to fetch product.');
            }
        };

        fetchProduct();
    }, [productName]);

    if (error) return <div>{error}</div>;
    if (!product) return <div>Loading...</div>;

    const handleAddToReminder = () => {
        addToCart(product.name);
    };

    return (
        <div>
            <div className="productdisplay">
                <div className="productdisplay-left">
                    <div className="productdisplay-img"> 
                        <img src={product.image} alt={product.name} />
                    </div>
                </div>
                <div className="productdisplay-right">
                    <label>Product Name:</label>
                    <h1>{product.name}</h1>
                    <label>Product Brand:</label>
                    <p>{product.brand}</p>
                    <label>Product Model:</label>
                    <p>{product.model}</p>
                    <label>Product Starting Bid:</label>
                    <p>${product.startingBid}</p> {/* Display starting bid */}
                    <label>Current Bid:</label>
                    <p>${currentBid}</p> {/* Display current bid */}
                    <label>Product Condition:</label>
                    <p>{product.condition}</p>
                    <label>Product Auction End Time:</label>
                    <p>{product.auction_end_time}</p>
                    <button onClick={handleAddToReminder}>Add to Reminder</button>
                    {/* Disable the bidding button based on auction end time */}
                    <button 
                        onClick={() => setModalOpen(true)} 
                        disabled={!canBid}
                    >
                        Bid
                    </button>
                </div>
            </div>
            <div className="description">
                <label>Description:</label>
                <p>{product.description}</p>
            </div>
            <Footer />
            <BiddingModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)} 
                currentBid={currentBid} // Pass current bid to modal
                startingBid={product.startingBid} // Pass starting bid to modal
                userId={userId}
                watchId={product._id}
            />
        </div>
    );
}

export default ProductDisplay;