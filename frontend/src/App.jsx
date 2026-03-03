import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PendulumPage from "./pages/PendulumPage";
import DiffusionPage from "./pages/DiffusionPage";
import SpringPage from "./pages/SpringPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<div>Profile Page</div>} />
                <Route path="/pendulum" element={<PendulumPage />} />
                <Route path="/diffusion" element={<DiffusionPage />} />
                <Route path="/spring" element={<SpringPage />} />
            </Routes>
        </Router>
    );
}

export default App;