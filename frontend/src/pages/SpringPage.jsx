import "../styles/Common.css";
import styles from "../styles/Spring.module.css";
import SpringSimulation from "../components/spring/SpringSimulation";
import {useTheme} from "../context/ThemeContext.jsx";
import React from "react";

export default function SpringPage() {
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
                        <SpringSimulation />
                    </div>
                </div>
            </div>
        </div>
    );
}