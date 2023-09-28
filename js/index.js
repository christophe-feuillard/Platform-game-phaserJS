import selection from "./selection.js";
import niveau1 from "./niveau1.js"; 

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
  // type: Phaser.AUTO,
  // width: 800,
  // height: 600,
  // physics: {
  //     default: 'arcade',
  //     arcade: {
  //         gravity: { y: 300 },
  //         debug: false
  //     }
  // },
  scene : [selection, niveau1]
};

var game = new Phaser.Game(config);
game.scene.start("selection"); 
 






// var config = {
//     type: Phaser.AUTO,
//     width: 900,
//     height: 600,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 550 },
//             debug: false
//         }
//     },
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };

// var player;
// // var enemy;
// var cursors;
// var groupe_ennemis;
// var score = 0;
// var gameOver = false;
// let keyE;
// var currentAnimation = '';
// var pv = 100;
// var healthText;
// var gameOverText = '';
// var attackDamage = 50;
// var enemyHealth = 100;
// var isAttacking = false;
// var plateformes;
// var playerSpeed = 140;
// var speedText = '';

// var game = new Phaser.Game(config);

// function preload ()
// {
//     this.load.image("Phaser_tuilesdejeu", "assets/tuilesperso2.png");
//     this.load.image('boots', 'assets/boots.png');
//     this.load.image('potion', 'assets/potion.png');
//     this.load.tilemapTiledJSON("carte", "assets/map2.json");  
//     this.load.spritesheet('soldier', 'assets/persosprite2.png', { frameWidth: 64, frameHeight: 48 });
//     this.load.spritesheet('soldier_attack', 'assets/attack_sprite2.png', { frameWidth: 87, frameHeight: 48 });
//     this.load.spritesheet('soldier_jump', 'assets/jump_sprite.png', { frameWidth: 86, frameHeight: 60 });
//     this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 42, frameHeight: 49 });
// }

// function create () {
//     const carteDuNiveau = this.add.tilemap("carte");
//     const tileset = carteDuNiveau.addTilesetImage(
//         "tuiles_de_jeu",
//         "Phaser_tuilesdejeu"
//     );  

//     const backgroundLayer = carteDuNiveau.createStaticLayer(
//         "background",
//         tileset
//     );
//     const backgroundLayer2 = carteDuNiveau.createStaticLayer(
//         "background_2",
//         tileset
//     );
//     plateformes = carteDuNiveau.createStaticLayer(
//         "plateformes",
//         tileset
//     );

//     groupe_ennemis = this.physics.add.group();
//     const groupeBottes = this.physics.add.group();

//     const tab_points = carteDuNiveau.getObjectLayer("calque_ennemis");   
//     const tab_items = carteDuNiveau.getObjectLayer("calque_item");   

//     tab_points.objects.forEach(point => {
//         if (point.name == "ennemi") {
//         var nouvel_ennemi = this.physics.add.sprite(point.x, point.y, "enemy");
//         nouvel_ennemi.setBounce(0);
//         nouvel_ennemi.setCollideWorldBounds(true);
//         this.physics.add.collider(nouvel_ennemi, plateformes);
//         groupe_ennemis.add(nouvel_ennemi);
//         }
//     }); 

//     player = this.physics.add.sprite(100, 440, 'soldier');
//     // player = this.physics.add.sprite(3000, 40, 'soldier');
//     player.setBounce(0);
//     player.setCollideWorldBounds(true);
//     player.body.onWorldBounds = true; 

//     tab_items.objects.forEach(item => {
//         if (item.name === "boots") {
//             const boots = this.physics.add.sprite(item.x, item.y, "boots");
//             boots.setScale(0.02)
//             this.physics.add.collider(boots, plateformes);
//             this.physics.add.overlap(player, boots, collectBoots, null, this);
//         } else if (item.name === "potion") {
//             const potion = this.physics.add.sprite(item.x, item.y, "potion");
//             potion.setScale(0.02)
//             this.physics.add.collider(potion, plateformes);
//             this.physics.add.overlap(player, potion, collectpotion, null, this);
//         }
//     });
    
//     plateformes.setCollisionByProperty({ collides: true });
//     plateformes.setCollisionByExclusion([-1]);

//     this.physics.world.setBounds(0, 0, 3200, 640);  // redimentionnement du monde avec les dimensions calculées via tiled
//     this.cameras.main.setBounds(0, 0, 3200, 640); //  ajout du champs de la caméra de taille identique à celle du monde
//     this.cameras.main.startFollow(player); // ancrage de la caméra sur le joueur

//     this.physics.add.collider(player, plateformes);

//     keyE = this.input.keyboard.addKey('E');
//     cursors = this.input.keyboard.createCursorKeys();

//     healthText = this.add.text(16, 16, `PV: ${pv}`, { fontSize: '25px', fill: '#FFFFFF' });
//     healthText.setScrollFactor(0); // fixe le texte à l'écran

//     gameOverText = this.add.text(370, 300, `TES DEAD`, { fontSize: '32px', fill: '#FFFFFF' });
//     gameOverText.setAlpha(0); // Masque le texte en le rendant transparent
//     gameOverText.setScrollFactor(0);

//     speedText = this.add.text(100, 100, '', { fontSize: '24px', fill: '#FFFFFF' });
//     speedText.setAlpha(0);
//     speedText.setScrollFactor(0);

//     player.body.world.on(  // écouteur sur les bords du monde
//         "worldbounds", // l'event surveillé
//         function (body, up, down, left, right) {
//         // on verifie si la hitbox qui est rentrée en collision est celle du player,
//         // et si la collision a eu lieu sur le bord inférieur du player
//         if (body.gameObject === player && down == true) {
//             this.physics.pause();
//             healthText.setAlpha(0);
//             gameOver = true;
//         }
//         },
//     this
//     ); 

//     createAnimations.call(this);

//     groupe_ennemis.children.iterate(function iterateur(un_ennemi) {
//         un_ennemi.setVelocityX(-80);
//         un_ennemi.direction = "gauche";
//         un_ennemi.play("enemy_walk", true);
//     }); 
// }

// function createAnimations() {
//     this.anims.create({ // les animations sont disponibles globalement pour tous les objets de jeu
//         key: 'left',
//         frames: this.anims.generateFrameNumbers('soldier', { start: 0, end: 6 }),
//         frameRate: 10,
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'turn',
//         frames: [ { key: 'soldier', frame: 7 } ],
//         frameRate: 20
//     });

//     this.anims.create({
//         key: 'right',
//         frames: this.anims.generateFrameNumbers('soldier', { start: 8, end: 15 }),
//         frameRate: 10,
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'attack',
//         frames: this.anims.generateFrameNumbers('soldier_attack', { start: 0, end: 7 }),
//         frameRate: 10,
//         repeat: 0,
//     });

//     this.anims.create({
//         key: 'jump',
//         frames: this.anims.generateFrameNumbers('soldier_jump', { start: 0, end: 10 }),
//         frameRate: 10,
//         repeat: 0, // 0 signifie qu'elle ne se répète pas
//     });

//     this.anims.create({
//         key: 'turn_enemy',
//         frames: [ { key: 'enemy', frame: 0 } ],
//         frameRate: 20,
//     });

//     this.anims.create({ // les animations sont disponibles globalement pour tous les objets de jeu
//         key: 'enemy_walk',
//         frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
//         frameRate: 10,
//         repeat: -1
//     });
// }

// function update ()
// {
//     if (gameOver) {
//         this.tweens.add({
//             targets: gameOverText,
//             alpha: 1, // Opacité complète (100%)
//             duration: 1200, // Durée de l'animation en millisecondes (1 seconde)
//             ease: 'Linear', // Fonction d'animation (vous pouvez choisir une autre si vous le souhaitez)
//             onComplete: function () {
//             // Callback lorsque l'animation est terminée (peut être laissé vide si vous n'avez pas besoin de traitement supplémentaire)
//             }
//         });
//         return;
//     }

//     if (keyE.isDown && !cursors.left.isDown && !cursors.right.isDown) { // attack
//         simulateSwordAttack();
//     } else if (cursors.left.isDown && !keyE.isDown) { // left
//         player.setVelocityX(-playerSpeed);
//         player.anims.play('left', true);
//         currentAnimation = 'left';
//     } else if (cursors.right.isDown && !keyE.isDown) { // right
//         player.setVelocityX(playerSpeed);
//         player.anims.play('right', true);
//         currentAnimation = 'right';
//     } else { // Si aucune touche de déplacement n'est enfoncée
//         player.setVelocityX(0);
//         if (currentAnimation === 'attack' || currentAnimation === 'jump') {
//             player.once('animationcomplete', function () {
//                 player.anims.play('turn');
//                 currentAnimation = 'turn';
//             });
//         } else {
//             player.anims.play('turn');
//             currentAnimation = 'turn';
//         }
//     }

//     if (cursors.up.isDown && player.body.onFloor() && !cursors.right.isDown && !cursors.left.isDown) { // jump si le joueur est sur le sol
//         player.setVelocityY(-330);
//         player.anims.play('jump', true);
//         currentAnimation = 'jump';
//     } else if (cursors.up.isDown && player.body.onFloor() && (cursors.right.isDown || cursors.left.isDown)) {
//         player.setVelocityY(-300); // pas d'anim de jump si le joueur marche a droite ou a gauche et il saute un peu moins haut
//     }
    
//     // groupe_ennemis.children.iterate(function iterateur(enemy) {
//     //     if(enemy.active) { // Logique de suivi de l'ennemi
//     //         if (player.x < enemy.x) {
//     //             // Le joueur est à gauche de l'ennemi, faites en sorte que l'ennemi se déplace vers la gauche
//     //             enemy.setVelocityX(-80); // Ajustez la vitesse de l'ennemi selon vos besoins
//     //             enemy.anims.play('enemy_walk', true);
//     //         } else if (player.x > enemy.x) {
//     //             // Le joueur est à droite de l'ennemi, faites en sorte que l'ennemi se déplace vers la droite
//     //             enemy.setVelocityX(80); // Ajustez la vitesse de l'ennemi selon vos besoins
//     //             enemy.anims.play('enemy_walk', true);
//     //         } else {
//     //             // Le joueur est à la même position horizontale que l'ennemi, arrêtez son mouvement
//     //             enemy.setVelocityX(0);
//     //             enemy.anims.stop('enemy_walk');
//     //         }
//     //     }
//     // }); 

//     this.physics.collide(player, groupe_ennemis.children.entries, playerEnemyCollision, null, this);

//     groupe_ennemis.children.iterate(function iterateur(un_ennemi) {
//         if (un_ennemi.direction == "gauche" && un_ennemi.body.blocked.down) {
//         var coords = un_ennemi.getBottomLeft();
//         var tuileSuivante = plateformes.getTileAtWorldXY(
//             coords.x,
//             coords.y + 10
//         );
//         if (tuileSuivante == null || un_ennemi.body.blocked.left) {
//             // on risque de marcher dans le vide, on tourne
//             un_ennemi.direction = "droite";
//             un_ennemi.setVelocityX(80);
//             un_ennemi.play("enemy_walk", true);
//         }
//         } else if (un_ennemi.direction == "droite" && un_ennemi.body.blocked.down) {
//             var coords = un_ennemi.getBottomRight();
//             var tuileSuivante = plateformes.getTileAtWorldXY(
//                 coords.x,
//                 coords.y + 10
//             );
//             if (tuileSuivante == null || un_ennemi.body.blocked.right) {
//                 // on risque de marcher dans le vide, on tourne
//                 un_ennemi.direction = "gauche";
//                 un_ennemi.setVelocityX(-80);
//                 un_ennemi.play("enemy_walk", true);
//             }
//         }
//     });
// }

// function playerEnemyCollision() {
//     // Définissez ici la logique des interactions entre le joueur et l'ennemi en cas de collision.
//     // Par exemple, vous pouvez réduire la santé du joueur ou détruire l'ennemi.
//     pv -= 1;
//     healthText.setText('PV: ' + pv);

//     if (healthText.text == "PV: 0"){
//         this.physics.pause();
//         gameOver = true;
//     }
// }

// function simulateSwordAttack() {
//     player.anims.play('attack', true);
//     currentAnimation = 'attack';
//     const attackRange = new Phaser.Geom.Rectangle(player.x - 50, player.y - 10, 120, 20); // portée de l'attaque

//     // Parcourez tous les ennemis de votre jeu (si vous en avez plusieurs)
//     // et vérifiez s'ils se trouvent dans la zone d'attaque
//     player.once('animationcomplete', function () {
//         groupe_ennemis.children.entries.forEach(enemy => {
//             if (Phaser.Geom.Rectangle.ContainsPoint(attackRange, enemy.getCenter())) {
//                 dealDamageToEnemy(enemy);
//             }
//         });
//     });
// }

// function dealDamageToEnemy(enemy) {
//     enemyHealth -= attackDamage;

//     if (enemyHealth <= 0) {
//         enemy.destroy(); 
//     }
// }

// function collectBoots(player, boots) {
//     speedText.setText('+20 Move Speed!');
//     speedText.setAlpha(1);
//     this.tweens.add({
//         targets: speedText,
//         alpha: 0, // Le texte deviendra progressivement transparent
//         y: speedText.y - 70, // Animation de montée
//         duration: 2000, // Durée de l'animation en millisecondes (2 secondes)
//         ease: 'Linear',
//         onComplete: function () {
//             speedText.setText(''); // Effacez le texte lorsque l'animation est terminée
//         }
//     });
//     playerSpeed = playerSpeed + 20;
//     boots.destroy(); 
// }

// function collectpotion(player, potion) {
//     speedText.setText('+20 PV!');
//     speedText.setAlpha(1);
//     this.tweens.add({
//         targets: speedText,
//         alpha: 0, 
//         y: speedText.y - 70, 
//         duration: 2000, 
//         ease: 'Linear',
//         onComplete: function () {
//             speedText.setText('');
//         }
//     });

//     pv = pv + 20;
//     potion.destroy(); 
//     updateHealthText();
// }

// function updateHealthText() {
//     healthText.setText(`PV: ${pv}`);
// }
