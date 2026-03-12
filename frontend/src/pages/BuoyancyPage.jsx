// src/pages/buoyancy/BuoyancyPage.jsx
import "../styles/Common.css";
import styles from "../styles/Buoyancy.module.css"; // використаємо ті ж стилі
import BuoyancySimulation from "../components/buoyancy/BuoyancySimulation.jsx";

export default function BuoyancyPage() {
    return (
        <div>
            <div className="top-bar">
                <div className="logo">Fyzikálne simulácie ️</div>
                <div className="top-right-buttons">
                    <a href="/" className="btn">Domov</a>
                </div>
            </div>

            <div className={styles.simulationContainer}>
                <BuoyancySimulation />
            </div>
        </div>
    );
}