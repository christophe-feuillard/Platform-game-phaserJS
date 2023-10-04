import selection from "./selection.js";
import niveau1 from "./niveau1.js"; 
import niveau2 from "./niveau2.js"; 

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 550 },
          debug: false
      }
  },

  scene : [selection, niveau1, niveau2]
};

var game = new Phaser.Game(config);
game.scene.start("selection"); 
