// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';    // ← your nav component
import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';
import './index.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      {/* full‑page gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-indigo-800 to-blue-900">

        {/* your Navigation.jsx handles both desktop & mobile menus */}
        <header className="relative z-20 bg-gradient-to-br from-violet-900 via-indigo-800 to-blue-900">
          <Navigation />
        </header>


        {/* content sits above the nav */}
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
