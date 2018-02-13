/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var errorElement = document.querySelector('#errorMsg');
var video = document.getElementById('video');
var canvas = window.canvas = document.querySelector('canvas');
var clicker = document.getElementById("cameraClicker");
var sky = document.getElementById("sky");
//var monument = document.getElementById("monument");
var weather = document.getElementById("weather");

// canvas.width = 480;
// canvas.height = 360;
clicker.onclick = function() {takePic()};

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: false,
  video: true
};


function handleSuccess(stream) {
  var videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using video device: ' + videoTracks[0].label);
  console.log('Stream active');

  stream.oninactive = function() {
    console.log('Stream inactive');
  };
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
  //monument.style.display = 'block';
  sky.style.display = 'block';
  weather.style.display = 'block';
  clicker.style.display = 'block';

  console.log("video width = " + video.videoWidth)
}

//
// (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1";
//     fjs.parentNode.insertBefore(js, fjs);
//   }(document, 'script', 'facebook-jssdk'));



function takePic() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d').
    drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  clicker.style.display = 'none';
  video.style.display = 'none';
  shareBtn.style.display = 'block';


};





function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
        constraints.video.width.exact + ' px is not supported by your device.');
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg('getUserMedia error: ' + error.name, error);
}

function errorMsg(msg, error) {
  errorElement.innerHTML += '<p>' + msg + '</p>';
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
