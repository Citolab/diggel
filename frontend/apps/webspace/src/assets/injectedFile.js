/* eslint-disable */
/* 
    CITOLAB COMMENT

    This script is used to detect what the user does in the InAppBrowser.
    It detects: keyboard events, mouse events, ajax calls and spa-navigation events
    This script is injected on loadstop of the first page and load start on every other page.

    MutationObserver is used because on loadStart the body is not always present.

    Because keyboard events are difficult to detect: https://stackoverflow.com/questions/36753548/keycode-on-android-is-always-229
    That's why the whole value of the input shown on keyup

    Click events are registered on the document. If the innertext is empty the tag name is logged.

    Navigation events in SPA site are logged using this method: https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate

    Ajax GET call are registered by hooking in to: window.XMLHttpRequest.prototype.open
*/
var config = { attributes: false, childList: true, subtree: true };
var zoekterm = 'zoekterm';
var navigatie = 'navigatie';
var keyLog = 'tekst_invoer';
var paste = 'plakken';
var klik = 'klik';
var klikAdvertentie = 'klik_advsertentie';
var sessionStarted = 'sessie_start';
var sessionResumed = 'sessie_hervat';
var sessionFinished = 'sessie_einde';
var itemStarted = 'item_start';
var selecteerAntwoord = 'selecteer_antwoord';

if (document.body != null) {
  addClickAndKeyUpEvents();
} else {
  // Callback function to execute when mutations are observed
  var callback = function (mutationsList, observer) {
    if (document.body != null) {
      // try to get rid of google consent
      addClickAndKeyUpEvents();
      observer.disconnect();
    }
  };
  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  observer.observe(document, config);
}

// https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate
// log url changes for single page applications
(function (history) {
  var pushState = history.pushState;
  history.pushState = function (state) {
    if (typeof history.onpushstate == 'function') {
      history.onpushstate({ state: state });
    }
    // whatever else you want to do
    // maybe call onhashchange e.handler
    addToLocalStorage(navigatie, window.location.href);
    return pushState.apply(history, arguments);
  };
})(window.history);

// log ajax calls
// var oldXHROpen = window.XMLHttpRequest.prototype.open;
// var lastUrl = '';
// window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
//     // don't register same call twice
//     if (method == 'GET' && lastUrl != url) {
//         lastUrl = url;
//         addToLocalStorage('ajax', url);
//     }
//     return oldXHROpen.apply(this, arguments);
// }


function addClickAndKeyUpEvents() {
  // log key events, e.target.value see comment on top.
  document.body.addEventListener(
    'keyup',
    function (e) {
      if (e.target.type == 'email') {
        addToLocalStorage(keyLog, '*** typt email');
      } else if (e.target.type == 'password') {
        addToLocalStorage(keyLog, '*** typt wachtwoord');
      } else {
        addToLocalStorage(keyLog, 'input value: ' + e.target.value);
      }
    },
    false
  );

  // log click events: add inner
  lastTarget = null;
  document.body.addEventListener('click', function (e) {
    // best effort to show something meaning full.
    if (e.target && e.target != lastTarget) {
      lastTarget == e.target;
      var label = e.target.innerText;
      if (label == null || typeof label == 'undefined' || label == '') {
        label = e.target.localName;
      }
      if (!(label == null || typeof label == 'undefined' || label == '')) {
        addToLocalStorage('click', label);
      }
    }
  });
}

function getData() {
  var data = [];
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    if (localStorage.key(i).startsWith('collected_data_')) {
      data.push(localStorage.getItem(localStorage.key(i)));
    }
  }
  return data;
}

// add all data that should be collected and send to backend.
// localStorage is the only way to communicate between InAppBrowser and Cordova App.
function addToLocalStorage(action, value, timestamp = new Date()) {
  action = action;
  // check to see if the previous value is the same and in the time range that we do allow new values to be registered.
  // this to prevent clicks and ajax calls to be registered multiple times.
  localStorage.setItem(
    'collected_data_' + uuidv4(),
    JSON.stringify({ action: action, content: value, timestamp: timestamp })
  );
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
