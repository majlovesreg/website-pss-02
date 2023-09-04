var dates = {};
dates.startDate = Date.parse('2023-07-11T00:00:00.000+07:00');
dates.endDate = Date.parse('2023-09-16T16:00:00.000+07:00');

var LOCALE = 'en';
var DATASOURCE = [];

window.addEventListener('DOMContentLoaded', () => {

  fetch( 
    'data/2023_SLV.json?v=1.0.0-beta1.0.5', {
      method: "GET",
      mode: "no-cors", // ON PRODUCTION: no-cors. ON DEV: cors.
      // cache: "no-cache",
      credentials: "include", /*
      headers: {
        "Content-Type": "application/json"
      },*/
      redirect: "error",
      referrerPolicy: "strict-origin-when-cross-origin"
    }

  )
  .then( response => response.json() )
  .then( jsonObj => DATASOURCE = jsonObj )
  .then( () => main() );
  
});

function main() {

  loadTranslations();
  
  createForm();
  updateText();

  loadInitialListeners();

  if ( Date.now() < dates.startDate ) {

    moveIn(document.getElementById('beforeStartDate'));

  } else if ( Date.now() > dates.endDate ) {

    window.location.replace('https://www.jw.org/');

  } else {

    moveIn( document.getElementById('welcome') );

  };

};


// Load translations
function loadTranslations() {

  // Get languages from DATASOURCE
  let locales = DATASOURCE.filter( obj => Object.keys(obj) ).map( obj => obj.locale );
  let localeNames = DATASOURCE.filter( obj => Object.keys(obj) ).map( obj => obj.localeName );

  // Set DOM for languageHeader
  let languageHeader = document.getElementById('languageHeader');

  // Generate language selections 
  for ( let i = 0; i < locales.length; i++ ) {

    let button = document.createElement("button");
    button.innerHTML = localeNames[i];
    button.id = 'languageButton' + locales[i].toUpperCase();
    button.type = 'button';
    button.value = locales[i];
    button.classList.add('languageButton');

    languageHeader.appendChild(button);

  };

  // Read whether locale was previously saved
  let locale = storageAvailable('localStorage') ? localStorage.getItem('locale') : readCookies('locale');

  // Set LOCALE to previously saved value, or if not present, based on browser language preferences
  LOCALE = locales.includes(locale) ? locale : setLocaleFromBrowserLangs(locales);

  // Save locale to either localStorage, or if not possible, as cookies
  storageAvailable('localStorage') ?
    localStorage.setItem('locale', LOCALE) :
    setCookie('locale', LOCALE, 400 * 24 * 3600, window.location.pathname, window.location.hostname, true);

  // Set language selected based on locale
  document.querySelector(`div#languageHeader button[value="${LOCALE}"]`).classList.add('languageSelected');

};


// Load questions form
function createForm(locale) {

  // Load languages
  if ( locale ) LOCALE = locale;
  var data = DATASOURCE.filter(jsonObj => jsonObj.locale == LOCALE)[0];

  const form = document.getElementById('formMain')

  // Load questions divs
  for ( let n of Object.keys(data.questions) ) {

    const div = document.createElement("div");

    div.id = 'question-' + n;
    div.classList.add("question");
    
    div.innerHTML = `<p>${data.questions[n].innerText}</p><input type="${data.questions[n].type}" name="${data.questions[n].name}" placeholder="${data.questions[n].placeholder}">`

    form.appendChild(div);
  
  };


  // Load buttons
  for ( let v of Object.values(data.buttons) ) {

    const button = document.createElement("button");

    button.type = v.type;
    button.id = v.id;
    button.innerText = v.innerText;

    if ( v.style.visibility ) button.style.visibility = v.style.visibility;
    if ( v.style.display ) button.style.display = v.style.display;

    form.appendChild(button);
  
  };

  document.getElementById('buttonBack').classList.add('transparent');

};


function updateText(locale) {

  if ( locale ) LOCALE = locale;
  var data = DATASOURCE.filter(jsonObj => jsonObj.locale == LOCALE)[0];
  if (!data) data = DATASOURCE.filter(jsonObj => jsonObj.locale == 'en')[0];

  storageAvailable('localStorage') ?
    localStorage.setItem('locale', LOCALE) :
    setCookie('locale', LOCALE, 400 * 24 * 3600, window.location.pathname, window.location.hostname, true);

  let languageButtons = document.getElementById('languageHeader').children;
  let languageButtonID = 'languageButton' + LOCALE.toUpperCase();

  for ( let i = 0; i < languageButtons.length; i++ ) {
    languageButtons[i].classList.remove('languageSelected');
    languageButtons[i].style.zIndex = '';
  };

  document.getElementById(languageButtonID).classList.add('languageSelected');
  document.getElementById(languageButtonID).style.zIndex = '-100';

  // Set page titles
  document.title = data.pageTitle;
  document.getElementById('pageTitle').innerHTML = data.pageTitle;

  // Set beforeStartDateMessage message and button texts
  document.getElementById('beforeStartDateMessage').innerHTML = data.dateCheck.beforeStartDateMessage;
  document.getElementById('beforeStartDateButton').innerHTML = data.dateCheck.beforeStartDateButton;

  // Set welcome message and button texts
  document.getElementById('welcomeMessage').innerHTML = data.welcome.message;
  document.getElementById('welcomeButtonYes').innerHTML = data.welcome.welcomeButtonYes;
  document.getElementById('welcomeButtonNo').innerHTML = data.welcome.welcomeButtonNo;

  // Set notWelcome message and button texts
  document.getElementById('notWelcomeMessage').innerHTML = data.notWelcome.message;
  document.getElementById('notWelcomeButtonOK').innerHTML = data.notWelcome.notWelcomeButtonOK;

  // Set authFailed message and button texts
  document.getElementById('authFailedMsgError').innerHTML = data.authFailed.msgError;
  document.getElementById('authFailedMsgRepeat').innerHTML = data.authFailed.msgRepeat;
  document.getElementById('authFailedNameLabel').innerHTML = data.authFailed.table.authFailedNameLabel;
  document.getElementById('authFailedCodeLabel').innerHTML = data.authFailed.table.authFailedCodeLabel;
  document.getElementById('authFailedButtonOK').innerHTML = data.authFailed.authFailedButtonOK;

  // Set authOK message and button texts
  document.getElementById('authOKMessage').innerHTML = data.authOK.message;
  document.getElementById('authOKPlaceholderLanguage').innerHTML = data.authOK.placeholderLanguage;
  document.getElementById('authOKPlaceholderFormat').innerHTML = data.authOK.placeholderFormat;

  // Update download button
  let buttonDownload = document.getElementById('authOKButtonDownload');
  if ( downloadText !== data.authOK.downloadText ) {
    try {
      buttonDownload.innerHTML = buttonDownload.innerHTML.replace( downloadText, data.authOK.downloadText );
      downloadText = data.authOK.downloadText;
    } catch(e) { console.log('Update download button error: ' + e) };
  };
  
  let authOKMessage = document.getElementById('authOKMessage');
  let name = document.querySelector('input[name=name]');
  if (name.value) authOKMessage.innerHTML = authOKMessage.innerHTML.replace( '${name}', titleCase(name.value.replace(/\s\s+/g, ' ').trim()) );

  // Set questions
  for ( let n of Object.keys(data.questions) ) document.getElementById('question-' + n).children[0].innerText = data.questions[n].innerText;

  // Set placeholders
  for ( let n of Object.keys(data.questions) ) document.getElementById('question-' + n).children[1].placeholder = data.questions[n].placeholder;

  // Set buttons
  for ( let v of Object.values(data.buttons) ) document.getElementById(v.id).innerText = v.innerText;

};


function loadInitialListeners() {

  document.getElementById('beforeStartDateButton')
    .addEventListener( 'click', () => window.location.assign('https://www.jw.org/') );

  document.getElementById('welcomeButtonYes').focus();  

  document.getElementById('welcomeButtonYes')
    .addEventListener( 'click', () => question(1, 'welcome') );

  document.getElementById('welcomeButtonNo')
    .addEventListener( 'click', () =>
      moveOutIn( document.getElementById('welcome'), document.getElementById('notWelcome') )
    );

  document.getElementById('notWelcomeButtonOK')
    .addEventListener( 'click', () => {
      moveOut( document.getElementById('notWelcome') );
      document.getElementById('notWelcome')
        .addEventListener('animationend', () => window.location.assign('https://www.jw.org/'));
    });

  document.getElementById('authFailedButtonOK')
    .addEventListener( 'click', () => {

      moveIn( document.getElementById('formMain') );
      question(1, 'authFailed');

    });

  // Language buttons

  let locales = DATASOURCE.filter( obj => Object.keys(obj) ).map( obj => obj.locale );
  let divMain = document.getElementById('divMain');

  for ( let i = 0; i < locales.length; i++ ) {
      
    document.getElementById('languageButton' + locales[i].toUpperCase() )
      .addEventListener( 'click', () => {
  
        divMain.classList.remove('fadeIn');
        divMain.classList.add('fadeOut');
  
        divMain.addEventListener('animationend', () => {
          updateText(locales[i]);
          divMain.classList.remove('fadeOut');
          divMain.classList.add('fadeIn');
        }, {once: true} );
  
      });
    
  };

};


// Questions loader and dynamic Listeners
function question(qNum, qPrev) {

  var data = DATASOURCE.filter(jsonObj => jsonObj.locale == LOCALE)[0];
  let qMax = Object.keys(data.questions).length;

  if ( qNum < 0 || qNum > qMax ) return;

  if ( ! qPrev ) qPrev = 'question-' + ( qNum - 1 );
  if ( qPrev == 'question-0' ) qPrev = 'welcome';

  let qNow  = 'question-' + qNum;

  moveOutIn( document.getElementById(qPrev), document.getElementById(qNow) );

  /////////////////////////////////////////////
  // Set dynamic listeners for each question //
  /////////////////////////////////////////////

  let visibilityBtnNext   = window.getComputedStyle( document.getElementById('buttonNext') ).getPropertyValue("visibility");
  let visibilityBtnBack   = window.getComputedStyle( document.getElementById('buttonBack') ).getPropertyValue("visibility");
  let visibilityBtnSubmit = window.getComputedStyle( document.getElementById('buttonSubmit') ).getPropertyValue("visibility");

  let displayBtnNext   = window.getComputedStyle( document.getElementById('buttonNext') ).getPropertyValue("display");
  let displayBtnBack   = window.getComputedStyle( document.getElementById('buttonBack') ).getPropertyValue("display");
  let displayBtnSubmit = window.getComputedStyle( document.getElementById('buttonSubmit') ).getPropertyValue("display");

  // Button animations
  removeAllListeners( document.getElementById(qNow), 'animationend' );

  if ( qNum == 1 ) {

    if ( visibilityBtnNext == 'hidden' || displayBtnNext == 'none' ) {

      addListener( document.getElementById(qNow), 'animationend', () => fadeIn( document.getElementById('buttonNext') ), { once: true } );

    };

    if ( ! (visibilityBtnBack == 'hidden' || displayBtnBack == 'none') ) {

      addListener( document.getElementById(qNow), 'animationend', () => fadeOut( document.getElementById('buttonBack') ), { once: true } );

    };

  };

  if ( qNum > 1 ) {

    if ( visibilityBtnBack == 'hidden' || displayBtnBack == 'none' ) {

      addListener( document.getElementById(qNow), 'animationend', () => fadeIn( document.getElementById('buttonBack') ), { once: true } );

    };

  };

  if ( qNum < qMax ) {

    if ( ! (visibilityBtnSubmit == 'hidden' || displayBtnSubmit == 'none') ) {

      addListener( document.getElementById(qNow), 'animationend', () => fadeOut( document.getElementById('buttonSubmit') ), { once: true } );

    };

  };

  if ( qNum == qMax ) {

    if ( ! (visibilityBtnNext == 'hidden' || displayBtnNext == 'none') ) {

      addListener( document.getElementById(qNow), 'animationend', () => fadeOut( document.getElementById('buttonNext') ), { once: true } );

    };

    if ( visibilityBtnSubmit == 'hidden' || displayBtnSubmit == 'none' ) {

      addListener( document.getElementById(qNow), 'animationend', () => fadeIn( document.getElementById('buttonSubmit') ), { once: true } );

    };

    /////////////////
    // Submit form //
    /////////////////

    // let submitURL = ( window.location.hostname == 'localhost' ) ? 'http://localhost:8787' : '/student/download'; // ON PRODUCTION: Comment out.
    let submitURL = '/student/download';

    removeAllListeners( document.getElementById('formMain'), 'submit' );
    addListener( document.getElementById('formMain'), 'submit', event => {

      event.preventDefault();

      let name = document.querySelector('input[name=name]').value;
      let code = document.querySelector('input[name=code]').value;

      if ( !name || !code ) return;

      moveOut( document.getElementById(qNow) );
      moveOut( document.getElementById('formMain') );

      // Load input to error page in case authetication fails
      document.getElementById('authFailedName').innerHTML = name;
      document.getElementById('authFailedCode').innerHTML = code;

      postData( submitURL, name, code).then( (json) => verifyData(json) );
    
    }, { once: false } );

  };

  // Set button listeners
  document.getElementById('buttonNext')
    .addEventListener( 'animationend', () => {

      removeAllListeners( document.getElementById('buttonNext'), 'click' );
      addListener( document.getElementById('buttonNext'), 'click', () => question( qNum + 1 ), { once: true } );

    }, { once: true } );

  document.getElementById('buttonBack')
    .addEventListener( 'animationend', () => {

      removeAllListeners( document.getElementById('buttonBack'), 'click' );
      addListener( document.getElementById('buttonBack'), 'click', () => question( (qNum - 1), 'question-' + qNum ), { once: true } );

    }, { once: true });

  addListener( document.getElementById(qNow), 'animationend', () => document.getElementById(qNow).children[1].focus(), { once: true } );

  // Set input keypress (Enter) listeners
  removeAllListeners( document.getElementById(qNow).children[1], 'keypress' );
  addListener( document.getElementById(qNow).children[1], 'keypress', event => {
      
      if (event.key === 'Enter') {
        event.preventDefault();
        qNum == qMax ? document.getElementById('buttonSubmit').click() : document.getElementById('buttonNext').click();
      };

  });

  // END: Question dynamic listeners

};

async function postData(url, name, code) {

  name = name.replace(/\s\s+/g, ' ').trim().toUpperCase();
  code = code.replace(/\s+/g, '').toUpperCase();

  try {

    // let mode = ( window.location.hostname == 'localhost' ) ? 'cors' : 'same-origin'; // ON PRODUCTION: Comment out.
    let mode = 'same-origin';
    // let redirect = ( window.location.hostname == 'localhost' ) ? 'follow' : 'error'; // ON PRODUCTION: Comment out.
    let redirect = 'error';

    const response = await fetch(url, {
    
      method: "POST",
      mode: mode,
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: redirect,
      referrerPolicy: "strict-origin-when-cross-origin",

      body: JSON.stringify({
        name,
        code
      })
    
    })
    .catch( e => { throw new Error( 'Fetch POST error: ' + e ) } );

    return response.json();

  } catch(e) { throw new Error( 'Try-fetch failed: ' + e ) };

};


function verifyData(json) {

  switch(json.auth) {

    case 'OK':

      let authOKMessage = document.getElementById('authOKMessage'); 
      authOKMessage.innerHTML = authOKMessage.innerHTML.replace( '${name}', titleCase(document.querySelector('input[name=name]').value.replace(/\s\s+/g, ' ').trim()) );

      let files = JSON.parse(json.result);

      let selectionLanguage = document.getElementById('authOKSelectionLanguage');
      let selectionFormat = document.getElementById('authOKSelectionFormat');
      let buttonDownload = document.getElementById('authOKButtonDownload');

      loadBookLanguages(files, selectionLanguage);

      moveIn(document.getElementById('authOK'))

      // Set onchange listeners for selectionLanguage, selectionFormat, and buttonDownload  
      selectionLanguage.addEventListener('change', () => {

        while ( selectionFormat.children.length > 1 ) selectionFormat.removeChild( selectionFormat.lastChild );
        selectionFormat.selectedIndex = 0;      

        loadBookFormats(files, selectionLanguage, selectionFormat);

        buttonDownload.disabled = true;
        
      });
    
      selectionFormat.addEventListener('change', () => {

        loadButtonDownload(files, selectionLanguage, selectionFormat, buttonDownload);
        
      });

      // Reload page on expiration of presigned URL expiration
      downloadTimer = document.getElementById('downloadTimer');
      timer = new CountDownTimer( 15 * 60, 1000 );
      timer
        .onTick( (minutes, seconds) => {

          seconds = ( seconds >= 10 || minutes === 0 ) ? seconds : '0' + seconds;
          minutes = minutes > 0 ? minutes + ':' : ( () => { downloadTimer.style.color = 'red'; return null; } )();
          downloadTimer.innerHTML = minutes ? minutes + seconds : '⏱️ ' + seconds;

        })
        .onTick( () => {

          if ( timer.expired() ) {
            document.getElementById('formMain').reset();
            window.location.reload();
          }

        })
        .start();

      break;

    case 'failed':

      moveIn( document.getElementById('authFailed') );

      document.getElementById('authFailedButtonOK').focus();

      let element;

      element = document.getElementById('authFailedName');
      json.result.name ? element.style.color = 'initial' : element.style.color = 'red';

      element = document.getElementById('authFailedNameIcon');
      json.result.name ? element.innerHTML = '🆗' : element.innerHTML = '❌';

      element = document.getElementById('authFailedCode');
      json.result.code ? element.style.color = 'initial' : element.style.color = 'red';

      element = document.getElementById('authFailedCodeIcon');
      json.result.code ? element.innerHTML = '🆗' : element.innerHTML = '❌';

      break;

    case '403':

      window.location.assign('/403.html');

      break;

    default:

      alert('Oops, there was an error! Can you please report the code below? 😅\n\n' + JSON.stringify(json, null, 2));
      window.location.reload();

  };

};


function loadBookLanguages(files, selectionLanguage) {

  let languageCode = [];

  // Get language codes
  for ( let i = 0; i < files.length; i++ ) languageCode.push( Object.keys(files[i])[0] );

  // Just get unique values
  languageCode = [ ...new Set(languageCode) ];

  for ( let i = 0; i < languageCode.length; i++ ) {

    let language = files.filter( obj => Object.keys(obj)[0] === languageCode[i] )[0][languageCode[i]].language; // Use node

    let option = document.createElement("option");
    option.innerHTML = language;
    option.value = languageCode[i];

    selectionLanguage.add(option);
  
  };

};


function loadBookFormats(files, selectionLanguage, selectionFormat) {

  let formats = files.filter( obj => Object.keys(obj)[0] === selectionLanguage.value ).map( obj => obj[selectionLanguage.value].format );

  for ( let i = 0; i < formats.length; i++ ) {

    let option = document.createElement("option");
    option.innerHTML = formats[i];
    option.value = formats[i];

    selectionFormat.add(option);

  };

  selectionFormat.disabled = false;

};


function loadButtonDownload(files, selectionLanguage, selectionFormat, buttonDownload) {

  let dl = files.filter( obj => {
    return Object.keys(obj)[0] === selectionLanguage.value &&
    obj[selectionLanguage.value].format === selectionFormat.value } )[0][selectionLanguage.value];

  buttonDownload.innerHTML = downloadText + ' ' + dl.format + '<br>' + dl.title;

  removeAllListeners(buttonDownload, 'click');
  addListener( buttonDownload, 'click', () => window.open(dl.path) );

  buttonDownload.disabled = false;

};


function setLocaleFromBrowserLangs(locales) {

  // Get browser languages as array; entries cut after the dash (-); only unique values by `Set`
  let browserLanguages = Array.from(new Set(navigator.languages.map( l => l.replace(/-.*$/, '') )));

  // Return if browserLanguages matches DATASOURCE locales
  for (let i = 0; i < browserLanguages.length; i++) if ( locales.includes(browserLanguages[i]) ) return browserLanguages[i];
  
  // If browser languages not found in locales, use the first locales value as default
  return locales[0];

};

///////////////////////
// Display functions //
///////////////////////

function moveIn(element, display = 'initial', visibility = 'initial') {

  element.style.display = display;
  element.style.visibility = visibility;
  element.style.zIndex = 'auto';

  element.classList.add('moveInUp');

};


function moveOut(element) {

  element.classList.remove('moveInUp');
  element.classList.add('moveOutUp');
  
  element.addEventListener('animationend', () => {
    
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.zIndex = '-10';
    
    element.classList.remove('moveOutUp');
  }, { once: true });

};


function moveOutIn(elementOut, elementIn, display, visibility) {
  
  moveOut(elementOut);

  elementOut.addEventListener('animationend', () => {

    moveIn(elementIn, display, visibility);

  }, { once: true } );

};

function fadeIn(element, display = 'initial', visibility = 'initial') {

  element.style.display = display;
  element.style.visibility = visibility;
  element.style.zIndex = 'auto';

  element.classList.add('fadeIn');

};


function fadeOut(element) {

  element.classList.remove('fadeIn');
  element.classList.add('fadeOut');
  
  element.addEventListener('animationend', () => {
    
    element.style.display = 'none';
    element.style.visibility = 'hidden';
    element.style.zIndex = '-10';
    
    element.classList.remove('fadeOut');
  }, { once: true });

};


function fadeOutIn(elementOut, elementIn, display, visibility) {
  
  fadeOut(elementOut);

  elementOut.addEventListener('animationend', () => {

    fadeIn(elementIn, display, visibility);

  }, { once: true } );

};

////////////////////////////////////
// Helper variables and functions //
////////////////////////////////////

var downloadText;

var _eventHandlers = {};

const addListener = (node, event, handler, option) => {

  if (!(event in _eventHandlers)) {
    _eventHandlers[event] = []
  }

  _eventHandlers[event].push({ node: node, handler: handler, option: option })

  node.addEventListener(event, handler, option)

};

const removeAllListeners = (targetNode, event) => {

  if ( ! _eventHandlers[event] ) return;

  _eventHandlers[event]
    .filter(({ node }) => node === targetNode)
    .forEach(({ node, handler, option }) => node.removeEventListener(event, handler, option))

  _eventHandlers[event] = _eventHandlers[event].filter(
    ({ node }) => node !== targetNode,
  );

};

function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
}

CountDownTimer.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  var start = Date.now(),
      that = this,
      diff, obj;

  (function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);
        
    if (diff > 0) {
      setTimeout(timer, that.granularity);
    } else {
      diff = 0;
      that.running = false;
    }

    obj = CountDownTimer.parse(diff);
    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }());
};

CountDownTimer.prototype.onTick = function(ftn) {
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
};

function readCookies(cookieName) {

  if ( ! document.cookie ) return null;

  let cookies = document.cookie.split(';');

  let cookieArray = [];

  for (let i = 0; i < cookies.length; i++) {

    let cookie = cookies[i].split('=');

    cookie[0] = cookie[0].trim();
    cookie[1] = cookie[1].trim();

    if (cookieName && cookie[0] === cookieName) {

      return cookie[1];

    } else if (!cookieName) {

      cookieArray.push({
        name: cookie[0],
        value: cookie[1]

      });

    };

  };

  return cookieArray;

};

function setCookie(name, value, expires, path, domain, secure) {

/*
name: The name of the cookie.
value: The value of the cookie.
expires: The expiration date of the cookie, in milliseconds. If this is not specified, the cookie will expire when the browser is closed.
path: The path of the cookie. If this is not specified, the cookie will be available on all pages in the domain.
domain: The domain of the cookie. If this is not specified, the cookie will be available on all subdomains of the domain.
secure: Whether the cookie should only be sent over secure connections. If this is not specified, the cookie will be sent over both secure and insecure connections.
*/

  var cookie = name + "=" + encodeURIComponent(value);

  if (expires) {
    var date = new Date();
    date.setTime(date.getTime() + (expires * 1000));
    cookie += "; expires=" + date.toUTCString();
  }

  if (path) {
    cookie += "; path=" + path;
  }

  if (domain) {
    cookie += "; domain=" + domain;
  }

  if (secure) {
    cookie += "; secure";
  }

  document.cookie = cookie;

};

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
function storageAvailable(type) {

  let storage;

  try {

    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;

  } catch (e) {

    return (

      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0

    );

  };

};
