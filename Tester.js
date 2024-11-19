(function() {
    // Create a function that ensures the DOM is fully loaded
    function initSnowfall() {
        if (!document || !document.body) {
            console.warn('DOM not ready, retrying in 100ms...');
            setTimeout(initSnowfall, 100);
            return;
        }

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
                    '#ff9fb4'  // Light Pink
                ];

                // Set initial styles
                this.element.style.cssText = `
                    position: fixed;
                    user-select: none;
                    z-index: 99999;
                    pointer-events: none;
                    animation: snowfall linear;
                    transition: color 3s;
                `;
                this.element.innerHTML = '❄';
                this.reset();
                
                // Only append if container exists
                if (this.container && this.container.appendChild) {
                    this.container.appendChild(this.element);
                    this.changeColor();
                }
            }

            changeColor() {
                if (!this.element) return;
                const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.element.style.color = randomColor;
                setTimeout(() => this.changeColor(), 2000 + Math.random() * 2000);
            }

            reset() {
                if (!this.element) return;
                const startX = Math.random() * (window.innerWidth || document.documentElement.clientWidth);
                const startY = -20;
                const duration = 3 + Math.random() * 4;
                const size = 10 + Math.random() * 20;
                const initialColor = this.colors[Math.floor(Math.random() * this.colors.length)];

                this.element.style.left = `${startX}px`;
                this.element.style.top = `${startY}px`;
                this.element.style.fontSize = `${size}px`;
                this.element.style.opacity = (0.5 + Math.random() * 0.5).toString();
                this.element.style.animationDuration = `${duration}s`;
                this.element.style.color = initialColor;
            }
        }

        class SnowfallManager {
            constructor() {
                this.snowflakes = [];
                this.maxSnowflakes = 50;
                this.isSnowing = false;
                this.lastScrollPosition = window.scrollY;
                this.scrollThreshold = 50;

                // Setup container first
                this.setupContainer();
                
                if (this.container) {
                    this.setupStyles();
                    this.setupScrollListener();
                    this.cleanup();
                }
            }

            setupContainer() {
                try {
                    if (!document.body) throw new Error('Document body not found');
                    
                    this.container = document.createElement('div');
                    this.container.id = 'snowfall-container';
                    
                    // Check if container already exists
                    const existingContainer = document.getElementById('snowfall-container');
                    if (existingContainer) {
                        existingContainer.remove();
                    }

                    this.container.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        pointer-events: none;
                        z-index: 99999;
                    `;
                    
                    document.body.appendChild(this.container);
                } catch (error) {
                    console.error('Error setting up snow container:', error);
                    this.container = null;
                }
            }

            setupStyles() {
                try {
                    const styleId = 'snowfall-styles';
                    let styleSheet = document.getElementById(styleId);
                    
                    if (styleSheet) {
                        styleSheet.remove();
                    }

                    styleSheet = document.createElement('style');
                    styleSheet.id = styleId;
                    styleSheet.textContent = `
                        @keyframes snowfall {
                            0% {
                                transform: translateY(0) rotate(0deg);
                            }
                            100% {
                                transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
                            }
                        }
                    `;
                    document.head.appendChild(styleSheet);
                } catch (error) {
                    console.error('Error setting up styles:', error);
                }
            }

            setupScrollListener() {
                let scrollTimeout;
                const handleScroll = () => {
                    const currentScroll = window.scrollY;
                    const scrollDifference = Math.abs(currentScroll - this.lastScrollPosition);

                    if (scrollDifference > this.scrollThreshold) {
                        this.startSnowing();
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => this.stopSnowing(), 1000);
                        this.lastScrollPosition = currentScroll;
                    }
                };

                window.removeEventListener('scroll', handleScroll);
                window.addEventListener('scroll', handleScroll);
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
                        if (!snowflake.element) return false;
                        
                        const rect = snowflake.element.getBoundingClientRect();
                        if (rect.top > window.innerHeight) {
                            try {
                                this.container.removeChild(snowflake.element);
                            } catch (error) {
                                console.error('Error removing snowflake:', error);
                            }
                            return false;
                        }
                        return true;
                    });
                }, 1000);
            }
        }

        // Initialize the SnowfallManager
        return new SnowfallManager();
    }

    // Start the initialization process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowfall);
    } else {
        initSnowfall();
    }
})();