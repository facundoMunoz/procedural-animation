// Variables
const VERTEBRA_DISTANCE = 60;
const SPINE_SIZE = 8; // Min 2
const SPEED = 5;
const spine = new Array(SPINE_SIZE);
const svg = document.getElementById("svg");
const eyes = new Array(2);

// Setup
let mousePosition = {
    x: 100,
    y: 100
};
let headPosition = {
    x: 100,
    y: 100
};

// Create vertebrae
function newSpine() {
    // Append spine
    for (let vertebra = 0; vertebra < SPINE_SIZE; vertebra++) {
        spine[vertebra] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        spine[vertebra].setAttribute('class', 'circle');
        spine[vertebra].setAttribute('r', '40');
        spine[vertebra].style.cx = `${(VERTEBRA_DISTANCE * vertebra * -1)}px`;
        spine[vertebra].style.cy = '0px';
        svg.appendChild(spine[vertebra]);
    }
    // Append eyes
    for (let eye = 0; eye < eyes.length; eye++) {
        eyes[eye] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        eyes[eye].setAttribute('class', 'eyes');
        eyes[eye].setAttribute('r', '10');
        eyes[eye].style.cx = spine[0].style.cx;
        eyes[eye].style.cy = spine[0].style.cy;
        svg.appendChild(eyes[eye]);
    }
}

// Mousemove event listener to get mouse position
document.addEventListener('mousemove', (event) => {
    mousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

// Continuous animation loop
function animate() {
    moveHeadTowardsMouse();
    requestAnimationFrame(animate);
}

function moveHeadTowardsMouse() {
    // Move head
    const dx = mousePosition.x - headPosition.x;
    const dy = mousePosition.y - headPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > SPEED) {
        // Normalized vector by speed
        const moveX = (dx / distance) * SPEED;
        const moveY = (dy / distance) * SPEED;

        headPosition.x += moveX;
        headPosition.y += moveY;

        spine[0].style.cx = `${headPosition.x}px`;
        spine[0].style.cy = `${headPosition.y}px`;

        // Move eyes
        eyes[0].style.cx = `${headPosition.x - ((dy / distance) * 30)}px`;
        eyes[0].style.cy = `${headPosition.y + ((dx / distance) * 30)}px`;
        eyes[1].style.cx = `${headPosition.x + ((dy / distance) * 30)}px`;
        eyes[1].style.cy = `${headPosition.y - ((dx / distance) * 30)}px`;
    }

    // Move vertebrae
    for (let vertebra = 1; vertebra < SPINE_SIZE; vertebra++) {
        const currentX = parseInt(spine[vertebra].style.cx);
        const currentY = parseInt(spine[vertebra].style.cy);
        const nextX = parseInt(spine[vertebra - 1].style.cx);
        const nextY = parseInt(spine[vertebra - 1].style.cy);
        // Calculate target between current and next vertebra
        const targetXTemp = currentX - nextX;
        const targetYTemp = currentY - nextY;
        const targetDistance = Math.sqrt(targetXTemp * targetXTemp + targetYTemp * targetYTemp);

        if (targetDistance > VERTEBRA_DISTANCE) {
            const targetX = ((targetXTemp / targetDistance) * VERTEBRA_DISTANCE + nextX);
            const targetY = ((targetYTemp / targetDistance) * VERTEBRA_DISTANCE + nextY);

            spine[vertebra].style.cx = `${targetX}px`;
            spine[vertebra].style.cy = `${targetY}px`;
        }
    }
}

// Start
newSpine();
animate();