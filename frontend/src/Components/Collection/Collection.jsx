import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Collection.css';
import Item from "../items/Item";

const Buy = () => {
    const [sortCriteria, setSortCriteria] = useState(""); 
    const [sortedCollection, setSortedCollection] = useState([]); 
    const [collection, setCollection] = useState([]); 

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/collection');
                const data = await response.json();
                setCollection(data);
                setSortedCollection(data); 
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };

        fetchCollection();
    }, []);

    const sortItems = (criteria) => {
        let sortedArray = [...collection];
        switch (criteria) {
            case "time":
                sortedArray.sort((a, b) => new Date(a.auction_end_time) - new Date(b.auction_end_time));
                break;
            case "model":
                sortedArray.sort((a, b) => a.model.localeCompare(b.model));
                break;
            case "brand":
                sortedArray.sort((a, b) => a.brand.localeCompare(b.brand));
                break;
            case "condition":
                sortedArray.sort((a, b) => a.condition.localeCompare(b.condition));
                break;
            default:
                break;
        }
        setSortedCollection(sortedArray);
    };

    const handleSortChange = (e) => {
        const criteria = e.target.value;
        setSortCriteria(criteria);
        sortItems(criteria);
    };

    return (
        <div className="collection">
            <h1>COLLECTION</h1>
            <hr />
            <div className="sorting-controls">
                <label htmlFor="sort">Sort By: </label>
                <select id="sort" value={sortCriteria} onChange={handleSortChange}>
                    <option value="">Select</option>
                    <option value="time">Time</option>
                    <option value="model">Model</option>
                    <option value="brand">Brand</option>
                    <option value="condition">Condition</option>
                </select>
            </div>
            <div className="collections-items">
                {sortedCollection.map((item, i) => (
                    <Link to={`/product/${encodeURIComponent(item.name)}`} key={i}>
                        <Item
                            id={item.id}
                            name={item.name}
                            brand={item.brand}
                            starting_bid={item.startingBid}
                            cuurrent_bid={item.currentBid}
                            auction_end_time={item.auction_end_time}
                            condition={item.condition}
                            image={item.image}
                            model={item.model}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Buy;
