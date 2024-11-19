window.addEventListener('load', function() {
    // Wait for a brief moment after load to ensure everything is ready
    setTimeout(() => {
        // Double check that document and body exist
        if (!document || !document.body) return;

        class Snowflake {
            constructor(container) {
                this.container = container;
                this.element = document.createElement('div');
                this.element.className = 'snowflake';
                
                this.colors = [
                    '#ffffff', // White
                    '#00fff2', // Light Blue
                    '#89CFF0', // Baby Blue
                    '#defcf9', // Ice Blue
                    '#9fb4ff', // Light Purple
                    '#ff9fb4', // Light Pink
                ];

                this.element.style.cssText = `
                    position: fixed;
                    user-select: none;
                    z-index: 99999;
                    pointer-events: none;
                    animation: fall linear;
                    transition: color 3s;
                `;
                this.element.innerHTML = '❄';
                this.reset();
                this.container.appendChild(this.element);
                
                this.changeColor();
            }

            changeColor() {
                const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.element.style.color = randomColor;
                setTimeout(() => this.changeColor(), 2000 + Math.random() * 2000);
            }

            reset() {
                const startX = Math.random() * window.innerWidth;
                const startY = -20;
                const duration = 3 + Math.random() * 4;
                const size = 10 + Math.random() * 20;
                const initialColor = this.colors[Math.floor(Math.random() * this.colors.length)];

                this.element.style.left = startX + 'px';
                this.element.style.top = startY + 'px';
                this.element.style.fontSize = size + 'px';
                this.element.style.opacity = 0.5 + Math.random() * 0.5;
                this.element.style.animationDuration = duration + 's';
                this.element.style.color = initialColor;
            }
        }

        class SnowfallManager {
            constructor() {
                // Create and append the container first
                this.setupContainer();
                
                if (this.container) {
                    this.snowflakes = [];
                    this.maxSnowflakes = 50;
                    this.isSnowing = false;
                    this.lastScrollPosition = window.scrollY;
                    this.scrollThreshold = 50;

                    this.setupStyles();
                    this.setupScrollListener();
                    this.cleanup();
                }
            }

            setupContainer() {
                try {
                    this.container = document.createElement('div');
                    this.container.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        pointer-events: none;
                        z-index: 99999;
                    `;
                    
                    if (document.body) {
                        document.body.appendChild(this.container);
                    }
                } catch (error) {
                    console.log('Error setting up snow container:', error);
                    this.container = null;
                }
            }

            setupStyles() {
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
            }

            setupScrollListener() {
                let scrollTimeout;
                window.addEventListener('scroll', () => {
                    const currentScroll = window.scrollY;
                    const scrollDifference = Math.abs(currentScroll - this.lastScrollPosition);

                    if (scrollDifference > this.scrollThreshold) {
                        this.startSnowing();
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => this.stopSnowing(), 1000);
                        this.lastScrollPosition = currentScroll;
                    }
                });
            }

            startSnowing() {
                if (!this.isSnowing && this.container) {
                    this.isSnowing = true;
                    this.animate();
                }
            }

            stopSnowing() {
                this.isSnowing = false;
            }

            animate() {
                if (!this.isSnowing || !this.container) return;

                if (this.snowflakes.length < this.maxSnowflakes) {
                    const snowflake = new Snowflake(this.container);
                    this.snowflakes.push(snowflake);
                }

                requestAnimationFrame(() => this.animate());
            }

            cleanup() {
                setInterval(() => {
                    if (!this.container) return;
                    
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

        // Initialize with a slight delay to ensure DOM is fully ready
        setTimeout(() => {
            if (document.body) {
                new SnowfallManager();
            }
        }, 100);
        
    }, 100);
});
