function createHeartTrail(colors) {
    document.addEventListener("mousemove", (event) => {
        const heart = document.createElement("div");

        heart.style.position = "absolute";
        heart.style.left = `${event.pageX}px`;
        heart.style.top = `${event.pageY}px`;
        heart.style.width = "15px";
        heart.style.height = "15px";
        heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        heart.className = "heart";
        heart.style.opacity = "1";
        heart.style.pointerEvents = "none";

        document.body.appendChild(heart);


        let size = 15;
        let opacity = 1;
        const animation = setInterval(() => {
            size += 1; 
            opacity -= 0.05; 
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.opacity = `${opacity}`;
            heart.style.top = `${event.pageY - size}px`;

            if (opacity <= 0) {
                clearInterval(animation);
                heart.remove(); 
            }
        }, 50); 
    });
}


document.getElementById("color-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const hexCode = document.getElementById("hex-code").value;
    const paletteDiv = document.getElementById("palette");

    paletteDiv.innerHTML = "";
    paletteDiv.style.display = "flex";
    paletteDiv.style.justifyContent = "center";
    paletteDiv.style.gap = "10px;"
    
    const hsl = hexToHSL(hexCode);

    const complementaryHues = [0, 180, 60, 240];
    const colors = [];

    complementaryHues.forEach((hueShift) => {
        const newColor = `hsl(${(hsl.h + hueShift) % 360}, ${hsl.s}%, ${hsl.l}%)`;
        colors.push(newColor);

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.alignItems = "center";
        container.style.margin = "10px";

        const colorBox = document.createElement("div");
        colorBox.style.width = "100px";
        colorBox.style.height = "100px";
        colorBox.style.backgroundColor = newColor;
        colorBox.style.display = "flex";
        colorBox.style.flexDirection = "row";
        colorBox.style.borderRadius = "5px";

        const hexCodeText = document.createElement("p");
        hexCodeText.textContent = hslToHex(hsl.h + hueShift, hsl.s, hsl.l);
        hexCodeText.style.color = "#fff";
        hexCodeText.style.fontFamily = "'Inconsolata', sans-serif";
        hexCodeText.style.fontSize = "12px";
        hexCodeText.style.marginTop = "5px";
        hexCodeText.style.textAlign = "center";

        container.appendChild(colorBox);
        container.appendChild(hexCodeText);
        paletteDiv.appendChild(container);

        createHeartTrail(colors);
    });
});

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}