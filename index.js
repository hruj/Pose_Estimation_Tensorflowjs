// import Webcam from "react-webcam";
// import * as posenet from '/node_modules/@tensorflow-models/posenet';

const imageElement = document.getElementById('human');
const imageElements = document.getElementById('humans');
const canvas = document.getElementById('canvas');
//const video = document.getElementById('video');
const ctx = canvas.getContext("2d");
const minConfidence = 0.2;
const frameRate = 20;

async function estimatePoseOnImage(imageElement) { 
  //load posenet
  const net = await posenet.load();
  
  const poses = await net.estimateSinglePose(
    imageElement, {
    flipHorizontal: false,
    scaleFactor:0.5,
    outputStride:16,
    scoreThreshold:0.5
  });
    console.log(poses);
    canvas1.width = 600;
    canvas1.height = 600;
    ctx1.clearRect(0, 0, 600, 600);
    ctx1.save();
    ctx1.drawImage(imageElements, 0, 0, 600, 600);
    ctx1.restore();
    poses.forEach(({ score, keypoints }) => {
      if (score >= minConfidence) {
        drawKeypoints(keypoints);
        drawSkeleton(keypoints);
      }
    });
  return pose;
}

async function estimatePosesOnImage(imageElements){
  // load posenet
  const net = await posenet.load();
  
  const poses = await net.estimateMultiplePoses( 
      imageElements,{ 
      imageScaleFactor:0.50, 
      flipHorizontal:false, 
      outputStride:16,    
      maxPoseDetections:5, 
      scoreThreshold:0.5, 
      nmsRadius:20
    });
    console.log(poses);
    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, 640, 480);
    ctx.save();
    ctx.drawImage(imageElements, 0, 0, 640, 480);
    ctx.restore();
    poses.forEach(({ score, keypoints }) => {
      if (score >= minConfidence) {
        drawKeypoints(keypoints);
        drawSkeleton(keypoints);
      }
    });
    return poses;
  }
  
  function drawPoint(y, x, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  }

  function drawKeypoints(keypoints) {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      console.log(`keypoint in drawkeypoints ${keypoint}`);
      const { y, x } = keypoint.position;
      drawPoint(y, x, 3);
    }
  }
  function drawSegment(pair1, pair2, color, scale) {
    ctx.beginPath();
    ctx.moveTo(pair1.x * scale, pair1.y * scale);
    ctx.lineTo(pair2.x * scale, pair2.y * scale);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  function drawSkeleton(keypoints) { 
    const color = "#FFFFFF";
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
      keypoints,
      minConfidence);
    adjacentKeyPoints.forEach((keypoint) => {
      drawSegment(
        keypoint[0].position,
        keypoint[1].position,
        color,  1,);
    });
  }

async function init(){  
  // await webcam.setup();
  estimatePoseOnImage(imageElement);
  estimatePosesOnImage(imageElement);
  estimatePosesOnImage(imageElements);
}

init();