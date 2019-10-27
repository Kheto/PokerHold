var deck = [];
var SUITS = ["c", "d", "h", "s"],
  VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

var SCORE_VALUES = {
  "High Card": 0,
  Pair: 1,
  "Two Pair": 5,
  "Three of a Kind": 20,
  "Full House": 50,
  Flush: 100,
  Straight: 125,
  "Four of a Kind": 300
};
var FLOP_SIZE = 5;
var HAND_SIZE = 3;

var score = {},
  tableCards = [],
  carriedCard = [];

var animTime = 1;

deck.populate = function() {
  for (suit of SUITS) {
    for (value of VALUES) {
      deck.push([value, suit]);
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
  carriedCard = tableCards.splice(
    tableCards.indexOf(
      tableCards.find((e, i) => {
        return e[0] == value && e[1] == suit;
      })
    ),
    1
  );
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
  updateScore();
  cleanup();
  setupRound();
}

function setupRound() {
  if (deck.length < 8) {
    deck.populate();
    deck.shuffle();
  }
  for (var i = 0; i < FLOP_SIZE; i++) {
    var newCard = deck.draw();
    tableCards.push(newCard);
    document
      .querySelector(".flop-container")
      .appendChild(createCard(newCard[0], newCard[1]));
  }

  for (var i = 0; i < HAND_SIZE; i++) {
    var newCard;
    var isCarried = false;
    if (carriedCard.length > 0) {
      newCard = carriedCard.pop();
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

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

setupRound();
