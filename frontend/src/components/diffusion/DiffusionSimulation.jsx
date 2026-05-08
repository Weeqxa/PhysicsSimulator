import {useEffect, useRef, useState} from "react";
import Diffusion from "./Diffusion";
import styles from "../../styles/Diffusion.module.css";
import {useSliderFill} from "../../utils/useSliderFill.jsx";

export default function DiffusionSimulation() {

    const updateSlider = useSliderFill();

    const canvasRef = useRef(null);
    const simulationRef = useRef(null);

    const [redCount, setRedCount] = useState(75);
    const [blueCount, setBlueCount] = useState(75);

    const [radius, setRadius] = useState(4);
    const [mass, setMass] = useState(1);
    const [temperature, setTemperature] = useState(1);

    const [barrierEnabled, setBarrierEnabled] = useState(true);

    // INIT
    useEffect(() => {
        if (!canvasRef.current) return;

        const sim = new Diffusion(
            canvasRef.current,
            redCount,
            blueCount,
            radius,
            mass,
            temperature
        );

        simulationRef.current = sim;

        return () => sim.stop();
    }, []);

    // UPDATE SIM
    useEffect(() => {
        simulationRef.current?.updateParameters({
            redCount,
            blueCount,
            radius,
            mass,
            temperature
        });
    }, [redCount, blueCount, radius, mass, temperature]);

    // BARRIER
    useEffect(() => {
        simulationRef.current?.setBarrier(barrierEnabled);
    }, [barrierEnabled]);

    const handleReset = () => simulationRef.current?.resetParticles();

    return (
        <div className={styles.simulationContainer}>

            {/* CANVAS */}
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={400}
                    className={styles.canvas}
                />
            </div>

            {/* RIGHT PANEL */}
            <div className={styles.controlsColumn}>

                {/* TEXT (повернутий як було) */}
                <div className={styles.infoText}>
                    <p>
                        <strong>Difúzia</strong><br/><br/>
                        Difúzia je proces, pri ktorom sa častice látky presúvajú z miesta s vyššou koncentráciou do
                        miesta s nižšou koncentráciou v dôsledku ich neusporiadaného tepelného pohybu, čo vedie k
                        dosiahnutiu rovnomerného rozdelenia koncentrácií vo viaczložkovej sústave.<br/><br/>

                        Pohyb častíc je úzko spätý s Brownovým pohybom a pohybom v dôsledku náhodných zrážok medzi
                        molekulami prostredia. Na jeho opis sa často využívajú stochastické modely, napríklad Langevinov
                        prístup, ktorý zohľadňuje pôsobenie náhodných síl a tlmenia.<br/><br/>

                        Simulácia znázorňuje pohyb častíc a ich rozptyl v priestore v čase, čo umožňuje pozorovať
                        základné vlastnosti difúzneho procesu.
                    </p>
                </div>

                {/* CONTROLS */}
                <div className={styles.controls}>

                    {/* SWITCH */}
                    <div className={styles.switchRow}>
                        <span className={styles.switchLabel}>
                            Prekážka: {barrierEnabled ? "Zapnutá" : "Vypnutá"}
                        </span>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={barrierEnabled}
                                onChange={(e) => setBarrierEnabled(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    {/* RED */}
                    <div className={styles.row}>
                        <label>Červené častice: {redCount}</label>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            value={redCount}
                            onChange={(e) => {
                                setRedCount(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* BLUE */}
                    <div className={styles.row}>
                        <label>Modré častice: {blueCount}</label>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            value={blueCount}
                            onChange={(e) => {
                                setBlueCount(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* RADIUS */}
                    <div className={styles.row}>
                        <label>Polomer: {radius}</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={radius}
                            onChange={(e) => {
                                setRadius(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* MASS */}
                    <div className={styles.row}>
                        <label>Hmotnosť: {mass}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={mass}
                            onChange={(e) => {
                                setMass(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* TEMP */}
                    <div className={styles.row}>
                        <label>Teplota: {temperature}</label>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => {
                                setTemperature(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                            onInput={(e) => updateSlider(e.target)}
                        />
                    </div>

                    {/* BUTTONS */}
                    <div className={styles.buttons}>
                        <button className="btn" onClick={() => simulationRef.current?.pause()}>
                            Pozastaviť
                        </button>
                        <button className="btn" onClick={() => simulationRef.current?.resume()}>
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