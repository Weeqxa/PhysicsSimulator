import { useEffect } from "react";

export function useSliderFill() {

    const updateSlider = (el) => {
        const min = Number(el.min || 0);
        const max = Number(el.max || 100);
        const val = Number(el.value);

        const percent = ((val - min) / (max - min)) * 100;

        el.style.background = `linear-gradient(to right,
            var(--color-accent) 0%,
            var(--color-accent) ${percent}%,
            var(--color-border) ${percent}%,
            var(--color-border) 100%)`;
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll("input[type=range]")
                .forEach(updateSlider);
        });
    }, []);

    return updateSlider;
}