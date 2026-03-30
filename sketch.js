let topPoints = [];    
let bottomPoints = []; 
let gameState = "START"; // 狀態：START, PLAYING, GAMEOVER, WIN

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateCourse();
}

function generateCourse() {
  topPoints = [];
  bottomPoints = [];
  let segments = 5; 
  let sectionWidth = width / (segments - 1);

  for (let i = 0; i < segments; i++) {
    let x = i * sectionWidth;
    // 起點和終點的高度稍微固定，增加容錯率
    let yTop = (i === 0 || i === segments - 1) ? height/2 - 30 : random(height * 0.2, height * 0.7);
    let gap = random(40, 70); 
    
    topPoints.push(createVector(x, yTop));
    bottomPoints.push(createVector(x, yTop + gap));
  }
}

function draw() {
  background(15, 15, 25);

  if (gameState === "START") {
    displayCourse();
    showStartScreen();
  } else if (gameState === "PLAYING") {
    displayCourse();
    checkStatus();
    
    // 繪製玩家指標
    fill(0, 255, 255);
    noStroke();
    ellipse(mouseX, mouseY, 12, 12);
  } else if (gameState === "GAMEOVER") {
    showEndScreen("遊戲失敗！", color(255, 50, 50));
  } else if (gameState === "WIN") {
    showEndScreen("恭喜通關！", color(50, 255, 150));
  }
}

function displayCourse() {
  strokeWeight(5);
  noFill();

  // 上軌道 (青色)
  stroke(0, 150, 255);
  beginShape();
  for (let p of topPoints) vertex(p.x, p.y);
  endShape();

  // 下軌道 (桃紅)
  stroke(255, 0, 150);
  beginShape();
  for (let p of bottomPoints) vertex(p.x, p.y);
  endShape();
  
  // 終點標記
  fill(255, 200, 0, 150);
  noStroke();
  rect(width - 10, 0, 10, height);
}

function checkStatus() {
  // 1. 勝利判斷
  if (mouseX >= width - 5) {
    gameState = "WIN";
    return;
  }

  // 2. 碰撞判斷
  for (let i = 0; i < topPoints.length - 1; i++) {
    if (mouseX >= topPoints[i].x && mouseX <= topPoints[i+1].x) {
      let t = (mouseX - topPoints[i].x) / (topPoints[i+1].x - topPoints[i].x);
      let currentUpperY = lerp(topPoints[i].y, topPoints[i+1].y, t);
      let currentLowerY = lerp(bottomPoints[i].y, bottomPoints[i+1].y, t);
      
      if (mouseY <= currentUpperY || mouseY >= currentLowerY) {
        gameState = "GAMEOVER";
      }
    }
  }
}

function showStartScreen() {
  // 繪製起點區域提示
  fill(0, 255, 100, 100);
  rect(0, topPoints[0].y, 50, bottomPoints[0].y - topPoints[0].y);
  
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text("請將滑鼠移至左側綠色區塊", width / 2, height / 2 - 40);
  textSize(24);
  text("點擊滑鼠開始遊戲", width / 2, height / 2 + 20);
  
  // 預覽玩家位置
  fill(255, 255, 255, 150);
  ellipse(mouseX, mouseY, 12, 12);
}

function showEndScreen(message, textColor) {
  background(10, 10, 20, 200);
  textAlign(CENTER, CENTER);
  fill(textColor);
  textSize(80);
  text(message, width / 2, height / 2);
  fill(255);
  textSize(24);
  text("點擊滑鼠回到起點", width / 2, height / 2 + 100);
}

function mousePressed() {
  if (gameState === "START") {
    // 檢查點擊時是否在起點區塊內 (x < 50 且在上下軌道間)
    if (mouseX <= 50 && mouseY > topPoints[0].y && mouseY < bottomPoints[0].y) {
      gameState = "PLAYING";
    }
  } else if (gameState === "GAMEOVER" || gameState === "WIN") {
    generateCourse();
    gameState = "START";
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateCourse();
  gameState = "START";
}