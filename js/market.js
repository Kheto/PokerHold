Array.prototype.contains = function(val) {
  return this.indexOf(val) > -1 ? true : false;
};

var items = [
  {
    id: 0,
    dependsOn: -1,
    price: 4000,
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
    desc: "Buy Jeremy's old cars",
    result: ""
  },
  {
    id: 4,
    dependsOn: 1,
    price: 70,
    desc: "Buy another video game",
    result:
      "Something about this game's story speaks to you deeply. You spend the weekend explaining it to your friends. After a week you have stopped playing without completing it. One day you'll try to play it again but you won't remember the controls."
  }
];

var CASH_ID = "test_cash",
  HISTORY_ID = "test_history";

var selected = undefined;
var cash = getCash();

function populate() {
  var productList = document.querySelector(".product-list");
  var history = getPurchaseHistory();

  for (let item of items) {
    console.log(item.id, item.dependsOn);
    if (
      (!history.contains(item.id) && item.dependsOn < 0) ||
      history.contains(item.dependsOn)
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
