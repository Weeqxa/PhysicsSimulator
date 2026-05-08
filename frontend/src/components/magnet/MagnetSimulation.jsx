import {useEffect, useRef, useState} from "react";
import Magnet from "./Magnet";
import styles from "../../styles/Magnet.module.css";
import {useSliderFill} from "../../utils/useSliderFill.jsx";

export default function MagnetSimulation() {

    const updateSlider = useSliderFill();

    const canvasRef = useRef(null);
    const magnetRef = useRef(null);

    const [fieldStrength, setFieldStrength] = useState(3000);
    const [damping, setDamping] = useState(0.9);
    const [inertia, setInertia] = useState(0.15);

    // INIT
    useEffect(() => {
        if (!canvasRef.current) return;

        const magnet = new Magnet(canvasRef.current, {
            fieldStrength,
            damping,
            inertia,
            theme: document.documentElement.dataset.theme
        });

        magnetRef.current?.updateParameters({
            fieldStrength,
            damping,
            inertia,
            theme: document.documentElement.dataset.theme
        });

        return () => magnet.destroy();
    }, []);

    // UPDATE
    useEffect(() => {
        magnetRef.current?.updateParameters({
            fieldStrength,
            damping,
            inertia
        });
    }, [fieldStrength, damping, inertia]);

    return (
        <div className={styles.simulationContainer}>

            {/* CANVAS */}
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={600}
                    className={styles.canvas}
                />
            </div>

            {/* CONTROLS */}
            <div className={styles.controlsColumn}>

                <div className={styles.infoText}>
                    <p>
                        <strong>Magnetické pole</strong><br/><br/>
                        Magnetické pole vzniká v okolí permanentných magnetov alebo vodičov, ktorými preteká elektrický
                        prúd. Magnetické pole pôsobí na pohybujúce sa elektrické náboje a iné magnetické látky.
                        <br/><br/>
                        Jeho vlastnosti možno opísať pomocou magnetických indukčných čiar, ktoré určujú smer a intenzitu
                        magnetického poľa. V každom bode priestoru možno smer magnetického poľa sledovať pomocou
                        magnetky.
                        <br/><br/>
                        Simulácia znázorňuje priestorové rozloženie magnetického poľa v okolí permanentného magnetu a
                        jeho vplyv na orientáciu magnetiek, ktoré vizualizujú smer siločiar.
                    </p>
                </div>

                <div className={styles.controls}>

                    {/* FIELD STRENGTH */}
                    <div className={styles.row}>
                        <label>Sila poľa: {fieldStrength}</label>
                        <input
                            type="range"
                            min="1000"
                            max="8000"
                            step="100"
                            value={fieldStrength}
                            onChange={(e) => {
                                setFieldStrength(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* DAMPING */}
                    <div className={styles.row}>
                        <label>Tlmenie: {damping.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0.7"
                            max="0.99"
                            step="0.01"
                            value={damping}
                            onChange={(e) => {
                                setDamping(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* INERTIA */}
                    <div className={styles.row}>
                        <label>Zotrvačnosť: {inertia.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0.05"
                            max="0.4"
                            step="0.01"
                            value={inertia}
                            onChange={(e) => {
                                setInertia(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}