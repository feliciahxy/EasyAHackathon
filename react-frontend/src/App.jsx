import Navbar from "./components/Navbar.jsx";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import CreateWallet from './pages/CreateWallet';
import CheckBalance from "./pages/CheckBalance.jsx";
import Escrow from "./pages/Escrow.jsx";
import OrganisationList from "./pages/OrganisationList.jsx";
import CreateTrustline from "./pages/CreateTrustline.jsx";
import FundWallet from "./components/FundWallet.jsx";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create-wallet' element={<CreateWallet />} />
          <Route path='/check-balance' element={<CheckBalance />} />
          <Route path='/escrow' element={<Escrow />} />
          <Route path='/organisations' element={<OrganisationList />} />
          <Route path='/create-trustline' element={<CreateTrustline />} />
          <Route path='/fund-wallet' element={<FundWallet />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  )
}

export default App;