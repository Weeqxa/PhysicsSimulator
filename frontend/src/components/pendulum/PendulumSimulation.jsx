import {useEffect, useRef, useState} from "react";
import Pendulum from "./Pendulum";
import styles from "../../styles/Pendulum.module.css";
import {useSliderFill} from "../../utils/useSliderFill.jsx";

export default function PendulumSimulation() {

    const updateSlider = useSliderFill();

    const canvasRef = useRef(null);
    const pendulumRef = useRef(null);

    const [length, setLength] = useState(150);
    const [gravity, setGravity] = useState(0.5);
    const [damping, setDamping] = useState(0.01);

    // INIT
    useEffect(() => {
        if (!canvasRef.current) return;

        const pendulum = new Pendulum(canvasRef.current);
        pendulumRef.current = pendulum;

        return () => pendulumRef.current?.stop();
    }, []);

    // UPDATE PHYSICS
    useEffect(() => {
        pendulumRef.current?.updateParameters({
            length,
            g: gravity,
            damping
        });
    }, [length, gravity, damping]);

    // CONTROLS
    const handlePause = () => pendulumRef.current?.pause();
    const handleResume = () => pendulumRef.current?.resume();
    const handleReset = () => pendulumRef.current?.reset();

    return (
        <div className={styles.simulationContainer}>

            {/* CANVAS */}
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className={styles.canvas}
                />
            </div>

            {/* RIGHT PANEL */}
            <div className={styles.controlsColumn}>

                {/* TEXT (повернуто назад) */}
                <div className={styles.infoText}>
                    <p>
                        <strong>Matematické kyvadlo</strong><br/><br/>
                        Matematické kyvadlo je sústava tvorená hmotným bodom zaveseným na niti zanedbateľnej hmotnosti.
                        Po vychýlení z rovnovážnej polohy vykonáva kmitavý pohyb vplyvom tiažovej sily.
                        <br/><br/>
                        Pri malých výchylkách možno tento pohyb aproximovať pomocou jednoduchých harmonických kmitov,
                        ktoré predstavujú jeden zo základných modelov periodického pohybu v mechanike. Kyvadlo patrí
                        medzi najjednoduchšie systémy na štúdium zákonitostí kmitania.
                        <br/><br/>
                        Simulácia znázorňuje priebeh pohybu kyvadla v závislosti od zvolených parametrov a umožňuje
                        pozorovať základné vlastnosti mechanického kmitania v rôznych podmienkach.
                        <br/><br/>
                    </p>
                </div>

                {/* CONTROLS */}
                <div className={styles.controls}>

                    <div className={styles.row}>
                        <label>Dĺžka: {length}</label>
                        <input
                            type="range"
                            min="50"
                            max="300"
                            value={length}
                            onChange={(e) => {
                                setLength(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
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
                            onChange={(e) => {
                                setGravity(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
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
                            onChange={(e) => {
                                setDamping(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
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