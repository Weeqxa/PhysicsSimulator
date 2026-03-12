import "../styles/Common.css";
import styles from "../styles/Spring.module.css";
import SpringSimulation from "../components/spring/SpringSimulation";

export default function SpringPage() {
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
                        <SpringSimulation />
                    </div>
                </div>
            </div>
        </div>
    );
}