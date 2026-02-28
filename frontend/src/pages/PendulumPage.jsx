import "../styles/Common.css";
import styles from "../styles/Pendulum.module.css";
import PendulumSimulation from "../components/pendulum/PendulumSimulation";

export default function PendulumPage() {
    return (
        <div>
            {/* ========================= ВЕРХНЯ ПАНЕЛЬ ========================= */}
            <div className="top-bar">
                <div className="logo">Physical Simulations</div>
                <div className="top-right-buttons">
                    <a href="/" className="btn">Home</a>
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