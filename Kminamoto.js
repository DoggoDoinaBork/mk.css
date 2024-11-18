// Wait for window to load
window.onload = function() {
    // Check if we're on the right page that has the elements we need
    if (!document.body) return;

    class Snowflake {
        constructor(container) {
            if (!container) return;
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
            // Check if we can create the container
            try {
                this.container = document.createElement('div');
                if (!this.container) return;
                
                this.container.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                // Only append if body exists
                if (document.body) {
                    document.body.appendChild(this.container);
                } else {
                    console.log('Body not found, waiting for DOM...');
                    return;
                }

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
            } catch (error) {
                console.log('Error initializing snowfall:', error);
            }
        }

        animate() {
            if (!this.container) return;
            
            if (this.snowflakes.length < this.maxSnowflakes) {
                const snowflake = new Snowflake(this.container);
                if (snowflake.element) {
                    this.snowflakes.push(snowflake);
                }
            }

            requestAnimationFrame(() => this.animate());
        }

        cleanup() {
            if (!this.container) return;
            
            setInterval(() => {
                this.snowflakes = this.snowflakes.filter(snowflake => {
                    if (!snowflake.element) return false;
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

    // Try to initialize with retry mechanism
    let retryCount = 0;
    const maxRetries = 5;

    function initSnowfall() {
        if (document.body) {
            const snowfall = new SnowfallManager();
        } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initSnowfall, 100);
        }
    }

    initSnowfall();
};
