/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './style/style.scss';

const mainStage = document.querySelector('#mainStage') as HTMLElement;
const mainTextArea = document.querySelector('#mainTextArea') as HTMLElement;
const userTextInput = document.querySelector('#userTextInput') as HTMLInputElement;
const errorMsg = document.querySelector('#errorMsg') as HTMLDivElement;
const gameOverScreen = document.querySelector('#gameOver') as HTMLDivElement;
const canvas = document.querySelector('#roomCanvas') as HTMLCanvasElement;
let ctx: any;
const userCharImage = new Image();
userCharImage.src = 'src/style/vendor/images/adventure.png';
const arrowImg = new Image();
arrowImg.src = 'src/style/vendor/images/arrow.png';
// eslint-disable-next-line prefer-const
let highScoreList = [
  {
    name: 'Mattias',
    score: 10,
  },
  {
    name: 'Unkown',
    score: 0,
  },
];
const nextRooms = [
  { x: 0, y: -1 }, // N
  { x: 0, y: 1 }, // S
  { x: -1, y: 0 }, // W
  { x: 1, y: 0 }, // E
];
let userName = '';
// eslint-disable-next-line prefer-const
let currentLocation = {
  x: 0,
  y: 0,
};
let wumpusCurrentLocation: any;
let enterCounter = 0;
let userArrowCounter = 3;
interface CaveRooms {
  containsWumpus: boolean;
  containsItem: string[];
  containsTrap: boolean;
  containsBat: boolean;
}

const allCaves /*: CaveRooms - FIXME: */ = [
  [
    // TODO: compress this declaration
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
  ],
  [
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
  ],
  [
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
  ],
  [
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
  ],
  [
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
    {
      containsWumpus: false,
      containsItem: [],
      containsTrap: false,
      containsBat: false,
    },
  ],
];

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function placeTraps(): void {
  for (let i = 0; i < 4; i++) {
    let tries = 0;
    let random1: number = getRandomInt(5);
    let random2: number = getRandomInt(4);
    while (
      ((random1 === 0 && random2 === 0) ||
        allCaves[random1][random2].containsTrap
      || allCaves[random1][random2].containsBat)
      && tries < 20
    ) {
      random1 = getRandomInt(5);
      random2 = getRandomInt(4);
      tries += 1;
      if (tries === 19) {
        console.error('Unable to place traps.');
      }
    }
    allCaves[random1][random2].containsTrap = true;
    console.log(`Traps have been placed: ${random1}:${random2}`);
  }
}

function placeBats(): void {
  for (let i = 0; i < 6; i++) {
    let tries = 0;
    let random1: number = getRandomInt(5);
    let random2: number = getRandomInt(4);
    while (
      ((random1 === 0 && random2 === 0) ||
        allCaves[random1][random2].containsTrap ||
        allCaves[random1][random2].containsBat) &&
      tries < 20
    ) {
      random1 = getRandomInt(5);
      random2 = getRandomInt(4);
      tries += 1;
      if (tries === 19) {
        console.error('Unable to place bats.');
      }
    }
    allCaves[random1][random2].containsBat = true;
    console.log(`Bats have been placed: ${random1}:${random2}`);
  }
}

function placeWumpus(): void {
  let random1: number = getRandomInt(5);
  let random2: number = getRandomInt(4);
  while (random1 === 0 && random2 === 0) {
    random1 = getRandomInt(5);
    random2 = getRandomInt(4);
  }
  allCaves[random1][random2].containsWumpus = true;
  wumpusCurrentLocation = `Wumpus location: ${random1}, ${random2}`;
  console.log(wumpusCurrentLocation);
}

function cavesPlaceEverything(): void {
  placeWumpus();
  placeTraps();
  placeBats();
}

function checkXIsOk(x: number) {
  if (x < 0) {
    x = 4;
  }
  if (x > 4) {
    x = 0;
  }
  return x;
}
function checkYIsOk(y: number) {
  if (y < 0) {
    y = 3;
  }
  if (y > 3) {
    y = 0;
  }
  return y;
}

function checkNearbyRoom() {
  let alreadyTriggerd = {
    bats: false,
    traps: false,
    wumpus: false,
  };
  for (let i = 0; i < 4; i++) {
    let tempX: number = currentLocation.x + nextRooms[i].x;
    let tempY: number = currentLocation.y + nextRooms[i].y;
    tempX = checkXIsOk(tempX); // Kollar igenom grann rum.
    tempY = checkYIsOk(tempY);
    if (allCaves[tempX][tempY].containsBat && !alreadyTriggerd.bats) {
      mainTextArea.innerHTML += '<br> I hear the menacing sounds of bats nearby... <br>';
      alreadyTriggerd.bats = true;
    }
    if (allCaves[tempX][tempY].containsTrap && !alreadyTriggerd.traps) {
      mainTextArea.innerHTML += '<br> I feel a rush of wind, there must be a huge bottomless hole nearby... <br>';
      alreadyTriggerd.traps = true;
    }
    if (allCaves[tempX][tempY].containsWumpus && !alreadyTriggerd.wumpus) {
      mainTextArea.innerHTML += '<br> I smell the most awful of smells... <br>';
      alreadyTriggerd.wumpus = true;
    }
    tempX = 0;
    tempY = 0;
  }
  if (!alreadyTriggerd.bats && !alreadyTriggerd.traps && !alreadyTriggerd.wumpus) {
    mainTextArea.innerHTML += '<br> I get a feeling that everything is fine... <br>';
  }
}

function fullReset(): void {
  for (let i = 0; i < allCaves.length; i++) {
    for (let j = 0; j < allCaves[i].length; j++) {
      allCaves[i][j].containsBat = false;
      allCaves[i][j].containsTrap = false;
      allCaves[i][j].containsWumpus = false;
    }
  }
  cavesPlaceEverything();
  userArrowCounter = 3;
  enterCounter = 0;
  currentLocation.x = 0;
  currentLocation.y = 0;
  gameOverScreen.classList.add('hidden');
  startGame();
}

function gameOver(reason: string) {
  console.log('Gameover screen triggerd');
  gameOverScreen.classList.remove('hidden');
  userTextInput.classList.add('hidden');
  mainTextArea.innerHTML = '';
  gameOverScreen.innerHTML = `GAME OVER <br> <br>
  ${userName} ${reason}
  <br> <br> Highscore list:
    <ul> 
      <li> ${highScoreList[0].name}: ${highScoreList[0].score}
      <li> ${highScoreList[1].name}: ${highScoreList[1].score}
    </ul>
    <button id="restartBtn">Restart Game?</button>
    `; // TODO: Restart butten function
  document.querySelector('#restartBtn')?.addEventListener('click', fullReset);
}

function displayRoom(i: number, j: number) {
  /** TODO:
   * Slumpa fram svar på olika situationer inom samma parameter
   * animera utskriften, all text ska inte komma samtidigt.
   */
  errorMsg.innerHTML = '';
  if (allCaves[i][j].containsBat) {
    mainTextArea.innerHTML = `As you enter the cave you see a giant bat flying straight at you! <br> 
    <br> As you try to escape the bat catches you by the leg and flyes away with you. 
    <br> You manage to break free and fall down to a cave nearby.`;
    setTimeout(() => {
      batMovesUser();
    }, 3000);
  } else if (allCaves[i][j].containsTrap) {
    mainTextArea.innerHTML = `As you enter the cave you see a giant hole in the middle. <br> 
    <br> You easily go around the hole and as you are in the clear. 
    <br> A stone falls down and kills you`;
    setTimeout(() => {
      gameOver('was killed due to head trauma');
    }, 3000);
  } else if (allCaves[i][j].containsWumpus) {
    mainTextArea.innerHTML = `As you enter the cave you you smell the foulest of smells. <br>
    <br> A movement deep in the dark is the last thing you see before you are slayed.`;
    setTimeout(() => {
      gameOver('was eaten by the Wumpus');
    }, 3000);
  } else {
    mainTextArea.innerHTML = `You have entered a new cave. x:${i} y:${j}<br>`;
    handleUserImg('show');
    checkNearbyRoom();
    mainTextArea.innerHTML += 'Where would you like to go next? N/S/W/E';
  }
}

function batMovesUser(): void {
  const fiftyFifty = getRandomInt(2);
  console.log('Batmove is triggered');
  if (fiftyFifty === 0) {
    currentLocation.x += getRandomInt(3);
  } else {
    currentLocation.y -= getRandomInt(3);
  }
  currentLocation.x = checkXIsOk(currentLocation.x);
  currentLocation.y = checkYIsOk(currentLocation.y);
  while (
    allCaves[currentLocation.x][currentLocation.y].containsBat ||
    allCaves[currentLocation.x][currentLocation.y].containsTrap ||
    allCaves[currentLocation.x][currentLocation.y].containsWumpus
  ) {
    currentLocation.x += getRandomInt(4);
    currentLocation.y += getRandomInt(4);
    currentLocation.x = checkXIsOk(currentLocation.x);
    currentLocation.y = checkYIsOk(currentLocation.y);
    console.warn('Batmove while loop triggerd');
  }

  displayRoom(currentLocation.x, currentLocation.y);
}

function startGame(): void {
  mainTextArea.innerHTML = `<span> Great! 
  What would you like your character to be called? <br> Press "Enter" to continue </span>`;
  userTextInput.classList.toggle('hidden');
  document.querySelector('#startBtn')?.classList.add('hidden');
}

function flyingArrow(direction: number) {
  let arrowLocationX = currentLocation.x; // TODO: Copy the obect to one variable instead?
  let arrowLocationY = currentLocation.y;
  userArrowCounter -= 1;
  const timer = ms => new Promise(res => setTimeout(res, ms));
  async function load():Promise<void> {
    // I use async to create a promise to slow down the loop, so the arrow img can be seen
    for (let i = 0; i < 3; i++) {
      arrowLocationX += nextRooms[direction].x;
      arrowLocationY += nextRooms[direction].y;
      arrowLocationX = checkXIsOk(arrowLocationX);
      arrowLocationY = checkYIsOk(arrowLocationY);
      ctx.drawImage(arrowImg, arrowLocationX * 60, arrowLocationY * 50, 35, 35);
      if (allCaves[arrowLocationX][arrowLocationY].containsWumpus) {
        // TODO: Display victory screen
        console.log('<br> <br> Wumpus has been hit');
        return;
      }
      if (arrowLocationX === currentLocation.x && arrowLocationY === currentLocation.y) {
        gameOver('shot himself with an arrow');
        console.log('You killed yourself');
        return;
      }
      // eslint-disable-next-line no-await-in-loop
      await timer(800);
      ctx.clearRect(arrowLocationX * 60, arrowLocationY * 50, 55, 45);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  load();
  mainTextArea.innerHTML += '<br> <br> It appears the arrow did not hit anything...';
}

function shootArrow(value: string): void {
  console.log(userArrowCounter);
  switch (value.toLowerCase().replace('shoot ', '')) {
    case 'n' || 'north':
      flyingArrow(0);
      break;
    case 's' || 'south':
      flyingArrow(1);
      break;
    case 'w' || 'west':
      flyingArrow(2);
      break;
    case 'e' || 'east':
      flyingArrow(3);
      break;
    default:
      console.log(value);
      errorMsg.innerHTML = ' <br> <br> Wrong input. Use "Shoot N/S/W/E"';
      break;
  }
  if (userArrowCounter === 1) {
    mainTextArea.innerHTML += '<br> <br> You are down to your last arrow. If you waste it, there is no hope.';
  }
  if (userArrowCounter === 0) {
    gameOver('ran out of arrows');
  }
}

function movement(value: string): void {
  let errorTriggerd = false;

  switch (value.toLowerCase()) {
    case 'n':
    case 'north':
      console.log(value);
      currentLocation.x += nextRooms[0].x;
      currentLocation.y += nextRooms[0].y;
      console.log('N is triggerd');
      break;
    case 's':
    case 'south':
      currentLocation.x += nextRooms[1].x;
      currentLocation.y += nextRooms[1].y;
      console.log('S is triggerd');
      break;
    case 'w':
    case 'west':
      currentLocation.x += nextRooms[2].x;
      currentLocation.y += nextRooms[2].y;
      console.log('W is triggerd');
      break;
    case 'e':
    case 'east':
      currentLocation.x += nextRooms[3].x;
      currentLocation.y += nextRooms[3].y;
      console.log('E is triggerd');
      break;
    default:
      errorMsg.innerHTML = '<br> <br> Wrong input. Use N/S/W/E';
      console.log('default movement');
      errorTriggerd = true;
      break;
  }
  if (!errorTriggerd) {
    currentLocation.x = checkXIsOk(currentLocation.x);
    currentLocation.y = checkYIsOk(currentLocation.y);
    displayRoom(currentLocation.x, currentLocation.y);
  }
}
function handleUserImg(reason: string) {
  if (canvas.getContext) {
    switch (reason) {
      case 'clear':
        ctx.clearRect(currentLocation.x * 60, currentLocation.y * 50, 55, 45);
        break;
      case 'show':
        ctx.drawImage(userCharImage, currentLocation.x * 60, currentLocation.y * 50, 40, 40);
        break;
      case 'bat':
        // TODO: Rotate the img a few turn incase the player meets a bat.
        break;
      default:
        console.error('handleUserImg function param');
        break;
    }
  }
}

function canvasRooms(): void {
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    for (let row = 0; row < allCaves.length; row++) {
      for (let col = 0; col < allCaves[row].length; col++) {
        ctx.fillStyle = 'rgb(45, 0, 45)';
        ctx.fillRect(row * 60, col * 50, 60, 50);
        ctx.clearRect(row * 60, col * 50, 55, 45);
      }
    }
  } else {
    console.error('Canvas is not supported');
    canvas.classList.add('hidden');
  }
}

function textInputEHandler(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    if (enterCounter === 0) {
      // Första gången man startar och trycker enter så anges detta
      userTextInput.classList.add('hidden');
      userName = userTextInput.value;
      mainTextArea.innerHTML = `Lets get started ${userName}! <br> <br> You are currently in the caves under the 
      castle of Greveholm. 
      Afraid to be alone? Lucky for you, you are not. There is also a beast by the name of Wumpus in the
      treturous cave system. Your goal is to slay Wumpus before he kills you. There is loot you can find along 
      the way to aid you, if you find it. Currently you only have a bow and three arrows.`;
      setTimeout(() => {
        userTextInput.classList.remove('hidden');
        mainTextArea.innerHTML = `You navigate using the field below. 
        Simply put in the direktion you would like to go in. <br> <br> Either using full names or the first letter.
        <br> North / South / West / East <br> <br>
        If you wish to shoot your bow, insert "Shoot" plus the direction. <br> <br>
        Press Enter again to enter the first cave;`;
      }, 5000);
    }
    if (enterCounter === 1) {
      displayRoom(0, 0);
    }
    if (enterCounter > 1) {
      // Sköter all hantering efter spelet har kommit igång
      if (userTextInput.value.toLowerCase().includes('shoot')) {
        shootArrow(userTextInput.value);
        return;
      }
      handleUserImg('clear');
      console.log('enterCounter more than 1');
      movement(userTextInput.value);
    }
    enterCounter += 1;
    userTextInput.value = '';
  }
}

userTextInput.addEventListener('keypress', textInputEHandler);
document.querySelector('#startBtn')?.addEventListener('click', startGame);

cavesPlaceEverything();
console.table(allCaves);
canvasRooms();
