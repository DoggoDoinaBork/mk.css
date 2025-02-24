(function() {
    function initSakuraAnimation() {
        if (!document || !document.body) {
            console.warn('DOM not ready, retrying in 100ms...');
            setTimeout(initSakuraAnimation, 100);
            return;
        }

        class SakuraPetal {
            constructor(container, x, y) {
                this.container = container;
                this.element = document.createElement('div');
                this.element.className = 'sakura-petal';
                
                // Sakura colors
                this.colors = [
                    '#ffd7e8', // Light pink
                    '#ffcce0', // Pale pink
                    '#ffc0d9', // Medium pink
                    '#ffb3d0', // Darker pink
                    '#ffe0ef', // Very light pink
                    '#fff0f7'  // Almost white pink
                ];
                
                // Set initial styles
                this.element.style.cssText = `
                    position: fixed;
                    user-select: none;
                    z-index: 99999;
                    pointer-events: none;
                    transition: transform 0.1s linear;
                    font-size: 20px;
                    filter: drop-shadow(0 0 2px rgba(255, 200, 200, 0.5));
                `;
                
                // Use flower emoji as sakura
                this.element.innerHTML = '🌸';
                
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
                const size = 10 + Math.random() * 20;
                this.element.style.fontSize = `${size}px`;
                
                // Set initial opacity
                this.opacity = 0.8 + Math.random() * 0.2;
                this.element.style.opacity = this.opacity;
                
                // Movement properties - create a gentle falling effect
                this.speed = 1 + Math.random() * 2;
                this.angle = Math.random() * Math.PI * 2; // Random initial direction
                this.vx = Math.cos(this.angle) * this.speed;
                this.vy = Math.sin(this.angle) * this.speed;
                
                // Add light gravity effect
                this.gravity = 0.05;
                
                // Add rotation
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() * 4) - 2;
                
                // Wobble properties for floating effect
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.02 + Math.random() * 0.04;
                this.wobbleSize = 0.5 + Math.random() * 2;
                
                // Update visuals
                this.updatePosition();
                this.updateColor();
            }

            updateColor() {
                if (!this.element) return;
                const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.element.style.color = randomColor;
            }

            updatePosition() {
                if (!this.element) return;
                const wobbleX = Math.sin(this.wobble) * this.wobbleSize;
                this.element.style.transform = `translate(${this.x + wobbleX}px, ${this.y}px) rotate(${this.rotation}deg)`;
            }

            move() {
                if (!this.element) return false;

                // Update position
                this.x += this.vx;
                this.y += this.vy;
                
                // Apply gentle gravity
                this.vy += this.gravity;
                
                // Add resistance/drag
                this.vx *= 0.99;
                this.vy *= 0.99;
                
                // Update wobble and rotation
                this.wobble += this.wobbleSpeed;
                this.rotation += this.rotationSpeed;
                
                // Fade out gradually
                this.opacity -= 0.005;
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

        class SakuraManager {
            constructor() {
                this.petals = [];
                this.maxPetals = 100;
                this.setupContainer();
                
                if (this.container) {
                    this.setupEventListeners();
                    this.animate();
                }
            }

            setupContainer() {
                try {
                    if (!document.body) throw new Error('Document body not found');
                    
                    const existingContainer = document.getElementById('sakura-container');
                    if (existingContainer) {
                        existingContainer.remove();
                    }

                    this.container = document.createElement('div');
                    this.container.id = 'sakura-container';
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
                    console.error('Error setting up sakura container:', error);
                    this.container = null;
                }
            }

            setupEventListeners() {
                // Mouse click handler
                document.addEventListener('click', (e) => {
                    this.createSakuraBurst(e.clientX, e.clientY);
                });

                // Touch handler
                document.addEventListener('touchstart', (e) => {
                    const touch = e.touches[0];
                    this.createSakuraBurst(touch.clientX, touch.clientY);
                });

                // Mousemove for gentle trailing effect (less frequent)
                let lastMoveTime = 0;
                document.addEventListener('mousemove', (e) => {
                    const now = Date.now();
                    if (now - lastMoveTime > 150) { // Limit to prevent too many petals
                        this.createSakuraSingle(e.clientX, e.clientY);
                        lastMoveTime = now;
                    }
                });
            }

            createSakuraBurst(x, y) {
                // Create multiple petals for a burst effect
                const burstCount = 10 + Math.floor(Math.random() * 10);
                for (let i = 0; i < burstCount; i++) {
                    if (this.petals.length < this.maxPetals) {
                        this.petals.push(new SakuraPetal(this.container, x, y));
                    }
                }
            }

            createSakuraSingle(x, y) {
                // Create a single petal on mouse move
                if (this.petals.length < this.maxPetals) {
                    this.petals.push(new SakuraPetal(this.container, x, y));
                }
            }

            animate() {
                if (!this.container) return;

                // Update and filter out dead petals
                this.petals = this.petals.filter(petal => {
                    const isAlive = petal.move();
                    if (!isAlive && this.container.contains(petal.element)) {
                        this.container.removeChild(petal.element);
                    }
                    return isAlive;
                });

                requestAnimationFrame(() => this.animate());
            }
        }

        return new SakuraManager();
    }

    // Start when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSakuraAnimation);
    } else {
        initSakuraAnimation();
    }
})();
