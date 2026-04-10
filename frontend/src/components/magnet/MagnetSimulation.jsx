import { useEffect, useRef, useState } from "react";
import Magnet from "./Magnet";
import styles from "../../styles/Magnet.module.css";

export default function MagnetSimulation() {

    const canvasRef = useRef(null);
    const magnetRef = useRef(null);

    const [fieldStrength, setFieldStrength] = useState(3000);
    const [damping, setDamping] = useState(0.9);
    const [inertia, setInertia] = useState(0.15);

    useEffect(() => {

        if (!canvasRef.current) return;

        const magnet = new Magnet(canvasRef.current, {
            fieldStrength,
            damping,
            inertia
        });

        magnetRef.current = magnet;

        return () => magnet.destroy();

    }, []);

    useEffect(() => {

        magnetRef.current?.updateParameters({
            fieldStrength,
            damping,
            inertia
        });

    }, [fieldStrength, damping, inertia]);

    return (
        <div className={styles.simulationContainer}>

            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={900}
                    height={600}
                    className={styles.canvas}
                />
            </div>

            <div className={styles.controlsColumn}>

                <div className={styles.infoText}>
                    <p>
                        <strong>Magnetické pole</strong><br/>
                        Magnetické pole je fyzikálne pole, ktoré vzniká v okolí magnetov alebo elektrických prúdov
                        a pôsobí na pohybujúce sa elektrické náboje a magnetické dipóly.<br/><br/>

                        Jeho vlastnosti možno opísať pomocou magnetických indukčných čiar, ktoré určujú smer a intenzitu poľa.
                        V každom bode priestoru má magnetické pole svoj smer a veľkosť, pričom jeho pôsobenie sa prejavuje napríklad orientáciou magnetickej ihly.<br/><br/>

                        Simulácia znázorňuje priestorové rozloženie magnetického poľa v okolí magnetu
                        a jeho vplyv na orientáciu kompasov, ktoré vizualizujú smer siločiar.
                    </p>
                </div>

                <div className={styles.controls}>

                    <div className={styles.row}>
                        <label>Sila poľa: {fieldStrength}</label>

                        <input
                            type="range"
                            min="1000"
                            max="8000"
                            step="100"
                            value={fieldStrength}
                            onChange={(e) => setFieldStrength(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Tlmenie: {damping.toFixed(2)}</label>

                        <input
                            type="range"
                            min="0.7"
                            max="0.99"
                            step="0.01"
                            value={damping}
                            onChange={(e) => setDamping(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Zotrvačnosť: {inertia.toFixed(2)}</label>

                        <input
                            type="range"
                            min="0.05"
                            max="0.4"
                            step="0.01"
                            value={inertia}
                            onChange={(e) => setInertia(Number(e.target.value))}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}