async function login(e) {
    document.querySelector("#success").textContent = "";
    document.querySelector("#error").textContent = "";
    const serverUrl = document.querySelector("#serverUrl").value;
    if (!serverUrl.match(/^https?:\/\//)) {
        document.querySelector("#error").textContent = "Server URL must start with http:// or https://";
        document.querySelector("#serverUrl").focus();        
        return;
    }
    
    console.log('logging in to', serverUrl);
    const redirectURL = browser.identity.getRedirectURL();
    try {
        const app = await registerApp(serverUrl, redirectURL);
        document.querySelector("#clientId").textContent = app.clientId
        document.querySelector("#clientSecret").textContent = app.clientSecret;
        document.querySelector("#appId").textContent = app.appId;
    
        const authCode = await getAuthCode(serverUrl, redirectURL, app.clientId);
        document.querySelector("#authCode").textContent = authCode
    
        const token = await getUserAccessToken(serverUrl, redirectURL, authCode, app.clientId, app.clientSecret);
        document.querySelector("#accessToken").textContent = token;
    } catch (err) {
        console.error(err);
        document.querySelector("#error").textContent = `An error occurred: ${err}`;
        throw err;
    }
    document.querySelector("#success").textContent = "Login successful";
    saveOptions()
}

function saveOptions() {
    const serverUrl = 
    browser.storage.sync.set({
        serverUrl: document.querySelector("#serverUrl").value,
        clientId: document.querySelector("#clientId").textContent,
        clientSecret: document.querySelector("#clientSecret").textContent,
        appId: document.querySelector("#appId").textContent,
        authCode: document.querySelector("#authCode").textContent,
        accessToken: document.querySelector("#accessToken").textContent
    });
}

function restoreOptions() {
    browser.storage.sync
        .get()
        .then((results) => {
            document.querySelector("#serverUrl").value = results.serverUrl || 'https://mastodon.social';
            document.querySelector("#clientId").textContent = results.clientId || '';
            document.querySelector("#clientSecret").textContent = results.clientSecret || '';
            document.querySelector("#appId").textContent = results.appId || '';
            document.querySelector("#authCode").textContent = results.authCode || '';
            document.querySelector("#accessToken").textContent = results.accessToken || '';
        });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("#login").addEventListener("click", login);
