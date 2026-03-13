import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PendulumPage from "./pages/PendulumPage";
import DiffusionPage from "./pages/DiffusionPage";
import SpringPage from "./pages/SpringPage";
import MagnetPage from "./pages/MagnetPage";
import BuoyancyPage from "./pages/BuoyancyPage";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>               <Route path="/pendulum" element={<PendulumPage/>}/>
                <Route path="/diffusion" element={<DiffusionPage/>}/>
                <Route path="/spring" element={<SpringPage/>}/>
                <Route path="/magnet" element={<MagnetPage/>}/>
                <Route path="/buoyancy" element={<BuoyancyPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;