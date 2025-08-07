const resultsTabsList = document.getElementById("tabs-list");
let tabsObjects = [];
let activeIndex = 0;

window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

function setOptions(result) {
  bookmarkBackgroundColor = result.bookmarkBackgroundColor;
  bookmarkTextColor = result.bookmarkTextColor;
  // bookmarkBorderColor = result.bookmarkBorderColor;

  openTabsBackgroundColor = result.openTabsBackgroundColor;
  openTabsTextColor = result.openTabsTextColor;
  // openTabsBorderColor = result.openTabsBorderColor;

  focusItemBackgroundColor = result.focusItemBackgroundColor;
  focusItemTextColor = result.focusItemTextColor;
  focusItemBorderColor = result.focusItemBorderColor;

  scoreThreshold = result.scoreThreshold;
}

const config = browser.storage.sync.get([
  "bookmarkBackgroundColor",
  "bookmarkTextColor",
  // "bookmarkBorderColor",

  "openTabsBackgroundColor",
  "openTabsTextColor",
  // "openTabsBorderColor",

  "focusItemBackgroundColor",
  "focusItemTextColor",
  "focusItemBorderColor",
  "scoreThreshold",
]);

config.then(setOptions);

function searchResultTabs() {
  activeIndex = 0;
  resultsTabsList.textContent = "";
  let searchQuery = document.getElementById("find-input").value;

  // Get matching tabs TODO Add option to customize threshold for scores
  console.log(scoreThreshold);
  fuzzyResultsAll = fuzzysort.go(
    searchQuery,
    tabsObjects.map((a) => a.title),
    { threshold: scoreThreshold },
  );

  for (i in fuzzyResultsAll) {
    currentTab =
      tabsObjects[
        tabsObjects.findIndex((x) => x.title === fuzzyResultsAll[i].target)
      ];

    if (currentTab == null) {
      continue;
    }

    let link = new TabLink(currentTab);
    tabLink = link.getLink();

    if (resultsTabsList.childElementCount === 0) {
      tabLink.classList.add("active");
    }

    resultsTabsList.appendChild(tabLink);
  }

  // Switch to first item with Enter (ie. don't put <CR> into text box)
  document.getElementById("find-input").onkeydown = function (e) {
    if (e.code === "ArrowUp") {
      e.preventDefault();
      if (tabsObjects.length === 0) {
        return;
      }

      upateSelection(activeIndex > 0 ? activeIndex - 1 : 0);
    }

    if (e.code === "ArrowDown") {
      e.preventDefault();
      if (tabsObjects.length === 0) {
        return;
      }

      const maxIndex = resultsTabsList.childElementCount - 1;
      upateSelection(activeIndex < maxIndex ? activeIndex + 1 : maxIndex);
    }

    if (e.code === "Enter") {
      e.preventDefault();
      resultsTabsList.children[activeIndex].click();
      // Close popup after switching tabs
      window.close();
    }
  };
}

document.addEventListener("DOMContentLoaded", function (e) {
  getTabs();
  getBookmarks();

  // Do this whenever the text box changes
  const input = document.getElementById("find-input");
  if (input != null) {
    input.oninput = searchResultTabs;
    // Focus on the input box on load
    document.getElementById("find-input").focus();
  }

  // Click on link to switch to that tab/window
  document.addEventListener("click", (e) => {
    const link =
      e.target.tagName.toLowerCase() == "li"
        ? e.target.firstElementChild
        : e.target;

    const openTabId = +link.getAttribute("href");
    const winId = +link.getAttribute("window");
    const bookmarkUrl = link.href;

    if (Number.isInteger(openTabId)) {
      browser.windows.update(winId, {
        focused: true,
      });
      browser.tabs.update(openTabId, {
        active: true,
      });
    } else {
      browser.tabs.create({ url: bookmarkUrl });
    }
    e.preventDefault();
  });
});

function getBookmarks() {
  function logItems(bookmarkItem) {
    if (bookmarkItem.url) {
      tabsObjects.push({
        title: bookmarkItem.title,
        url: bookmarkItem.url,
        bookmark: 1,
      });
    }
    if (bookmarkItem.children) {
      for (child of bookmarkItem.children) {
        logItems(child);
      }
    }
  }

  function logTree(bookmarkItems) {
    logItems(bookmarkItems[0]);
  }

  browser.bookmarks.getTree(logTree);
}

function getTabs() {
  tabsObjects = [];
  browser.tabs.query({}, function (tabs) {
    for (let tab of tabs) {
      // console.log(tab.title + " : "  + tab.id + " : " + tab.windowId);
      tabsObjects.push({
        title: tab.title,
        url: tab.url,
        id: tab.id,
        winId: tab.windowId,
        bookmark: 0,
      });
    }
  });
}

function upateSelection(newIndex) {
  if (activeIndex != newIndex) {
    resultsTabsList.children[activeIndex].classList.remove("active");
  }
  activeIndex = newIndex;
  resultsTabsList.children[activeIndex].classList.add("active");
}

function setActive(event) {
  event.target.classList.add("active");
}

function setInactive(event) {
  event.target.classList.remove("active");
}

class TabLink {
  constructor(tabObject) {
    this.item = document.createElement("li");
    this.item.classList.add("list-group-item");
    this.item.onmouseenter = setActive;
    this.item.onfocus = setActive;
    this.item.onmouseleave = setInactive;
    this.item.onblur = setInactive;

    this.link = document.createElement("a");

    if (tabObject.bookmark) {
      this.link.classList.add("bookmark-link");
      this.link.textContent = tabObject.title.slice(0, 64);
      this.link.setAttribute("href", tabObject.url);
      this.link.setAttribute("window", tabObject.winId);

      this.link.style.backgroundColor = bookmarkBackgroundColor;
      this.link.style.color = bookmarkTextColor;
    } else if (!tabObject.bookmark) {
      this.link.classList.add("open-tab-link");
      this.link.textContent = tabObject.title.slice(0, 64);
      this.link.setAttribute("href", tabObject.id);
      this.link.setAttribute("window", tabObject.winId);

      this.link.style.backgroundColor = openTabsBackgroundColor;
      this.link.style.color = openTabsTextColor;
    }

    this.item.appendChild(this.link);
  }
  getLink() {
    return this.item;
  }
}
