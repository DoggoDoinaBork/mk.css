(function() {
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

                this.element.style.cssText = `
                    position: fixed;
                    user-select: none;
                    z-index: 99999;
                    pointer-events: none;
                    transition: transform 0.1s linear;
                `;
                this.element.innerHTML = '❄';
                
                if (this.container && this.container.appendChild) {
                    this.container.appendChild(this.element);
                    this.reset();
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
                
                // Initialize position and movement properties
                this.x = Math.random() * window.innerWidth;
                this.y = -20;
                const size = 10 + Math.random() * 20;
                
                // Set initial styles
                this.element.style.fontSize = `${size}px`;
                this.element.style.opacity = (0.5 + Math.random() * 0.5).toString();
                
                // Movement parameters
                this.wobbleSpeed = 0.02 + Math.random() * 0.08;
                this.wobbleRange = Math.random() * 2 - 1;
                this.fallSpeed = 2 + Math.random() * 3;
                this.wobblePos = Math.random() * Math.PI * 2;
                
                // Apply initial position
                this.updatePosition();
            }

            updatePosition() {
                if (!this.element) return;
                this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            }

            move(isScrolling) {
                if (!this.element) return false;

                if (isScrolling) {
                    // Update vertical position
                    this.y += this.fallSpeed;
                    
                    // Update horizontal wobble
                    this.wobblePos += this.wobbleSpeed;
                    this.x += Math.sin(this.wobblePos) * this.wobbleRange;
                    
                    // Apply new position
                    this.updatePosition();
                }

                // Check if snowflake is still in view
                return this.y <= window.innerHeight;
            }
        }

        class SnowfallManager {
            constructor() {
                this.snowflakes = [];
                this.maxSnowflakes = 50;
                this.isScrolling = false;
                this.scrollTimeout = null;
                
                this.setupContainer();
                
                if (this.container) {
                    this.setupScrollListener();
                    this.startSnowfall();
                }
            }

            setupContainer() {
                try {
                    if (!document.body) throw new Error('Document body not found');
                    
                    // Remove existing container if present
                    const existingContainer = document.getElementById('snowfall-container');
                    if (existingContainer) {
                        existingContainer.remove();
                    }

                    // Create new container
                    this.container = document.createElement('div');
                    this.container.id = 'snowfall-container';
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

            setupScrollListener() {
                window.addEventListener('scroll', () => {
                    // Clear existing timeout
                    if (this.scrollTimeout) {
                        clearTimeout(this.scrollTimeout);
                    }
                    
                    // Set scrolling state to true
                    this.isScrolling = true;
                    
                    // Set timeout to stop scrolling state
                    this.scrollTimeout = setTimeout(() => {
                        this.isScrolling = false;
                    }, 50);
                }, { passive: true });

                // Handle window resize
                window.addEventListener('resize', () => {
                    this.maxSnowflakes = Math.floor((window.innerWidth * window.innerHeight) / 20000);
                });
            }

            startSnowfall() {
                // Initial population of snowflakes
                this.addNewSnowflakes();
                
                // Start the animation loop
                this.animate();
            }

            addNewSnowflakes() {
                const numToAdd = this.maxSnowflakes - this.snowflakes.length;
                for (let i = 0; i < numToAdd; i++) {
                    this.snowflakes.push(new Snowflake(this.container));
                }
            }

            animate() {
                if (!this.container) return;

                // Update existing snowflakes
                this.snowflakes = this.snowflakes.filter(snowflake => {
                    const isVisible = snowflake.move(this.isScrolling);
                    if (!isVisible) {
                        if (this.container.contains(snowflake.element)) {
                            this.container.removeChild(snowflake.element);
                        }
                        return false;
                    }
                    return true;
                });

                // Add new snowflakes if needed
                if (this.snowflakes.length < this.maxSnowflakes) {
                    this.addNewSnowflakes();
                }

                // Continue animation loop
                requestAnimationFrame(() => this.animate());
            }
        }

        return new SnowfallManager();
    }

    // Start the initialization process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowfall);
    } else {
        initSnowfall();
    }
})();
