<!DOCTYPE html>
<html>
<head>
    <title>Fireworks Animation</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            background: #000;
            overflow: hidden;
            cursor: pointer;
        }
        .content {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: Arial, sans-serif;
            text-align: center;
            pointer-events: none;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>✨ Click Anywhere for Fireworks! ✨</h1>
    </div>

    <script>
    (function() {
        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.element = document.createElement('div');
                this.element.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${color};
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(${x}px, ${y}px);
                    transition: transform 0.02s linear;
                `;
                
                // Random velocity in all directions
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 6;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                // Gravity and fade effects
                this.gravity = 0.12;
                this.life = 1;
                this.decay = 0.015 + Math.random() * 0.015;
            }

            update() {
                this.life -= this.decay;
                if (this.life <= 0) return false;

                // Apply gravity and velocity
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;

                // Update position and opacity
                this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
                this.element.style.opacity = this.life;

                return true;
            }
        }

        class Firework {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.particles = [];
                this.container = document.createElement('div');
                this.container.style.position = 'fixed';
                this.container.style.zIndex = '1000';
                document.body.appendChild(this.container);
                
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

                this.explode();
            }

            explode() {
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                const particleCount = 50 + Math.floor(Math.random() * 30);

                for (let i = 0; i < particleCount; i++) {
                    const particle = new Particle(this.x, this.y, color);
                    this.container.appendChild(particle.element);
                    this.particles.push(particle);
                }
            }

            update() {
                this.particles = this.particles.filter(particle => {
                    const alive = particle.update();
                    if (!alive) {
                        this.container.removeChild(particle.element);
                    }
                    return alive;
                });

                if (this.particles.length === 0) {
                    document.body.removeChild(this.container);
                    return false;
                }
                return true;
            }
        }

        class FireworksManager {
            constructor() {
                this.fireworks = [];
                this.isAnimating = false;
                this.setupEventListeners();
                this.autoLaunchInterval = null;
                this.startAutoLaunch();
            }

            setupEventListeners() {
                document.addEventListener('click', (e) => {
                    this.createFirework(e.clientX, e.clientY);
                });

                document.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.createFirework(touch.clientX, touch.clientY);
                });
            }

            createFirework(x, y) {
                const firework = new Firework(x, y);
                this.fireworks.push(firework);
                
                if (!this.isAnimating) {
                    this.isAnimating = true;
                    this.animate();
                }
            }

            startAutoLaunch() {
                this.autoLaunchInterval = setInterval(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * (window.innerHeight * 0.7);
                    this.createFirework(x, y);
                }, 2000);
            }

            animate() {
                this.fireworks = this.fireworks.filter(firework => firework.update());

                if (this.fireworks.length > 0) {
                    requestAnimationFrame(() => this.animate());
                } else {
                    this.isAnimating = false;
                }
            }
        }

        // Initialize when the DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new FireworksManager());
        } else {
            new FireworksManager();
        }
    })();
    </script>
</body>
</html>
