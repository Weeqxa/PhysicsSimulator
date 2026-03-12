import { useRef, useEffect, useState } from "react";
import Buoyancy from "./Buoyancy";
import styles from "../../styles/Buoyancy.module.css";

import woodImg from "../../assets/objects/wood.jpg";
import stoneImg from "../../assets/objects/stone.jpg";
import balloonImg from "../../assets/objects/balloon.jpg";

const OBJECTS = {
    wood: { density: 0.6, shape: "wood", image: woodImg },
    stone: { density: 2.5, shape: "stone", image: stoneImg },
    balloon: { density: 0.2, shape: "circle", image: balloonImg },
};

const FLUIDS = {
    water: { density: 1, color: "rgba(0,150,255,0.5)" },
    oil: { density: 0.8, color: "rgba(255,200,0,0.5)" },
    mercury: { density: 13.6, color: "rgba(180,180,180,0.7)" },
    gasoline: { density: 0.7, color: "rgba(255,100,50,0.5)" },
};

export default function BuoyancySimulation() {
    const canvasRef = useRef(null);
    const simulationRef = useRef(null);

    const [objectName, setObjectName] = useState("wood");
    const [fluidName, setFluidName] = useState("water");
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
            objectColor: obj, // передаємо об'єкт з image
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
                        Інтерактивна симуляція <strong>плавання (Витік)</strong>!<br/>
                        Виберіть предмет та рідину, щоб побачити, як різні об’єкти плавають у різних рідинах.<br/>
                        Розмір предмета можна змінювати.
                    </p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.row}>
                        <label>Предмет:</label>
                        <select value={objectName} onChange={e => setObjectName(e.target.value)}>
                            {Object.keys(OBJECTS).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <label>Рідина:</label>
                        <select value={fluidName} onChange={e => setFluidName(e.target.value)}>
                            {Object.keys(FLUIDS).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <label>Розмір: {size}</label>
                        <input
                            type="range"
                            min="10"
                            max="80"
                            step="1"
                            value={size}
                            onChange={e => setSize(Number(e.target.value))}
                        />
                    </div>

                    <div className={styles.buttons}>
                        <button className="btn" onClick={() => simulationRef.current?.pause()}>Поставити на паузу</button>
                        <button className="btn" onClick={() => simulationRef.current?.resume()}>Продовжити</button>
                    </div>
                </div>
            </div>
        </div>
    );
}