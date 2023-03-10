async function registerApp(serverUrl, redirectURL) {
    console.log('Registering app', serverUrl, redirectURL);
    const registerUrl = serverUrl + "/api/v1/apps";
    const data = {
        client_name: 'Follow Mastodon User Web Extension',
        redirect_uris: redirectURL,
        scopes: 'read write follow push',
        website: 'https://joshka.net'
    };
    const response = await postJson(registerUrl, data);
    const app =  {
        clientId: response.client_id,
        clientSecret: response.client_secret,
        appId: response.vapid_key
    };
    console.log('Registered app', JSON.stringify(app));
    return app;
}

async function getAuthCode(serverUrl, redirectURL, clientId) {
    console.log('Authorizing user', serverUrl, redirectURL, clientId);
    let authURL = `${serverUrl}/oauth/authorize`
    authURL += `?client_id=${clientId}`;
    authURL += `&response_type=code`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent("read write follow")}`;

    let codeURL = await browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL
    });
    let authCode = codeURL.match(/code=(?<code>.*)$/).groups.code;
    console.log("Authorized user", authCode);
    return authCode;
}

async function getUserAccessToken(serverUrl, redirectURL, authCode, clientId, clientSecret) {
    console.log('Getting user access token', serverUrl, redirectURL, authCode, clientId, clientSecret);
    const tokenUrl = `${serverUrl}/oauth/token`
    const data = {
        grant_type: "authorization_code",
        code: authCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectURL,
        scope: "read write follow"
    }
    let response = await postJson(tokenUrl, data);
    let token = response.access_token;
    console.log(`Got Access token ${token}`);
    return token;
}

async function verifyCredentials(serverUrl, token) {
    console.log('Verifying credentials', serverUrl, token);
    let verifyUrl = `${serverUrl}/api/v1/accounts/verify_credentials`;
    let response = await getJson(verifyUrl, null, token);
    console.log(JSON.stringify(response));
    return response;
}

// async function lookupAccount(serverUrl, acct) {
//     console.log('Looking up account', serverUrl, acct);
//     let lookupUrl = `${serverUrl}/api/v1/accounts/lookup`;
//     lookupUrl += `?acct=${encodeURIComponent(acct)}`;
//     lookupUrl += "&skip_webfinger=false";

//     let response = await getJson(lookupUrl, acct);
//     console.log(JSON.stringify(response));
//     return response;
// }

// async function searchAccount(serverUrl, acct, token) {
//     console.log('Searching account', serverUrl, acct);
//     let lookupUrl = `${serverUrl}/api/v1/accounts/search`;
//     lookupUrl += `?q=${encodeURIComponent(acct)}`;
//     lookupUrl += "&resolve=true";

//     let response = await getJson(lookupUrl, acct, token);
//     console.log(JSON.stringify(response));
//     return response;
// }

// async function followAcccount(serverUrl, id, token) {
//     console.log('Following account', serverUrl, id, token);
//     let followUrl = `${serverUrl}/api/v1/accounts/${id}/follow`;
//     let response = await postJson(followUrl, id, token);
//     console.log(JSON.stringify(response));
//     return response;
// }

function postJson(url, data, token) {
    return fetchJson('POST', url, data, token);
}

function getJson(url, data, token) {
    return fetchJson('GET', url, data, token);
}

// I was unable to get fetch() to work from within a options screen possibly
// CSP related. Instead we fall back to using xhr, and wrap it in a promise
function fetchJson(method, url, data, token) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true /* async */);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        if (!!token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }
        xhr.onload = (e) => {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200) {
                // console.log("postJson success", xhr.response);
                if (xhr.responseType === "json") {
                    resolve(xhr.response);
                } else {
                    resolve(JSON.parse(xhr.responseText));
                }
            } else {
                console.error("Client error occurred", xhr.status, xhr.statusText, xhr.response);
                reject(xhr.response);
            }
        }
        xhr.onerror = (e) => {
            console.error("Server error occurred", xhr.status, xhr.statusText, xhr.response);
            reject(xhr.response);
        }
        xhr.send(JSON.stringify(data));
    });
}