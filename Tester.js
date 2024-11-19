(function() {
    function initSnowfall() {
        if (!document || !document.body) {
            console.warn('DOM not ready, retrying in 100ms...');
            setTimeout(initSnowfall, 100);
            return;
        }

        class Snowflake {
            constructor(container, startX) {
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
                    transition: color 3s;
                `;
                this.element.innerHTML = '❄';
                this.reset(startX);
                
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

            reset(startX = null) {
                if (!this.element) return;
                
                // Use provided startX or generate random
                const x = startX !== null ? startX : Math.random() * (window.innerWidth || document.documentElement.clientWidth);
                const y = -20;
                const size = 10 + Math.random() * 20;
                const initialColor = this.colors[Math.floor(Math.random() * this.colors.length)];

                this.element.style.left = `${x}px`;
                this.element.style.top = `${y}px`;
                this.element.style.fontSize = `${size}px`;
                this.element.style.opacity = (0.5 + Math.random() * 0.5).toString();
                this.element.style.color = initialColor;
                
                // Set initial position properties
                this.currentY = y;
                this.speed = 2 + Math.random() * 3; // pixels per frame
                this.wobble = Math.random() * 2 - 1; // Left/right movement
                this.wobbleSpeed = 0.02 + Math.random() * 0.08; // How fast it moves left/right
                this.wobblePos = Math.random() * Math.PI * 2; // Starting position in the wobble
            }

            update() {
                if (!this.element) return false;

                // Update position
                this.currentY += this.speed;
                this.wobblePos += this.wobbleSpeed;
                const newX = parseFloat(this.element.style.left) + Math.sin(this.wobblePos) * this.wobble;
                
                // Update element position
                this.element.style.transform = `translate(${Math.sin(this.wobblePos) * this.wobble}px, ${this.currentY}px)`;

                // Check if snowflake is still within viewport
                const rect = this.element.getBoundingClientRect();
                return rect.top <= window.innerHeight;
            }
        }

        class SnowfallManager {
            constructor() {
                this.snowflakes = [];
                this.maxSnowflakes = 50;
                this.isSnowing = false;
                this.lastScrollY = window.scrollY;
                this.scrollVelocity = 0;
                this.lastScrollTime = Date.now();
                
                // Setup container first
                this.setupContainer();
                
                if (this.container) {
                    this.setupScrollListener();
                    this.animate();
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

            setupScrollListener() {
                let scrollTimeout;
                
                const handleScroll = () => {
                    const currentTime = Date.now();
                    const currentScrollY = window.scrollY;
                    const timeDiff = currentTime - this.lastScrollTime;
                    
                    if (timeDiff > 0) {
                        // Calculate scroll velocity (pixels per millisecond)
                        this.scrollVelocity = Math.abs(currentScrollY - this.lastScrollY) / timeDiff;
                        
                        // Add snowflakes based on scroll velocity
                        const flakesToAdd = Math.min(5, Math.floor(this.scrollVelocity * 50));
                        
                        // Add snowflakes across the viewport width
                        for (let i = 0; i < flakesToAdd; i++) {
                            const startX = Math.random() * window.innerWidth;
                            if (this.snowflakes.length < this.maxSnowflakes) {
                                this.snowflakes.push(new Snowflake(this.container, startX));
                            }
                        }
                    }
                    
                    this.lastScrollY = currentScrollY;
                    this.lastScrollTime = currentTime;
                    
                    // Clear previous timeout
                    clearTimeout(scrollTimeout);
                    // Gradually reduce scroll velocity
                    scrollTimeout = setTimeout(() => {
                        this.scrollVelocity = 0;
                    }, 150);
                };

                // Remove existing listener before adding new one
                window.removeEventListener('scroll', handleScroll);
                window.addEventListener('scroll', handleScroll);
                
                // Add resize handler
                window.addEventListener('resize', () => {
                    this.maxSnowflakes = Math.floor((window.innerWidth * window.innerHeight) / 20000);
                });
            }

            animate() {
                if (!this.container) return;

                // Update existing snowflakes
                this.snowflakes = this.snowflakes.filter(snowflake => {
                    const isVisible = snowflake.update();
                    if (!isVisible) {
                        this.container.removeChild(snowflake.element);
                    }
                    return isVisible;
                });

                // Request next frame
                requestAnimationFrame(() => this.animate());
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
