import { useRef, useEffect, useState } from "react";
import Buoyancy from "./Buoyancy";
import styles from "../../styles/Buoyancy.module.css";

import woodImg from "../../assets/objects/wood.jpg";
import stoneImg from "../../assets/objects/stone.jpg";
import balloonImg from "../../assets/objects/balloon.jpg";

// ===== ПРЕДМЕТИ =====
const OBJECTS = {
    drevo: { density: 0.6, shape: "wood", image: woodImg },
    kamen: { density: 2.5, shape: "stone", image: stoneImg },
    balon: { density: 0.2, shape: "circle", image: balloonImg },
};

// ===== KVAPALINY =====
const FLUIDS = {
    voda: { density: 1, color: "rgba(0,150,255,0.5)" },
    olej: { density: 0.8, color: "rgba(255,200,0,0.5)" },
    ortut: { density: 13.6, color: "rgba(180,180,180,0.7)" },
    benzin: { density: 0.7, color: "rgba(255,100,50,0.5)" },
};

export default function BuoyancySimulation() {
    const canvasRef = useRef(null);
    const simulationRef = useRef(null);

    const [objectName, setObjectName] = useState("drevo");
    const [fluidName, setFluidName] = useState("voda");
    const [size, setSize] = useState(40);

    useEffect(() => {
        if (!canvasRef.current) return;

        const obj = OBJECTS[objectName];
        const fl = FLUIDS[fluidName];

        const sim = new Buoyancy(
            canvasRef.current,
            obj.density,
            fl.density,
            size,
            obj,
            fl.color,
            obj.shape
        );

        simulationRef.current = sim;
        return () => sim.stop();
    }, []);

    useEffect(() => {
        const obj = OBJECTS[objectName];
        const fl = FLUIDS[fluidName];

        simulationRef.current?.updateParameters({
            objectDensity: obj.density,
            fluidDensity: fl.density,
            size,
            objectColor: obj,
            fluidColor: fl.color,
            shape: obj.shape,
        });
    }, [objectName, fluidName, size]);

    return (
        <div className={styles.simulationContainer}>
            <div className={styles.canvasColumn}>
                <canvas ref={canvasRef} width={700} height={400} className={styles.canvas} />
            </div>

            <div className={styles.controlsColumn}>
                <div className={styles.infoText}>
                    <p>
                        <strong>Vztlaková sila a plávanie telies</strong><br/>
                        Vztlaková sila je sila, ktorá pôsobí na teleso ponorené do kvapaliny smerom nahor
                        a je spôsobená rozdielom tlaku v kvapaline.<br/><br/>

                        Podľa Archimedovho zákona je veľkosť vztlakovej sily rovná tiaži kvapaliny,
                        ktorú teleso vytlačí. Správanie telesa v kvapaline závisí najmä od pomeru jeho hustoty
                        k hustote okolitého prostredia.<br/><br/>

                        Teleso môže plávať, vznášať sa alebo klesať v závislosti od tohto pomeru,
                        pričom rovnováha nastáva vtedy, keď sa vztlaková sila vyrovná tiažovej sile.<br/><br/>

                        Simulácia znázorňuje interakciu medzi telesom a kvapalinou
                        a umožňuje pozorovať základné princípy plávania a pôsobenia vztlaku.
                    </p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.cardGroup}>
                        <p>Predmet:</p>
                        <div className={styles.cardContainer}>
                            {Object.entries(OBJECTS).map(([name, obj]) => (
                                <div
                                    key={name}
                                    className={`${styles.card} ${objectName === name ? styles.selected : ""}`}
                                    onClick={() => setObjectName(name)}
                                >
                                    <img src={obj.image} alt={name} />
                                    <span>{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.cardGroup}>
                        <p>Kvapalina:</p>
                        <div className={styles.cardContainer}>
                            {Object.entries(FLUIDS).map(([name, fluid]) => (
                                <div
                                    key={name}
                                    className={`${styles.card} ${fluidName === name ? styles.selected : ""}`}
                                    style={{ background: fluid.color }}
                                    onClick={() => setFluidName(name)}
                                >
                                    <span>{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <label>Veľkosť: {size}</label>
                        <input
                            type="range"
                            min="10"
                            max="80"
                            step="1"
                            value={size}
                            onChange={e => setSize(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}