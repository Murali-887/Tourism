import React from 'react';
import {Link} from 'react-router-dom'
import '../css/Header.css';
import { handleLogout } from '../helpingFunctions';

function Header(props) {
    return (
        <nav>
            <div><Link to='/' className='nav--tours'>ALL TOURS</Link></div>
            <div><Link to='/'><img src="/logo.png" alt="Logo" width='10%' /></Link></div>
            <div className='nav--button'>
            {
                !props.user?<Link to='/login'>LOGIN</Link>:null
            }
            {
                props.user && props.user.role === 'admin' ?
                <Link to='/signup'>SIGN UP</Link> : null
            }
            {
                props.user ? <Link onClick={() => handleLogout(props.setUser, props.setMessage)}>LOGOUT</Link> : null
            }
            </div>
        </nav>
    );
}

export default Header;