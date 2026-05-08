import "../styles/Common.css";
import styles from "../styles/Pendulum.module.css";
import PendulumSimulation from "../components/pendulum/PendulumSimulation";
import React from "react";
import {useTheme} from "../context/ThemeContext";

export default function PendulumPage() {
    const {theme, toggleTheme} = useTheme();
    return (
        <div>
            {/* ========================= ВЕРХНЯ ПАНЕЛЬ ========================= */}
            <div className="top-bar">
                <div className="logo">Fyzikálne simulácie</div>

                <div className="top-right-buttons">
                    <button className="themeToggle" onClick={toggleTheme} aria-label="Toggle theme">
                        <span className={`thumb ${theme === "dark" ? "dark" : "light"}`}>
                            {theme === "dark" ? "🌙" : "☀️"}
                        </span>
                    </button>
                    <a href="/" className="btn">Domov</a>
                </div>
            </div>

            {/* ========================= КОНТЕЙНЕР ВСІЄЇ СИМУЛЯЦІЇ ========================= */}
            <div className={styles["simulation-container"]}>
                <div className={styles["simulation-panel"]}>

                    {/* ========================= КОЛОНКИ: МАЯТНИК + ПАРАМЕТРИ ========================= */}
                    <div className={styles.container}>
                        <PendulumSimulation/>
                        {/* PendulumSimulation вже містить canvasColumn та controls */}
                    </div>

                </div>
            </div>
        </div>
    );
}