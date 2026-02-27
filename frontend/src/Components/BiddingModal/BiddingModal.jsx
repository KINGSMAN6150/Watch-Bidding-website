import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './BiddingModal.css';

const BiddingModal = ({ isOpen, onClose, watchId, currentBid, startingBid, userId }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [liveBid, setLiveBid] = useState(currentBid);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const socketRef = useRef(null);

    useEffect(() => {
        if(!isOpen || !watchId)
        return;
        
        socketRef.current = io('http://localhost:3000');
        socketRef.current.emit('join-auction', watchId);
        socketRef.current.on('bid-updated', ({ newBid }) => {
            setLiveBid(newBid);
            setSuccess(`New bid placed: ₹${newBid}`);
            setError('');
        });
        socketRef.current.on('bid-error', ({ message }) => {
            setError(message);
            setSuccess('');
        });

        return () => {
            socketRef.current.emit('leave-auction', watchId);
            socketRef.current.disconnect();
        };
    },[isOpen, watchId]);

    const handleBidSubmit = (e) => {
        e.preventDefault();
        const parsedAmount = Number(bidAmount);

        if(isNaN(parsedAmount) || parsedAmount <= liveBid) {
            setError(`Bid must be higher than current bid of ₹${liveBid}`);
            return ;
        }


        socketRef.current.emit('place-bid', {
            watchId,
            amount: parsedAmount,
            userId,
        });
        setBidAmount('');
    };
    if(!isOpen) return null;

    return (<div className="modal">
            <div className="modal-content">
                <button className="close" onClick={onClose}>&times;</button>
                <h2>Place Your Bid</h2>
                <p>Current Bid: <strong>₹{liveBid}</strong></p>
                <form onSubmit={handleBidSubmit}>
                    <label>
                        Your Bid Amount:
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            required
                            min={liveBid + 1}
                            placeholder={`Min ₹${liveBid + 1}`}
                        />
                    </label>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button type="submit">Submit Bid</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>);
} 

export default BiddingModal;