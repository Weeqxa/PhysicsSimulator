// src/components/diffusion/DiffusionSimulation.jsx
import { useEffect, useRef, useState } from "react";
import Diffusion from "./Diffusion";
import styles from "../../styles/Diffusion.module.css";

export default function DiffusionSimulation() {
    const canvasRef = useRef(null);
    const simulationRef = useRef(null);

    const [particleCount, setParticleCount] = useState(150);
    const [radius, setRadius] = useState(4);
    const [mass, setMass] = useState(1);
    const [temperature, setTemperature] = useState(1);

    useEffect(() => {
        if (!canvasRef.current) return;
        const sim = new Diffusion(canvasRef.current, particleCount, radius, mass, temperature);
        simulationRef.current = sim;

        return () => sim.stop();
    }, []);

    useEffect(() => {
        simulationRef.current?.updateParameters({ particleCount, radius, mass, temperature });
    }, [particleCount, radius, mass, temperature]);

    const handleReset = () => simulationRef.current?.resetParticles();

    return (
        <div className={styles.simulationContainer}>
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={400}
                    className={styles.canvas}
                />
            </div>

            <div className={styles.controlsColumn}>
                <div className={styles.infoText}>
                    <p>
                        Interaktívna simulácia <strong>difúzie</strong>!<br/>
                        Pozorujte pohyb častíc a Brownov pohyb.<br/><br/>
                        <strong>Particle Count</strong> — počet častíc v simulácii.<br/>
                        <strong>Mass</strong> — ovplyvňuje rýchlosť pohybu (väčšia hmotnosť = pomalší pohyb).<br/>
                        <strong>Radius (pm)</strong> — veľkosť častíc.<br/>
                        <strong>Temperature (K)</strong> — ovplyvňuje počiatočnú rýchlosť častíc.<br/><br/>
                        Experimentujte s parametrami a sledujte okamžitú zmenu.
                    </p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.row}>
                        <label>Particle Count: {particleCount}</label>
                        <input
                            type="range"
                            min="50"
                            max="500"
                            value={particleCount}
                            onChange={(e) => setParticleCount(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Radius: {radius}</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Mass: {mass}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Temperature: {temperature}</label>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.buttons}>
                        <button className="btn" onClick={() => simulationRef.current?.pause()}>Pause</button>
                        <button className="btn" onClick={() => simulationRef.current?.resume()}>Resume</button>
                        <button className="btn" onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
}