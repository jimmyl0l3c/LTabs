const resultsTabsList = document.getElementById("tabs-list");

let tabsObjects = [];
let activeIndex = 0;
let scoreThreshold = 0;

browser.storage.sync.get("scoreThreshold").then((result) => {
  scoreThreshold = result.scoreThreshold;
});

function searchResultTabs(e) {
  activeIndex = 0;
  resultsTabsList.textContent = "";

  const searchQuery = e.target.value;

  // Get matching tabs
  fuzzyResultsAll = fuzzysort.go(
    searchQuery,
    tabsObjects.map((a) => a.title),
    { threshold: scoreThreshold },
  );

  for (result of fuzzyResultsAll) {
    const currentTab =
      tabsObjects[tabsObjects.findIndex((x) => x.title === result.target)];

    if (currentTab == null) {
      continue;
    }

    const tabLink = createListItem(currentTab);

    if (resultsTabsList.childElementCount === 0) {
      tabLink.classList.add("active");
    }

    resultsTabsList.appendChild(tabLink);
  }
}

document.addEventListener("DOMContentLoaded", function (_) {
  const input = document.getElementById("find-input");

  input.oninput = searchResultTabs;
  input.onkeydown = handleKeymaps;

  // NOTE: Focusing is unreliable, trying multiple times.
  focusInput();
  setTimeout(focusInput, 50);
  setTimeout(focusInput, 100);

  getAllTabs().then((tabs) => (tabsObjects = tabs));
  // getAllBookmarks().then((tabs) => (tabsObjects = tabs));
});

const focusInput = () => {
  const input = document.getElementById("find-input");

  input.blur();
  input.focus();
  input.click();
};

function handleKeymaps(e) {
  switch (e.code) {
    case "ArrowUp":
      e.preventDefault();
      if (resultsTabsList.childElementCount === 0) {
        return;
      }
      setActiveIndex(activeIndex > 0 ? activeIndex - 1 : 0);
      break;

    case "ArrowDown":
      e.preventDefault();
      if (resultsTabsList.childElementCount === 0) {
        return;
      }
      const maxIndex = resultsTabsList.childElementCount - 1;
      setActiveIndex(activeIndex < maxIndex ? activeIndex + 1 : maxIndex);
      break;

    case "Enter":
      e.preventDefault();
      if (resultsTabsList.childElementCount === 0) {
        return;
      }
      resultsTabsList.children[activeIndex].click();
      window.close();
      break;
  }
}

function setActiveIndex(newIndex) {
  if (activeIndex != newIndex) {
    resultsTabsList.children[activeIndex].classList.remove("active");
  }
  activeIndex = newIndex;
  resultsTabsList.children[activeIndex].classList.add("active");
}

const setLinkActive = (e) => e.target.classList.add("active");
const setLinkInactive = (e) => e.target.classList.remove("active");

const openLink = (e) => {
  e.preventDefault();

  const link =
    e.target.nodeName.toLowerCase() === "li"
      ? e.target.firstElementChild
      : e.target;

  const href = link.getAttribute("href");
  const winId = parseInt(link.getAttribute("window"));
  const tabId = parseInt(href);

  if (Number.isInteger(tabId)) {
    browser.windows.update(winId, { focused: true });
    browser.tabs.update(tabId, { active: true });
  } else {
    browser.tabs.create({ url: href });
  }
};

function createListItem(tab) {
  const item = document.createElement("li");
  item.classList.add("list-group-item");
  item.onmouseenter = setLinkActive;
  item.onfocus = setLinkActive;
  item.onmouseleave = setLinkInactive;
  item.onblur = setLinkInactive;
  item.onclick = openLink;

  const link = document.createElement("a");
  link.classList.add("open-tab-link");
  link.textContent = tab.title.slice(0, 64);
  link.setAttribute("href", tab.tabId ?? tab.url);
  link.setAttribute("window", tab.winId);

  item.appendChild(link);

  return item;
}

async function getAllTabs() {
  return browser.tabs.query({}).then((tabs) =>
    tabs.map((tab) => {
      return {
        title: tab.title,
        url: tab.url,
        tabId: tab.id,
        winId: tab.windowId,
      };
    }),
  );
}

async function getAllBookmarks() {
  const uniqueUrls = new Set([]);
  const bookmarks = [];

  function walk(node) {
    if (node.url != null && !uniqueUrls.has(node.url)) {
      bookmarks.push({
        title: node.title,
        url: node.url,
      });
    }

    if (node.children != null && node.children.length > 0) {
      for (child of node.children) {
        walk(child);
      }
    }
  }

  await browser.bookmarks.getTree().then((tree) => walk(tree[0]));

  return bookmarks;
}
