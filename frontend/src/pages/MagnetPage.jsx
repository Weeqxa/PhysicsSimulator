import "../styles/Common.css";
import styles from "../styles/Magnet.module.css";
import MagnetSimulation from "../components/magnet/MagnetSimulation";

export default function MagnetPage() {
    return (
        <div>
            <div className="top-bar">
                <div className="logo">Fyzikálne simulácie</div>
                <div className="top-right-buttons">
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