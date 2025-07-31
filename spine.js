// Variables
const SNAKE = [10, 30, 30, 25, 35, 35, 30, 30, 20, 10, 10];
const VERTEBRA_DISTANCE = 30;
const SPINE_SIZE = 25; // Min 2
const SPEED = 5;
const EYES_SIZE = 10;
const spine = new Array(SPINE_SIZE);
const skin = new Array(SPINE_SIZE - 1);
const svg = document.getElementById("svg");
const eyes = new Array(2);

// Setup
let mousePosition = {
    x: VERTEBRA_DISTANCE,
    y: svg.clientHeight / 2
};
let headPosition = {
    x: -VERTEBRA_DISTANCE,
    y: svg.clientHeight / 2
};

// Create vertebrae
function newSpine() {
    // Append spine
    for (let vertebra = 0; vertebra < SPINE_SIZE; vertebra++) {
        spine[vertebra] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        spine[vertebra].setAttribute('class', 'circle');
        spine[vertebra].setAttribute('r', '40');
        spine[vertebra].style.cx = `${(VERTEBRA_DISTANCE * vertebra * -1) - VERTEBRA_DISTANCE}px`;
        spine[vertebra].style.cy = `${svg.clientHeight / 2}px`;
        svg.appendChild(spine[vertebra]);
    }
    // Append skin
    for (let skinSegment = 0; skinSegment < SPINE_SIZE - 1; skinSegment++) {
        skin[skinSegment] = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        skin[skinSegment].setAttribute('class', 'polygon');
        svg.appendChild(skin[skinSegment]);
    }
    // Append eyes
    for (let eye = 0; eye < eyes.length; eye++) {
        eyes[eye] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        eyes[eye].setAttribute('class', 'eyes');
        eyes[eye].setAttribute('r', EYES_SIZE);
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
        let eyesDistance = spine[0].getAttribute('r') - EYES_SIZE;
        eyes[0].style.cx = `${headPosition.x - ((dy / distance) * eyesDistance)}px`;
        eyes[0].style.cy = `${headPosition.y + ((dx / distance) * eyesDistance)}px`;
        eyes[1].style.cx = `${headPosition.x + ((dy / distance) * eyesDistance)}px`;
        eyes[1].style.cy = `${headPosition.y - ((dx / distance) * eyesDistance)}px`;
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

            // MOVE EYES WHEN NOT IN FIRST VERTEBRA
            /*if (vertebra == 1) {
                // Move eyes
                let currentBorderDistance = spine[vertebra].getAttribute('r') - EYES_SIZE;
                eyes[0].style.cx = `${currentX - ((targetYTemp / targetDistance) * currentBorderDistance)}px`;
                eyes[0].style.cy = `${currentY + ((targetXTemp / targetDistance) * currentBorderDistance)}px`;
                eyes[1].style.cx = `${currentX + ((targetYTemp / targetDistance) * currentBorderDistance)}px`;
                eyes[1].style.cy = `${currentY - ((targetXTemp / targetDistance) * currentBorderDistance)}px`;
            }*/
        }
        // Update skin
        let currentBorderDistance = spine[vertebra].getAttribute('r');
        let currentLeft = `${currentX - ((targetYTemp / targetDistance) * currentBorderDistance)},${currentY + ((targetXTemp / targetDistance) * currentBorderDistance)}`;
        let currentRight = `${currentX + ((targetYTemp / targetDistance) * currentBorderDistance)},${currentY - ((targetXTemp / targetDistance) * currentBorderDistance)}`;
        let nextBorderDistance = spine[vertebra - 1].getAttribute('r');
        let nextLeft = `${nextX - ((targetYTemp / targetDistance) * nextBorderDistance)},${nextY + ((targetXTemp / targetDistance) * nextBorderDistance)}`;
        let nextRight = `${nextX + ((targetYTemp / targetDistance) * nextBorderDistance)},${nextY - ((targetXTemp / targetDistance) * nextBorderDistance)}`;

        skin[vertebra - 1].setAttribute('points', `${currentLeft} ${nextLeft} ${nextRight} ${currentRight}`); // Top left, top right, bottom right, bottom left
    }
}

// Start
newSpine();
animate();