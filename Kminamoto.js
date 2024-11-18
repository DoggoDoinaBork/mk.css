class Snowflake {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'snowflake';
        this.element.style.cssText = `
            position: fixed;
            color: white;
            user-select: none;
            z-index: 1000;
            pointer-events: none;
            animation: fall linear;
        `;
        this.element.innerHTML = '❄';
        this.reset();
        this.container.appendChild(this.element);
    }

    reset() {
        const startX = Math.random() * window.innerWidth;
        const startY = -20;
        const duration = 3 + Math.random() * 4;
        const size = 10 + Math.random() * 20;

        this.element.style.left = startX + 'px';
        this.element.style.top = startY + 'px';
        this.element.style.fontSize = size + 'px';
        this.element.style.opacity = 0.5 + Math.random() * 0.5;
        this.element.style.animationDuration = duration + 's';
    }
}

class SnowfallManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(this.container);

        this.snowflakes = [];
        this.maxSnowflakes = 50;

        // Add falling animation to stylesheet
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(styleSheet);

        // Start the animation loop
        this.animate();
        this.cleanup();
    }

    animate() {
        if (this.snowflakes.length < this.maxSnowflakes) {
            const snowflake = new Snowflake(this.container);
            this.snowflakes.push(snowflake);
        }

        requestAnimationFrame(() => this.animate());
    }

    cleanup() {
        setInterval(() => {
            this.snowflakes = this.snowflakes.filter(snowflake => {
                const rect = snowflake.element.getBoundingClientRect();
                if (rect.top > window.innerHeight) {
                    this.container.removeChild(snowflake.element);
                    return false;
                }
                return true;
            });
        }, 1000);
    }
}

// Initialize the snowfall
const snowfall = new SnowfallManager();