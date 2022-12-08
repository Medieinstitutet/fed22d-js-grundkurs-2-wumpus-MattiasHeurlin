/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './style/style.scss';

const mainStage = document.querySelector('#mainStage') as HTMLElement;
const mainTextArea = document.querySelector('#mainTextArea') as HTMLElement;
const userTextInput = document.querySelector('#userTextInput') as HTMLInputElement;
const errorMsg = document.querySelector('#errorMsg') as HTMLDivElement;
const nextRooms = [
  { x: 0, y: -1 }, // S
  { x: 0, y: 1 }, // N
  { x: -1, y: 0 }, // W
  { x: 1, y: 0 }, // E
];
let userName = '';
let currentLocation = {
  x: 0,
  y: 0,
};
let wumpusCurrentLocation: any;
let enterCounter = 0;

interface CaveRooms {
  containsWumpus: boolean;
  containsItem: string[];
  containsTrap: boolean;
  containsBat: boolean;
}

const allCaves /*: CaveRooms - Ger många errors FIXME: */ = [
  [
    // Tar upp mycket plats, men eslint vill att man skriver såhär
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
    let random1: number = getRandomInt(3);
    let random2: number = getRandomInt(4);
    console.log(random1 + ' ' + random2);
    while (random1 === 0 && random2 === 0) {
      random1 = getRandomInt(3);
      random2 = getRandomInt(4);
    }
    allCaves[random1][random2].containsTrap = true;
    console.log(`Traps have been placed: ${random1} ${random2}`);
  }
}

function placeBats(): void {
  for (let i = 0; i < 6; i++) {
    let random1: number = getRandomInt(3);
    let random2: number = getRandomInt(4);
    while (random1 === 0 && random2 === 0) {
      random1 = getRandomInt(3);
      random2 = getRandomInt(4);
    }
    allCaves[random1][random2].containsBat = true;
    console.log(`Bats have been placed: ${i}`);
  }
}

function placeWumpus(): void {
  let random1: number = getRandomInt(3);
  let random2: number = getRandomInt(4);
  while (
    allCaves[random1][random2].containsTrap ||
    allCaves[random1][random2].containsBat ||
    (random1 === 0 && random2 === 0)
  ) {
    random1 = getRandomInt(3);
    random2 = getRandomInt(4);
  }
  allCaves[random1][random2].containsWumpus = true;
  wumpusCurrentLocation = `Wumpus location: ${random1}, ${random2}`;
  console.log(wumpusCurrentLocation);
}

function cavesPlaceEverything(): void {
  placeTraps();
  placeBats();
  placeWumpus();
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
    if (tempX < 0) {
      tempX = 4;
    }
    if (tempY < 0) {
      tempY = 3;
    }
    if (tempX > 4) {
      tempX = 0;
    }
    if (tempY > 3) {
      tempY = 0;
    }
    if (allCaves[tempX][tempY].containsBat && !alreadyTriggerd.bats) {
      mainTextArea.innerHTML += '<br> I hear the menacing sounds of bats nearby... <br>';
      alreadyTriggerd.bats = true;
    }
    if (allCaves[tempX][tempY].containsTrap && !alreadyTriggerd.traps) {
      mainTextArea.innerHTML += '<br> I feel a rush of wind, there must be a huge bottomless hole nearby... <br>';
      alreadyTriggerd.traps = true;
    }
    if (allCaves[tempX][tempY].containsWumpus && !alreadyTriggerd.wumpus) {
      mainTextArea.innerHTML += '<br> I get a feeling that everything is fine... <br>';
      alreadyTriggerd.wumpus = true;
    }
    tempX = 0;
    tempY = 0;
  }
}
function batMovesUser() {
  const fiftyFifty = getRandomInt(1);
  if (fiftyFifty === 0) {
    currentLocation.x += getRandomInt(2);
  } else {
    currentLocation.x -= getRandomInt(2);
  }
  if (fiftyFifty === 1) {
    currentLocation.y -= getRandomInt(2);
  } else {
    currentLocation.y += getRandomInt(2);
  }
  currentLocation.x = checkXIsOk(currentLocation.x);
  currentLocation.y = checkYIsOk(currentLocation.y);
  displayRoom(currentLocation.x, currentLocation.y);
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
    //TODO: Trigger game over
  } else if (allCaves[i][j].containsWumpus) {
    mainTextArea.innerHTML = `As you enter the cave you you smell the foulest of smells. <br>
    <br> A movement deep in the dark is the last thing you see before you are slayed.`;
    //TODO: Trigger game over
  } else {
    mainTextArea.innerHTML = 'You have entered a new cave. <br>';
    checkNearbyRoom();
    mainTextArea.innerHTML += 'Where would you like to go next? N/S/W/E';
  }
}

function startGame(): void {
  mainTextArea.innerHTML = 'Great! What would you like your character to be called? <br> Press "Enter" to continue';
  userTextInput.classList.toggle('hidden');
}
function movement(value: string): void {
  console.log(value);
  switch (value.toLowerCase()) {
    case 'n' || 'north':
      currentLocation.x = +nextRooms[0].x;
      currentLocation.y = +nextRooms[0].y;
      console.log('N is triggerd');
      break;
    case 's' || 'south':
      currentLocation.x = +nextRooms[1].x;
      currentLocation.y = +nextRooms[1].y;
      console.log('S is triggerd');
      break;
    case 'w' || 'west':
      currentLocation.x = +nextRooms[2].x;
      currentLocation.y = +nextRooms[2].y;
      console.log('W is triggerd');
      break;
    case 'e' || 'east':
      currentLocation.x = +nextRooms[3].x;
      currentLocation.y = +nextRooms[3].y;
      console.log('E is triggerd');
      break;
    default:
      errorMsg.innerHTML = ' <br> <br> Wrong input';
  }
  currentLocation.x = checkXIsOk(currentLocation.x);
  currentLocation.y = checkYIsOk(currentLocation.y);
  displayRoom(currentLocation.x, currentLocation.y);
}
function textInputEHandler(e) {
  console.log(e.key);
  if (e.key === 'Enter') {
    if (enterCounter === 0) {
      // Första gången man startar och trycker enter så anges detta
      userName = userTextInput.value;
      mainTextArea.innerHTML = `Lets get started ${userName}! <br> <br> You are currently in the caves under the 
      castle of Greveholm. 
      Afraid to be alone? Lucky for you, you are not. There is also a beast by the name of Wumpus in the
      treturous cave system. Your goal is to slay Wumpus before he kills you. There is loot you can find along 
      the way to aid you, if you find it. Currently you only have a bow and three arrows.`;
      setTimeout(() => {
        mainTextArea.innerHTML = `You navigate using the field below. 
        Simply put in the direktion you would like to go in. <br> <br> Either using full names or the first letter.
        <br> North <br> South <br> West <br> East <br> <br> Press Enter again to enter the first cave;`;
      }, 6000);
    }
    if (enterCounter === 1) {
      displayRoom(0, 0);
    }
    if (enterCounter > 1) {
      // Sköter all hantering efter spelet har kommit igång
      console.log('enterCounter mer than 1');
      movement(userTextInput.value);
      displayRoom(currentLocation.x, currentLocation.y);
    }
    enterCounter += 1;
    userTextInput.value = '';
  }
}

userTextInput.addEventListener('keypress', textInputEHandler);
document.querySelector('#startBtn')?.addEventListener('click', startGame);

cavesPlaceEverything();
console.table(allCaves);
