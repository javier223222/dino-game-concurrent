let score = 0;
let gameSpeed = 5;


self.onmessage = function (e) {
    if (e.data.action === 'update') {
      updateGameLogic(e.data.score);  // Actualiza la lógica del juego
      postMessage({ action: 'update', score, gameSpeed }); // Envía la puntuación y la velocidad del juego
    }
    if (e.data.action === 'checkColision') {
      checkColision(e.data.dino,e.data.obstacles); // Comprueba si el dinosaurio choca con un obstáculo
    }
  
   
  };
  

function updateGameLogic(currentScore) {
  score = currentScore + 1; // Aumenta la puntuación
  if (score % 200 === 0) {
    gameSpeed += 0.5; // Incrementa la velocidad del juego cada 100 puntos
  }
}


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
          dinoX + dinoWidth-20 > obstacleX &&
          dinoY < obstacleY + obstacleHeight &&
          dinoY + dinoHeight-20 > obstacleY) {
          postMessage({ action: 'gameOver', score });
        }
      });
    }
  }
 }
 



  
  
  
  
  
  