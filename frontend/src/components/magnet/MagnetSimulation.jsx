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
                        Interaktívna simulácia <strong>magnetického poľa</strong>.<br/><br/>

                        Presúvajte magnet myšou a sledujte, ako sa mení orientácia kompasov.<br/><br/>

                        <strong>Field Strength</strong> — určuje intenzitu magnetického poľa; väčšia hodnota znamená silnejší vplyv na kompas.<br/>
                        <strong>Damping</strong> — určuje, ako rýchlo kompas zastavuje svoje otáčanie; vyššia hodnota spôsobuje plynulejšie, pomalšie otáčanie.<br/>
                        <strong>Inertia</strong> — ovplyvňuje zotrvačnosť kompasovej ihly; vyššia hodnota znamená, že ihla reaguje pomalšie na zmenu poľa.<br/><br/>

                        Kompasy sa vždy orientujú podľa smeru magnetického poľa a interaktívne vizualizujú jeho silové línie.
                    </p>
                </div>

                <div className={styles.controls}>

                    <div className={styles.row}>
                        <label>Field strength: {fieldStrength}</label>

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
                        <label>Damping: {damping.toFixed(2)}</label>

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
                        <label>Inertia: {inertia.toFixed(2)}</label>

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