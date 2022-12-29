/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './style/style.scss';
import accessGrantedImp from './style/vendor/images/acessgranted.png';
import arrowImgImp from './style/vendor/images/arrow.png';
import UserCharImgImp from './style/vendor/images/adventure.png';
import EndlessHoleImp from './style/vendor/images/endlesshole.jpg';

const mainStage = document.querySelector('#mainStage') as HTMLElement;
const mainTextArea = document.querySelector('#mainTextArea') as HTMLElement;
const userTextInput = document.querySelector('#userTextInput') as HTMLInputElement;
const errorMsg = document.querySelector('#errorMsg') as HTMLDivElement;
const gameOverScreen = document.querySelector('#gameOver') as HTMLDivElement;
const canvas = document.querySelector('#roomCanvas') as HTMLCanvasElement;
let ctx: any;
const userCharImage = new Image();
userCharImage.src = UserCharImgImp;
const arrowImg = new Image();
arrowImg.src = arrowImgImp;
const backgroundImage = new Image();
backgroundImage.src = accessGrantedImp;
const endlessHoleImage = new Image();
endlessHoleImage.src = EndlessHoleImp;
const highScoreList = [
  {
    name: 'Mattias',
    score: 10,
  },
];
const nextRooms = [
  { x: 0, y: -1 }, // N
  { x: 0, y: 1 }, // S
  { x: -1, y: 0 }, // W
  { x: 1, y: 0 }, // E
];
let userName = '';
const currentLocation = {
  x: 0,
  y: 0,
};
let wumpusCurrentLocation: any;
let enterCounter = 0;
let userArrowCounter = 3;
let userPointCounter = 10; // User starts at 10 points
let userHasCoin = false;

interface CaveRooms {
  containsWumpus: boolean;
  containsItem: string[];
  containsTrap: boolean;
  containsBat: boolean;
}

const allCaves: CaveRooms[][] = [
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

function placeItems(): void {
  for (let i = 0; i < 5; i++) {
    let tries = 0;
    let random1: number = getRandomInt(5);
    let random2: number = getRandomInt(4);
    while (
      ((random1 === 0 && random2 === 0)
       || allCaves[random1][random2].containsTrap
       || allCaves[random1][random2].containsWumpus
       || allCaves[random1][random2].containsItem.length > 0
       || allCaves[random1][random2].containsBat)
      && tries < 20
    ) {
      random1 = getRandomInt(5);
      random2 = getRandomInt(4);
      tries += 1;
      if (tries === 19) {
        console.error('Unable to place all items.');
      }
    }
    if (i < 2) {
      allCaves[random1][random2].containsItem.push('bonusItem');
    }
    if (i < 4) {
      allCaves[random1][random2].containsItem.push('arrowItem');
    }
    if (i === 4) {
      allCaves[random1][random2].containsItem.push('coinItem');
    }
    console.log(`Items have been placed: ${i}: ${random1}:${random2}`);
  }
}

function placeTraps(): void {
  for (let i = 0; i < 4; i++) {
    let tries = 0;
    let random1: number = getRandomInt(5);
    let random2: number = getRandomInt(4);
    while (
      ((random1 === 0 && random2 === 0)
        || allCaves[random1][random2].containsTrap
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
      ((random1 === 0 && random2 === 0)
       || allCaves[random1][random2].containsTrap
       || allCaves[random1][random2].containsBat)
      && tries < 20
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
  let tries = 0;
  while (
    ((random1 === 0 && random2 === 0)
     || allCaves[random1][random2].containsTrap
     || allCaves[random1][random2].containsWumpus
     || allCaves[random1][random2].containsBat)
    && tries < 20
  ) {
    random1 = getRandomInt(5);
    random2 = getRandomInt(4);
    tries += 1;
    if (tries === 19) {
      console.error('Unable to place the Wumpus.');
    }
  }
  allCaves[random1][random2].containsWumpus = true;
  wumpusCurrentLocation = `Wumpus location: ${random1}, ${random2}`;
  console.log(wumpusCurrentLocation);
}

function cavesPlaceEverything(): void {
  placeWumpus();
  placeTraps();
  placeBats();
  placeItems();
}

function checkXIsOk(x: number) {
  if (x < 0) {
    x = 4;
  }
  if (x > 4) {
    x = 0;
  }
  return x;
} // Checks if x and y is within the parameters of the allCaves array
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
  const alreadyTriggerd = {
    bats: false,
    traps: false,
    wumpus: false,
  };
  for (let i = 0; i < 4; i++) { // Checks nearby rums
    let tempX: number = currentLocation.x + nextRooms[i].x;
    let tempY: number = currentLocation.y + nextRooms[i].y;
    tempX = checkXIsOk(tempX);
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
  canvasRooms(); // resets the canvas display
  for (let i = 0; i < allCaves.length; i++) {
    for (let j = 0; j < allCaves[i].length; j++) {
      allCaves[i][j].containsBat = false;
      allCaves[i][j].containsTrap = false;
      allCaves[i][j].containsWumpus = false;
      allCaves[i][j].containsItem.length = 0;
    }
  }
  cavesPlaceEverything();
  userArrowCounter = 3;
  enterCounter = 0;
  currentLocation.x = 0;
  currentLocation.y = 0;
  userName = '';
  userPointCounter = 10;
  gameOverScreen.classList.add('hidden');
  enterCounter = 1; // so the player wont need to read all the text again
  userTextInput.value = '';
  userHasCoin = false;
  startGame();
}

function calcUserScore(): void {
  const newUserScore = { name: userName, score: userPointCounter };
  highScoreList.push(newUserScore);
}

function gameOver(win: boolean, reason: string) {
  if (win) {
    // Only includes the player score if the play won.
    calcUserScore();
  }
  mainTextArea.innerHTML = '';
  console.log('Gameover screen triggerd');
  gameOverScreen.classList.remove('hidden');
  userTextInput.classList.add('hidden');
  if (!win) {
    gameOverScreen.innerHTML = 'GAME OVER <br> <br>';
  } else {
    gameOverScreen.innerHTML = 'VICTORY! <br> <br>';
  }
  gameOverScreen.innerHTML += `
  ${userName} ${reason}
  <br> <br> Highscore list:
    <ul> `;
  highScoreList.forEach((user) => {
    gameOverScreen.innerHTML += `<li> ${user.name}: ${user.score} </li>`;
  });
  gameOverScreen.innerHTML += `</ul> 
  <button aria-label="press to restart" id="restartBtn">Restart Game?</button>`;
  document.querySelector('#restartBtn')?.addEventListener('click', fullReset);
}

function displayRoom(i: number, j: number) { // Checks the rum for its properties,
  errorMsg.innerHTML = '';
  handleUserImg('show');
  userTextInput.classList.remove('hidden');
  if (allCaves[i][j].containsBat) {
    mainTextArea.innerHTML = `As you enter the cave you see a giant bat flying straight at you! <br> 
    <br> As you try to escape the bat catches you by the leg and flyes away with you. 
    <br> You manage to break free and fall down to a cave nearby.`;
    userTextInput.classList.add('hidden'); // So the user cant insert any input while flying
    handleUserImg('clear');
    setTimeout(() => {
      batMovesUser();
    }, 3000);
    return;
  } if (allCaves[i][j].containsTrap) {
    mainTextArea.innerHTML = `As you enter the cave you see a giant hole in the middle. <br> 
    <br> You easily go around the hole and as you are almost in the clear. <br>
    <br> You slip and fall into the hole.`;
    if (userHasCoin) {
      mainTextArea.innerHTML += `<br> <br> After falling for two minutes you feel your right pocket heat up. 
      As you put your hand in the pocket and feel the burning hot coin you blink and you 
      find your self back in the cave again. <br> <br>
      Where would you like to go next? N/S/W/E`;
      return;
    }
    handleUserImg('clear');
    userTextInput.classList.add('hidden');
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      ctx.drawImage(endlessHoleImage, 0, 0, 300, 200);
      gameOver(false, 'fell into endless hole');
    }, 3000);
    return;
  } if (allCaves[i][j].containsWumpus) {
    mainTextArea.innerHTML = `As you enter the cave you you smell the foulest of smells. <br>
    <br> A movement deep in the dark is the last thing you see before you are slayed.`;
    if (userHasCoin) {
      const tries = 0;
      allCaves[i][j].containsWumpus = false;
      mainTextArea.innerHTML = `As you enter the cave you you smell the foulest of smells. <br>
      <br> A movement deep in the dark is the last thing you see before 
      before the coin in your pocket bursts and the Wumpus vanishes, now he could be anywhere again... <br> <br>`;
      placeWumpus();
      while (allCaves[i][j].containsWumpus && tries < 20) {
        placeWumpus();
      } // Moves the wumpus to a random room, and removes him from the current room. IF the user has the coin.
      userHasCoin = false;
      displayRoom(currentLocation.x, currentLocation.y);
      return;
    }
    handleUserImg('clear');
    userTextInput.classList.add('hidden');
    setTimeout(() => {
      gameOver(false, 'was eaten by the Wumpus');
    }, 3000);
    return;
  }
  mainTextArea.innerHTML = 'You have entered a new cave. <br>';
  checkNearbyRoom();
  if (allCaves[i][j].containsItem.length > 0) {
    if (allCaves[i][j].containsItem.includes('bonusItem')) {
      mainTextArea.innerHTML += '<br> I find a chest with valuables inside... (Bonus Point)';
      userPointCounter += 3;
    }
    if (allCaves[i][j].containsItem.includes('arrowItem')) {
      mainTextArea.innerHTML += '<br> I find a chest with valuables inside... (Bonus Point)';
      userPointCounter += 3;
    }
    if (allCaves[i][j].containsItem.includes('coinItem')) {
      mainTextArea.innerHTML += `<br> On a table in the corner of the cave 
          there is a single gold coin... (Strange Coin Added)`;
      userHasCoin = true;
    }
    allCaves[i][j].containsItem = []; // Makes it so the same item cant be picked up twice in the same cave.
  }
  mainTextArea.innerHTML += '<br> <br> Where would you like to go next? N/S/W/E';
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
    allCaves[currentLocation.x][currentLocation.y].containsBat
    || allCaves[currentLocation.x][currentLocation.y].containsTrap
    || allCaves[currentLocation.x][currentLocation.y].containsWumpus
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
  canvasRooms();
}

function flyingArrow(direction: number) {
  let arrowLocationX = currentLocation.x;
  let arrowLocationY = currentLocation.y;
  userArrowCounter -= 1;
  // eslint-disable-next-line no-promise-executor-return
  const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
  async function load(): Promise<void> {
    // I use async to create a promise to slow down the loop, so the arrow img can be seen
    for (let i = 0; i < 3; i++) {
      arrowLocationX += nextRooms[direction].x;
      arrowLocationY += nextRooms[direction].y;
      arrowLocationX = checkXIsOk(arrowLocationX);
      arrowLocationY = checkYIsOk(arrowLocationY);
      ctx.drawImage(arrowImg, arrowLocationX * 60, arrowLocationY * 50, 35, 35);
      if (allCaves[arrowLocationX][arrowLocationY].containsWumpus) {
        gameOver(true, 'has slain the Wumpus');
        i = 3;
        return;
      }
      if (arrowLocationX === currentLocation.x && arrowLocationY === currentLocation.y) {
        gameOver(false, 'shot himself with an arrow');
        return;
      }
      // eslint-disable-next-line no-await-in-loop
      await timer(600);
      ctx.clearRect(arrowLocationX * 60, arrowLocationY * 50, 55, 45);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  load();
  if (!mainTextArea.innerHTML.includes('It appears the arrow did not hit anything')) {
    mainTextArea.innerHTML += '<br> <br> It appears the arrow did not hit anything...';
  }
}

function shootArrow(value: string): void {
  switch (value.toLowerCase().replace('shoot ', '')) {
    case 'n':
    case 'north':
      flyingArrow(0);
      break;
    case 's':
    case 'south':
      flyingArrow(1);
      break;
    case 'w':
    case 'west':
      flyingArrow(2);
      break;
    case 'e':
    case 'east':
      flyingArrow(3);
      break;
    default:
      console.log(value);
      errorMsg.innerHTML = ' <br> <br> Wrong input. Use "Shoot N/S/W/E"';
      break;
  }
  if (userArrowCounter === 1 && mainTextArea.innerHTML.includes('VICTORY!')) {
    mainTextArea.innerHTML += '<br> <br> You are down to your last arrow. If you waste it, there is no hope.';
  }
  if (userArrowCounter === 0) {
    gameOver(false, 'ran out of arrows');
  }
}

function movement(value: string): void {
  let errorTriggerd = false;
  userPointCounter -= 1;
  switch (value.toLowerCase()) {
    case 'n':
    case 'north':
      console.log(value);
      currentLocation.x += nextRooms[0].x;
      currentLocation.y += nextRooms[0].y;
      break;
    case 's':
    case 'south':
      currentLocation.x += nextRooms[1].x;
      currentLocation.y += nextRooms[1].y;
      break;
    case 'w':
    case 'west':
      currentLocation.x += nextRooms[2].x;
      currentLocation.y += nextRooms[2].y;
      break;
    case 'e':
    case 'east':
      currentLocation.x += nextRooms[3].x;
      currentLocation.y += nextRooms[3].y;
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
  switch (reason) {
    case 'clear':
      ctx.clearRect(currentLocation.x * 60, currentLocation.y * 50, 55, 45);
      break;
    case 'show':
      ctx.drawImage(userCharImage, currentLocation.x * 60, currentLocation.y * 50, 40, 40);
      break;
    default:
      console.error('handleUserImg function param');
      break;
  }
}

function canvasRooms(): void {
  if (canvas.getContext) {
    console.log(canvas);
    ctx = canvas.getContext('2d');
    for (let row = 0; row < allCaves.length; row++) {
      for (let col = 0; col < allCaves[row].length; col++) {
        ctx.fillStyle = 'rgb(9, 10, 41)';
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
      // First time starting, this is displayed.
      userName = userTextInput.value;
      mainTextArea.innerHTML = `Lets get started ${userName}! <br> <br> You are currently in the caves under the 
      castle of Greveholm. 
      Afraid to be alone? Lucky for you, you are not. There is also a beast by the name of Wumpus in the
      treturous cave system. Your goal is to find and slay the Wumpus. There is loot you can find along 
      the way to aid you, if you find it. Currently you only have a bow and three arrows.
      You navigate using the field below. 
      Simply put in the direktion you would like to go in. <br> <br> Either using full names or the first letter.
      <br> North / South / West / East <br> <br>
      If you wish to shoot your bow, insert "Shoot" and the direction. <br> <br>
      Press Enter again to enter the first cave;`;
    }
    if (enterCounter === 1) {
      displayRoom(0, 0);
      mainStage.classList.add('turned-on');
      canvas.classList.remove('hidden');
      ctx.clearRect(0, 0, 300, 200); // Draws "acess granted", then clears and places img of player.
      ctx.drawImage(backgroundImage, 0, 0, 300, 200);
      setTimeout(() => {
        canvasRooms();
        handleUserImg('show');
      }, 1500);
    }
    if (enterCounter > 1) {
      // Handles all input after the game has started.
      if (userTextInput.value.toLowerCase().includes('shoot')) {
        shootArrow(userTextInput.value);
        userTextInput.value = '';
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
