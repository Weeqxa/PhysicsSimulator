import {useEffect, useRef, useState} from "react";
import Spring from "./Spring";
import styles from "../../styles/Spring.module.css";
import {useSliderFill} from "../../utils/useSliderFill.jsx";

export default function SpringSimulation() {

    const updateSlider = useSliderFill();

    const canvasRef = useRef(null);
    const springRef = useRef(null);

    const [mass, setMass] = useState(1);
    const [k, setK] = useState(20);
    const [c, setC] = useState(0.5);
    const [nonlinear, setNonlinear] = useState(false);

    const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme"));

    // INIT
    useEffect(() => {
        if (!canvasRef.current) return;

        const spring = new Spring(canvasRef.current, {
            mass, k, c, nonlinear, restY: 120, y0: 200, theme
        });

        springRef.current = spring;

        return () => spring.destroy();
    }, []);

    // UPDATE PHYSICS
    useEffect(() => {
        springRef.current?.updateParameters({
            mass, k, c, nonlinear
        });
    }, [mass, k, c, nonlinear]);

    // THEME LIVE UPDATE (NO REFRESH)
    useEffect(() => {
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute("data-theme");

            setTheme(newTheme);
            springRef.current?.updateParameters({theme: newTheme});
        });

        observer.observe(document.documentElement, {
            attributes: true, attributeFilter: ["data-theme"]
        });

        return () => observer.disconnect();
    }, []);

    const handlePause = () => springRef.current?.pause();
    const handleResume = () => springRef.current?.resume();
    const handleReset = () => springRef.current?.reset();

    return (<div className={styles.simulationContainer}>

            {/* CANVAS */}
            <div className={styles.canvasColumn}>
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={500}
                    className={styles.canvas}
                />
            </div>

            {/* RIGHT PANEL */}
            <div className={styles.controlsColumn}>

                {/* TEXT (як ти просив) */}
                <div className={styles.infoText}>
                    <p>
                        <strong>Pružinový oscilátor</strong><br/><br/>

                        Pružinový oscilátor je tvorený pružinou zanedbateľnej hmotnosti a závažím s hmotnosťou.
                        Ide o mechanický pohyb telesa v dôsledku pôsobenia sily pružnosti, ktorá vždy smeruje do
                        rovnovážnej polohy.

                        <br/><br/>

                        Tento pohyb je v ideálnom prípade opísaný Hookovým zákonom, podľa ktorého je sila úmerná
                        výchylke.
                        Pri malých výchylkách ide o jednoduché harmonické kmity, zatiaľ čo pri väčších výchylkách sa
                        môžu prejaviť aj nelineárne efekty.

                        <br/><br/>

                        Simulácia znázorňuje časový priebeh pohybu telesa na pružine a umožňuje pozorovať základné
                        vlastnosti mechanického kmitania v rôznych podmienkach.
                    </p>
                </div>

                {/* CONTROLS */}
                <div className={styles.controls}>

                    {/* MASS */}
                    <div className={styles.row}>
                        <label>Hmotnosť: {mass}</label>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={mass}
                            onChange={(e) => {
                                setMass(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                        />
                    </div>

                    {/* K */}
                    <div className={styles.row}>
                        <label>k: {k}</label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={k}
                            onChange={(e) => {
                                setK(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                        />
                    </div>

                    {/* DAMPING */}
                    <div className={styles.row}>
                        <label>Tlmenie: {c}</label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.05"
                            value={c}
                            onChange={(e) => {
                                setC(Number(e.target.value));
                                updateSlider(e.target);
                            }}
                        />
                    </div>

                    <div className={styles.row}>
                        <label> Nelineárne (kx³)
                            <span className={styles.switch}>
                                <input type="checkbox" checked={nonlinear}
                                       onChange={(e) => setNonlinear(e.target.checked)}/>
                                <span className={styles.slider}></span>
                            </span> </label></div>

                    {/* BUTTONS */}
                    <div className={styles.buttons}>
                        <button className="btn" onClick={handlePause}>Pozastaviť</button>
                        <button className="btn" onClick={handleResume}>Pokračovať</button>
                        <button className="btn" onClick={handleReset}>Resetovať</button>
                    </div>

                </div>
            </div>
        </div>);
}