// src/pages/buoyancy/BuoyancyPage.jsx
import "../styles/Common.css";
import styles from "../styles/Buoyancy.module.css"; // використаємо ті ж стилі
import BuoyancySimulation from "../components/buoyancy/BuoyancySimulation.jsx";
import {useTheme} from "../context/ThemeContext.jsx";
import React from "react";

export default function BuoyancyPage() {
    const {theme, toggleTheme} = useTheme();

    return (
        <div>
            <div className="top-bar">
                <div className="logo">Fyzikálne simulácie ️</div>
                <div className="top-right-buttons">
                    <button className="themeToggle" onClick={toggleTheme} aria-label="Toggle theme">
                        <span className={`thumb ${theme === "dark" ? "dark" : "light"}`}>
                            {theme === "dark" ? "🌙" : "☀️"}
                        </span>
                    </button>
                    <a href="/" className="btn">Domov</a>
                </div>
            </div>

            <div className={styles.simulationContainer}>
                <BuoyancySimulation />
            </div>
        </div>
    );
}