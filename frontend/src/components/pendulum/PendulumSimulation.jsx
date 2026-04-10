import {useEffect, useRef, useState} from "react";
import Pendulum from "./Pendulum";
import styles from "../../styles/Pendulum.module.css";

export default function PendulumSimulation() {
    const canvasRef = useRef(null);
    const pendulumRef = useRef(null);

    const [length, setLength] = useState(150);
    const [gravity, setGravity] = useState(0.5);
    const [damping, setDamping] = useState(0.01);

    // Ініціалізація маятника
    useEffect(() => {
        if (!canvasRef.current) return;
        const pendulum = new Pendulum(canvasRef.current);
        pendulumRef.current = pendulum;

        return () => pendulumRef.current?.stop();
    }, []);

    // Оновлення параметрів
    useEffect(() => {
        pendulumRef.current?.updateParameters({length, g: gravity, damping});
    }, [length, gravity, damping]);

    // Кнопки керування
    const handlePause = () => pendulumRef.current?.pause();
    const handleResume = () => pendulumRef.current?.resume();
    const handleReset = () => pendulumRef.current?.reset();

    return (
        <div className={styles.simulationContainer}>
            {/* Ліва колонка - Canvas */}
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className={styles.canvas}
                />
            </div>

            {/* Права колонка - текст + панель керування */}
            <div className={styles.controlsColumn}>
                {/* Текстове пояснення зверху */}
                <div className={styles.infoText}>
                    <p>
                        <strong>Mechanické kyvadlo</strong><br/>
                        Mechanické kyvadlo je fyzikálny systém tvorený hmotným bodom zaveseným na pevnom závese.
                        Po vychýlení z rovnovážnej polohy vykonáva kmitavý pohyb vplyvom gravitačnej sily.<br/><br/>

                        Pri malých výchylkách možno tento pohyb aproximovať ako jednoduché harmonické kmity,
                        ktoré predstavujú jeden zo základných modelov periodického pohybu v mechanike.
                        Kyvadlo patrí medzi najjednoduchšie systémy na štúdium zákonitostí kmitania.<br/><br/>

                        Simulácia znázorňuje priebeh pohybu kyvadla v závislosti od zvolených podmienok
                        a umožňuje pozorovať základné vlastnosti mechanického kmitania.
                    </p>
                </div>

                {/* Панель керування */}
                <div className={styles.controls}>
                    <div className={styles.row}>
                        <label>Dĺžka: {length}</label>
                        <input
                            type="range"
                            min="50"
                            max="300"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Gravitácia: {gravity}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            value={gravity}
                            onChange={(e) => setGravity(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Tlmenie: {damping.toFixed(3)}</label>
                        <input
                            type="range"
                            min="0"
                            max="0.05"
                            step="0.005"
                            value={damping}
                            onChange={(e) => setDamping(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.buttons}>
                        <button className="btn" onClick={handlePause}>
                            Pozastaviť
                        </button>
                        <button className="btn" onClick={handleResume}>
                            Pokračovať
                        </button>
                        <button className="btn" onClick={handleReset}>
                            Resetovať
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}