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
