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
var shareBtn = document.getElementById("shareBtn");
var download = document.getElementById("download");


//var monument = document.getElementById("monument");
var weather = document.getElementById("weather");
var tree = document.getElementById("tree");

var node = document.getElementById('container');

var img = new Image();

var urlToOpen;


// canvas.width = 480;
// canvas.height = 360;
clicker.onclick = function() {takePic()};
shareBtn.onclick = function() {loadImg()};
download.onclick = function() {downloadImg()};
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
  tree.style.display = 'block';
  clicker.style.display = 'block';
}


function takePic() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').
    drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

  domtoimage.draw(node, {})
      .then(function (canvas) {
          //img.src = dataUrl;
          canvas.toBlob(function(blob){
            //canvas.append(img);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://d3a4kjxi6e.execute-api.us-east-1.amazonaws.com/prod/movableink-ar-presigned-url', true);
            xhr.onload = function(e) { console.log(this.responseText)
              var response = JSON.parse(this.responseText);
              var putXHR = new XMLHttpRequest();
              putXHR.open('PUT', response.putUrl, true);
              putXHR.onload = function(e) { console.log(response.putUrl);
            }
              putXHR.send(blob);
              urlToOpen = response.url;
              console.log("urlToOpen " + urlToOpen);
            };
            xhr.send();
          },'image/jpeg', 0.95)

      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
  clicker.style.display = 'none';
  video.style.display = 'none';
  enableShareBtn();

};

function enableShareBtn(){
  window.setTimeout(function() {
    //shareBtn.style.display = 'block';
    download.style.display = 'block';
}, 250);

}


function loadImg() {
  FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
            object : {
               'og:url': urlToOpen,
               'og:title': 'Future Forecast',
               'og:description': "Me, soon.",
               'og:image': urlToOpen,
               'og:og:image:width': '733',
               'og:image:height': '1440'
            }
        })
    });
      console.log('urlToOpen '+ urlToOpen);
}

function downloadImg() {
  //var blob = new Blob(recordedBlobs, {type: 'video/webm'});
  var url = urlToOpen;
  var a = document.createElement('a');
  console.log("the urls is "+url)
  a.style.display = 'none';
  a.href = url;
  a.download = url;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
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
