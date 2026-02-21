import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

// =========================
// Головний компонент App
// =========================
function App() {
    return (
        // -------------------------
        // Router обгортає всю аплікацію і керує URL
        // -------------------------
        <Router>
            {/* -------------------------
                Routes містить список всіх маршрутів (URL → компонент)
                ------------------------- */}
            <Routes>
                {/* Домашня сторінка */}
                <Route path="/" element={<Home/>}/>

                {/* Сторінка реєстрації */}
                <Route path="/register" element={<Register/>}/>

                {/* Сторінка логіну */}
                <Route path="/login" element={<Login/>}/>

                {/* Майбутній маршрут для профілю */}
                <Route path="/profile" element={<div>Profile Page</div>}/>

                {/* Майбутній маршрут для симуляції маятника */}
                <Route path="/pendulum" element={<div>Pendulum Simulation</div>}/>
            </Routes>
        </Router>
    );
}

export default App;