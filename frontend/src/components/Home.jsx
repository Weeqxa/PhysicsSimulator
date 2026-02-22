import React, {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import "../styles/common.css";
import styles from "../styles/Home.module.css";

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
                <div className="logo">Physical Simulations</div>

                <div className={styles["home-auth-buttons"]}>
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="btn">Login</Link>
                            <Link to="/register" className="btn">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" className="profile-btn">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M6 20c0-4 3-6 6-6s6 2 6 6"/>
                                </svg>
                            </Link>
                            <button onClick={handleLogout} className="btn">Logout</button>
                        </>
                    )}
                </div>
            </header>

            {/* ========================= ОСНОВНИЙ КОНТЕНТ ========================= */}
            <div className="content">
                {/* будь-який додатковий контент */}

                {isDesktop && <div style={{height: "400px", visibility: "hidden"}}/>}

                {/* ========================= КАРУСЕЛЬ СИМУЛЯЦІЙ ========================= */}
                <div
                    className={styles["simulation-carousel-wrapper"]}
                    ref={carouselRef}
                    onWheel={handleWheel}
                    style={{marginTop: "auto"}} // витискаємо карусель до низу
                >
                    <div className={styles["simulations-carousel"]}>
                        <Link to="/pendulum" className={styles["sim-card"]}>
                            <div
                                className={styles["sim-img"]}
                                style={{backgroundImage: "url('/images/pendulum.jpg')"}}
                            />
                            <div className={styles["sim-title"]}>Pendulum Simulation</div>
                        </Link>

                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className={`${styles["sim-card"]} ${styles.disabled}`}>
                                <div className={`${styles["sim-img"]} ${styles.placeholder}`}/>
                                <div className={styles["sim-title"]}>Coming Soon {item}</div>
                                <div className={styles["soon-text"]}>Not available</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================= ФУТЕР ========================= */}
            <footer>BP Project – Physical Simulations</footer>
        </div>
    );
}