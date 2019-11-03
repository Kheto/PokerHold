var deck = [];
var SUITS = ["c", "d", "h", "s"],
  VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];

var SCORE_VALUES = {
  "High Card": 0,
  Pair: 5,
  "Two Pair": 10,
  "Three of a Kind": 50,
  "Full House": 200,
  Flush: 100,
  Straight: 250,
  "Four of a Kind": 300
};
var FLOP_SIZE = 5,
  HAND_SIZE = 3;
var DECK_MIN_SIZE = FLOP_SIZE + HAND_SIZE - 1;
var INITIAL_ROUNDS = 3;

var CASH_ID = "test_cash";

var score = {},
  tableCards = [],
  carriedCard = [];

var animTime = 1;

var roundsLeft = INITIAL_ROUNDS;

//initialize shuffle animation
var shuffleAnimationDelay = 0.5;
for (el of document.querySelectorAll(".shuffle-text")) {
  console.log(el);
  el.style.animationDelay = shuffleAnimationDelay;
  shuffleAnimationDelay += 0.5 + "s";
}

deck.populate = function() {
  //console.log("Carried card:", carriedCard[0][0], carriedCard[0][1]);
  for (suit of SUITS) {
    for (value of VALUES) {
      if (value !== carriedCard[0] || suit !== carriedCard[1]) {
        deck.push([value, suit]);
      }
    }
  }
};

deck.shuffle = function() {
  this.sort(() => Math.random() - 0.5);
};
deck.draw = function() {
  return this.pop();
};

function createCard(value, suit) {
  let newCard = document.createElement("div");
  newCard.classList.add("card");
  newCard.style.backgroundImage = `url(./png/${value + suit}.png)`;
  newCard.style.animationDuration = animTime + "s";
  animTime += 0.05;
  newCard.value = [value, suit];
  newCard.onclick = function() {
    resolveGame(value, suit);
    // console.log(tableCards.indexOf([value, suit]));
    //console.log(document.querySelectorAll(".flop-container > .card"));
  };
  return newCard;
}

function resolveGame(value, suit) {
  carriedCard = tableCards
    .splice(
      tableCards.indexOf(
        tableCards.find((e, i) => {
          return e[0] == value && e[1] == suit;
        })
      ),
      1
    )
    .flat();
  var hand = Hand.solve(
    tableCards.map(x => {
      return x.join("");
    })
  );
  console.log(
    tableCards.map(x => {
      return x.join("");
    })
  );
  if (score[hand.name]) {
    score[hand.name] += 1;
  } else {
    score[hand.name] = 1;
  }
  console.log(hand.name);
  console.log(deck.length);

  if (deck.length < DECK_MIN_SIZE) {
    roundsLeft -= 1;
  }

  if (roundsLeft > 0) {
    updateScore();
    cleanup();
    setupRound();
  } else {
    cleanup();
    gameover();
  }
}

function setupRound() {
  if (deck.length < 8) {
    if (roundsLeft < INITIAL_ROUNDS) {
      displayShuffleOverlay();
    }
    deck.populate();
    deck.shuffle();
  }
  for (var i = 0; i < FLOP_SIZE; i++) {
    var newCard = deck.draw();
    tableCards.push(newCard);
    var cardEl = createCard(newCard[0], newCard[1]);
    cardEl.onclick = undefined;
    document.querySelector(".flop-container").appendChild(cardEl);
  }

  for (var i = 0; i < HAND_SIZE; i++) {
    var newCard;
    var isCarried = false;
    if (carriedCard.length > 0) {
      newCard = carriedCard;
      carriedCard = [];
      isCarried = true;
    } else {
      newCard = deck.draw();
    }
    tableCards.push(newCard);
    var cardEl = createCard(newCard[0], newCard[1]);
    if (isCarried) {
      cardEl.style.animation = "none";
      cardEl.style.animationDuration = "0";
    }
    document.querySelector(".hand-container").appendChild(cardEl);
  }
}

function cleanup() {
  tableCards = [];
  animTime = 0.25;
  removeChildren(document.querySelector(".hand-container"));
  removeChildren(document.querySelector(".flop-container"));
}

function updateScore() {
  const scoreboard = document.querySelector(".scoreboard");
  removeChildren(scoreboard);
  var total = 0;

  for (row in score) {
    var newRow = document.createElement("li");
    newRow.innerText = `${row}: ${score[row]} x $${SCORE_VALUES[row]}`;
    scoreboard.appendChild(newRow);
    total += score[row] * SCORE_VALUES[row];
  }
  newRow = document.createElement("li");
  newRow.innerText = `Total: $${total}`;
  scoreboard.appendChild(newRow);
}

function gameover() {
  var total = 0;
  var highscore = window.sessionStorage.getItem("highscore");
  for (row in score) {
    total += score[row] * SCORE_VALUES[row];
  }
  if (highscore < total) {
    highscore = total;
    window.sessionStorage.setItem("highscore", total);
  }
  document.querySelector(".result-text").innerText =
    "Game Over \n Final score: $" + total + "\nHighscore: $" + highscore;
  document.querySelector(".result-overlay").classList.remove("hidden");

  var cash = parseInt(window.localStorage.getItem(CASH_ID));
  if (cash == null || isNaN(cash)) {
    cash = 0;
  }
  cash += total;
  console.log("setting cash to", cash)
  window.localStorage.setItem(CASH_ID, cash);
}

function displayShuffleOverlay() {
  document.querySelector(".shuffle-overlay").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector(".shuffle-overlay").classList.add("hidden");
  }, 1000);
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

setupRound();
