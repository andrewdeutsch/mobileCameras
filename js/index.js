/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

var shareButtons = document.getElementById('sharethis-inline-share-buttons');
var errorElement = document.querySelector('#errorMsg');
var video = document.getElementById('video');
var canvas1 = window.canvas = document.querySelector('canvas');
var clicker = document.getElementById("cameraClicker");
var shareBtn = document.getElementById("shareBtn");
var download = document.getElementById("download");
var snapShot = document.getElementById("snapShot");
var block = document.getElementById('block');
var fbLogo = document.getElementById('fbLogo');
var twitterLogo = document.getElementById('twitterLogo');
var cancelText = document.getElementById('cancelText');
var weather = document.getElementById("weather");
var tree = document.getElementById("tree");
var node1 = document.getElementById('container');
var sky = document.getElementById("sky");
var nameTag = document.getElementById("nameTag");

var thisUser;
//access token activated on graph explorer for the 'future forecast' app
var token = "";

var context = canvas1.getContext('2d');

var formData;
var dataURL;
var blobby;
// canvas.width = 480;
// canvas.height = 360;
clicker.addEventListener('click', function () {
    takePic()
})
fbLogo.addEventListener('click', function () {
	login();
})
twitterLogo.addEventListener('click', function () {
	//login();
})
cancelText.addEventListener('click', function () {
	resetClicker();
})
// download.onclick = function() {downloadImg()};
// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
    audio: false,
    video: true
};

function resetClicker(){
  block.style.display = 'none';
  clicker.style.display = 'block';
  canvas1.style.display = 'none';
  $("video").prop('disabled', false);
  video.style.display = 'block';
}
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
    sky.style.display = 'block';
    weather.style.display = 'block';
    tree.style.display = 'block';
}


function takePic() {
    canvas1.style.display = 'block';
    canvas1.width = video.videoWidth;
    canvas1.height = video.videoHeight;

    clicker.style.display = 'none';
    context.drawImage(video, 0, 0);
    $("video").prop('disabled', true);
    //$('video').remove();
    html2canvas(document.querySelector("#container")).then(canvas => {

    dataURL = canvas.toDataURL('image/jpeg', 0.8);
    blobby = dataURItoBlob(dataURL);

    video.style.display = 'none';

    enableShareBtn();
    });

};

function enableShareBtn() {
    window.setTimeout(function() {
        //shareBtn.style.display = 'block';
        block.style.display = 'block';

    }, 250);

}


function fbUpload(token){
  var formData = new FormData()
  formData.append('access_token', token)
  formData.append('source', blobby)
  formData.append('message', 'Check out my Future Forecast! Get yours at https://www.futureforecast.com');
  var xhr = new XMLHttpRequest();
  xhr.open( 'POST', 'https://graph.facebook.com/me/photos', true )
  xhr.onload = xhr.onerror = function() {
    //console.log( xhr.responseText )
  };
  xhr.send( formData )
}

function dataURItoBlob(dataURI) {
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
  return new Blob([ab], {type: mimeString});
}
//
function login() {
  FB.login(function(response) {
    token = response.authResponse.accessToken;
    if (response.status === 'connected') {
        fbUpload(token)
        console.log(response.authResponse.accessToken);
        //document.getElementById('status').innerHTML = 'We are connected.';
        //document.getElementById('loginBtn').style.visibility = 'hidden';
      } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'We are not logged in.'
        document.getElementById('loginBtn').style.display = 'block';
      } else {
        document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
        document.getElementById('loginBtn').style.display = 'block';
      }
  }, {scope: 'publish_actions'});
}
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
