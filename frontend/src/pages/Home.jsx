import React, {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import "../styles/Common.css";
import styles from "../styles/Home.module.css";
import pendulumImg from "../assets/images/pendulum.jpg";
import diffusionImg from "../assets/images/diffusion.jpg";
import springImg from "../assets/images/spring.jpg";
import magnetImg from "../assets/images/magnet.jpg";
import buoyancyImg from "../assets/images/buoyancy.jpg";

export default function Home() {
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


    return (
        <div className="wrapper">
            {/* ========================= ВЕРХНЯ ПАНЕЛЬ ========================= */}
            <header className="top-bar">
                <div className="logo">Fyzikálne simulácie</div>
                <div className={styles["home-auth-buttons"]}>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="btn">Prihlásiť sa</Link>
                            <Link to="/register" className="btn">Registrovať sa</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="profile-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M6 20c0-4 3-6 6-6s6 2 6 6"/>
                                </svg>
                            </Link>
                            <button onClick={handleLogout} className="btn">Odhlásiť sa</button>
                        </>
                    )}
                </div>
            </header>

            {/* ========================= ОСНОВНИЙ КОНТЕНТ ========================= */}
            <div className="content">
                {/* Вітальний текст */}
                <div className={styles["intro-section"]}>
                    <h1>Vitajte vo virtuálnej fyzikálnej laboratóriu!</h1>
                    <p>
                        Preskúmajte{' '}
                        <span className={styles.highlight}>mechaniku</span>,{' '}
                        <span className={styles.highlight}>magnetizmus</span>,{' '}
                        <span className={styles.highlight}>difúziu</span>,{' '}
                        <span className={styles.highlight}>pružiny</span> a{' '}
                        <span className={styles.highlight}>plávajúce telieska</span> prostredníctvom interaktívnych
                        simulácií.<br/>
                        Experimentujte s parametrami a sledujte okamžité výsledky – učte sa fyziku vizuálne a
                        intuitívne!
                    </p>
                </div>

                {isDesktop && <div style={{height: "40px", visibility: "hidden"}}/>}

                {/* ========================= КАРУСЕЛЬ СИМУЛЯЦІЙ ========================= */}
                <div
                    className={styles["simulation-carousel-wrapper"]}
                    ref={carouselRef}
                    onWheel={handleWheel}
                >
                    <div className={styles["simulations-carousel"]}>
                        {[
                            {
                                path: "/pendulum",
                                title: "Kyvadlo",
                                image: pendulumImg
                            },
                            {
                                path: "/diffusion",
                                title: "Difúzia",
                                image: diffusionImg
                            },
                            {
                                path: "/magnet",
                                title: "Magnetické pole",
                                image: magnetImg
                            },
                            {
                                path: "/spring",
                                title: "Pružina",
                                image: springImg
                            },
                            {
                                path: "/buoyancy",
                                title: "Vztlak",
                                image: buoyancyImg
                            }
                        ].map((sim) => (
                            <Link key={sim.path} to={sim.path} className={styles["sim-card"]}>
                                <div
                                    className={styles["sim-img"]}
                                    style={{ backgroundImage: `url('${sim.image}')` }}
                                />
                                <div className={styles["sim-title"]}>{sim.title}</div>
                            </Link>
                        ))}
                    </div>


                </div>
            </div>

            {/* ========================= ФУТЕР ========================= */}
            <footer>BP Projekt – Fyzikálne simulácie</footer>
        </div>
    );
}