function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    scoreThreshold: translateThresholdValues(
      parseInt(document.querySelector("#scoreThreshold").value),
    ),
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#scoreThreshold").value =
      translateThresholdValues(result.scoreThreshold) || "5";
    document.querySelector("#rangeInput").value =
      translateThresholdValues(result.scoreThreshold) || "5";
  }

  const getting = browser.storage.sync.get(["scoreThreshold"]);
  getting.then(setCurrentChoice);
}

function resetOptions() {
  document.querySelector("#scoreThreshold").value = "5";
  document.querySelector("#rangeInput").value = "5";

  browser.storage.sync.set({
    scoreThreshold: -2000,
  });
}

function translateThresholdValues(input) {
  // scoreSetting = parseInt(document.querySelector("#scoreThreshold").value)
  switch (input) {
    case 1:
      return -100;
    case 2:
      return -200;
    case 3:
      return -500;
    case 4:
      return -1000;
    case 5:
      return -2000;
    case 6:
      return -5000;
    case 7:
      return -10000;
    case 8:
      return -20000;
    case 9:
      return -50000;
    case 10:
      return -Infinity;
    case -100:
      return 1;
    case -200:
      return 2;
    case -500:
      return 3;
    case -1000:
      return 4;
    case -2000:
      return 5;
    case -5000:
      return 6;
    case -10000:
      return 7;
    case -20000:
      return 8;
    case -50000:
      return 9;
    case -Infinity:
      return 10;
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("reset").addEventListener("click", resetOptions);

// Threshold for fuzzy matching
function update() {
  textInput.value = this.value;
}
var textInput = document.getElementById("scoreThreshold");
var rangeInput = document.getElementById("rangeInput");
rangeInput.addEventListener("change", update);
update.call(rangeInput); // first run
