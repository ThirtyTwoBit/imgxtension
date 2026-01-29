/* check for updates */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    const currentVersion = chrome.runtime.getManifest().version;
    chrome.storage.local.get('lastVersion', (data) => {
      if (data.lastVersion !== currentVersion) {
        chrome.storage.local.set({ lastVersion: currentVersion });

        // Open a tab showing update info
        chrome.tabs.create({ url: 'settings/update.html' });
      }
    });
  } else if (details.reason === 'install') {
    // Set initial version on first install
    const currentVersion = chrome.runtime.getManifest().version;
    chrome.storage.local.set({ lastVersion: currentVersion });
  }
});

/* settings button on settings page */
// For MV3 Chrome and MV2 Firefox
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openOptions") {
    if (chrome.runtime.openOptionsPage) {/*
      chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
          // Fallback if openOptionsPage is not supported or errors out
          chrome.tabs.update(sender.tab.id, { url: chrome.runtime.getURL("settings/options.html") });
        }
      });*/
    /*} else {*/
      // Older browsers or fallback
      chrome.tabs.update(sender.tab.id, { url: chrome.runtime.getURL("settings/options.html") });
    }
  }
});




/* preloads pinchats */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['pinChat', 'pinChats'], (result) => {
        if (result.pinChat === undefined) {
            chrome.storage.local.set({ pinChat: false });
        }
        if (!Array.isArray(result.pinChats)) {
            chrome.storage.local.set({ pinChats: [] });
        }
    });
});



/* ADDS IMGFLIP QUICK CREATE */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'imgflip-image') {
    const url = 'https://imgflip.com/memegenerator#imgUrl=' + encodeURIComponent(info.srcUrl);
    chrome.tabs.create({ url });
  } else if (info.menuItemId === 'imgflip-video') {
    const url = 'https://imgflip.com/gif-maker#videoUrl=' + encodeURIComponent(info.srcUrl);
    chrome.tabs.create({ url });
  }
});

function createMenus() {
  console.log("Creating context menus");
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'imgflip-image',
      title: 'Create meme from this image',
      contexts: ['image']
    });
    chrome.contextMenus.create({
      id: 'imgflip-video',
      title: 'Create GIF from this video',
      contexts: ['video']
    });
  });
}

function removeMenus() {
  chrome.contextMenus.removeAll();
}

// handle setting changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.quickCreate) {
    if (changes.quickCreate.newValue === true) {
      createMenus();
    } else {
      removeMenus();
    }
  }
});

// handle startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['quickCreate'], result => {
    if (result.quickCreate === true) {
      createMenus();
    }
  });
});

// handle installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['quickCreate'], result => {
    if (result.quickCreate === true) {
      createMenus();
    }
  });
});


/* ADDS THE NOTIFICATION AND POPUP UPDATES */
const actionAPI = chrome.action || chrome.browserAction;

function fetchData() {
  fetch("https://imgflip.com/ajax_get_le_data", {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "x-requested-with": "XMLHttpRequest",
    },
  })
    .then(response => response.json())
    .then(data => {
      console.log("User Data:", data);
      const notificationCount = data.user && data.user.nots !== undefined ? String(data.user.nots) : "";
      if (data.user.id !== 0) {
        //set badge to notifs
        actionAPI.setBadgeText({ text: notificationCount });
        actionAPI.setBadgeBackgroundColor({ color: "#D72E62" });
        console.log(`set notif count to ${notificationCount}`);
        try {
          chrome.runtime.sendMessage({ type: "load_data", data: data });
        } catch(error) {
        }
      } else {
        try {
          chrome.runtime.sendMessage({ type: "not_logged_in" });
        } catch(error) {
        }
      }
    })
    .catch(err => {
      console.error("Error fetching notifications:", err);
    });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popup_opened") {
    console.log("popup opened received");
    try {
      fetchData();
    } catch(error) {
    }
  }
});

// initial load run
try {
  fetchData();
} catch(error) {
}

const intervalInMinutes = 1;
const intervalInMilliseconds = intervalInMinutes * 60 * 1000;

setInterval(() => {
  try {
    // run every so often
    fetchData();
  } catch(error) {
  }
}, intervalInMilliseconds);
