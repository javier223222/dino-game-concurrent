let obstacles = [];

onmessage = function (e) {
  if (e.data.action === 'update') {
    updateObstacles(e.data.gameSpeed,e.data.score);
    postMessage({ action: 'draw', obstacles });
  }
};

function updateObstacles(gameSpeed,score) {
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 500) {
    let obstacle = {
      x: 800,
      y: 130,
      width: 20,
      height: 50,
      speed: gameSpeed,
    };
    obstacles.push(obstacle);
    if (Math.random() < 0.3) { // 30% chance to generate a group of cacti
      let numberOfCacti = Math.floor(Math.random() * 3) + 2; // Generate between 2 and 4 cacti
      
      
      if (numberOfCacti >=4 && score<300){
        for (let i = 1; i < 2; i++) {
          let additionalCactus = {
            x: obstacle.x + i * 25, // Adjust the spacing between cacti
            y: 130,
            width: 20,
            height: 50,
            speed: gameSpeed,
          };
          obstacles.push(additionalCactus);
        }

      }else {
        if(numberOfCacti==4){
          for (let i = 1; i < numberOfCacti-1; i++) {
            let additionalCactus = {
              x: obstacle.x + i * 25, // Adjust the spacing between cacti
              y: 130,
              width: 20,
              height: 50,
              speed: gameSpeed,
            };
            obstacles.push(additionalCactus);
          }

        }

        
      
      }

     
    }
    
    
   
  }

  obstacles.forEach(obstacle => {
    obstacle.x -= obstacle.speed;
  });

  // Eliminar obstáculos que salen de la pantalla
  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

