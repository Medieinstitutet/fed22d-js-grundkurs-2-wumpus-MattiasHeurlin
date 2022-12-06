/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './style/style.scss';

const mainStage = document.querySelector('#mainStage') as HTMLElement;
const mainTextArea = document.querySelector('#mainTextArea') as HTMLElement;
const userTextInput = document.querySelector('#userTextInput') as HTMLInputElement;
let userName = '';
let currentInstance = 0;
let wumpusCurrentLocation: any;

interface CaveRooms {
  wumpusIsHere: boolean;
  containsItem: string[];
  containsTrap: boolean;
  containsBat: boolean;
}

const allCaves /*: CaveRooms - Ger många errors FIXME: */ = [
  [ // Tar upp mycket plats, men eslint vill att man skriver såhär
    {
      wumpusIsHere: false, containsItem: [''], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
  ],
  [
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
  ],
  [
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
  ],
  [
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
  ],
  [
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
    {
      wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false,
    },
  ],
];

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function placeWumpus(): void {
  const random1: number = getRandomInt(4);
  const random2: number = getRandomInt(3);
  allCaves[random1][random2].wumpusIsHere = true;
  wumpusCurrentLocation = `Wumpus location: ${random1}, ${random2}`;
  console.log(wumpusCurrentLocation);
}
function placeTraps(): void {
  for (let i = 0; i < 5; i++) {
    allCaves[getRandomInt(4)][getRandomInt(3)].containsTrap = true;
    console.log(`Traps have been placed: ${i}`);
  }
}
function placeBats(): void {
  for (let i = 0; i < 5; i++) {
    allCaves[getRandomInt(4)][getRandomInt(3)].containsBat = true;
    console.log(`Bats have been placed: ${i}`);
  }
}

function cavesPlaceEverything(): void {
  placeWumpus();
  placeTraps();
  placeBats();
}

function nextInstance(): void {
  if (currentInstance === 1) {
    mainTextArea.innerHTML = `Lets get started ${userName}! <br> <br> You are currently in the caves under the 
    castle of Greveholm. 
    Afraid to be alone? Lucky for you, you are not. There is also a beast by the name of Wumpus in the
    treturous cave system. Your goal is the slay Wumpus before he kills you. There is loot you can find along 
    the way to aid you, if you find it. Currently you only have a bow and two arrows.`;
  }
}

function startGame(): void {
  mainTextArea.innerHTML = 'Great! What would you like your character to be called? <br> Press "Enter" to continue';
  userTextInput.classList.toggle('hidden');
  userTextInput.addEventListener('keypress', (e) => {
    userName = userTextInput.value; // TODO: Fixa max antal tecken
    if (e.key === 'Enter') {
      userTextInput.value = '';
      userTextInput.classList.toggle('hidden');
      currentInstance += 1;
      nextInstance();
    }
  });
}
document.querySelector('#startBtn')?.addEventListener('click', startGame);

cavesPlaceEverything();
console.table(allCaves);
