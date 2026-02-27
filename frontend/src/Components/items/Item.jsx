import React from "react";
import './Item.css'
import { Link } from "react-router-dom";
const Item=(props)=>{
    return(
        <div className="item">
        <Link to={`/product/${encodeURIComponent(props.name)}`}><img src={props.image} alt={props.name} /></Link> 
            <p>{props.name}</p>
            <p>{props.brand}</p>
            <p>{props.description}</p>
            <p>{props.model}</p>
            <p>{props.condition}</p>
            <p>{props.auction_end_time}</p>
            <div className="price">
                <div className="starting_bid">
                    ${props.starting_bid}
                </div>
            </div>
        </div>
    )
}
export default Item;