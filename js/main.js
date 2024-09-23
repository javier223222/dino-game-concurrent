let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 200;

// Crear el worker para el dinosaurio
let dinoWorker = new Worker('workers/dinoWorker.js');
// Crear el worker para los obstáculos
let obstaclesWorker = new Worker('workers/obstaclesWorker.js');
// Crear el worker para la lógica del juego
let gameLogicWorker = new Worker('workers/gameLogicWorker.js');

let backgroundX = 0;  // Posición inicial del fondo
let obstacles = [];   // Recibiremos los obstáculos desde el worker
let legAnimationState = 0; 
let dinoImage = new Image(); // Imagen del dinosaurio

let background=new Image()
let cactus=new Image()
let backgroundSpeed = 2
let buttonRestart=document.getElementById('restart')
let gameOver=document.getElementById('game-over')
gameOver.style="visibility:hidden"
buttonRestart.style="visibility:hidden"
 // Alterna entre 0 y 1
dinoImage.src = '/images/dino.png';
background.src='/images/background.png'
cactus.src='/images/cactus.png'
let otherCactus=false
let htmlscore= document.getElementById('score');
let gameState = {
    score: 0,
    gameSpeed: 5,
    isfinished:false,
    
}
function terminateWorkers(){
  
  dinoWorker.terminate();
  obstaclesWorker.terminate();
  gameLogicWorker.terminate();

}

// Manejadores de los workers
function handleDinoWorker(e) {
  if (e.data.action === 'draw') {
      drawGame(e.data.dino);
      gameState.dino = e.data.dino;
  }
}

function handleObstaclesWorker(e) {
  if (e.data.action === 'draw') {
      obstacles = e.data.obstacles;
      gameState.obstacles = obstacles;
  }
}

function handleGameLogicWorker(e) {
  if (e.data.action === 'update') {
      gameState.score = e.data.score;
      gameState.gameSpeed = e.data.gameSpeed;
      htmlscore.innerHTML = "Score:" + gameState.score;
  }

  if (e.data.action === 'gameOver') {
      gameOver.style.visibility = 'visible';
      gameOver.innerHTML = "Game Over Score:" + gameState.score;
      gameState.isFinished = true;
      htmlscore.innerHTML = "Score:0";
      terminateWorkers();
      buttonRestart.style.visibility = 'visible';
  }
}


function initWorkers(){
  dinoWorker=new Worker('workers/dinoWorker.js')
  obstaclesWorker=new Worker('workers/obstaclesWorker.js')
  gameLogicWorker=new Worker('workers/gameLogicWorker.js')
  dinoWorker.onmessage=handleDinoWorker
  obstaclesWorker.onmessage=handleObstaclesWorker
  gameLogicWorker.onmessage=handleGameLogicWorker

}




function  restartGame(){
  gameState = {
    score: 0,
    gameSpeed: 5,
    isfinished:false,
  }
  initWorkers()
  

   buttonRestart.style="visibility:hidden"
    gameOver.style="visibility:hidden"
   htmlscore.innerHTML ="Score:"+gameState.score;
 
   
    

 
 }


 buttonRestart.addEventListener('click',restartGame)
 
  document.addEventListener('keydown', function (event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      if(gameState.isfinished){
        restartGame()
      }
 
     
    }

  })
 



// Escuchar la respuesta del worker del dinosaurio
dinoWorker.onmessage =handleDinoWorker

gameLogicWorker.onmessage = handleGameLogicWorker

// Escuchar la respuesta del worker de obstáculos
obstaclesWorker.onmessage = handleObstaclesWorker



function drawDinosaur(x, y,isJumping) {
    if (dinoImage.complete ) {
       
        let dinoWidth = 50; // Ajusta el tamaño según sea necesario
        let dinoHeight = 50; // Ajusta el tamaño según sea necesario
        if (isJumping){
            context.drawImage(dinoImage, x, y, dinoWidth, dinoHeight);  // Dibuja el dinosaurio saltando
        }else{
          context.drawImage(dinoImage, x, 130, dinoWidth, dinoHeight);  
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

// Función para dibujar los obstáculos (cactus )
function drawObstacles() {
  obstacles.forEach(obstacle => {
    if (cactus.complete) {
        context.drawImage(cactus, obstacle.x, obstacle.y, 50, 50);
        
    }
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
    
  }

});

// Usar setInterval para actualizar el estado del juego

setInterval(() => {
  dinoWorker.postMessage({ action: 'update' });  // Actualizar el dinosaurio
  obstaclesWorker.postMessage({ action: 'update',gameSpeed: gameState.gameSpeed,score:gameState.score }); 
  gameLogicWorker.postMessage({ action: 'checkColision',dino:gameState,obstacles:gameState.obstacles}) // Actualizar los obstáculos
 gameLogicWorker.postMessage({ action: 'update', score: gameState.score });
 
}, 1000 / 60); // 60 FPS
