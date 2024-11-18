<script>
document.addEventListener("DOMContentLoaded", function () {
    let snowContainer = document.createElement("div");
    snowContainer.style.position = "fixed";
    snowContainer.style.top = "0";
    snowContainer.style.left = "0";
    snowContainer.style.width = "100%";
    snowContainer.style.height = "100%";
    snowContainer.style.pointerEvents = "none";
    snowContainer.style.zIndex = "1000";
    document.body.appendChild(snowContainer);

    let isScrolling = false;
    let snowflakeInterval;

    // Function to create a snowflake
    function createSnowflake() {
        if (!isScrolling) return;

        let snowflake = document.createElement("div");
        snowflake.innerHTML = "❄️";
        snowflake.style.position = "absolute";
        snowflake.style.fontSize = Math.random() * 15 + 10 + "px"; // Smaller snowflakes
        snowflake.style.color = "rgba(255, 255, 255, 0.8)";
        snowflake.style.left = Math.random() * window.innerWidth + "px";
        snowflake.style.animation = `fall ${Math.random() * 5 + 5}s linear infinite`;
        snowContainer.appendChild(snowflake);

        setTimeout(() => snowflake.remove(), 10000); // Remove snowflake after 10s
    }

    // Function to start snowflakes on scroll
    function startSnowflakes() {
        if (!snowflakeInterval) {
            snowflakeInterval = setInterval(createSnowflake, 500); // Spawn less frequently
        }
    }

    // Function to stop snowflakes
    function stopSnowflakes() {
        clearInterval(snowflakeInterval);
        snowflakeInterval = null;
    }

    // Scroll listener
    window.addEventListener("scroll", function () {
        isScrolling = true;
        startSnowflakes();

        // Stop snowflakes if no scroll activity after 500ms
        clearTimeout(snowContainer.dataset.stopTimeout);
        snowContainer.dataset.stopTimeout = setTimeout(() => {
            isScrolling = false;
            stopSnowflakes();
        }, 500); // 500ms delay to detect scroll stop
    });

    // Add keyframe animation
    let style = document.createElement("style");
    style.innerHTML = `
        @keyframes fall {
            from { transform: translateY(-50px); }
            to { transform: translateY(${window.innerHeight}px); }
        }
    `;
    document.head.appendChild(style);
});
</script>