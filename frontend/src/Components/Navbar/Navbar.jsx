import React, { useContext, useState } from 'react';
import './Navbar.css';
import footer_logo from '../Assests/footer_img.jpg';
import reminder from '../Assests/reminder.png';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/Context';

const Navbar = () => {
    const { getTotalReminderItems, user, getUserFirstLetter, logoutUser } = useContext(ShopContext);
    const [menu, setMenu] = useState("home");
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={footer_logo} alt="" style={{ height: '80px', width: '80px' }} />
                <p>AUCTION</p>
            </div>
            <ul className='nav-menu'>
                <li onClick={() => setMenu("home")} className={menu === 'home' ? 'active' : ''}>
                    <Link style={{ textDecoration: "none", color: "white" }} to='/Home'>Home</Link>
                    {menu === 'home' && <hr />}
                </li>
                <li onClick={() => setMenu("buy")} className={menu === 'buy' ? 'active' : ''}>
                    <Link style={{ textDecoration: "none", color: "white" }} to='/Buy'>Buy</Link>
                    {menu === 'buy' && <hr />}
                </li>
                <li onClick={() => setMenu("sell")} className={menu === 'sell' ? 'active' : ''}>
                    <Link style={{ textDecoration: "none", color: "white" }} to='/Sell'>Sell</Link>
                    {menu === 'sell' && <hr />}
                </li>
                <li onClick={() => setMenu("pricing")} className={menu === 'pricing' ? 'active' : ''}>
                    <Link style={{ textDecoration: "none", color: "white" }} to='/Pricing'>Pricing</Link>
                    {menu === 'pricing' && <hr />}
                </li>
                <li onClick={() => setMenu("about-us")} className={menu === 'about-us' ? 'active' : ''}>
                    <Link style={{ textDecoration: "none", color: "white" }} to='/about'>About Us</Link>
                    {menu === 'about-us' && <hr />}
                </li>
            </ul>
            <div className='nav-reminder'>
                <Link style={{ textDecoration: "none", color: "white" }} to='/reminder'>
                    <img src={reminder} alt="" style={{ height: '50px', width: "50px" }} />
                </Link>
                <div className='nav-reminder-count'>{getTotalReminderItems()}</div>
                
                {!user ? (
                    <Link to='/signup' style={{ textDecoration: "none" }}>
                        <button className="nav-login-button">Login</button>
                    </Link>
                ) : (
                    <div className='nav-user-section'>
                        <span className='user-initial'>{getUserFirstLetter()}</span>
                        <button className="nav-logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;