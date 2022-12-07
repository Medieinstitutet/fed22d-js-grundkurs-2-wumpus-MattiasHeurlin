/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import './style/style.scss';

const mainStage = document.querySelector('#mainStage') as HTMLElement;
const mainTextArea = document.querySelector('#mainTextArea') as HTMLElement;
const userTextInput = document.querySelector('#userTextInput') as HTMLInputElement;

let userName = '';
let currentLocation = {
  x: 0,
  y: 0,
};
let wumpusCurrentLocation: any;
let enterCounter: number;

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
    allCaves[getRandomInt(3)][getRandomInt(4)].containsTrap = true;
    console.log(`Traps have been placed: ${i}`);
  }
}

function placeBats(): void {
  for (let i = 0; i < 6; i++) {
    let random1: number = getRandomInt(3);
    let random2: number = getRandomInt(4);
    while (allCaves[random1][random2].containsTrap) {
      random1 = getRandomInt(3);
      random2 = getRandomInt(4);
      console.log('While loop has been triggerd');
    }
    allCaves[random1][random2].containsBat = true;
    console.log(`Bats have been placed: ${i}`);
  }
}

function placeWumpus(): void {
  let random1: number = getRandomInt(3);
  let random2: number = getRandomInt(4);
  while (allCaves[random1][random2].containsTrap || allCaves[random1][random2].containsBat) {
    random1 = getRandomInt(3);
    random2 = getRandomInt(4);
    console.log(`Wumpus While loop has been triggerd: ${random1} ${random2}`);
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

function startGame(): void {
  mainTextArea.innerHTML = 'Great! What would you like your character to be called? <br> Press "Enter" to continue';
  userTextInput.classList.toggle('hidden');
}

function textInputEHandler(e) {
  console.log(e.key);
  if (e.key === 'Enter') {
    if (enterCounter === 0) {
      userName = userTextInput.value;
      mainTextArea.innerHTML = `Lets get started ${userName}! <br> <br> You are currently in the caves under the 
      castle of Greveholm. 
      Afraid to be alone? Lucky for you, you are not. There is also a beast by the name of Wumpus in the
      treturous cave system. Your goal is to slay Wumpus before he kills you. There is loot you can find along 
      the way to aid you, if you find it. Currently you only have a bow and two arrows.
      <br> <br> Press Enter again to enter the first room`;
    }
   if (enterCounter === 1) {
      displayRoom(0,0);
    }
    enterCounter =+ 1;
    userTextInput.value = '';
  }
}

function movement(): void {
  /**
   * Hämta nuvarande position
   * flytta åt något håll
   * Kolla vad nytt rum innehåller
   * Ge respons beroande på vad som finns i närliggande rum.
   * Ge val att avfyra pil
   * Ge val att kolla inventory
   * Ge val att röra sig igen
   */
}
function displayRoom(i: number, j: number) {
  /** TODO:
   * Slumpa fram svar på olika situationer inom samma parameter
   * animera utskriften, all text ska inte komma samtidigt.
   */
  if (allCaves[i][j].containsBat) {
    mainTextArea.innerHTML = `As you enter the cave you see a giant bat flying straight at you! <br> 
    <br> As you try to escape the bat catches you by the leg and flyes away with you. 
    <br> You manage to break free and fall down to a cave nearby.`;
    // TODO: Fixa uträckning för nytt rum
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
    mainTextArea.innerHTML = `You have entered a new cave. <br>`;
    checkNearbyRoom();
  }
}
function checkNearbyRoom() {
  for (let i = 0; i < 4; i++) {
    const testcounter = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }, // FIXME: Denna funkar inte alls
    ];
    if (allCaves[(currentLocation.x + testcounter[i].x)][(currentLocation.y + testcounter[i].y)].containsBat) {
      mainTextArea.innerHTML =+ '<br> I hear the menacing souds of bats nearby...';
    }
    if (allCaves[(currentLocation.x + testcounter[i].x)][(currentLocation.y + testcounter[i].y)].containsTrap) {
      mainTextArea.innerHTML =+ '<br> I fell a rush of wind, there must be a huge bottomless hole nearby...';
    }
    if (allCaves[(currentLocation.x + testcounter[i].x)][(currentLocation.y + testcounter[i].y)].containsWumpus) {
      mainTextArea.innerHTML =+ '<br> I get a feeling that everything is fine...';
    }
    console.log(testcounter[i]);
  }
}

userTextInput.addEventListener('keypress', textInputEHandler);
document.querySelector('#startBtn')?.addEventListener('click', startGame);

cavesPlaceEverything();
console.table(allCaves);
