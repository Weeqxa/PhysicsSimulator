// src/components/diffusion/DiffusionSimulation.jsx
import {useEffect, useRef, useState} from "react";
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
        simulationRef.current?.updateParameters({particleCount, radius, mass, temperature});
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
                        <strong>Difúzia</strong><br/>
                        Difúzia je proces samovoľného premiešavania častíc v dôsledku ich neusporiadaného tepelného pohybu,
                        ktorý vedie k postupnému vyrovnávaniu koncentrácie látky v priestore.<br/><br/>

                        Pohyb častíc je úzko spätý s Brownovým pohybom, vznikajúcim vplyvom náhodných zrážok
                        s molekulami prostredia. Na jeho opis sa často využívajú stochastické modely,
                        napríklad Langevinov prístup, ktorý zohľadňuje pôsobenie náhodných síl a tlmenia.<br/><br/>

                        Simulácia znázorňuje pohyb častíc a ich rozptyl v priestore v čase,
                        čím umožňuje pozorovať základné vlastnosti difúzneho procesu.
                    </p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.row}>
                        <label>Počet častíc: {particleCount}</label>
                        <input
                            type="range"
                            min="50"
                            max="500"
                            value={particleCount}
                            onChange={(e) => setParticleCount(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Polomer: {radius}</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.row}>
                        <label>Hmotnosť: {mass}</label>
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
                        <label>Teplota: {temperature}</label>
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
                        <button className="btn" onClick={() => simulationRef.current?.pause()}>Pozastaviť</button>
                        <button className="btn" onClick={() => simulationRef.current?.resume()}>Pokračovať</button>
                        <button className="btn" onClick={handleReset}>Resetovať</button>
                    </div>
                </div>
            </div>
        </div>
    );
}