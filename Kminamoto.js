(function() {
    function init() {
        if (!document || !document.body) {
            setTimeout(init, 100);
            return;
        }

        class Snowflake {
            constructor(container) {
                this.container = container;
                this.element = document.createElement('div');
                this.element.className = 'snowflake';
                this.element.style.cssText = `
                    position: fixed;
                    color: white;
                    user-select: none;
                    z-index: 99999;
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
                const container = document.createElement('div');
                container.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    z-index: 99999;
                `;
                
                if (document.body) {
                    document.body.insertAdjacentElement('beforeend', container);
                    this.container = container;
                    this.snowflakes = [];
                    this.maxSnowflakes = 50;
                    this.isSnowing = false;
                    this.lastScrollPosition = window.scrollY;
                    this.scrollThreshold = 50; // Minimum scroll distance to trigger snow

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

                    this.setupScrollListener();
                    this.cleanup();
                }
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
                if (!this.isSnowing) {
                    this.isSnowing = true;
                    this.animate();
                }
            }

            stopSnowing() {
                this.isSnowing = false;
            }

            animate() {
                if (!this.isSnowing) return;

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

        new SnowfallManager();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
