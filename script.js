const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');


const player = {
    speed: 5,
    score: 0
};

let keys = {
    ArrowUp: false,
    ArrowRight: false,
    ArrowLeft: false,
    ArrowDown: false
}
const pressOn = e => {
    e.preventDefault();
    keys[e.key] = true;
}
const pressOff = e => {
    e.preventDefault();
    keys[e.key] = false;
}

// Start game 
const start = () => {
    gameArea.textContent = '';
    player.start = true;
    player.score = 0;

    startScreen.classList.add('hide');
    score.classList.remove('hide');

    // Generate lines 
    generateLines();

    // Generate a dynamic car
    playerCar();

    // Generate enemies car
    enemyCar();

    window.requestAnimationFrame(playGame)
}

// Move lines

// Generate lines
const generateLines = () => {
    for(let i = 1; i <= 5; i++) {
        const line = document.createElement('div');
        line.setAttribute('class', 'line');

        line.y = (i * 150);
        line.style.top = `${line.y}px`;

        gameArea.appendChild(line);
    }
}

// move lines
const moveLines = () => {
    const lines = document.querySelectorAll('.line');

    lines.forEach(item => {
        if(item.y > 1000) item.y -= 1000;
        item.y += player.speed;
        item.style.top = `${item.y}px`
    })
}

// player's car
const playerCar = () => {
    const car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    player.y = car.offsetTop;
    player.x = car.offsetLeft;
}
// enemy's car
const enemyCar = () => {
    for(i = 1; i <= 3; i++) {
        const enemy = document.createElement('div');
        enemy.setAttribute('class', 'enemy');

        enemy.y = ((i+1) * 600 ) * -1;
        enemy.style.top = `${enemy.y}px`;
        enemy.style.left = `${Math.floor(Math.random() * 300)}px`;

        gameArea.appendChild(enemy)
    }
}

// Get random color
const getColor = () => {
    const hex = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    let hexColor = '#';
    const getRandomColor = () => Math.floor(Math.random() * hex.length);
    for(i = 1; i <= 6; i++) hexColor += hex[getRandomColor()];

    if(hexColor !== '#0000ff' && hexColor !== '#000000'){ return hexColor }
    else enemyCar();
}

// Check for collision
const isCollide = (a,b) => {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || (aRect.left > bRect.right) || (aRect.right < bRect.left)
    )
}

// Play game
const playGame = () => {
    let car = document.querySelector('.car');

    // Get road boundary
    const road = gameArea.getBoundingClientRect();

    moveLines();
    moveEnemy();

    if(player.start) {
        if(keys.ArrowUp && player.y > (road.top - 200)) player.y -= player.speed;
        if(keys.ArrowDown && player.y < (road.bottom- 200)) player.y += player.speed;
        if(keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if(keys.ArrowRight && player.x < (road.width - 50)) player.x += player.speed;

        car.style.top = `${player.y}px`;
        car.style.left = `${player.x}px`;

        player.score++;
        score.textContent = `Score: ${player.score}`;

        window.requestAnimationFrame(playGame);
    }
}
// End game
const endGame = () => {
    player.start = false;

    startScreen.classList.remove('startScreen', 'hide');
    startScreen.classList.add('gameEnd');

    score.innerHTML = `Game Over` + '<br/>' + `Score was ${player.score}`
    startScreen.innerHTML = `Press here to start` + '<br />' + `Arrow keys to move` + '<br />' + `If you hit enemy' car you lose`;
}

// move enemy
const moveEnemy = () => {
    const car = document.querySelector('.car');
    const enemyCar = document.querySelectorAll('.enemy');
    enemyCar.forEach(enemy => {

        // Check for collision
        if(isCollide(car, enemy)) endGame();

        // Check if enemy's car is off the screen. if so reset position to -600 (Back to top)
        if (enemy.y >= 1000) {
            enemy.y = -1000;
            enemy.style.left = `${Math.floor(Math.random() * 300)}px`;
            enemy.style.backgroundColor = getColor();
        }
        enemy.y += player.speed;
        enemy.style.top = `${enemy.y}px`;
    })  
}


// Event listeners
startScreen.addEventListener('click', start);
document.addEventListener('keyup', pressOff);
document.addEventListener('keydown', pressOn);