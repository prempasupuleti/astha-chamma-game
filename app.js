
let deg = 720;
let count = 1;
const safe = [0, 4, 8, 12];
const keys = ["one", "two", "three", "four"];
const tokensArray = [
  `oneplayer1`,
  `twoplayer1`,
  `threeplayer1`,
  `fourplayer1`,
  `oneplayer3`,
  `twoplayer3`,
  `threeplayer3`,
  `fourplayer3`,
];
const domelements = {
  rollDice: document.querySelector(".dice_container-text"),
  cube: document.querySelector(".cube"),
  peices: document.querySelectorAll(`.player1`),
  peices: document.querySelectorAll(`.player2`),
  boardContainer: document.querySelector(".content_board_gridContainer"),
  iconContainer: document.querySelector(".content_board_gridContainer--item"),
  diceText: document.querySelector(".dice_container-text"),
  infoText: document.querySelector(".info-text"),
};


let state = {
  personTobeRolled: 1,
  currentdiceValue: 0,
  positionUpdated: false,
};


class Person {
  constructor(state, player, position) {
    this.state = state;
    this.player = player;
    this.currentDice = [];
    this.kills = 0;
    this.currentposition = position;
  }
}

let player1 = new Person({}, 1, { one: 0, two: 0, three: 0, four: 0 });

let player3 = new Person({}, 3, { one: 8, two: 8, three: 8, four: 8 });


const randomGenerator = () => {
  return Math.floor(Math.random() * 6 + 1);
};


let currentClass = "";
const changeDiceSide = (rolledNumber) => {
  domelements.cube.style.transform = ``;
  var showClass = "show-" + rolledNumber;
  if (currentClass) {
    domelements.cube.classList.remove(currentClass);
  }
  domelements.cube.classList.add(showClass);
  currentClass = showClass;
};

const rollDice = () => {
  return new Promise((resolve, reject) => {
    let diceValue;
    setTimeout(() => {
      mySound = new sound("./Assets/diceroll.wav");
      mySound.play();
    }, 1000);

    const stopTimeInterval = setInterval(() => {
      domelements.cube.style.transform = `rotate3d(1, 1, 1,${deg + 1000}deg)`;
      deg += 720;
    }, 1000);
    setTimeout(() => {
      clearInterval(stopTimeInterval);
      diceValue = randomGenerator();
      changeDiceSide(diceValue);
      state.currentdiceValue = diceValue;
      resolve(diceValue);
    }, 3000);
  });
};


const updatePlayer = (playerNumber) => {
  domelements.diceText.textContent = `Player ${playerNumber} rolled the dice`;
  domelements.boardContainer.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    mySound = new sound("./Assets/button click.mp3");
    mySound.play();
    if (state.positionUpdated === false) {
      if (tokensArray.includes(`${event.target.id}`)) {
        console.log("updating the Token");
        updateToken(event.target.id, event.target.className);
      } else {
        domelements.infoText.textContent =
          "please select correct token to move";
        alert(`please select correct token to move`);
      }
    }
  });
};


let classNameUpdated;
let id;
function updateToken(ids, className) {
  classNameUpdated = className.split(" ");
  id = ids;
  console.log(classNameUpdated);
  console.log(id);
  if (state.personTobeRolled === 1 && classNameUpdated[1] === "player1") {
    let curPos = player1.currentposition[classNameUpdated[0]];
    if (state.currentdiceValue + curPos <= 15) {
      somef(player1);
    } else if (state.currentdiceValue + curPos > 15) {
      if (player1.kills >= 1) {
        somef(player1);
      } else {


        alert("Please have a kill");
        updatePlayer(state.personTobeRolled);
      }
    } else if (state.currentdiceValue + curPos > 24) {

      alert("Please select a valid Player");
      return;
    }
  } else if (
    state.personTobeRolled === 3 &&
    classNameUpdated[1] === "player3"
  ) {
    let curPos = player3.currentposition[classNameUpdated[0]];

    if (state.currentdiceValue + curPos <= 15 && curPos >= 8) {
      somef(player3);
    } else if (state.currentdiceValue + curPos > 15 && curPos - 16 < 0) {
      somef(player3, 16);
    } else if (state.currentdiceValue + curPos > 7 && curPos < 8) {
      if (player3.kills >= 1) {
        if (state.currentdiceValue + curPos <= 11) {
          state.currentdiceValue + curPos;
          somef(player3, -12);
        }
      } else {

        alert("Please Have a kill");
        updatePlayer(state.personTobeRolled);
      }
    } else if (state.currentdiceValue + curPos > 23 && curPos >= 7) {
      if (
        state.currentdiceValue + curPos - 8 >= 16 &&
        state.currentdiceValue + curPos - 8 <= 19
      ) {
        somef(player3, 8);
      }
    } else if (curPos >= 16 && curPos <= 19) {
      if (curPos + state.currentdiceValue <= 19) {
        somef(player3);
      } else if (curPos + state.currentdiceValue === 20) {
        somef(player3, -4);
      }
    } else if (curPos <= 23 && state.currentdiceValue + curPos - 8 > 20) {

      alert("Please other player as this player has no valid move");
      updatePlayer(state.personTobeRolled);
    } else {
      somef(player3);
    }
  } else {

    alert(`Please select Player ${state.personTobeRolled}`);
  }
}



function somef(player, stepsToSubstract = 0) {
  state.positionUpdated = true;
  console.log(document.querySelector(`#${id}`));
  document
    .querySelector(`#${id}`)
    .parentNode.removeChild(document.querySelector(`#${id}`));
  console.log(
    state.currentdiceValue,
    player.currentposition[classNameUpdated[0]],
    stepsToSubstract
  );

  document
    .querySelector(
      `div[id="${
        state.currentdiceValue +
        player.currentposition[classNameUpdated[0]] -
        stepsToSubstract
      }"]`
    )
    .insertAdjacentHTML(
      "beforeEnd",
      `<div class="${classNameUpdated[0]} ${classNameUpdated[1]}" id="${id}"></div>`
    );
  checkforKill(classNameUpdated[1], classNameUpdated[0], stepsToSubstract);
  updateValueInPlayerState(
    state.personTobeRolled,
    classNameUpdated[0],
    state.currentdiceValue,
    stepsToSubstract
  );
}
function checkforKill(player, positon, stepsToSubstract = 0) {
  console.log(`entered checkforKill`);
  if (player === "player1") {
    keys.forEach((key) => {
      killUpdateplayer1(key, stepsToSubstract, positon);
    });
  } else if (player === "player3") {
    keys.forEach((key) => {
      killUpdateplayer3(key, stepsToSubstract, positon);
    });
  }

  function killUpdateplayer1(key, stepsToSubstract = 0, positon) {
    console.log(`entered checkforKill`);

    if (
      player1.currentposition[positon] + state.currentdiceValue ===
        player3.currentposition[key] &&
      !safe.includes(player1.currentposition[positon] + state.currentdiceValue)
    ) {
      player3.currentposition[key] = 8;
      player1.kills = player1.kills + 1;
      document
        .getElementById(`${key}player3`)
        .parentNode.removeChild(document.getElementById(`${key}player3`));
      document
        .querySelector(`div[id="8"]`)
        .insertAdjacentHTML(
          "beforeEnd",
          `<div class="${key} player3" id="${key}player3"></div>`
        );
    }
  }
  function killUpdateplayer3(key, stepsToSubstract = 0, positon) {
    console.log(`entered checkforKill`);
    if (
      player3.currentposition[positon] +
        state.currentdiceValue -
        stepsToSubstract ===
        player1.currentposition[key] &&
      !safe.includes(
        player3.currentposition[positon] +
          state.currentdiceValue -
          stepsToSubstract
      )
    ) {
      player1.currentposition[key] = 0;
      player3.kills = player3.kills + 1;
      document
        .getElementById(`${key}player1`)
        .parentNode.removeChild(document.getElementById(`${key}player1`));
      document
        .querySelector(`div[id="0"]`)
        .insertAdjacentHTML(
          "beforeEnd",
          `<div class="${key} player1" id="${key}player1"></div>`
        );
    }
  }
}


function updateValueInPlayerState(
  player,
  CurIconPosition,
  dice,
  stepsToSubstract = 0
) {
  console.log("hello");
  switch (player) {
    case 1: {

      player1.currentposition[CurIconPosition] += dice - stepsToSubstract;
      console.log(player1);
      state.personTobeRolled = 3;
      checkWin(player1);
      break;
    }
    case 3: {
      player3.currentposition[CurIconPosition] += dice - stepsToSubstract;
      console.log(player3);
      state.personTobeRolled = 1;
      checkWin(player3);
      break;
    }
  }
}


domelements.rollDice.addEventListener("click", async () => {
  await rollDice().then((data) => {
    state.currentdiceValue = data;
    console.log(`Dice Rolled`);
    state.positionUpdated = false;
    swiPlayer(state.personTobeRolled);
  });
});

function swiPlayer(currentPlayer) {
  console.log(currentPlayer);
  switch (currentPlayer) {
    case 1: {
      let bool = updatePlayer(1);
      if (bool === false) {
        updatePlayer(1);
      }
      checkWin(player1);
      break;
    }
    case 3: {
      let bool = updatePlayer(3);
      if (bool === false) updatePlayer(3);
      checkWin(player3);
      break;
    }
  }
}

function checkWin(player) {
  if (
    player.currentposition[keys[0]] === 24 ||
    player.currentposition[keys[1]] === 24 ||
    player.currentposition[keys[2]] === 24 ||
    player.currentposition[keys[3]] === 24
  ) {

    console.log(
      player.currentposition[keys[0]] === 24 ||
        player.currentposition[keys[1]] === 24 ||
        player.currentposition[keys[2]] === 24 ||
        player.currentposition[keys[3]] === 24
    );
    alert(`Player ${state.personTobeRolled} won the Match`);
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
