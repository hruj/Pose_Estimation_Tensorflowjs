const imageElement = document.getElementById('human');
const imageElements = document.getElementById('humans');
const canvas = document.getElementById('canvas');
const video = document.getElementById('video');
const ctx = canvas.getContext("2d");
const minConfidence = 0.2;
const VIDEO_HEIGHT = 640;
const VIDEO_WIDTH = 480;
const frameRate = 20;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(vid => {
      video.srcObject = vid;
      const intervalID = setInterval(async () => {
        try {
          estimatePosesOnImage();
        } catch (err) {
          clearInterval(intervalID)
          setErrorMessage(err.message)
        }
      }, Math.round(1000 / frameRate))
      return () => clearInterval(intervalID)
    });

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

async function estimatePoseOnImage() { 
  //load posenet
  const net = await posenet.load();
  
  const pose = await net.estimateSinglePose(
    imageElement, {
    flipHorizontal: false,
    scaleFactor:0.5,
    outputStride:16,
    scoreThreshold:0.5
  });
  console.log(pose);
  return pose;
}
/*
async function estimatePosesOnImage(){
  // load posenet
  const net = await posenet.load();
  
  const poses = await net.estimateMultiplePoses( 
      video,{ 
      imageScaleFactor:0.50, 
      flipHorizontal:false, 
      outputStride:16,    
      maxPoseDetections:5, 
      scoreThreshold:0.5, 
      nmsRadius:20
    });
    console.log(poses);
    canvas.width = VIDEO_WIDTH;
    canvas.height = VIDEO_HEIGHT;
    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    ctx.save();
    ctx.drawImage(imageElements, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    ctx.restore();
    poses.forEach(({ score, keypoints }) => {
      if (score >= minConfidence) {
        drawKeypoints(keypoints);
        drawSkeleton(keypoints);
      }
    });
    return poses;
  }*/
  
  async function estimatePosesOnImage(){
    posenet
      .load()
      .then(function (net) {
        console.log("estimateMultiplePoses .... ");
        return net.estimatePoses(video, {
          decodingMethod: "single-person",
        });
      })
      .then(function (poses) {
        console.log(`got Poses ${JSON.stringify(poses)}`);
        canvas.width = VIDEO_WIDTH;
        canvas.height = VIDEO_HEIGHT;
        ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        ctx.save();
        ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
        ctx.restore();
        poses.forEach(({ score, keypoints }) => {
          if (score >= minConfidence) {
            drawKeypoints(keypoints);
            drawSkeleton(keypoints);
          }
        });
      });
  }

const intervalID = setInterval(async () => {
  try {
    estimateMultiplePoses();
  } catch (err) {
    clearInterval(intervalID);
    setErrorMessage(err.message);
  }
}, Math.round(1000 / frameRate));
clearInterval(intervalID);

async function init(){  
  // await webcam.setup();
  //estimatePoseOnImage();
  estimatePosesOnImage();
}

init();