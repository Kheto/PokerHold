Array.prototype.contains = function(val) {
  return this.indexOf(val) > -1 ? true : false;
};

var items = [
  {
    id: 0,
    dependsOn: -1,
    price: 2500,
    desc: "Take out a hit on Jeremy Clarkson.",
    result: `Jeremy Clarkson saunters confidently to his car and gets in. After
  briefly reveling in how rich he is, he turns the key in the ignition and
  explodes.`
  },
  {
    id: 1,
    dependsOn: -1,
    price: 349,
    desc: "Latest games console.",
    result: `You sit down to play the most recently released video game. A loading bar informs you that it will be ready to play in 4 hours.

  After the game has started, you play for 15 minutes before realising you aren't having fun.`
  },
  {
    id: 2,
    dependsOn: -1,
    price: 30,
    desc: "Screen printed canvas bag.",
    result: `Upon receiving the bag you spend 20 minutes thinking of new outfits that it would compliment. You briefly consider buying new clothes before putting the bag somewhere in your car and forgetting about it.`
  },
  {
    id: 3,
    dependsOn: 0,
    price: 10000,
    desc: "Jeremy's old cars",
    result:
      "You've bought all of Jeremy Clarkson's old cars. At the auction his wife seems distraught, you comfort her. A BBC executive offers you his old job."
  },
  {
    id: 4,
    dependsOn: 1,
    price: 70,
    desc: "Another video game",
    result:
      "Something about this game's story speaks to you deeply. You spend the weekend explaining it to your friends. After a week you have stopped playing without completing it. One day you'll try to play it again but you won't remember the controls."
  },
  {
    id: 5,
    dependsOn: 3,
    price: 300,
    desc: "Monthly train ticket to the BBC studio",
    result:
      "You are now a co-host on Jeremy Clarkson's old TV programme. While wrapping up the last episode of the series you run into his wife again. She asks you to dinner."
  },
  {
    id: 6,
    dependsOn: 5,
    price: 200,
    desc:
      "Take Jeremy Clarson's widow to dinner and assume your place within his family.",
    result: "You are Jeremy Clarkson"
  },
  {
    id: 7,
    dependsOn: 2,
    price: 60,
    desc: "Box of old CDs",
    result:
      "None of these are good. You listen to the one with the highest rating on Last.fm out of stubbornness."
  },
  {
    id: 8,
    dependsOn: -1,
    price: 5,
    desc: "Extra hot chilli sauce",
    result:
      "You pour some gingerly onto a Dorito. The taste is pleasant for a few seconds until you are overcome with pain. This was a bad idea."
  },
  {
    id: 9,
    dependsOn: 2,
    price: 600,
    desc: "Used car",
    result:
      "This car is only slightly nicer than you previous car. It makes fewer weird noises. You realise you left your canvas bag in the old one."
  },
  {id: 10,
  dependsOn: 0,
price: 400,
desc: "Adrenochrome from the dark net",
result:"A white powder arrives in a nondescript package. You're not sure how to take it. You've heard you should have someone with you to guide you through the trip. You don't trust any of your friends enough so it sits at the back of a drawer for 47 years until one of your children inherits it."}
];

var CASH_ID = "test_cash",
  HISTORY_ID = "test_history";

var selected = undefined;
var cash = getCash();

function populate() {
  var productList = document.querySelector(".product-list");
  var history = getPurchaseHistory();
  if (history.length >= items.length){
    items = [{id: 9999 + history.length, dependsOn: -1, price: 99999, desc: "Game over, idiot. You fool. You clown. Go do something important.", result: "Stupid idiot"}]
  }

  for (let item of items) {
    console.log(item.id, item.dependsOn);
    if (
      (!history.contains(item.id) && item.dependsOn < 0) ||
      (history.contains(item.dependsOn) && !history.contains(item.id))
    ) {
      var rowElement = createProductRow(item);
      rowElement.id = item.id;
      rowElement.onclick = () => {
        if (selected !== undefined) {
          document.getElementById(selected).classList.remove("selected");
        }
        document.getElementById(item.id).classList.add("selected");
        selected = item.id;

        //   rowElement.classList.add("selected");
      };
      productList.appendChild(rowElement);
    }
  }
}

function updateCashDisplay() {
  cash = getCash();
  document.querySelector(".current-cash").innerText = `$${cash}`;
}

function createProductRow(product) {
  var rowElement = document.createElement("tr");
  rowElement.innerHTML = `<td class="desc">$${product.price}</td>
    <td class="price">${product.desc}</td>`;
  return rowElement;
}

function purchase() {
  console.log("Purchased", selected);
  var product = getProductById(selected);
  if (cash - product.price > 0) {
    document.querySelector(".result-text").textContent = product.result;
    cash -= product.price;
    setCash(cash);
    updatePurchaseHistory(product.id);
    document.querySelector(".result-overlay").classList.remove("hidden");
  }
  var cashCounter = document.querySelector(".current-cash");
  cashCounter.classList.remove("flash-text");
  cashCounter.offsetHeight;
  cashCounter.classList.add("flash-text");
}

function closeOverlay() {
  document.querySelector(".result-overlay").classList.add("hidden");
}

function getProductById(id) {
  for (item of items) {
    if (item.id == id) {
      return item;
    }
  }
  return null;
}

function getCash() {
  var temp_cash = window.localStorage.getItem(CASH_ID);
  if (temp_cash == null || isNaN(temp_cash)) {
    return 0;
  }
  return temp_cash;
}

function setCash() {
  window.localStorage.setItem(CASH_ID, cash);
}

function getPurchaseHistory() {
  var temp_hist = window.localStorage.getItem(HISTORY_ID);
  if (temp_hist === null) {
    return [];
  }
  return JSON.parse(temp_hist);
}

function updatePurchaseHistory(id) {
  var temp_hist = getPurchaseHistory();
  temp_hist.push(id);
  temp_hist = JSON.stringify(temp_hist);
  window.localStorage.setItem(HISTORY_ID, temp_hist);
}

populate();
updateCashDisplay();
