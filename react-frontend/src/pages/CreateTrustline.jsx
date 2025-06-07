import React, { useState } from 'react';
import TrustlineCreator from '../components/TrustlineCreator';

const issuer = import.meta.env.VITE_ISSUER_ADDRESS;

function CreateTrustline() {
    return (
        <TrustlineCreator issuer={issuer}/>
    );
}

export default CreateTrustline;
