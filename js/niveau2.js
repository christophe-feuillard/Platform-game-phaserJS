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
            "Tileset_ground",
            "Phaser_tuilesdejeu2"
        );  

        const backgroundTileset = carteDuNiveau.addTilesetImage(
            "backgroundlvl2",
            "Phaser_tuilesdejeu2_sky"
        );  
        const background = carteDuNiveau.createStaticLayer(
            "background",
            backgroundTileset
        );  
        const background2 = carteDuNiveau.createStaticLayer(
            "background2",
            backgroundTileset
        );  
        this.plateformes2 = carteDuNiveau.createStaticLayer(
            "plateformes",
            tileset
        );  
        this.plateforme_mobile = this.physics.add.sprite(
            590,
            558,
            "plateforme_mobile"
        ); 

        this.groupe_slime = this.physics.add.group();

        const slime_point = carteDuNiveau.getObjectLayer("ennemis");   

        slime_point.objects.forEach(point => {
            if (point.name == "ennemi") {
                var nouvel_ennemi = this.physics.add.sprite(point.x, point.y, "slime");
                nouvel_ennemi.setBounce(0.1);
                nouvel_ennemi.setCollideWorldBounds(true);
                nouvel_ennemi.setScale(1.4);
                nouvel_ennemi.setGravityY(550);
                this.physics.add.collider(nouvel_ennemi, this.plateformes2);
                this.groupe_slime.add(nouvel_ennemi);
            }
        }); 

        this.plateforme_mobile.body.allowGravity = false;
        this.plateforme_mobile.body.immovable = true; 

        this.tween_mouvement = this.tweens.add({
            targets: [this.plateforme_mobile],  
            paused: true, 
            ease: "Linear",  
            duration: 2000, 
            yoyo: true,   
            x: "-=200",   
            delay: 0,     
            hold: 1000,  
            repeatDelay: 1000, 
            repeat: -1 
        });

        this.levier = this.physics.add.staticSprite(200, 523, "img_levier"); 
        this.levier.active = false; 
        this.levier.setScale(0.7);

        this.player = this.physics.add.sprite(100, 500, 'soldier');
        // this.player = this.physics.add.sprite(1800, 300, 'soldier');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.player.body.onWorldBounds = true; 
        
        this.plateformes2.setCollisionByProperty({ collides: true });
        this.plateformes2.setCollisionByExclusion([-1]);

        this.physics.world.setBounds(0, 0, 3200, 640);  // redimentionnement du monde avec les dimensions calculées via tiled
        this.cameras.main.setBounds(0, 0, 3200, 640); //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.startFollow(this.player); // ancrage de la caméra sur le joueur

        this.physics.add.collider(this.player, this.plateformes2);
        this.physics.add.collider(this.player, this.plateforme_mobile);

        this.keyE = this.input.keyboard.addKey('E');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.pv = 100;
        this.playerSpeed = 140;
        this.enemyHealth = 100;
        this.attackDamage = 50;

        this.healthText = this.add.text(16, 16, `PV: ${this.pv}`, { fontSize: '25px', fill: '#FFFFFF' });
        this.healthText.setScrollFactor(0); // fixe le texte à l'écran

        this.gameOverText = this.add.text(300, 300, `TES DEAD`, { fontSize: '32px', fill: '#FFFFFF' });
        this.gameOverText.setAlpha(0); // Masque le texte en le rendant transparent
        this.gameOverText.setScrollFactor(0);

        this.speedText = this.add.text(100, 100, '', { fontSize: '24px', fill: '#FFFFFF' });
        this.speedText.setAlpha(0);
        this.speedText.setScrollFactor(0);

        this.player.body.world.on(
            "worldbounds", 
            function (body, up, down, left, right) {
            if (body.gameObject === this.player && down == true) {
                this.physics.pause();
                this.healthText.setAlpha(0);
                this.gameOver = true;
            }
            },
        this
        ); 
     }

    update () {
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('R'), 250)) {
            location.reload(); 
        }

        const self = this; 

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) == true) {
            if (this.physics.overlap(this.player, this.porte_retour)) { this.scene.start("selection"); }
            if (this.physics.overlap(this.player, this.levier) == true) {
                if (this.levier.active == true) {        
                    this.levier.active = false; 
                    this.levier.flipX = false; 
                    this.tween_mouvement.pause();  
                } else {         
                    this.levier.active = true; 
                    this.levier.flipX = true; 
                    this.tween_mouvement.resume(); 
                }
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

        this.physics.collide(this.player, this.groupe_slime.children.entries, this.playerEnemyCollision, null, this);

        this.groupe_slime.children.iterate(function (slime) {
            const slimeSpeed = 50;
            
            // function jumpSlime() {
            //     slime.setVelocityY(-100); // Ajustez la valeur de la vélocité Y selon votre niveau
            // }
            
            function moveSlime() {
                if (self.player.x < slime.x) {
                    slime.setVelocityX(-slimeSpeed);
                } else if (self.player.x > slime.x) {
                    slime.setVelocityX(slimeSpeed);
                }
            }
            
            // setInterval(jumpSlime, 2000);
            
            setInterval(moveSlime, 100); // Vous pouvez ajuster la fréquence de mise à jour du déplacement
        });

    }

    playerEnemyCollision() {
        this.pv -= 1;
        this.healthText.setText('PV: ' + this.pv);

        if (this.healthText.text == "PV: 0"){
            this.physics.pause();
            this.gameOver = true;
        }
    }

    simulateSwordAttack() {
        const self = this;
        this.player.anims.play('attack', true);
        this.currentAnimation = 'attack';
        const attackRange = new Phaser.Geom.Rectangle(this.player.x - 50, this.player.y - 10, 120, 20); // portée de l'attaque

        // this.player.once('animationcomplete', function () {
        //     self.groupe_ennemis.children.entries.forEach(enemy => {
        //         if (Phaser.Geom.Rectangle.ContainsPoint(attackRange, enemy.getCenter())) {
        //             self.dealDamageToEnemy(enemy);
        //         }
        //     });
        // });
    }

    collectBoots(player, boots) {
        const self = this;
        this.speedText.setText('+20 Move Speed!');
        this.speedText.setAlpha(1);
        this.tweens.add({
            targets: this.speedText,
            alpha: 0, // Le texte deviendra progressivement transparent
            y: this.speedText.y - 70, // Animation de montée
            duration: 2000, 
            ease: 'Linear',
            onComplete: function () {
                self.speedText.setText(''); 
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