// ==UserScript==
// @name YouTube Gamepad
// @namespace PuddleJumper
// @version 0.1
// @description Adds gamepad/joystick/controller support to YouTube
// @author PuddleJumper
// @match https://www.youtube.com/watch*
// @grant none
// ==/UserScript==

var selectedBoxShadowStyle = 'rgba(27, 127, 204, .8) 0px 0px 0px 3px inset';

var gamepadButtonHTML =
  `<button class="ytp-button" id="gamepad-button"
aria-label="Controller support"
title="Controller support" disabled style="opacity: 0.4;">
<svg id="gamepad-icon" width="100%" height="100%" viewBox="0 0 36 36">
<path d="M23.622 9c-1.913 0-2.558 1.382-5.623 1.382-3.009
0-3.746-1.382-5.623-1.382-5.209 0-6.376 10.375-6.376 14.348 0 2.145.817
3.652 2.469 3.652 3.458 0 2.926-5 6.915-5h5.23c3.989 0 3.457 5 6.915 5
1.652 0 2.471-1.506 2.471-3.651 0-3.973-1.169-14.349-6.378-14.349zm-10.622
10c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm10-6c.552 0 1
.447 1 1 0 .553-.448 1-1 1s-1-.447-1-1c0-.553.448-1 1-1zm-2 4c-.552
0-1-.447-1-1 0-.553.448-1 1-1s1 .447 1 1c0 .553-.448 1-1 1zm2 2c-.552
0-1-.447-1-1 0-.553.448-1 1-1s1 .447 1 1c0 .553-.448 1-1 1zm2-2c-.552
0-1-.447-1-1 0-.553.448-1 1-1s1 .447 1 1c0 .553-.448 1-1 1zm-10.25-1c0
.965-.785 1.75-1.75 1.75s-1.75-.785-1.75-1.75.785-1.75 1.75-1.75 1.75.785
1.75 1.75z" fill="#fff"/></svg></button>`;
var gamepadButton, nextButton, playpauseButton, previousButton, volumeButton,
  subtitlesButton, settingsButton, multicamButton, miniplayerButton,
  pipButton, theatermodeButton, playontvButton, fullscreenButton, videoPlayer,
  bodyNode;

// Find the buttons
var videomenu = [];

function findElements() {
  videoPlayer = document.getElementById('movie_player');
  bodyNode = document.lastElementChild.lastElementChild;


  findVideoControls();
}

function findVideoControls() {
  var controlsElems = document.getElementsByClassName('ytp-chrome-controls');
  var controlsElem = controlsElems[0];
  if (controlsElem) {
    var controls = controlsElem.children;
    var leftcontrols = controls[0].children;
    var rightcontrols = controls[1].children;

    nextButton = leftcontrols[0]
    playpauseButton = leftcontrols[1];
    previousButton = leftcontrols[2];
    volumeButton = leftcontrols[3].firstElementChild;

    subtitlesButton = rightcontrols[2];
    settingsButton = rightcontrols[3];
    multicamButton = rightcontrols[4];
    miniplayerButton = rightcontrols[5];
    pipButton = rightcontrols[6];
    theatermodeButton = rightcontrols[7];
    playontvButton = rightcontrols[8];
    fullscreenButton = rightcontrols[9];

    for (var i = 0; i < 3; i++) {
      videomenu[i] = leftcontrols[i];
    }
    videomenu[3] = volumeButton;
    for (var i = 2; i < 10; i++) {
      videomenu[i + 2] = rightcontrols[i];
    }
  }
}

// Add indicator icon to the video controls
function createIcon() {
  if (document.getElementById('gamepad-button')) {
    return;
  }

  if (!subtitlesButton) {
    subtitlesButton =
      document.getElementsByClassName('ytp-subtitles-button')[0];
  }

  if (!subtitlesButton) {
    return;
  }

  if (!gamepadButton) {
    var gamepadButtonTemplate = document.createElement('TEMPLATE');
    gamepadButtonTemplate.innerHTML = gamepadButtonHTML;
    gamepadButton = gamepadButtonTemplate.content.firstElementChild;
  }

  subtitlesButton.parentElement.insertBefore(gamepadButton, subtitlesButton);
}

function pageUpdate() {
  createIcon();
  findElements();
}

// Watch page for changes and update buttons
var observer = new MutationObserver(pageUpdate);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
pageUpdate();

// Gamepad handling
var lastgpstate = [];
var gamepads = [];

function gamepadWatcher() {
  // Update gamepad readings
  navigator.getGamepads();
  var gpevent = document.createEvent('Event');

  // Loop through each gamepad
  for (var gp = 0; gp < gamepads.length; gp++) {
    gamepad = gamepads[gp];
    // Not present = null
    if (!gamepad) {
      continue;
    }

    // Only supports standard mappings
    if (gamepad.mapping != 'standard') {
      continue;
    }

    // Loop through each button
    for (var b = 0; b < gamepad.buttons.length; b++) {
      button = gamepad.buttons[b];
      lastbuttonstate = lastgpstate[gp].buttons[b];

      // Also fires when lastbuttonstate is undefined
      if (lastbuttonstate.pressed != button.pressed) {
        gpevent.initEvent(button.pressed ? 'gpbuttondown' : 'gpbuttonup');
        gpevent.buttonCode = b;
        gpevent.gamepad = gamepads[gp];
        document.dispatchEvent(gpevent);

        lastbuttonstate.pressed = button.pressed;
        lastbuttonstate.value = button.value;
      }
    }
  }
}

var gpinterval;

function gpConnectionHandler(gp) {
  console.log('Gamepad connected');

  var gamepad = navigator.getGamepads()[gp];
  if (gamepad && gamepad.mapping == 'standard') {
    gamepads[gp] = gamepad;

    lastgpstate[gp] = {
      axes: [],
      buttons: [],
    };

    for (var a = 0; a < gamepads[gp].axes.length; a++) {
      lastgpstate[gp].axes[a] = {};
    }

    for (var b = 0; b < gamepads[gp].buttons.length; b++) {
      lastgpstate[gp].buttons[b] = {};
    }
  }

  if (!gpinterval && countStandardGamepads() > 0) {
    gpinterval = setInterval(gamepadWatcher, 17);
    createIcon();
    gamepadButton.style.opacity = 1;
  }
}

function gpDisconnectionHandler(gp) {
  console.log('Gamepad disconnected');
  navigator.getGamepads();

  delete gamepads[gp];
  delete lastgpstate[gp];

  if (gpinterval && countStandardGamepads() <= 0) {
    clearInterval(gpinterval);
    delete gpinterval;
    createIcon();
    gamepadButton.style.opacity = 0.4;
  }
}

window.addEventListener('gamepadconnected',
  function(e) {
    gpConnectionHandler(e.gamepad.index);
  });
window.addEventListener('gamepaddisconnected',
  function(e) {
    gpDisconnectionHandler(e.gamepad.index);
  });

// Scan all gamepads in case we missed a connection event
for (var gp = 0; gp < gamepads.length; gp++) {
  gpConnectionHandler(gp);
}

function countStandardGamepads() {
  var count = 0;
  for (var i = 0; i < gamepads.length; i++) {
    if (!gamepads[i]) {
      continue;
    }

    if (gamepads[i].mapping == 'standard') {
      count++;
    }
  }
  return count;
}

function sendKey(keyCode, element) {
  keyEvent = document.createEvent('Event');
  keyEvent.initEvent('keydown');

  keyEvent.keyCode = keyCode;

  element.dispatchEvent(keyEvent);
}

var videoContext = 'video';
var videoMenuContext = 'videomenu';
var videoInfoContext = 'videoinfo';
var suggestedVideosContext = 'suggestedvideos';

var activecontext = videoContext;
var nextcontext = videoContext;

var videomenuindex = 1;
var suggestedvideoindex = 1;

function videoPause() {
  if (activecontext == videoContext) {
    playpauseButton.click();
  }
}

function videomenuAccept() {
  if (activecontext == videoMenuContext) {
    videomenu[videomenuindex].click();
  }
}

function videocontextBack() {
  if (activecontext == videoMenuContext ||
    activecontext == suggestedVideosContext) {

    deselectSuggestedVideo();
    deselectVideoMenuElem();

    videoPlayer.focus();
    videoPlayer.classList.add('ytp-autohide');

    nextcontext = videoContext;
  }
}

function suggestedVideosList() {
  return document.getElementById('related')
    .children[1].children[1].children;
}

function selectSuggestedVideo() {
  var svl = suggestedVideosList();

  if (suggestedvideoindex >= svl.length) {
    suggestedvideoindex = svl.length - 1;
  }
  if (suggestedvideoindex < 0) {
    suggestedvideoindex = 0;
  }

  var sv = getSuggestedVideo(svl);
  sv.tabIndex = 100 + suggestedvideoindex;
  sv.focus();
  sv.style.boxShadow = selectedBoxShadowStyle;
}

function deselectSuggestedVideo() {
  var svl = suggestedVideosList();
  var sv = getSuggestedVideo(svl);
  sv.style.boxShadow = '';
}

function getSuggestedVideo(svl) {
  if (suggestedvideoindex == 0) {
    return svl[0].children[1].firstElementChild.firstElementChild;
  }
  return svl[suggestedvideoindex].firstElementChild;
}

function videoSuggested() {
  if (activecontext == videoContext) {
    selectSuggestedVideo();
    nextcontext = suggestedVideosContext;
  }
}

function activateVideomenu() {
  if (activecontext == videoContext) {
    videoPlayer.classList.remove('ytp-autohide');
    nextcontext = videoMenuContext;
    selectVideoMenuElem();
  }
}

function videoFullscreen() {
  if (activecontext == videoContext) {
    fullscreenButton.click();
  }
}

function videoVolumeUp() {
  if (activecontext == videoContext) {
    sendKey(38, videoPlayer);
  }
}

function videoVolumeDown() {
  if (activecontext == videoContext) {
    sendKey(40, videoPlayer);
  }
}

function videoSeekBack() {
  if (activecontext == videoContext) {
    sendKey(37, videoPlayer);
  }
}

function videomenuLeft() {
  if (activecontext == videoMenuContext) {

    deselectVideoMenuElem();
    videomenuindex = getNextEnabledVideoMenuIndex(videomenuindex, -1);
    selectVideoMenuElem();
  }
}

function getNextEnabledVideoMenuIndex(index, step) {
  var i = index + step;

  while (i < videomenu.length && i >= 0) {
    var elem = videomenu[i];

    if (elem.style.display != 'none') {
      return i;
    }

    i += step;
  }

  return index;
}

function videoSeekForward() {
  if (activecontext == videoContext) {
    sendKey(39, videoPlayer);
  }
}

function selectVideoMenuElem() {
  var vmi = videomenu[videomenuindex];
  vmi.style.boxShadow = selectedBoxShadowStyle;
}

function deselectVideoMenuElem() {
  var vmi = videomenu[videomenuindex];
  vmi.style.boxShadow = '';
}

function videomenuRight() {
  if (activecontext == videoMenuContext) {

    deselectVideoMenuElem();
    videomenuindex = getNextEnabledVideoMenuIndex(videomenuindex, 1);
    selectVideoMenuElem();
  }
}

function videoStepBack() {
  if (activecontext == 'videoContext') {
    sendKey(188, videoPlayer);
  }
}

function videoStepForward() {
  if (activecontext == 'videoContext') {
    sendKey(190, videoPlayer);
  }
}

function suggestedvideosUp() {
  if (activecontext == suggestedVideosContext) {
    deselectSuggestedVideo();
    suggestedvideoindex--;
    selectSuggestedVideo();
  }
}

function suggestedvideosDown() {
  if (activecontext == suggestedVideosContext) {
    deselectSuggestedVideo();
    suggestedvideoindex++;
    selectSuggestedVideo();
  }
}

function suggestedvideoAccept() {
  if (activecontext == suggestedVideosContext) {
    var svl = suggestedVideosList();
    var sv = getSuggestedVideo(svl);
    sv.firstElementChild.firstElementChild.click();

    videocontextBack();
  }
}

buttonBindings = [];
buttonBindings[0] = [videoPause, videomenuAccept, suggestedvideoAccept]; // A
buttonBindings[1] = [videocontextBack, videoSuggested]; // B
buttonBindings[2] = [activateVideomenu]; // X
buttonBindings[3] = [videoFullscreen]; // Y
buttonBindings[4] = [videoStepBack]; // LB
buttonBindings[5] = [videoStepForward]; // RB
buttonBindings[6] = []; // LT
buttonBindings[7] = []; // RT
buttonBindings[8] = []; // Select
buttonBindings[9] = []; // Start
buttonBindings[10] = []; // LS
buttonBindings[11] = []; // RS
buttonBindings[12] = [videoVolumeUp, suggestedvideosUp]; // Up
buttonBindings[13] = [videoVolumeDown, suggestedvideosDown]; // Down
buttonBindings[14] = [videoSeekBack, videomenuLeft]; // Left
buttonBindings[15] = [videoSeekForward, videomenuRight]; // Right
buttonBindings[16] = []; // Guide
buttonBindings[17] = []; // Touchpad click

document.addEventListener('gpbuttondown', function(e) {
  binding = buttonBindings[e.buttonCode];
  if (binding) {
    for (var i = 0; i < binding.length; i++) {
      binding[i]();
    }
  }

  activecontext = nextcontext;
});
