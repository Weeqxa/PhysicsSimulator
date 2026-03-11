// src/pages/diffusion/DiffusionPage.jsx
import "../styles/Common.css";
import styles from "../styles/Diffusion.module.css";
import DiffusionSimulation from "../components/diffusion/DiffusionSimulation.jsx";

export default function DiffusionPage() {
    return (
        <div>
            <div className="top-bar">
                <div className="logo">Physical Simulations</div>
                <div className="top-right-buttons">
                    <a href="/" className="btn">Home</a>
                </div>
            </div>


            <div className={styles.simulationContainer}>
                <DiffusionSimulation />
            </div>
        </div>
    );
}