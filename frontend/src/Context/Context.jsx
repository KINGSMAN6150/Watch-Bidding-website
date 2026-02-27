import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems'));
    return savedCart || {};
};

const ShopContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [notification, setNotification] = useState("");
    const [products, setProducts] = useState([]);

    // Fetch products from API on initial render
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/collection");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Load user from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('token', userData.token);
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
    };

    const getUserFirstLetter = () => user ? user.name.charAt(0).toUpperCase() : null;

    // Cart management functions
    const addToCart = (productName) => {
        setCartItems((prev) => {
            const newCount = (prev[productName] || 0) + 1;
            setNotification(`${productName} added to reminders!`);
            return { ...prev, [productName]: newCount };
        });
    };

    const removeFromCart = (productName) => {
        setCartItems((prev) => {
            const newCount = Math.max((prev[productName] || 0) - 1, 0);
            setNotification(`${productName} removed from reminders!`);
            return { ...prev, [productName]: newCount };
        });
    };

    const clearCart = () => {
        setCartItems({});
        setNotification("All reminders cleared!");
    };

    const getTotalReminderItems = () => 
        Object.values(cartItems).reduce((total, count) => total + count, 0);

    const contextValue = {
        products,
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalReminderItems,
        user,
        loginUser,
        logoutUser,
        getUserFirstLetter,
        notification,
        setNotification,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
            {notification && <div className="notification">{notification}</div>}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;