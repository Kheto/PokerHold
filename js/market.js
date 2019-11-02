var items = [
  {
    id: 0,
    price: 4000,
    desc: "Take out a hit on Jeremy Clarkson.",
    result: `Jeremy Clarkson saunters confidently to his car and gets in. After
  briefly reveling in how rich he is, he turns the key in the ignition and
  explodes.`
  },
  {
    id: 1,
    price: 200,
    desc: "Buy the latest games console.",
    result: `You sit down to play the most recently released video game. A loading bar informs you that it will be ready to play in 4 hours.

  After the game has started, you play for 15 minutes before realising you aren't having fun.`
  },
  { id: 2, price: 200, desc: "Buy the latest games console." }
];

var CASH_ID = "test_cash";

var selected = undefined;
var cash = getCash();

function populate() {
  var productList = document.querySelector(".product-list");

  for (let item of items) {
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

function createProductRow(product) {
  var rowElement = document.createElement("tr");
  rowElement.innerHTML = `<td class="desc">$${product.price}</td>
    <td class="price">${product.desc}</td>`;
  return rowElement;
}

function purchase() {
  console.log("Purchased", selected);
  document.querySelector(".result-overlay").textContent = getProductById(
    selected
  ).result;
  document.querySelector(".result-overlay").classList.remove("hidden");
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
  if (temp_cash == undefined) {
    return 0;
  }
  return temp_cash;
}

populate();
