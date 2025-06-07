
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
    const [count, setCount] = useState(0);
    return (
        <div
        className="hero min-h-screen w-screen relative"
        style={{
            backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
        >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
            <div className="max-w">
            <h1 className="mb-5 text-5xl font-bold">SAMPLE NAME</h1>
            <h1 className="mb-5 text-l">Crowdfunding made seamless and transparent </h1>
            <div className="flex flex-row justify-center items-center gap-4 mt-6">
                <button className="btn btn-primary text-neutral-content text-base md:text-lg px-6 py-2"><Link to="/create-wallet">Create Wallet</Link></button>
                <button className="btn btn-primary text-neutral-content text-base md:text-lg px-6 py-2"><Link to="/escrow">Send Currency</Link></button>
            </div>
            
            </div>
        </div>
        </div>
    );
};
export default Home;
