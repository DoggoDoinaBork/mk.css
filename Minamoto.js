(function() {
    function initFireworks() {
        if (!document || !document.body) {
            console.warn('DOM not ready, retrying in 100ms...');
            setTimeout(initFireworks, 100);
            return;
        }

        class Spark {
            constructor(container, x, y) {
                this.container = container;
                this.element = document.createElement('div');
                this.element.className = 'spark';
                
                this.colors = [
                    '#ff0000', // Red
                    '#ffa500', // Orange
                    '#ffff00', // Yellow
                    '#00ff00', // Green
                    '#00ffff', // Cyan
                    '#ff00ff', // Magenta
                    '#ff69b4', // Pink
                    '#daa520'  // Golden
                ];

                this.element.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    user-select: none;
                    z-index: 99999;
                    pointer-events: none;
                    transition: transform 0.02s linear;
                `;
                
                if (this.container && this.container.appendChild) {
                    this.container.appendChild(this.element);
                    this.reset(x, y);
                }
            }

            reset(x, y) {
                if (!this.element) return;
                
                // Position
                this.x = x;
                this.y = y;
                
                // Random velocity in all directions
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 6;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                // Physics properties
                this.gravity = 0.12;
                this.life = 1;
                this.decay = 0.015 + Math.random() * 0.015;
                
                // Visual properties
                const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.element.style.backgroundColor = randomColor;
                this.element.style.opacity = this.life;
                
                this.updatePosition();
            }

            updatePosition() {
                if (!this.element) return;
                this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
            }

            move() {
                if (!this.element) return false;

                // Update life
                this.life -= this.decay;
                if (this.life <= 0) return false;

                // Apply physics
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;

                // Update visual properties
                this.element.style.opacity = this.life;
                this.updatePosition();

                return true;
            }
        }

        class FireworksManager {
            constructor() {
                this.sparks = [];
                this.maxSparks = 500;
                this.sparkCount = 50; // Sparks per explosion
                
                this.setupContainer();
                
                if (this.container) {
                    this.setupEventListeners();
                    this.startAutoLaunch();
                    this.animate();
                }
            }

            setupContainer() {
                try {
                    if (!document.body) throw new Error('Document body not found');
                    
                    const existingContainer = document.getElementById('fireworks-container');
                    if (existingContainer) {
                        existingContainer.remove();
                    }

                    this.container = document.createElement('div');
                    this.container.id = 'fireworks-container';
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
                    console.error('Error setting up fireworks container:', error);
                    this.container = null;
                }
            }

            setupEventListeners() {
                document.addEventListener('click', (e) => {
                    this.createExplosion(e.clientX, e.clientY);
                });

                document.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.createExplosion(touch.clientX, touch.clientY);
                });
            }

            startAutoLaunch() {
                setInterval(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * (window.innerHeight * 0.7);
                    this.createExplosion(x, y);
                }, 2000);
            }

            createExplosion(x, y) {
                // Only create new sparks if we're under the limit
                if (this.sparks.length < this.maxSparks) {
                    const sparkCount = Math.min(
                        this.sparkCount,
                        this.maxSparks - this.sparks.length
                    );
                    
                    for (let i = 0; i < sparkCount; i++) {
                        this.sparks.push(new Spark(this.container, x, y));
                    }
                }
            }

            animate() {
                if (!this.container) return;

                this.sparks = this.sparks.filter(spark => {
                    const isAlive = spark.move();
                    if (!isAlive && this.container.contains(spark.element)) {
                        this.container.removeChild(spark.element);
                    }
                    return isAlive;
                });

                requestAnimationFrame(() => this.animate());
            }
        }

        return new FireworksManager();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFireworks);
    } else {
        initFireworks();
    }
})();
