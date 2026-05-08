// src/pages/diffusion/DiffusionPage.jsx
import "../styles/Common.css";
import styles from "../styles/Diffusion.module.css";
import DiffusionSimulation from "../components/diffusion/DiffusionSimulation.jsx";
import {useTheme} from "../context/ThemeContext";
import React from "react";

export default function DiffusionPage() {

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
                <DiffusionSimulation />
            </div>
        </div>
    );
}