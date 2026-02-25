import React, { useState } from "react";
import preowned from "./CSS/preowned.jpg";
import './CSS/Sell.css';
import Footer from "../Components/Footer/Footer";

const Sell = () => {
    const [productName, setProductName] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [condition, setCondition] = useState('');
    const [description, setDescription] = useState('');
    const [auctionTime, setAuctionTime] = useState('');
    const [bid, setBid] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result; // Convert image to base64
                setPreviewImage(base64String);

                // Store the base64 string in local storage
                localStorage.setItem('uploadedImage', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name: productName,
            brand: brand,
            model: model,
            condition: condition,
            bid: bid,
            description: description,
            auction_end_time: auctionTime,
            image: previewImage, // Include the image in form data
        };

        // Send data to backend
        try {
            const token = localStorage.getItem('token'); // JWT from login
            const response = await fetch('http://localhost:3000/api/collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token, // required by authMiddleware
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Watch listed for auction successfully!');
                resetForm();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to submit the watch information.');
            }
        } catch (error) {
            console.error('Error submitting watch information:', error);
        }
    };

    const resetForm = () => {
        setProductName('');
        setBrand('');
        setModel('');
        setCondition('');
        setDescription('');
        setAuctionTime('');
        setBid('');
        setPreviewImage('');
        localStorage.removeItem('uploadedImage'); // Clear image from local storage after submission
    };

    return (
        <div>
            <div className="sell-page">
                <img src={preowned} alt="" />
                <div className="sell-item-container">
                    <h1>Sell Your Pre-owned and New Watches</h1>
                    <form className="product-fields" onSubmit={handleSubmit}>
                        <label>Enter Product Name:</label>
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Name" />
                        
                        <label>Enter Product Brand:</label>
                        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" />
                        
                        <label>Enter Product Model:</label>
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model" />
                        
                        <label>Enter Product Condition:</label>
                        <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Condition" />

                        <label>Enter Product Description:</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                        
                        <label>Enter Auction Time:</label>
                        <input type="datetime-local" value={auctionTime} onChange={(e) => setAuctionTime(e.target.value)} />

                        <label>Enter Starting Bid:</label>
                        <input type="text" value={bid} onChange={(e) => setBid(e.target.value)} placeholder="Starting bid"/>

                        <label>Upload Image:</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {previewImage && (
                            <div className="image-preview">
                                <img src={previewImage} alt="Preview" />
                            </div>
                        )}

                        <div className="sell-product-agree">
                            <input type="checkbox" required />
                            <label>By Continuing, I agree to the terms and conditions mentioned below</label>
                            <button type="submit">Create Product</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Sell;
