/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 *  Modified from https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/canvas/js/main.js
 */

'use strict';

var videoElement = document.querySelector('video');
var videoSelect = document.querySelector('select#videoSource');
var selectors = [videoSelect];

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  var values = selectors.map(function(select) {
    return select.value;
  });
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    }
  }
  selectors.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  videoElement.onloadedmetadata = function(e) {
    videoElement.style.display = "block";
    videoElement.play();
  }
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

videoSelect.onchange = start;

// start();

function start(stopTracks=true) {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      if (stopTracks) {
        track.stop();
      }
    });
  }

  for (var i = 0; i < videoSelect.options.length; i++) {
    if (videoSelect.options[i].text.includes("Front")) {
      alert(i + videoSelect.options[i].value);
      videoSelect.value = videoSource.options[i].value;
      alert("selecting " + i);
    }
  }

  var videoSource = videoSelect.value;

  var constraints = {
    audio: false,
    video: {
      deviceId: videoSource ? {exact: videoSource} : undefined,
      facingMode: "user"
    }
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream).then(gotDevices).catch(handleError);
}

videoSelect.onchange = start;

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function handleOrientation(event) {
  try {
    var alpha = event.alpha;
    $("#alpha").text(alpha);
    if (alpha >= 150 && alpha <= 210) {
        $("video").addClass("flipV");
    } else {
      $("video").removeClass("flipV");
    }
  }
  catch {
    console.log("No alpha for device.");
  }
}

window.addEventListener('deviceorientation', handleOrientation, true);

handleOrientation();
