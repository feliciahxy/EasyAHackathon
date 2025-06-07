import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function OrganisationList() {
    return (
        <div className="flex items-center justify-center w-screen gap-x-8">
            <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">Organisation Name</h2>
                <p>Organisation Description</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link to="/escrow">Donate Now</Link></button>
                </div>
            </div>
            </div>
            <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">Organisation Name</h2>
                <p>Organisation Description</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link to="/escrow">Donate Now</Link></button>
                </div>
            </div>
            </div>
            <div className="card bg-base-100 w-96 shadow-sm">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">Organisation Name</h2>
                <p>Organisation Description</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link to="/escrow">Donate Now</Link></button>
                </div>
            </div>
            </div>
        </div>
    );
}
export default OrganisationList;
