(() => {
    const defaultServerUrl = 'https://mastodon.social';
    browser.storage.sync
        .get('serverUrl')
        .then((results) => results.serverUrl || defaultServerUrl)
        .then((serverUrl) => {
            let username = document.querySelector('meta[property="profile:username"]');
            if (!username || !username.content) {
                console.log("No username found on page");
                return;
            }
            let encodedUsername = encodeURIComponent(username.content);
            let followURL = `${serverUrl}/authorize_interaction?acct=${encodedUsername}`;
            window.open(followURL,'_blank','width=600,height=600,toolbar=no');
        })
        .catch((error) => { console.log("Error", error); })
})();
