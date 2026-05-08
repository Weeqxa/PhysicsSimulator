import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Common.css";
import styles from "../styles/Home.module.css";
import { useTheme } from "../context/ThemeContext";

import pendulumDark from "../assets/images/pendulum/dark.jpg";
import pendulumLight from "../assets/images/pendulum/light.jpg";

import diffusionDark from "../assets/images/diffusion/dark.jpg";
import diffusionLight from "../assets/images/diffusion/light.jpg";

import springDark from "../assets/images/spring/dark.jpg";
import springLight from "../assets/images/spring/light.jpg";

import magnetDark from "../assets/images/magnet/dark.jpg";
import magnetLight from "../assets/images/magnet/light.jpg";

import buoyancyDark from "../assets/images/buoyancy/dark.jpg";
import buoyancyLight from "../assets/images/buoyancy/light.jpg";

export default function Home() {
    const { theme, toggleTheme } = useTheme();

    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 480);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 480);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const carouselRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    const handleWheel = (e) => {
        if (carouselRef.current) {
            if (carouselRef.current.scrollWidth > carouselRef.current.clientWidth) {
                e.preventDefault();
                carouselRef.current.scrollLeft += e.deltaY * 2;
            }
        }
    };

    const getImage = (dark, light) => {
        return theme === "dark" ? dark : light;
    };

    const sims = [
        {
            path: "/pendulum",
            title: "Kyvadlo",
            image: getImage(pendulumDark, pendulumLight),
        },
        {
            path: "/diffusion",
            title: "Difúzia",
            image: getImage(diffusionDark, diffusionLight),
        },
        {
            path: "/magnet",
            title: "Magnetické pole",
            image: getImage(magnetDark, magnetLight),
        },
        {
            path: "/spring",
            title: "Pružina",
            image: getImage(springDark, springLight),
        },
        {
            path: "/buoyancy",
            title: "Vztlak",
            image: getImage(buoyancyDark, buoyancyLight),
        },
    ];

    return (
        <div className="wrapper">

            <header className="top-bar">
                <div className="logo">Fyzikálne simulácie</div>

                <div className={styles["home-auth-buttons"]}>
                    <button className="themeToggle" onClick={toggleTheme} aria-label="Toggle theme">
                        <span className={`thumb ${theme === "dark" ? "dark" : "light"}`}>
                            {theme === "dark" ? "🌙" : "☀️"}
                        </span>
                    </button>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="btn">Prihlásiť sa</Link>
                            <Link to="/register" className="btn">Registrovať sa</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="profile-btn" aria-label="Profile">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                >
                                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                                </svg>
                            </Link>                            <button onClick={handleLogout} className="btn">
                                Odhlásiť sa
                            </button>
                        </>
                    )}
                </div>
            </header>

            <div className="content">

                <div className={styles["intro-section"]}>
                    <h1>Vitajte vo virtuálnom fyzikálnom laboratóriu!</h1>
                    <p>
                        Preskúmajte{' '}
                        <span className={styles.highlight}>matematické kyvadlo</span>,{' '}
                        <span className={styles.highlight}>jav difúzie</span>,{' '}
                        <span className={styles.highlight}>magneticke pole v okoli magnetu</span>,{' '}
                        <span className={styles.highlight}>kmitavý pohyb závažia na pružine</span> a{' '}
                        <span className={styles.highlight}>prejavy vztlakovej sily</span> prostredníctvom interaktívnych
                        simulácií.<br/>
                        Meňte parametre a sledujte okamžité výsledky – učte sa fyziku vizuálne a
                        intuitívne!
                    </p>
                </div>

                <div
                    className={styles["simulation-carousel-wrapper"]}
                    ref={carouselRef}
                    onWheel={handleWheel}
                >
                    <div className={styles["simulations-carousel"]}>
                        {sims.map((sim) => (
                            <Link key={sim.path} to={sim.path} className={styles["sim-card"]}>
                                <div
                                    className={styles["sim-img"]}
                                    style={{ backgroundImage: `url(${sim.image})` }}
                                />
                                <div className={styles["sim-title"]}>{sim.title}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <footer>BP Projekt – Fyzikálne simulácie</footer>
        </div>
    );
}