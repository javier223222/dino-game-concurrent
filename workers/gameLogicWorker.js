let score = 0;
let gameSpeed = 5;


onmessage = function (e) {
    if (e.data.action === 'update') {
      updateGameLogic(e.data.score);
      postMessage({ action: 'update', score, gameSpeed });
    }
    if (e.data.action === 'checkColision') {
      checkColision(e.data.dino,e.data.obstacles);
    }
  
   
  };
  

function updateGameLogic(currentScore) {
  score = currentScore + 1; // Aumenta la puntuación
  if (score % 200 === 0) {
    gameSpeed += 0.5; // Incrementa la velocidad del juego cada 100 puntos
  }
}

// function checkColision(gameState,obstacles){
//     if (obstacles.length > 0) {
//         if (gameState.dino.y + 70 > 180) {
//           // Comprobar si el dinosaurio choca con un obstáculo
//           let dinoX = gameState.dino.x;
//           let dinoY = gameState.dino.y;
//           let dinoWidth = 50;
//           let dinoHeight = 50;
//           obstacles.forEach(obstacle => {
//             if (dinoX < obstacle.x + 10 && dinoX + dinoWidth > obstacle.x && dinoY < obstacle.y + 20 && dinoY + dinoHeight > obstacle.y) {
//                 postMessage({ action: 'gameOver',score });
//             }
//           });
//         }
//       }
// }

function checkColision(gameState, obstacles) {
  if (obstacles.length > 0) {
    if (gameState.dino.y + 70 > 180) {
      // Comprobar si el dinosaurio choca con un obstáculo
      let dinoX = gameState.dino.x;
      let dinoY = gameState.dino.y;
      let dinoWidth = 50;
      let dinoHeight = 50;
      obstacles.forEach(obstacle => {
        let obstacleX = obstacle.x;
        let obstacleY = obstacle.y;
        let obstacleWidth = 10;
        let obstacleHeight = 20;

        if (dinoX < obstacleX + obstacleWidth &&
          dinoX + dinoWidth > obstacleX &&
          dinoY < obstacleY + obstacleHeight &&
          dinoY + dinoHeight > obstacleY) {
          postMessage({ action: 'gameOver', score });
        }
      });
    }
  }
 }
  
  
  
  
  
  