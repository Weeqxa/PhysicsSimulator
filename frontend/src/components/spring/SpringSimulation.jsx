import { useEffect, useRef, useState } from "react";
import Spring from "./Spring";
import styles from "../../styles/Spring.module.css";

export default function SpringSimulation() {
    const canvasRef = useRef(null);
    const springRef = useRef(null);

    const [mass, setMass] = useState(1);
    const [k, setK] = useState(20);
    const [c, setC] = useState(0.5);
    const [nonlinear, setNonlinear] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;
        const spring = new Spring(canvasRef.current, {
            mass,
            k,
            c,
            nonlinear,
            restY: 120,
            y0: 200,
            massColor: "#9c81e1"
        });
        springRef.current = spring;

        return () => spring.destroy();
    }, []);

    useEffect(() => {
        springRef.current?.updateParameters({ mass, k, c, nonlinear });
    }, [mass, k, c, nonlinear]);

    const handlePause = () => springRef.current?.pause();
    const handleResume = () => springRef.current?.resume();
    const handleReset = () => springRef.current?.reset();

    return (
        <div className={styles.simulationContainer}>
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={500}
                    className={styles.canvas}
                />
            </div>

            <div className={styles.controlsColumn}>
                <div className={styles.infoText}>
                    <p>
                        Vitajte v interaktívnej simulácii <strong>pružiny</strong>!<br/>
                        Sledujte pohyb závažia ovplyvnený silou pružiny a gravitáciou.<br/><br/>

                        <strong>Mass</strong> — hmotnosť závažia; väčšia hmotnosť znamená, že závažia reagujú pomalšie.<br/>
                        <strong>K</strong> — tuhosť pružiny; vyššia hodnota = pružina tvrdšia a kmitanie rýchlejšie.<br/>
                        <strong>Damping</strong> — koeficient tlmenia; väčšie tlmenie = kmitanie sa rýchlejšie zastaví.<br/>
                        <strong>Nonlinear</strong> — zapnutie nelineárneho efektu (kx³) pre zložitejšie kmitanie.<br/><br/>

                        Pomocou posúvačov môžete meniť parametre a myšou ťahať závažia priamo v animácii.
                    </p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.row}>
                        <label>Mass: {mass}</label>
                        <input type="range" min="0.5" max="5" step="0.1" value={mass}
                               onChange={e => setMass(Number(e.target.value))}/>
                    </div>

                    <div className={styles.row}>
                        <label>k: {k}</label>
                        <input type="range" min="5" max="50" step="1" value={k}
                               onChange={e => setK(Number(e.target.value))}/>
                    </div>

                    <div className={styles.row}>
                        <label>Damping: {c}</label>
                        <input type="range" min="0" max="2" step="0.05" value={c}
                               onChange={e => setC(Number(e.target.value))}/>
                    </div>

                    <div className={styles.row}>
                        <label>
                            Nonlinear (kx³)
                            <span className={styles.switch}>
                                <input type="checkbox" checked={nonlinear}
                                       onChange={e => setNonlinear(e.target.checked)}/>
                                <span className={styles.slider}></span>
                            </span>
                        </label>
                    </div>

                    <div className={styles.buttons}>
                        <button className="btn" onClick={handlePause}>Pause</button>
                        <button className="btn" onClick={handleResume}>Resume</button>
                        <button className="btn" onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
}