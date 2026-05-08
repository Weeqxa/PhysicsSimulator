import "../styles/Common.css";
import styles from "../styles/Magnet.module.css";
import MagnetSimulation from "../components/magnet/MagnetSimulation";
import {useTheme} from "../context/ThemeContext.jsx";
import React from "react";

export default function MagnetPage() {
    const {theme, toggleTheme} = useTheme();
    return (
        <div>
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

            <div className={styles["simulation-container"]}>
                <div className={styles["simulation-panel"]}>
                    <div className={styles.container}>
                        <MagnetSimulation />
                    </div>
                </div>
            </div>
        </div>
    );
}