let video;
let handpose;
let predictions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480); // 保持鏡頭大小及比例
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function modelReady() {
  // 模型載入完成
}

function draw() {
  background(220);

  // 計算鏡頭置中位置
  let videoWidth = video.width;
  let videoHeight = video.height;
  let xOffset = (width - videoWidth) / 2;
  let yOffset = (height - videoHeight) / 2;

  // 畫布水平翻轉，讓鏡頭與手指標記都正確
  push();
  translate(width, 0); // 翻轉畫布
  scale(-1, 1); // 水平翻轉
  image(video, width - xOffset - videoWidth, yOffset, videoWidth, videoHeight);
  drawFingers(width - xOffset - videoWidth, yOffset, videoWidth, videoHeight);
  pop();
}

function drawFingers(xOffset, yOffset, videoWidth, videoHeight) {
  for (let i = 0; i < predictions.length; i++) {
    const landmarks = predictions[i].landmarks;
    // landmark 已經是鏡像，直接加上偏移
    fill(255, 0, 0);
    noStroke();
    ellipse(landmarks[8][0] + xOffset, landmarks[8][1] + yOffset, 20, 20); // 食指
    fill(0, 0, 255);
    ellipse(landmarks[4][0] + xOffset, landmarks[4][1] + yOffset, 20, 20); // 大拇指
  }
}
