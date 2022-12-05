import './style/style.scss';

const mainStage: unknown = document.querySelector('#mainStage');
const mainTextArea: unknown = document.querySelector('#mainTextArea');
const userTextInput: unknown = document.querySelector('#userTextInput');
document.querySelector('#startBtn')?.addEventListener('click', startGame);
let userName = '';
console.log(userTextInput);
let currentInstance = 0;
let wumpusCurrentLocation: any;

interface CaveRooms {
  wumpusIsHere: boolean;
  containsItem: string;
}

let allCaves: CaveRooms = [
  [{wumpusIsHere: false,
  containsItem: ''}, {wumpusIsHere: false,
    containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
      containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
    containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
      containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
      containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
      containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
    containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
    containsItem: ''} ],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
      containsItem: ''}],
  [{wumpusIsHere: false,
    containsItem: ''}, {wumpusIsHere: false,
      containsItem: ''}
]];


function getRandomInt(max): any {
  return Math.floor(Math.random() * max);
}

function placeWumpus(): void {
  let random1: int = getRandomInt(4);
  let random2: int = getRandomInt(3);
  allCaves[random1][random2].wumpusIsHere = true;
  wumpusCurrentLocation = `Wumpus location: ${random1}, ${random2}`;
}

placeWumpus();

console.log(wumpusCurrentLocation);

function startGame(): void {
  mainTextArea.innerHTML = 'Great! What would you like your character to be called? <br> Press "Enter" to continue';
  userTextInput.classList.toggle('hidden');
  userTextInput.addEventListener('keypress', (e) => {
    userName = userTextInput.value; // TODO: Fixa max antal tecken 
    if (e.key === 'Enter') {
      userTextInput.value = '';
      userTextInput.classList.toggle('hidden');
      currentInstance++;
      nextInstance();
    }
  });
};

function nextInstance(): void {
  if (currentInstance == 1) {
    mainTextArea.innerHTML = `Lets get started ${userName}! <br> <br> You are currently in the caves under the 
    castle of Greveholm. 
    Afraid to be alone? Lucky for you, you are not. There is also a beast by the name of Wumpus in the
    treturous cave system. Your goal is the slay Wumpus before he kills you. There is loot you can find along 
    the way to aid you, if you need it. Currently you only have a bow and two arrows.`;
  }
}