import React from "react";
import {Link} from "react-router-dom";
import "../css/home.css"; // Підключаємо стилі для головної сторінки

// =========================
// Головний компонент Home
// =========================
export default function Home() {
    return (
        <div>
            {/* =========================
                ВЕРХНЯ ПАНЕЛЬ (HEADER)
                ========================= */}
            <header className="top-bar">
                {/* Логотип */}
                <div className="logo">Physical Simulations</div>

                {/* Кнопки авторизації та профілю */}
                <div className="auth-buttons">
                    {/* Перехід на сторінку логіну */}
                    <Link to="/login" className="auth-btn">Login</Link>

                    {/* Перехід на сторінку реєстрації */}
                    <Link to="/register" className="auth-btn">Register</Link>

                    {/* Кнопка профілю (поки просто іконка) */}
                    <Link to="/profile" className="profile-btn">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4"></circle>
                            <path d="M6 20c0-4 3-6 6-6s6 2 6 6"></path>
                        </svg>
                    </Link>
                </div>
            </header>

            {/* =========================
                СІТКА КАРТОК СИМУЛЯЦІЙ
                ========================= */}
            <main className="simulation-grid">
                {/* Карта для маятника */}
                <Link to="/pendulum" className="sim-card">
                    <div className="sim-img" style={{backgroundImage: "url('/images/pendulum.jpg')"}}></div>
                    <div className="sim-title">Pendulum Simulation</div>
                </Link>

                {/* Заглушки для майбутніх симуляцій */}
                <div className="sim-card disabled">
                    <div className="sim-img placeholder"></div>
                    <div className="sim-title">Coming Soon</div>
                    <div className="soon-text">Not available</div>
                </div>

                <div className="sim-card disabled">
                    <div className="sim-img placeholder"></div>
                    <div className="sim-title">Coming Soon</div>
                    <div className="soon-text">Not available</div>
                </div>
            </main>

            {/* =========================
                ФУТЕР
                ========================= */}
            <footer>
                <p>UX Project – Physical Simulations</p>
            </footer>
        </div>
    );
}