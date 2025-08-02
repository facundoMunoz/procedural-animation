// Constants
const SPEED = 7;
const EYES_SIZE = 10;
const svg = document.getElementById("svg");
const eyes = new Array(2);
// Snake only
const tongue = document.createElementNS("http://www.w3.org/2000/svg", "circle");
const skin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
// Lizard only
const feet = new Array(4);
const legs = new Array(4);
const FOOT_SIZE = 12;
// Variables
let vertebraDistance;
let spineSize; // Min 3
let spine;
let mousePosition;
let headPosition;
let animationRequest;
// Lizard only
let skinSquare;
let currentFeetPair = false;
// Snake = 0, Lizard = 1
let currentAnimal;

// Setup initial positions
function setupPositions() {
    skinSquare = new Array(spineSize - 1);
    svg.innerHTML = '';
    mousePosition = {
        x: vertebraDistance,
        y: svg.clientHeight / 2
    };
    headPosition = {
        x: -vertebraDistance,
        y: svg.clientHeight / 2
    };
}

// Create snake
function newSnake() {
    // Set variables
    currentAnimal = 0;
    vertebraDistance = 20;
    spineSize = 40;
    spine = new Array(spineSize);
    setupPositions();
    // Append skin
    skin.setAttribute('stroke', '#58804f');
    skin.setAttribute('stroke-width', '80');
    skin.setAttribute('fill', 'none');
    skin.setAttribute('stroke-linecap', 'round');
    svg.appendChild(skin);
    // Append tongue
    tongue.setAttribute('class', 'tongue');
    tongue.setAttribute('r', '10');
    tongue.style.cx = '0px';
    tongue.style.cy = `${svg.clientHeight / 2}px`;
    svg.appendChild(tongue);
    // Append spine
    for (let vertebra = spineSize - 1; vertebra >= 0; vertebra--) {
        spine[vertebra] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        spine[vertebra].style.cx = `${(vertebraDistance * vertebra * -1) - vertebraDistance}px`;
        spine[vertebra].style.cy = `${svg.clientHeight / 2}px`;
        if (vertebra == 0) {
            spine[vertebra].setAttribute('class', 'circle');
            spine[vertebra].setAttribute('r', '45');
            spine[vertebra].style.fill = '#58804f';
            svg.appendChild(spine[vertebra]);
        }
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
    window.cancelAnimationFrame(animationRequest);
    animate();
}

// Create lizard
function newLizard() {
    // Set variables
    let body = new Array(40, 30, 40, 40, 40, 30, 25, 20, 15, 10, 5);
    currentAnimal = 1;
    vertebraDistance = 40;
    spineSize = body.length;
    spine = new Array(spineSize);
    setupPositions();
    // Append square skin
    for (let skinSegment = 0; skinSegment < spineSize - 1; skinSegment++) {
        skinSquare[skinSegment] = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        skinSquare[skinSegment].setAttribute('class', 'polygon');
        svg.appendChild(skinSquare[skinSegment]);
    }
    // Append legs
    for (let foot = 0; foot < feet.length; foot++) {
        legs[foot] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        legs[foot].setAttribute('stroke', '#58804f');
        legs[foot].setAttribute('stroke-width', FOOT_SIZE * 2);
        legs[foot].setAttribute('fill', 'none');
        legs[foot].setAttribute('stroke-linecap', 'round');
        svg.appendChild(legs[foot]);
    }
    // Append feet
    for (let foot = 0; foot < feet.length; foot++) {
        feet[foot] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        feet[foot].setAttribute('class', 'circle');
        feet[foot].setAttribute('r', FOOT_SIZE);
        feet[foot].style.cx = `${-vertebraDistance}px`;
        feet[foot].style.cy = '0px';
        svg.appendChild(feet[foot]);
    }
    // Append spine
    for (let vertebra = spineSize - 1; vertebra >= 0; vertebra--) {
        spine[vertebra] = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        spine[vertebra].style.cx = `${(vertebraDistance * vertebra * -1) - vertebraDistance}px`;
        spine[vertebra].style.cy = `${svg.clientHeight / 2}px`;
        spine[vertebra].setAttribute('class', 'circle');
        spine[vertebra].setAttribute('r', body[vertebra]);
        spine[vertebra].style.fill = '#58804f';
        if (vertebra == 1) {
            // Append tongue
            tongue.setAttribute('class', 'tongue');
            tongue.setAttribute('r', '10');
            tongue.style.cx = '0px';
            tongue.style.cy = `${svg.clientHeight / 2}px`;
            svg.appendChild(tongue);
        }
        svg.appendChild(spine[vertebra]);
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
    window.cancelAnimationFrame(animationRequest);
    animate();
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
    animationRequest = window.requestAnimationFrame(animate);
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

        // Move tongue
        tongue.style.cx = `${headPosition.x + ((dx / distance) * spine[0].getAttribute('r'))}px`;
        tongue.style.cy = `${headPosition.y + ((dy / distance) * spine[0].getAttribute('r'))}px`;

        // Move eyes
        let eyesDistance = spine[0].getAttribute('r') - EYES_SIZE;
        eyes[0].style.cx = `${headPosition.x - ((dy / distance) * eyesDistance)}px`;
        eyes[0].style.cy = `${headPosition.y + ((dx / distance) * eyesDistance)}px`;
        eyes[1].style.cx = `${headPosition.x + ((dy / distance) * eyesDistance)}px`;
        eyes[1].style.cy = `${headPosition.y - ((dx / distance) * eyesDistance)}px`;
    }

    // Move vertebrae
    let currentFoot = feet.length - 1;
    for (let vertebra = 1; vertebra < spineSize; vertebra++) {
        const currentX = parseInt(spine[vertebra].style.cx);
        const currentY = parseInt(spine[vertebra].style.cy);
        const nextX = parseInt(spine[vertebra - 1].style.cx);
        const nextY = parseInt(spine[vertebra - 1].style.cy);
        // Calculate target between current and next vertebra
        const targetXTemp = currentX - nextX;
        const targetYTemp = currentY - nextY;
        const targetDistance = Math.sqrt(targetXTemp * targetXTemp + targetYTemp * targetYTemp);

        const targetX = ((targetXTemp / targetDistance) * vertebraDistance + nextX);
        const targetY = ((targetYTemp / targetDistance) * vertebraDistance + nextY);

        if (targetDistance > vertebraDistance) {
            spine[vertebra].style.cx = `${targetX}px`;
            spine[vertebra].style.cy = `${targetY}px`;
        }

        if (currentAnimal == 1) {
            // Update skin
            let currentBorderDistance = spine[vertebra].getAttribute('r');
            let currentLeft = `${currentX - ((targetYTemp / targetDistance) * currentBorderDistance)},${currentY + ((targetXTemp / targetDistance) * currentBorderDistance)}`;
            let currentRight = `${currentX + ((targetYTemp / targetDistance) * currentBorderDistance)},${currentY - ((targetXTemp / targetDistance) * currentBorderDistance)}`;
            let nextBorderDistance = spine[vertebra - 1].getAttribute('r');
            let nextLeft = `${nextX - ((targetYTemp / targetDistance) * nextBorderDistance)},${nextY + ((targetXTemp / targetDistance) * nextBorderDistance)}`;
            let nextRight = `${nextX + ((targetYTemp / targetDistance) * nextBorderDistance)},${nextY - ((targetXTemp / targetDistance) * nextBorderDistance)}`;
            skinSquare[vertebra - 1].setAttribute('points', `${currentLeft} ${nextLeft} ${nextRight} ${currentRight}`); // Top left, top right, bottom right, bottom left

            let feetX, feetY, feetDistance, currentFeetX, currentFeetY;
            if (vertebra == 2 || vertebra == 4) {
                currentFeetX = parseInt(feet[currentFoot].style.cx);
                currentFeetY = parseInt(feet[currentFoot].style.cy);
                feetX = nextX - ((targetYTemp / targetDistance) * currentBorderDistance * 2);
                feetY = nextY + ((targetXTemp / targetDistance) * currentBorderDistance * 2);
                feetDistance = Math.sqrt((feetX - currentFeetX) * (feetX - currentFeetX) + (feetY - currentFeetY) * (feetY - currentFeetY));
                if (!currentFeetPair) {
                    // Move feet
                    if (feetDistance > currentBorderDistance * 2) {
                        feet[currentFoot].style.cx = `${feetX}px`;
                        feet[currentFoot].style.cy = `${feetY}px`;
                    }
                    // Move leg
                    let pathData = `M${currentX - ((targetYTemp / targetDistance) * currentBorderDistance)} ${currentY + ((targetXTemp / targetDistance) * currentBorderDistance)} L${parseInt(feet[currentFoot].style.cx)} ${parseInt(feet[currentFoot].style.cy)}`;
                    legs[currentFoot].setAttribute('d', pathData);
                }
                currentFoot--;
                currentFeetX = parseInt(feet[currentFoot].style.cx);
                currentFeetY = parseInt(feet[currentFoot].style.cy);
                feetX = nextX + ((targetYTemp / targetDistance) * currentBorderDistance * 2);
                feetY = nextY - ((targetXTemp / targetDistance) * currentBorderDistance * 2);
                feetDistance = Math.sqrt((feetX - currentFeetX) * (feetX - currentFeetX) + (feetY - currentFeetY) * (feetY - currentFeetY));
                if (currentFeetPair) {
                    // Move feet
                    if (feetDistance > currentBorderDistance * 2) {
                        feet[currentFoot].style.cx = `${feetX}px`;
                        feet[currentFoot].style.cy = `${feetY}px`;
                    }
                    // Move leg
                    pathData = `M${currentX + ((targetYTemp / targetDistance) * currentBorderDistance)} ${currentY - ((targetXTemp / targetDistance) * currentBorderDistance)} L${parseInt(feet[currentFoot].style.cx)} ${parseInt(feet[currentFoot].style.cy)}`;
                    legs[currentFoot].setAttribute('d', pathData);
                }
                currentFoot--;

            }
        }
    }
    currentFeetPair = !currentFeetPair;

    if (currentAnimal == 0) {
        let pathData = `M${parseInt(spine[0].style.cx)},${parseInt(spine[0].style.cy)} S`;
        for (let vertebra = 1; vertebra < spineSize; vertebra++) {
            pathData = `${pathData}${parseInt(spine[vertebra].style.cx)},${parseInt(spine[vertebra].style.cy)} `;
        }
        skin.setAttribute('d', pathData);
    }
}