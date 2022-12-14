function onError(error) {
    console.error(`Failed to execute follow content script: ${error}`);
}

browser.browserAction.onClicked.addListener(() => {
    browser.tabs
        .executeScript({file: "follow-user.js"})
        .catch(onError);
});

browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync
        .get('serverUrl')
        .then((results) => {
            if (!results || !results.serverUrl) {
                browser.storage.sync.set({
                    serverUrl: 'https://mastodon.social'
                });
            }
        });
}); 

browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
    // if (temporary) return; // skip during development
    switch (reason) {
      case "install":
        {
          await browser.runtime.openOptionsPage();
        }
        break;
    }
  });