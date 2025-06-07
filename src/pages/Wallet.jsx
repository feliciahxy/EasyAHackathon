import React, {useState} from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import '../App.css';

const Wallet = () => {
    const [count, setCount] = useState(0);
    return (
        <div className="home-content">
        <h1 className="text-3xl font-bold underline text-center mt-10"> 
            Welcome to EasyAHackathon!
        </h1>
        <div className="flex justify-center mt-10">
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
        </div>
        <div className="card">
            <button className="btn flex justify-center" onClick={() => setCount((count) => count + 1)}>
                count is {count}
            </button>
            <p>
                Edit <code>src/App.jsx</code> and save to test HMR
            </p>
        </div>
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        </div>
    );
};

export default Wallet;