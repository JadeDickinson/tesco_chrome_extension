setIcon();
chrome.browserAction.onClicked.addListener(sortByWeight);
chrome.runtime.onMessage.addListener(function(request) {
  if (request.scheme == "dark") {
    setIcon("dark")
  } else {
    setIcon("light")
  }
});

function sortByWeight() {
  chrome.tabs.query({ active: true }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.executeScript(tab.id, { file: "./sort-by-weight.js" });
    });
  });
}

function setIcon() {
  chrome.browserAction.setIcon({
    path: {
      "16": `images/sort-by-weight-16.png`,
      "32": `images/sort-by-weight-32.png`,
      "48": `images/sort-by-weight-48.png`,
      "128": `images/sort-by-weight-128.png`,
    }
  });
}
