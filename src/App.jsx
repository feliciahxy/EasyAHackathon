import './App.css'
import { NavBar } from "./components"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Wallet } from 'pages/wallet';
import { Home } from 'pages/home';

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/wallet' element={<Wallet />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  )
}

export default App
