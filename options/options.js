const regexInput = document.querySelector("#regex");
const selectorInput = document.querySelector("#selector");

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
  browser.storage.local.set({
    regex: regexInput.value,
    selector: selectorInput.value,
  });
}

/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
  regexInput.value = restoredSettings.regex || "";
  selectorInput.value = restoredSettings.selector || ".athing > .title:last-child > a";
}

function onError(e) {
  console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
On blur, save the currently selected settings.
*/
regexInput.addEventListener("blur", storeSettings);
selectorInput.addEventListener("blur", storeSettings);
