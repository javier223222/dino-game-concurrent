let dino = {
    x: 50,
    y: 130,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 1.5,  // Reducimos la gravedad para que caiga más lento
    jumpPower: -18,  // Aumentamos la potencia del salto para que suba más rápido
    isJumping: false,
  };
  
  self.onmessage = function (e) {
    if (e.data.action === 'update') {
      updateDino();  // Actualiza la posición del dinosaurio
      postMessage({ action: 'draw', dino }); // Envía la posición actualizada del dinosaurio
    }else if (e.data.action === 'jump') {
      jump(); // Hace saltar al dinosaurio

      
     
    }
  };
  
  function updateDino() {
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;
  
    if (dino.y > 130) {
      dino.y = 130;
      dino.velocityY = 0;
      dino.isJumping = false;
    }
  }

function jump() {
      console.log('Jumping');
        if (!dino.isJumping) {
        dino.velocityY = dino.jumpPower;
        dino.isJumping = true;

        }
    }
  
  
  