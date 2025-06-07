const CreateWallet = () => {
    const [walletName, setWalletName] = useState('');
    const [walletPassword, setWalletPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleCreateWallet = async () => {
        if (!walletName || !walletPassword) {
        setError('Please fill in all fields');
        return;
        }
    
        try {
        // Simulate wallet creation logic
        console.log(`Creating wallet: ${walletName} with password: ${walletPassword}`);
        // Reset fields after creation
        setWalletName('');
        setWalletPassword('');
        setError('');
        } catch (err) {
        setError('Failed to create wallet');
        }
    };
    
    return (
        <div>
        <h1>Create Wallet (Boilerplate)</h1>
        <input
            type="text"
            placeholder="Wallet Name"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
        />
        <input
            type="password"
            placeholder="Wallet Password"
            value={walletPassword}
            onChange={(e) => setWalletPassword(e.target.value)}
        />
        <button onClick={handleCreateWallet}>Create Wallet</button>
        {error && <p className="error">{error}</p>}
        </div>
    );
}

export default CreateWallet;