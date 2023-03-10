async function checkLoggedIn() {
    try {
        let settings = await browser.storage.sync.get(['accessToken', 'serverUrl']);

        if (!!settings && !!settings.accessToken) {
            document.querySelector("#debug-serverUrl").textContent = settings.serverUrl;
            document.querySelector("#debug-accessToken").textContent = settings.accessToken;

            document.querySelector("#not-logged-in").classList.add("hidden");
            document.querySelector("#logged-in").classList.remove("hidden");
            document.querySelector("#actions").classList.remove("hidden");
            
            let myAccount = await verify(settings);
            document.querySelector("#myUsername").textContent = myAccount.display_name + "(@" + myAccount.username + ")";

            let username = await getUsername();
            document.querySelector("#debug-username").textContent = username;

            let account = await lookupAccount(settings.serverUrl, settings.accessToken, username);
            document.querySelector("#debug-account").textContent = account.id;

            let relationship = await getRelationship(settings.serverUrl, settings.accessToken, account.id);
            console.log(relationship);
            document.querySelector('#debug-relationship').textContent = JSON.stringify(relationship);

            if (relationship[0].following) {
                document.querySelector("#unfollow").classList.remove("hidden");
            } else {
                document.querySelector("#follow").classList.remove("hidden");
            }

            if (relationship[0].blocking) {
                document.querySelector("#unblock").classList.remove("hidden");
            } else {
                document.querySelector("#block").classList.remove("hidden");
            }
            
            if (relationship[0].muting) {
                document.querySelector("#unmute").classList.remove("hidden");
            } else
            {
                document.querySelector("#mute").classList.remove("hidden");
            }
        }
    } catch (err) {
        document.querySelector("#debug-section").classList.remove("hidden");
        document.querySelector("#debug-message").value = "Error: " + JSON.stringify(err);
    }
}

async function getUsername() {
    try {
        let results = await browser.tabs.executeScript({
            code: "(function() { let username=document.querySelector('meta[property=\"profile:username\"]'); return username && username.content; })();"
        });
        return results && results[0];
    } catch (err) {
        throw new Error("Error getting username: " + err);
    }
}

async function verify(settings) {
    try {
        const response = await fetch(settings.serverUrl + '/api/v1/accounts/verify_credentials', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + settings.accessToken
            },
            method: 'GET'
        });
        return await response.json();
    } catch (err) {
        throw new Error("Error verifying credentials: " + err);
    }
}

async function lookupAccount(serverUrl, accessToken, username) {
    try {
        const url = serverUrl
            + '/api/v1/accounts/lookup'
            + '?acct=' + encodeURIComponent(username)
            + '&skip_webfinger=false'
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET'
        });
        return await response.json();
    } catch (err) {
        throw new Error("Error looking up account: " + err);
    }
}

async function getRelationship(serverUrl, accessToken, accountId) {
    try {
        const url = serverUrl
            + '/api/v1/accounts/relationships'
            + '?id[]=' + encodeURIComponent(accountId)
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET'
        });
        return await response.json();
    } catch (err) {
        throw new Error("Error getting relationship: " + err);
    }
}

async function accountAction(action) {
    try {
        let settings = await getLoggedInUser();
        let account = document.querySelector("#debug-account").textContent;
        console.log("Attempting to " + action + " user " + account);
        const response = await fetch(settings.serverUrl + '/api/v1/accounts/' + account + '/' + action, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + settings.accessToken
            },
            method: 'POST'
        });
        if (response.status != 200) {
            throw new Error("Error following user: " + response.status + " " + response.statusText +
                " " + await response.text());
        }
    } catch (err) {
        throw new Error("Error attempting to " + action + " user: " + err);
    }
}

async function follow() {
    await accountAction('follow');
    document.querySelector("#follow").classList.add("hidden");
    document.querySelector("#unfollow").classList.remove("hidden");
}

async function unfollow() {
    await accountAction('unfollow');
    document.querySelector("#unfollow").classList.add("hidden");
    document.querySelector("#follow").classList.remove("hidden");
}

async function block() {
    await accountAction('block');
    document.querySelector("#block").classList.add("hidden");
    document.querySelector("#unblock").classList.remove("hidden");
}

async function unblock() {
    await accountAction('unblock');
    document.querySelector("#unblock").classList.add("hidden");
    document.querySelector("#block").classList.remove("hidden");
}

async function mute() {
    await accountAction('mute');
    document.querySelector("#mute").classList.add("hidden");
    document.querySelector("#unmute").classList.remove("hidden");
}

async function unmute() {
    await accountAction('unmute');
    document.querySelector("#unmute").classList.add("hidden");
    document.querySelector("#mute").classList.remove("hidden");
}

async function getLoggedInUser() {
    let settings = await browser.storage.sync.get(['accessToken', 'serverUrl']);
    if (!settings || !settings.accessToken) {
        throw "No access token found. Please log in.";
    }
    return settings;
}

async function openOptionsPage() {
    await browser.runtime.openOptionsPage();
}

document.querySelector('#openOptionsPage').addEventListener('click', openOptionsPage);
document.querySelector('#follow').addEventListener('click', follow);
document.querySelector('#unfollow').addEventListener('click', unfollow);
document.querySelector('#block').addEventListener('click', block);
document.querySelector('#unblock').addEventListener('click', unblock);
document.querySelector('#mute').addEventListener('click', mute);
document.querySelector('#unmute').addEventListener('click', unmute);

document.addEventListener('DOMContentLoaded', checkLoggedIn);

