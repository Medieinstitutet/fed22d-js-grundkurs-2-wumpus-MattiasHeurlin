import './style/style.scss';

const mainStage: object = document.querySelector('#mainStage');
const mainTextArea: object = document.querySelector('#mainTextArea');
const userTextInput: object = document.querySelector('#userTextInput');
document.querySelector('#startBtn')?.addEventListener('click', startGame);
let userName = '';
console.log(userTextInput);
let currentInstance = 0;
let wumpusCurrentLocation: any;

interface CaveRooms {
  wumpusIsHere: boolean;
  containsItem: Array<string>;
  containsTrap: boolean;
  containsBat: boolean;
}

let allCaves: CaveRooms = [
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
  [
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
    { wumpusIsHere: false, containsItem: [], containsTrap: false, containsBat: false },
  ],
];

function getRandomInt(max:number): number {
  return Math.floor(Math.random() * max);
}

function placeWumpus(): void {
  let random1: number = getRandomInt(4);
  let random2: number = getRandomInt(3);
  allCaves[random1, random2].wumpusIsHere = true;
  wumpusCurrentLocation = `Wumpus location: ${random1}, ${random2}`;
  console.log(wumpusCurrentLocation);
}
function placeTraps(): void {
  for (let i = 0; i < 5;i++) {
    allCaves[getRandomInt(4), getRandomInt(3)].containsTrap = true;
    console.log('Trap has been placed ' + i)
  }
}
function placeBats(): void {
  for (let i = 0; i < 5;i++) {
    allCaves[getRandomInt(4), getRandomInt(3)].containsbat = true;
    console.log('Bat has been placed ' + i)
  }
}

function cavesPlaceEverything(): void {
  placeWumpus();
  placeTraps();
  placeBats();
}

function nextInstance(): void {
  if (currentInstance == 1) {
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
  userTextInput.addEventListener('keypress', e => {
    userName = userTextInput.value; // TODO: Fixa max antal tecken
    if (e.key === 'Enter') {
      userTextInput.value = '';
      userTextInput.classList.toggle('hidden');
      currentInstance += 1;
      nextInstance();
    }
  });
}
cavesPlaceEverything();

console.table(allCaves);
