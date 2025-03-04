/*
@title: virus_plowing
@author: Danush Ramanan
*/

/*
CONTROLS:
  W - Move Up
  S - Move Down
  A - Move Left
  D - Move Right

  I - Info
*/

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(dir) {
    switch(dir) {
      case 'w':
        this.y--;
        break;
      case 'a':
        this.x--;
        break;
      case 's':
        this.y++;
        break;
      case 'd':
        this.x++;
        break;
      default:
        break;
    }
  }

  update() {
    getFirst(playerKey).x = this.x;
    getFirst(playerKey).y = this.y;
  }
}

const playerKey = "p";
const virusKey = "v";
const shieldKey = "s";

const killVirusSound = tune`
124.48132780082987: c5~124.48132780082987,
124.48132780082987: f5~124.48132780082987 + c5-124.48132780082987,
124.48132780082987: f5-124.48132780082987,
3609.9585062240662`;
const dieSound = tune`
205.4794520547945: f5-205.4794520547945 + b4^205.4794520547945,
205.4794520547945: f5-205.4794520547945 + b4^205.4794520547945,
205.4794520547945: c5-205.4794520547945 + f4^205.4794520547945,
205.4794520547945: c5-205.4794520547945 + f4^205.4794520547945,
205.4794520547945: e5-205.4794520547945 + a4^205.4794520547945,
205.4794520547945: d5-205.4794520547945 + g4^205.4794520547945,
205.4794520547945,
205.4794520547945: b4/205.4794520547945,
205.4794520547945: b4/205.4794520547945,
4726.027397260274`;

let score = 0;
let showingInstructions = false;

setLegend(
  [ playerKey, bitmap`
3333333333333333
3333333333333333
3333333333333333
3330003333000333
3330003333000333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
...33......33...
...33......33...
...33......33...
...33......33...
..3333....3333..`],
  [ virusKey, bitmap`
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444`],
  [ shieldKey, bitmap`
................
................
7......77......7
7777777777777777
7777777777777777
7777779779777777
7777999999997777
7777944444497777
7777794444977777
7777779449777777
.77777799777777.
.77777777777777.
..777777777777..
..777777777777..
...7777777777...
................` ]
);

setSolids([playerKey, shieldKey]);

let level = 0;
const levels = [
  map`
..................
.p................
...............v..
..................
..................
..................
..................
..................
.......s..........
..................
..................`,
  map`
..................
..................
..................
..................
..................
..................
..................
..................
..................
..................
..................`,
];

setMap(levels[level]);

setPushables({
  [ playerKey ]: [ shieldKey ],
});

let player = new Player(getFirst(playerKey).x, getFirst(playerKey).y);

onInput("w", () => {
  player.move('w');
});
onInput("a", () => {
  player.move('a');
});
onInput("s", () => {
  player.move('s');
});
onInput("d", () => {
  player.move('d');
});

onInput("i", () => {
  if (level !== 0) return;
  if (!showingInstructions) {
    addText("Move with WASD.\nPush shield into \nvirus squares.\nDon't touch viruses!", { 
      x: 0,
      y: 1,
      color: color`3`
    })
  } else {
    clearText();
  }
  showingInstructions = !showingInstructions;
  
});

afterInput(() => {
  if (level === 1) {
    clearText()
    setMap(levels[level]);
    addText("You Died", { 
      x: 6,
      y: 1,
      color: color`3`
    })

    addText(`Score: ${score}`, { 
      x: 6,
      y: 3,
      color: color`3`
    })
  } else {
    player.update();
  
    let toVirusSpawn = Math.floor(Math.random() * 2);
    if (toVirusSpawn === 1) {
      addSprite(Math.floor(Math.random() * width()), Math.floor(Math.random() * height()), virusKey);
      if (getAll(virusKey)[getAll(virusKey).length - 1] === player.x && getAll(virusKey)[getAll(virusKey).length - 1] === player.y) getAll(virusKey)[getAll(virusKey).length - 1].remove();
      if (getAll(virusKey)[getAll(virusKey).length - 1] === getFirst(shieldKey).x && getAll(virusKey)[getAll(virusKey).length - 1] === getFirst(shieldKey).y) getAll(virusKey)[getAll(virusKey).length - 1].remove();
    }
    for (const virus of getAll(virusKey)) {
      if (toVirusSpawn === 1) if (getAll(virusKey)[getAll(virusKey).length - 1] === virus.x && getAll(virusKey)[getAll(virusKey).length - 1] === virus.y) getAll(virusKey)[getAll(virusKey).length - 1].remove();
      if (player.x === virus.x && player.y === virus.y) {
        getFirst(playerKey).remove();
        playTune(dieSound);
        clearText();
        addText("Press Any Key.", { 
          x: 3,
          y: 1,
          color: color`3`
        })
        level = 1;
      }
      if (getFirst(shieldKey).x === virus.x && getFirst(shieldKey).y === virus.y) {
        virus.remove();
        playTune(killVirusSound);
        score++;
      }
    }
  }
});
