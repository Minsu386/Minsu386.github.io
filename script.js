/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  const coffeeCounter = document.querySelector('#coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  for (let producer of producers) {
    if (producer.price / 2 <= coffeeCount) {
      producer.unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  // your code here
  const unlockProducers = [];
  for(let producer of data.producers) {
    if (producer.unlocked) {
      unlockProducers.push(producer)
    }
  }

  return unlockProducers;
}

function makeDisplayNameFromId(id) {
  // your code here
  let displayName = '';
  for (let i = 0; i < id.length; i++) {
    if (i === 0 || id[i - 1] === "_") {
      displayName += id[i].toUpperCase();
    } else if (id[i] === "_") {
      displayName += " ";
    } else {
      displayName += id[i];
    }
  }

  return displayName;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  // your code here
  const producerContainer = document.getElementById("producer_container");
  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.coffee);
  const unlockedProducers = getUnlockedProducers(data);
  for (let unlockedProducer of unlockedProducers) {
    const producerDiv = makeProducerDiv(unlockedProducer);
    producerContainer.append(producerDiv);
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  for (let producer of data.producers) {
    if (producerId.includes(producer.id)) {
      
      return producer;
    }
  }
}

function canAffordProducer(data, producerId) {
  // your code here
  let canAfford = false;
  let producer = getProducerById(data, producerId);
  if (data.coffee >= producer.price) {
    canAfford = true;
  }

  return canAfford;
}

function updateCPSView(cps) {
  // your code here
  const cpsView = document.getElementById('cps');
  cpsView.innerText = cps;

}

function updatePrice(oldPrice) {
  // your code here
  // changed price for increase game speed. 
  return Math.floor(oldPrice * 1.01); 
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  let producer = getProducerById(data, producerId);
  if (canAffordProducer(data, producerId)) {
    producer.qty += 1;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;

    return true;
  } else {

    return false;
  }
}

function buyButtonClick(event, data) {
  // your code here
  if (event.target.tagName === 'BUTTON' && event.target.id[0] === 'b') {
    const producerId = event.target.id;
    if (!canAffordProducer(data, producerId)) {
      window.alert('Not enough coffee!');
    } else {
      attemptToBuyProducer(data, producerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // your code here
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  renderProducers(data);
  
}




/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)  
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
