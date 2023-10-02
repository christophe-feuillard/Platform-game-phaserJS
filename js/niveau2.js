export default class niveau2 extends Phaser.Scene {

  constructor() {
    super({
      key: "niveau2" // identifiant de la classe
    });
  }

  preload() {}

  create () {
      const carteDuNiveau = this.add.tilemap("niveau2");
      const tileset = carteDuNiveau.addTilesetImage(
          "tuileries",
          "Phaser_tuilesdejeu2"
      );  

      const backgroundLayer = carteDuNiveau.createStaticLayer(
          "background",
          tileset
      );
      this.plateformes2 = carteDuNiveau.createStaticLayer(
          "plateformes",
          tileset
      );

      this.groupe_ennemis = this.physics.add.group();

      const tab_points = carteDuNiveau.getObjectLayer("calque_ennemis");   
      const tab_items = carteDuNiveau.getObjectLayer("calque_item"); 
      this.porte_retour = this.physics.add.staticSprite(3150, 523, "img_porte1");   

      tab_points.objects.forEach(point => {
          if (point.name == "ennemi") {
          var nouvel_ennemi = this.physics.add.sprite(point.x, point.y, "enemy");
          nouvel_ennemi.setBounce(0);
          nouvel_ennemi.setCollideWorldBounds(true);
          this.physics.add.collider(nouvel_ennemi, this.plateformes);
          this.groupe_ennemis.add(nouvel_ennemi);
          }
      }); 

      this.player = this.physics.add.sprite(100, 440, 'soldier');
      //   this.player.refreshBody();
    //   this.player = this.physics.add.sprite(3000, 40, 'soldier');
      this.player.setBounce(0);
      this.player.setCollideWorldBounds(true);
      this.player.body.onWorldBounds = true; 

      tab_items.objects.forEach(item => {
          if (item.name === "boots") {
              const boots = this.physics.add.sprite(item.x, item.y, "boots");
              boots.setScale(0.02)
              this.physics.add.collider(boots, this.plateformes);
              this.physics.add.overlap(this.player, boots, this.collectBoots, null, this);
          } else if (item.name === "potion") {
              const potion = this.physics.add.sprite(item.x, item.y, "potion");
              potion.setScale(0.02)
              this.physics.add.collider(potion, this.plateformes);
              this.physics.add.overlap(this.player, potion, this.collectpotion, null, this);
          }
      });
      
      this.plateformes.setCollisionByProperty({ collides: true });
      this.plateformes.setCollisionByExclusion([-1]);

      this.physics.world.setBounds(0, 0, 3200, 640);  // redimentionnement du monde avec les dimensions calculées via tiled
      this.cameras.main.setBounds(0, 0, 3200, 640); //  ajout du champs de la caméra de taille identique à celle du monde
      this.cameras.main.startFollow(this.player); // ancrage de la caméra sur le joueur

      this.physics.add.collider(this.player, this.plateformes);

      this.keyE = this.input.keyboard.addKey('E');
      this.cursors = this.input.keyboard.createCursorKeys();

      this.pv = 100;
      this.playerSpeed = 140;
      this.enemyHealth = 100;
      this.attackDamage = 50;

      this.healthText = this.add.text(16, 16, `PV: ${this.pv}`, { fontSize: '25px', fill: '#FFFFFF' });
      this.healthText.setScrollFactor(0); // fixe le texte à l'écran

      this.gameOverText = this.add.text(370, 300, `TES DEAD`, { fontSize: '32px', fill: '#FFFFFF' });
      this.gameOverText.setAlpha(0); // Masque le texte en le rendant transparent
      this.gameOverText.setScrollFactor(0);

      this.speedText = this.add.text(100, 100, '', { fontSize: '24px', fill: '#FFFFFF' });
      this.speedText.setAlpha(0);
      this.speedText.setScrollFactor(0);

      this.player.body.world.on(  // écouteur sur les bords du monde
          "worldbounds", // l'event surveillé
          function (body, up, down, left, right) {
          // on verifie si la hitbox qui est rentrée en collision est celle du player,
          // et si la collision a eu lieu sur le bord inférieur du player
          if (body.gameObject === this.player && down == true) {
              this.physics.pause();
              this.healthText.setAlpha(0);
              this.gameOver = true;
          }
          },
      this
      ); 

      this.groupe_ennemis.children.iterate(function iterateur(un_ennemi) {
          un_ennemi.setVelocityX(-80);
          un_ennemi.direction = "gauche";
          un_ennemi.play("enemy_walk", true);
      }); 
  }

  update () {

    const self = this; // Stockez une référence à 'this' dans une variable 'self'

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space) == true) {
        console.log(this.physics);
        console.log(this.player);
        console.log(this.porte_retour);
      if (this.physics.overlap(this.player, this.porte_retour)) {
         console.log('yo yo');
        this.scene.start("selection");
        }
    } 

    if (this.gameOver) {
      this.tweens.add({
          targets: this.gameOverText,
          alpha: 1, // Opacité complète (100%)
          duration: 1200, // Durée de l'animation en millisecondes (1 seconde)
          ease: 'Linear', // Fonction d'animation (vous pouvez choisir une autre si vous le souhaitez)
          onComplete: function () {
          // Callback lorsque l'animation est terminée (peut être laissé vide si vous n'avez pas besoin de traitement supplémentaire)
          }
      });
      return;
    }

    if (this.keyE.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown) { // attack
        this.simulateSwordAttack();
    } else if (this.cursors.left.isDown && !this.keyE.isDown) { // left
        this.player.setVelocityX(-this.playerSpeed);
        this.player.anims.play('left', true);
        this.currentAnimation = 'left';
    } else if (this.cursors.right.isDown && !this.keyE.isDown) { // right
        this.player.setVelocityX(this.playerSpeed);
        this.player.anims.play('right', true);
        this.currentAnimation = 'right';
    } else { // Si aucune touche de déplacement n'est enfoncée
        this.player.setVelocityX(0);
        if (this.currentAnimation === 'attack' || this.currentAnimation === 'jump') {
            this.player.once('animationcomplete', function () {
                self.player.anims.play('turn');
                this.currentAnimation = 'turn';
            });
        } else {
            this.player.anims.play('turn');
            this.currentAnimation = 'turn';
        }
    }

    if (this.cursors.up.isDown && this.player.body.onFloor() && !this.cursors.right.isDown && !this.cursors.left.isDown) { // jump si le joueur est sur le sol
        this.player.setVelocityY(-330);
        this.player.anims.play('jump', true);
        this.currentAnimation = 'jump';
    } else if (this.cursors.up.isDown && this.player.body.onFloor() && (this.cursors.right.isDown || this.cursors.left.isDown)) {
        this.player.setVelocityY(-300); // pas d'anim de jump si le joueur marche a droite ou a gauche et il saute un peu moins haut
    }

    this.physics.collide(this.player, this.groupe_ennemis.children.entries, this.playerEnemyCollision, null, this);

    this.groupe_ennemis.children.iterate(function iterateur(un_ennemi) { // deplacement ennemis
        if (un_ennemi.direction == "gauche" && un_ennemi.body.blocked.down) {
        var coords = un_ennemi.getBottomLeft();
        var tuileSuivante = self.plateformes.getTileAtWorldXY(
            coords.x,
            coords.y + 10
        );
        if (tuileSuivante == null || un_ennemi.body.blocked.left) {
            // on risque de marcher dans le vide, on tourne
            un_ennemi.direction = "droite";
            un_ennemi.setVelocityX(80);
            un_ennemi.play("enemy_walk", true);
        }
        } else if (un_ennemi.direction == "droite" && un_ennemi.body.blocked.down) {
            var coords = un_ennemi.getBottomRight();
            var tuileSuivante = self.plateformes.getTileAtWorldXY(
                coords.x,
                coords.y + 10
            );
            if (tuileSuivante == null || un_ennemi.body.blocked.right) {
                // on risque de marcher dans le vide, on tourne
                un_ennemi.direction = "gauche";
                un_ennemi.setVelocityX(-80);
                un_ennemi.play("enemy_walk", true);
            }
        }
    });

  }

  playerEnemyCollision() {
      this.pv -= 2;
      this.healthText.setText('PV: ' + this.pv);

      if (this.healthText.text == "PV: 0"){
          this.physics.pause();
          this.gameOver = true;
      }
  }

    dealDamageToEnemy(enemy) {
      this.enemyHealth -= this.attackDamage;

        if (this.enemyHealth <= 0) {
            enemy.destroy(); 
        }
    }

  simulateSwordAttack() {
    const self = this;
    this.player.anims.play('attack', true);
    this.currentAnimation = 'attack';
    const attackRange = new Phaser.Geom.Rectangle(this.player.x - 50, this.player.y - 10, 120, 20); // portée de l'attaque

    this.player.once('animationcomplete', function () {
        self.groupe_ennemis.children.entries.forEach(enemy => {
            if (Phaser.Geom.Rectangle.ContainsPoint(attackRange, enemy.getCenter())) {
                self.dealDamageToEnemy(enemy);
            }
        });
    });
  }

  collectBoots(player, boots) {
    const self = this;
      this.speedText.setText('+20 Move Speed!');
      this.speedText.setAlpha(1);
      this.tweens.add({
          targets: this.speedText,
          alpha: 0, // Le texte deviendra progressivement transparent
          y: this.speedText.y - 70, // Animation de montée
          duration: 2000, // Durée de l'animation en millisecondes (2 secondes)
          ease: 'Linear',
          onComplete: function () {
              self.speedText.setText(''); // Effacez le texte lorsque l'animation est terminée
          }
      });
      this.playerSpeed = this.playerSpeed + 20;
      boots.destroy(); 
  }

  collectpotion(player, potion) {
    const self = this;
      this.speedText.setText('+20 PV!');
      this.speedText.setAlpha(1);
      this.tweens.add({
          targets: this.speedText,
          alpha: 0, 
          y: this.speedText.y - 70, 
          duration: 2000, 
          ease: 'Linear',
          onComplete: function () {
              self.speedText.setText('');
          }
      });

      this.pv = this.pv + 20;
      potion.destroy(); 
      this.updateHealthText();
  }

  updateHealthText() {
      this.healthText.setText(`PV: ${this.pv}`);
  }

}