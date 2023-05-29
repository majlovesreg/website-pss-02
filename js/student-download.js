var LOCALE = 'en';
var DATASOURCE = [];

fetch("data/2023_SLV.json").then(response => response.json()).then(jsonObj => DATASOURCE = jsonObj);

window.onload = () => main();

function main() {  
  
  createForm();
  updateText();

  moveIn(document.getElementsByClassName('container')[0], 'flex');

  loadInitialListeners();

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
    
    div.innerHTML = '<p>'+ data.questions[n].innerText +'</p><input type="'+ data.questions[n].type +'" name="'+ data.questions[n].name +'" placeholder="'+ data.questions[n].placeholder +'">'

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

  // Set page titles
  document.title = data.pageTitle;
  document.getElementById('pageTitle').innerHTML = data.pageTitle;

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

  // Set questions
  for ( let n of Object.keys(data.questions) ) document.getElementById('question-' + n).children[0].innerText = data.questions[n].innerText;

  // Set buttons
  for ( let v of Object.values(data.buttons) ) document.getElementById(v.id).innerText = v.innerText;

};


function loadInitialListeners() {

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

    removeAllListeners( document.getElementById('formMain'), 'submit' );
    addListener( document.getElementById('formMain'), 'submit', event => {

      event.preventDefault();

      moveOut( document.getElementById(qNow) );
      moveOut( document.getElementById('formMain') );


      let name = document.querySelector('input[name=name]').value;
      let code = document.querySelector('input[name=code]').value;

      // Load input to error page in case authetication fails
      document.getElementById('authFailedName').innerHTML = name;
      document.getElementById('authFailedCode').innerHTML = code;

      postData('/download/verifier', name, code).then( (json) => verifyData(json) );
    
    }, { once: false } );

  };

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

  removeAllListeners( document.getElementById(qNow).children[1], 'keypress' );
  addListener( document.getElementById(qNow).children[1], 'keypress', event => {
      
      if (event.key === "Enter") {
        event.preventDefault();
        qNum == qMax ? document.getElementById('buttonSubmit').click() : document.getElementById('buttonNext').click();
      }

  });

  // END: Question dynamic listeners

};

async function postData(url, name, code) {

  name = name.replace(/\s\s+/g, ' ').trim().toUpperCase();
  code = code.replace(/\s\s+/g, ' ').trim().toUpperCase();

  try {

    const response = await fetch(url, {
    
      method: "POST",
      mode: "same-origin",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "error",
      referrerPolicy: "strict-origin-when-cross-origin",

      body: JSON.stringify({
        name,
        code
      })
    
    }).catch( e => { return { 'error': e } } );

    return response.json();

  } catch(e) {

    return { 'error': e };
  
  };

};


function verifyData(json) {

  json = {
    "auth": "failed",
    "result": {
      "name": false,
      "code": true
    }
  }

  switch(json.auth) {

    case 'OK':

      // Do OK

      break;

    case 'failed':

      moveIn( document.getElementById('authFailed') );

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

    default:

      window.location.assign('/403.html');

      break;

  };

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
