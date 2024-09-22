let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 200;

// Crear el worker para el dinosaurio
let dinoWorker = new Worker('workers/dinoWorker.js');

// Crear el worker para los obstáculos
let obstaclesWorker = new Worker('workers/obstaclesWorker.js');
let gameLogicWorker = new Worker('workers/gameLogicWorker.js');

let backgroundX = 0;  // Posición inicial del fondo
let obstacles = [];   // Recibiremos los obstáculos desde el worker
let legAnimationState = 0; 
let dinoImage = new Image();
let dinoImage2 = new Image();
let background=new Image()
let cactus=new Image()
let backgroundSpeed = 2
let buttonRestart=document.getElementById('restart')
let gameOver=document.getElementById('game-over')
gameOver.style="visibility:hidden"

buttonRestart.style="visibility:hidden"
dinoImage2.src = '/images/dinoagachado.png'; // Alterna entre 0 y 1
dinoImage.src = '/images/dino.png';
background.src='/images/background.png'
cactus.src='/images/cactus.png'

let otherCactus=false
let htmlscore= document.getElementById('score');
let gameState = {
    score: 0,
    gameSpeed: 5,
    
}
let isDown=false // Alterna entre 0 y 1

function  restartGame(){
  gameState = {
    score: 0,
    gameSpeed: 5,
  }
  
  dinoWorker=new Worker('workers/dinoWorker.js')
   obstaclesWorker=new Worker('workers/obstaclesWorker.js')
   gameLogicWorker=new Worker('workers/gameLogicWorker.js')
   buttonRestart.style="visibility:hidden"
    gameOver.style="visibility:hidden"
   htmlscore.innerHTML ="Score:"+gameState.score;
   dinoWorker.onmessage = function (e) {
    if (e.data.action === 'draw') {
      drawGame(e.data.dino); 
      gameState.dino=e.data.dino // Dibuja el fondo, dinosaurio y obstáculos
    }
  };
  
  gameLogicWorker.onmessage = function (e) {
   
      if (e.data.action === 'update') {
        
        gameState.score = e.data.score;
        gameState.gameSpeed = e.data.gameSpeed;
        htmlscore.innerHTML ="Score:"+gameState.score;
      }
      if (e.data.action === 'gameOver') {
        htmlscore.innerHTML ="Score:"+0;
          gameOver.style="visibility:visible"
      gameOver.innerHTML="Game Over Score:"+gameState.score
        gameState.score=e.data.score
        gameLogicWorker.terminate();
        dinoWorker.terminate();
        obstaclesWorker.terminate();
        buttonRestart.style="visibility:visible"

        
       
        
      
        
   
      }
  
        
     
    };
  
  // Escuchar la respuesta del worker de obstáculos
  obstaclesWorker.onmessage = function (e) {
  
    if (e.data.action === 'draw') {
      // si recibe un nuevo obstaculo por la action draw guarda el obstcaculo en el array que esta en el objeto gameState
      
      obstacles = e.data.obstacles;
      gameState.obstacles=obstacles
    }
    
  };
   
    

 
 }
 buttonRestart.addEventListener('click',restartGame)

// Alternar el estado de las patas

// Escuchar la respuesta del worker del dinosaurio
dinoWorker.onmessage = function (e) {
  if (e.data.action === 'draw') {
    drawGame(e.data.dino); 
    gameState.dino=e.data.dino // Dibuja el fondo, dinosaurio y obstáculos
  }
  document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      dinoWorker.postMessage({ action: 'jump' });
      isDown= false;
    }else if(event.code === 'ArrowDown'){
      isDown = true;
    }
  
  });
  
  // Usar setInterval para actualizar el estado del juego
 
};

gameLogicWorker.onmessage = function (e) {
 
    if (e.data.action === 'update') {
      
      gameState.score = e.data.score;
      gameState.gameSpeed = e.data.gameSpeed;
      htmlscore.innerHTML ="Score:"+gameState.score;
    }
    if (e.data.action === 'gameOver') {
      htmlscore.innerHTML ="Score:"+0;
      gameOver.style="visibility:visible"
      gameOver.innerHTML="Game Over Score:"+gameState.score
      gameState.score=e.data.score
      gameLogicWorker.terminate();
      dinoWorker.terminate();
      obstaclesWorker.terminate();
      buttonRestart.style="visibility:visible"
      
      
     
    
      
 
    }

      
   
  };

// Escuchar la respuesta del worker de obstáculos
obstaclesWorker.onmessage = function (e) {

  if (e.data.action === 'draw') {
    // si recibe un nuevo obstaculo por la action draw guarda el obstcaculo en el array que esta en el objeto gameState
    
    obstacles = e.data.obstacles;
    gameState.obstacles=obstacles
  }
  
};


function drawDinosaur(x, y,isJumping) {
    if (dinoImage.complete && dinoImage2.complete) {
        if (isDown) {
            context.drawImage(dinoImage2, x, 150, 50, 25);  // Dibuja el dinosaurio agachado
        }else{
        let dinoWidth = 50; // Ajusta el tamaño según sea necesario
        let dinoHeight = 50; // Ajusta el tamaño según sea necesario
        if (isJumping){
            context.drawImage(dinoImage, x, y, dinoWidth, dinoHeight);  // Dibuja el dinosaurio saltando
        }else{
          context.drawImage(dinoImage, x, 130, dinoWidth, dinoHeight);  
        }
        

        }

        
        
      }
}

// Función para dibujar el suelo
function drawBackground() {
if (background.complete) {
    context.drawImage(background, backgroundX, 0, canvas.width, canvas.height);

    // Dibuja la segunda imagen del fondo justo después de la primera para crear un bucle continuo
    context.drawImage(background, backgroundX + canvas.width, 0, canvas.width, canvas.height);
  
    // Actualiza la posición del fondo para el movimiento
    backgroundX -= backgroundSpeed;
  
    // Reinicia la posición cuando el fondo haya salido completamente del canvas
    if (backgroundX <= -canvas.width) {
      backgroundX = 0;
    }  // Dibuja el fondo
    
  }
  
}

// Función para dibujar los obstáculos (cactus y palomas)
function drawObstacles() {
  obstacles.forEach(obstacle => {
    if (cactus.complete) {
        context.drawImage(cactus, obstacle.x, obstacle.y, 50, 50);
        if(gameState.score>300&&gameState.score<700){
       
            context.drawImage(cactus, obstacle.x + 20, obstacle.y, 50, 50);
             
          }
    }
    
    
      // Dibujar un cactus simple
    //   context.fillStyle = 'green';
    //   context.fillRect(obstacle.x, obstacle.y, 10, 20);  // Cuerpo del cactus
    //   context.fillRect(obstacle.x - 5, obstacle.y + 5, 5, 5);  // Brazo izquierdo
    //   context.fillRect(obstacle.x + 10, obstacle.y + 5, 5, 5);

    // if(otherCactus>300&&otherCactus<700){
    //     context.fillStyle = 'green';
    //     context.fillRect(obstacle.x + 20, obstacle.y, 10, 20);  // Cuerpo del cactus
    //     context.fillRect(obstacle.x + 15, obstacle.y + 5, 5, 5);  // Brazo izquierdo
    //     context.fillRect(obstacle.x + 30, obstacle.y + 5, 5, 5);
       
     
    //  }   
    // // Dibujar un segundo cactus simple
    //  if(gameState.score>700){
    //     context.fillStyle = 'green';
    //     context.fillRect(obstacle.x + 40, obstacle.y, 10, 20);  // Cuerpo del cactus
    //     context.fillRect(obstacle.x + 35, obstacle.y + 5, 5, 5);  // Brazo izquierdo
    //     context.fillRect(obstacle.x + 50, obstacle.y + 5, 5, 5);  // Brazo derecho
    //  }
       
    

   
        // Brazo derecho
   
  });
}

// Función para dibujar el juego completo
function drawGame(dino) {
  // Limpiar todo el canvas primero
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar el fondo primero
  drawBackground();

  // Dibujar los obstáculos
  drawObstacles();

  // Dibujar el dinosaurio encima del fondo
  drawDinosaur(dino.x, dino.y,dino.isJumping);
}

// Detectar la barra espaciadora para hacer saltar al dinosaurio
document.addEventListener('keydown', function (event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    dinoWorker.postMessage({ action: 'jump' });
    isDown= false;
  }else if(event.code === 'ArrowDown'){
    isDown = true;
  }

});

// Usar setInterval para actualizar el estado del juego
setInterval(function () {
  dinoWorker.postMessage({ action: 'update' });  // Actualizar el dinosaurio
  obstaclesWorker.postMessage({ action: 'update',gameSpeed: gameState.gameSpeed,score:gameState.score });  // Actualizar los obstáculos
 gameLogicWorker.postMessage({ action: 'update', score: gameState.score });
 gameLogicWorker.postMessage({ action: 'checkColision',dino:gameState,obstacles:gameState.obstacles})
   // Actualizar los obstáculos
}, 16);  // Aproximadamente 60 FPS


