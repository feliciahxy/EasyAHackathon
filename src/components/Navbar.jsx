import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { menu, close, wallet } from "../assets";

const Navbar = () => {
    const [toggle, setToggle] = useState(true);
    const handleClick = () => {
        setToggle(!toggle);
        console.log("Toggle state:", toggle);
    }

    const redirectPage = () => {
        setToggle(true);
        console.log("Toggle state:", toggle);
    }

    return (
        <div className="navbar w-full left-0 right-0 top-0 bg-base-100 shadow-sm fixed">
            <div className="flex-none">
                <div className="dropdown" onClick={handleClick}>
                    <img tabIndex={0} role="button" src={toggle ? menu : close} alt='menu' className='w-[30px] h-[30px]'/>
                    <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li onClick={redirectPage}><a><Link to="/create-wallet">Create Wallet</Link></a></li>
                        <li onClick={redirectPage}><a><Link to="/escrow">Send Currency</Link></a></li>
                    </ul>
                </div>
            </div>
            <div className="flex-1">
                <a className="btn btn-ghost text-xl"><Link to="/">daisyUI</Link></a>
            </div>
            <div className="flex-none">
                <div>
                    <Link to="/check-balance"><img src={wallet} alt='wallet' className='w-[50px] h-[50px]' /></Link>
                </div>
            </div>
        </div>
    );
}   

export default Navbar;