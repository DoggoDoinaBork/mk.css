(function() {
    function initHeartAnimation() {
        if (!document || !document.body) {
            console.warn('DOM not ready, retrying in 100ms...');
            setTimeout(initHeartAnimation, 100);
            return;
        }

        class Heart {
            constructor(container, x, y) {
                this.container = container;
                this.element = document.createElement('div');
                this.element.className = 'heart';
                
                // Set initial styles
                this.element.style.cssText = `
                    position: fixed;
                    user-select: none;
                    z-index: 99999;
                    pointer-events: none;
                    transition: transform 0.1s linear;
                    font-size: 20px;
                    color: #ff69b4;
                    text-shadow: 0 0 5px rgba(255, 105, 180, 0.5);
                `;
                
                this.element.innerHTML = '❤';
                
                if (this.container && this.container.appendChild) {
                    this.container.appendChild(this.element);
                    this.reset(x, y);
                }
            }

            reset(x, y) {
                if (!this.element) return;
                
                // Start from click/touch position
                this.x = x;
                this.y = y;
                
                // Set random size
                const size = 15 + Math.random() * 20;
                this.element.style.fontSize = `${size}px`;
                
                // Set initial opacity
                this.opacity = 0.8;
                this.element.style.opacity = this.opacity;
                
                // Movement properties - create a burst effect
                this.speed = 3 + Math.random() * 4;
                this.angle = Math.random() * Math.PI * 2; // Random direction
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                
                // Add gravity effect
                this.gravity = 0.1;
                
                // Wobble properties
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.05 + Math.random() * 0.05;
                
                this.updatePosition();
            }

            updatePosition() {
                if (!this.element) return;
                const wobbleX = Math.sin(this.wobble) * 2;
                this.element.style.transform = `translate(${this.x + wobbleX}px, ${this.y}px)`;
            }

            move() {
                if (!this.element) return false;

                // Update position
                this.x += this.vx;
                this.y += this.vy;
                
                // Apply gravity
                this.vy += this.gravity;
                
                // Slow down horizontal movement
                this.vx *= 0.99;
                
                // Update wobble
                this.wobble += this.wobbleSpeed;
                
                // Fade out gradually
                this.opacity -= 0.01;
                this.element.style.opacity = Math.max(0, this.opacity);
                
                this.updatePosition();

                // Remove when faded out or out of bounds
                return (
                    this.opacity > 0 &&
                    this.x > -50 &&
                    this.x < window.innerWidth + 50 &&
                    this.y < window.innerHeight + 50
                );
            }
        }

        class HeartManager {
            constructor() {
                this.hearts = [];
                this.maxHearts = 100;
                this.setupContainer();
                
                if (this.container) {
                    this.setupEventListeners();
                    this.animate();
                }
            }

            setupContainer() {
                try {
                    if (!document.body) throw new Error('Document body not found');
                    
                    const existingContainer = document.getElementById('heart-container');
                    if (existingContainer) {
                        existingContainer.remove();
                    }

                    this.container = document.createElement('div');
                    this.container.id = 'heart-container';
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
                    console.error('Error setting up heart container:', error);
                    this.container = null;
                }
            }

            setupEventListeners() {
                // Mouse click handler
                document.addEventListener('click', (e) => {
                    this.createHeartBurst(e.clientX, e.clientY);
                });

                // Touch handler
                document.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.createHeartBurst(touch.clientX, touch.clientY);
                });
            }

            createHeartBurst(x, y) {
                // Create multiple hearts for a burst effect
                const burstCount = 8 + Math.floor(Math.random() * 5);
                for (let i = 0; i < burstCount; i++) {
                    if (this.hearts.length < this.maxHearts) {
                        this.hearts.push(new Heart(this.container, x, y));
                    }
                }
            }

            animate() {
                if (!this.container) return;

                // Update and filter out dead hearts
                this.hearts = this.hearts.filter(heart => {
                    const isAlive = heart.move();
                    if (!isAlive && this.container.contains(heart.element)) {
                        this.container.removeChild(heart.element);
                    }
                    return isAlive;
                });

                requestAnimationFrame(() => this.animate());
            }
        }

        return new HeartManager();
    }

    // Start when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeartAnimation);
    } else {
        initHeartAnimation();
    }
})();
