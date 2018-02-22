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
var sky = document.getElementById("sky");
var shareBtn = document.getElementById("shareBtn");
var download = document.getElementById("download");
var snapShot = document.getElementById("snapShot");

//access token activated on graph explorer for the 'future forecast' app
var token = "EAAGmcJ787vgBAD7x8F4enC9J5C6EMZAK5GFHvnDZCZCZA0mqx5XgZCFSgDEZBnPZBA4ZAXLjcnIfji4ZCZCirtzp3D0jsZC1fRwisisnkelqU1ZAL9yQmdR6Q6BLqK9jZA6XBM9kZBgM91GMebalQZBHbV5wRv24VA5K0Ss3vQVCUyS0mgz2QZCdzZCRveFV6ZAL9HZBrK0KqE4ZC3ryqnyslBqwHIuknbae";

var context = canvas1.getContext('2d');

//var monument = document.getElementById("monument");
var weather = document.getElementById("weather");
var tree = document.getElementById("tree");
var node1 = document.getElementById('container');

console.log("node1.width " + node1.width);
//var urlToOpen;
var formData;
var dataURL;
var blobby;
// canvas.width = 480;
// canvas.height = 360;
clicker.addEventListener('click', function () {
    //fbUpload(token)
    takePic()
})
shareBtn.addEventListener('click', function () {
	fbUpload(token)
})
// download.onclick = function() {downloadImg()};
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
    canvas1.width = video.videoWidth;
    canvas1.height = video.videoHeight;
    //var skyWidth = 100%;
    //var skyHeight = 100%;

    context.drawImage(video, 0, 0);
    $('video').remove();
    console.log('node1 ' +node1);
    domtoimage.draw(node1, {})
        .then(function(canvas) {
            //img.src = dataUrl;
            //context.clearRect(0,0);
            //$('body').html("").prepend(canvas)
            canvas.toBlob(function(blob) {
                //canvas.append(img);
                //canvas.append(sky);
                // canvas.append(tree);
                // canvas.append(weather);
                //sky.style.display = 'none';
                //weather.style.display = 'none';
                //tree.style.display = 'none';
                //context.drawImage(sky, 0, 0, sky.width, sky.height);
                console.log("video.videoWidth " + video.videoWidth)
                dataURL = canvas1.toDataURL('image/jpeg', .8)
                blobby = dataURItoBlob(dataURL);
            //     var xhr = new XMLHttpRequest();
            //     xhr.open('GET', 'https://d3a4kjxi6e.execute-api.us-east-1.amazonaws.com/prod/movableink-ar-presigned-url', true);
            //     xhr.onload = function(e) {
            //         console.log(this.responseText)
            //         var response = JSON.parse(this.responseText);
            //         var putXHR = new XMLHttpRequest();
            //         putXHR.open('PUT', response.putUrl, true);
            //         putXHR.onload = function(e) {
            //             console.log(response.putUrl);
            //         }
            //         putXHR.send(blob);
            //         //urlToOpen = response.url;
            //         dataURL = canvas.toDataURL('image/jpeg', 1.0)
            //         blobby = dataURItoBlob(dataURL);
            //
            //         console.log("urlToOpen " + urlToOpen);
            //     };
            //     xhr.send();
            // }, 'image/jpeg', 0.95)
          });
        })
        .catch(function(error) {
            console.error('oops, something went wrong!', error);
        });
    //var c = document.getElementById("canvas");
    // var ctx = canvas.getContext("2d");
    // var img = new Image();
    // img.onload = function() {
    //   ctx.drawImage(img, 0, 0);
    // };
    // img.src = urlToOpen;
    //canvas.src = urlToOpen;
    clicker.style.display = 'none';
    video.style.display = 'none';
    enableShareBtn();

};

function enableShareBtn() {
    window.setTimeout(function() {
        shareBtn.style.display = 'block';
        // sky.style.display = 'none';
        // weather.style.display = 'none';
        // tree.style.display = 'none';
        //shareButtons.style.display = 'block';
        //download.style.display = 'block';
    }, 250);

}


// function loadImg() {
//
//     FB.ui({
//         method: 'share_open_graph',
//         action_type: 'og.shares',
//         action_properties: JSON.stringify({
//             object: {
//                 'og:url': urlToOpen,
//                 'og:title': 'Future Forecast',
//                 'og:description': "Me, soon.",
//                 'og:image': urlToOpen,
//                 'og:og:image:width': '733',
//                 'og:image:height': '1440'
//             }
//         })
//     });


//     console.log('urlToOpen ' + urlToOpen);
// }

function fbUpload(){
  // var dataURL = canvas.toDataURL('image/jpeg', 1.0)
  // var blobby = dataURItoBlob(dataURL);
  var formData = new FormData()
  formData.append('access_token', token)
  formData.append('source', blobby)
  formData.append('message', 'Check out my Future Forecast! Get yours at https://www.futureforecast.com');
  // for (var pair of formData.entries()) {
  //   console.log("FORM DATA " + pair[0]+ ', ' + pair[1]);
  // }
  //console.log(urlToOpen);
  var xhr = new XMLHttpRequest();
  xhr.open( 'POST', 'https://graph.facebook.com/me/photos', true )
  xhr.onload = xhr.onerror = function() {
    console.log( xhr.responseText )
  };
  xhr.send( formData )

  // FB.api('/me/photos', 'post', {source: formData}, function(response) {
  //   if (!response || response.error) {
  //     document.getElementById('status').innerHTML = "Errooor!";
  //     console.log(response.error);
  //   } else {
  //     document.getElementById('status').innerHTML = response.id;
  //   }
  // });
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
    console.log(response);
    if (response.status === 'connected') {
        document.getElementById('status').innerHTML = 'We are connected.';
        document.getElementById('loginBtn').style.visibility = 'hidden';
      } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'We are not logged in.'
      } else {
        document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
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
