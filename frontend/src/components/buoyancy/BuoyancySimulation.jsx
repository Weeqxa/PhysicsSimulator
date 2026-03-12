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
                        Interaktívna simulácia <strong>plávania a vztlaku</strong>!<br/>
                        Pozorujte, ako rôzne predmety reagujú na <strong>vztlakovú silu</strong> vo vode alebo iných kvapalinách.<br/><br/>
                        <strong>Predmet</strong> — vyberte objekt, ktorý chcete sledovať (napr. drevo, kameň, balón).<br/>
                        <strong>Hustota predmetu</strong> — určuje, či predmet klesá alebo pláva; vyššia hustota znamená, že predmet je ťažší a klesá rýchlejšie.<br/>
                        <strong>Hustota kvapaliny</strong> — vplýva na vztlak; hustejšia kvapalina poskytuje väčší vztlak a predmet ľahšie pláva.<br/>
                        <strong>Veľkosť</strong> — určuje rozmery predmetu; väčší predmet má väčší objem a viac vztlaku.<br/>
                        <strong>Farba a tvar predmetu</strong> — vizuálna reprezentácia objektu; môže byť kruh, drevo alebo kameň.<br/>
                        <strong>Farba kvapaliny</strong> — vizuálna reprezentácia kvapaliny (voda, olej, ortuť, benzín).<br/><br/>
                        Simulácia zohľadňuje <strong>gravitáciu, vztlakovú silu a odrazy od stien</strong>.<br/>
                        Predmety môžu plávať, klesať alebo sa kývať podľa rozdielu hustoty medzi objektom a kvapalinou.
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