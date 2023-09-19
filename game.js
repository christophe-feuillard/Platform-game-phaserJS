var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 550 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var enemy;
var cursors;
var score = 0;
var gameOver = false;
let keyE;
var currentAnimation = '';
var pv = 100;
var healthText;
var gameOverText = '';
var attackDamage = 50;
var enemyHealth = 100;
var isAttacking = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image("Phaser_tuilesdejeu", "assets/tuilesperso2.png");
    this.load.tilemapTiledJSON("carte", "assets/map2.json");  
    this.load.spritesheet('soldier', 'assets/persosprite2.png', { frameWidth: 64, frameHeight: 48 });
    this.load.spritesheet('soldier_attack', 'assets/attack_sprite2.png', { frameWidth: 87, frameHeight: 48 });
    this.load.spritesheet('soldier_jump', 'assets/jump_sprite.png', { frameWidth: 86, frameHeight: 60 });
    this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 42, frameHeight: 49 });
}

function create () {
    const carteDuNiveau = this.add.tilemap("carte");
    const tileset = carteDuNiveau.addTilesetImage(
        "tuiles_de_jeu",
        "Phaser_tuilesdejeu"
    );  

    const backgroundLayer = carteDuNiveau.createStaticLayer(
        "background",
        tileset
    );
    const backgroundLayer2 = carteDuNiveau.createStaticLayer(
        "background_2",
        tileset
    );
    const plateformes = carteDuNiveau.createStaticLayer(
        "plateformes",
        tileset
    );

    player = this.physics.add.sprite(100, 450, 'soldier');
    player.setBounce(0);
    player.setCollideWorldBounds(true);
    player.body.onWorldBounds = true; 
    
    enemy = this.physics.add.sprite(400, 450, 'enemy');
    enemy.setBounce(0);
    enemy.setCollideWorldBounds(true);
    
    plateformes.setCollisionByProperty({ collides: true });
    plateformes.setCollisionByExclusion([-1]);

    this.physics.world.setBounds(0, 0, 3200, 640);  // redimentionnement du monde avec les dimensions calculées via tiled
    this.cameras.main.setBounds(0, 0, 3200, 640); //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.startFollow(player); // ancrage de la caméra sur le joueur

    this.physics.add.collider(player, plateformes);
    this.physics.add.collider(enemy, plateformes);
    // this.physics.add.collider(enemy, player);

    keyE = this.input.keyboard.addKey('E');
    cursors = this.input.keyboard.createCursorKeys();

    healthText = this.add.text(16, 16, `PV: 100`, { fontSize: '32px', fill: '#FFFFFF' });
    healthText.setScrollFactor(0); // fixe le texte à l'écran

    gameOverText = this.add.text(370, 300, `TES DEAD`, { fontSize: '32px', fill: '#FFFFFF' });
    gameOverText.setAlpha(0); // Masque le texte en le rendant transparent
    gameOverText.setScrollFactor(0);

    player.body.world.on(  // écouteur sur les bords du monde
        "worldbounds", // l'event surveillé
        function (body, up, down, left, right) {
        // on verifie si la hitbox qui est rentrée en collision est celle du player,
        // et si la collision a eu lieu sur le bord inférieur du player
        if (body.gameObject === player && down == true) {
            healthText.setAlpha(0);
            gameOver = true;
        }
        },
    this
    ); 

    createAnimations.call(this);
}

function createAnimations() {
    this.anims.create({ // les animations sont disponibles globalement pour tous les objets de jeu
        key: 'left',
        frames: this.anims.generateFrameNumbers('soldier', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'soldier', frame: 7 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('soldier', { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('soldier_attack', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: 0,
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('soldier_jump', { start: 0, end: 10 }),
        frameRate: 10,
        repeat: 0, // 0 signifie qu'elle ne se répète pas
    });

    this.anims.create({
        key: 'turn_enemy',
        frames: [ { key: 'enemy', frame: 0 } ],
        frameRate: 20,
    });

    this.anims.create({ // les animations sont disponibles globalement pour tous les objets de jeu
        key: 'enemy_walk',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}

function update ()
{
    if (gameOver) {
        this.tweens.add({
            targets: gameOverText,
            alpha: 1, // Opacité complète (100%)
            duration: 1200, // Durée de l'animation en millisecondes (1 seconde)
            ease: 'Linear', // Fonction d'animation (vous pouvez choisir une autre si vous le souhaitez)
            onComplete: function () {
            // Callback lorsque l'animation est terminée (peut être laissé vide si vous n'avez pas besoin de traitement supplémentaire)
            }
        });
        return;
    }

    if (keyE.isDown) { // attack
        simulateSwordAttack();
    } else if (cursors.left.isDown) { // left
        player.setVelocityX(-160);
        player.anims.play('left', true);
        currentAnimation = 'left';
    } else if (cursors.right.isDown) { // right
        player.setVelocityX(160);
        player.anims.play('right', true);
        currentAnimation = 'right';
    } else { // Si aucune touche de déplacement n'est enfoncée
        player.setVelocityX(0);
        if (currentAnimation === 'attack' || currentAnimation === 'jump') {
            player.once('animationcomplete', function () {
                player.anims.play('turn');
                currentAnimation = 'turn';
            });
        } else {
            player.anims.play('turn');
            currentAnimation = 'turn';
        }
    }

    if (cursors.up.isDown && player.body.onFloor()) { // jump si le joueur est sur le sol
        player.setVelocityY(-300);
        player.anims.play('jump', true);
        currentAnimation = 'jump';
    }

    // if (cursors.left.isDown) { // left
    //     player.setVelocityX(-160);
    //     player.anims.play('left', true);
    //     currentAnimation = 'left';
    // } else if (cursors.right.isDown) { // right
    //     player.setVelocityX(160);
    //     player.anims.play('right', true);
    //     currentAnimation = 'right';
    // } 
    // else if (cursors.up.isDown && player.body.onFloor()) { // jump
    //     player.anims.play('jump', true);
    //     player.setVelocityY(-250);
    //     currentAnimation = 'jump';
    // }
    // if (keyE.isDown) { // attack
    //     player.anims.play('attack', true);
    //     currentAnimation = 'attack';
    // } else { // rien
    //     player.setVelocityX(0);
    //     if (currentAnimation === 'attack' || currentAnimation === 'jump') { // je laisse l'animation précédente se terminer
    //         player.once('animationcomplete', function () {
    //             player.anims.play('turn');
    //             currentAnimation = 'turn'; // met à jour l'animation actuelle
    //         });
    //     } else {
    //         player.anims.play('turn');
    //         currentAnimation = 'turn';
    //     }
    // }

    if(enemy.active) { // Logique de suivi de l'ennemi
        if (player.x < enemy.x) {
            // Le joueur est à gauche de l'ennemi, faites en sorte que l'ennemi se déplace vers la gauche
            enemy.setVelocityX(-100); // Ajustez la vitesse de l'ennemi selon vos besoins
            enemy.anims.play('enemy_walk', true);
        } else if (player.x > enemy.x) {
            // Le joueur est à droite de l'ennemi, faites en sorte que l'ennemi se déplace vers la droite
            enemy.setVelocityX(100); // Ajustez la vitesse de l'ennemi selon vos besoins
            enemy.anims.play('enemy_walk', true);
        } else {
            // Le joueur est à la même position horizontale que l'ennemi, arrêtez son mouvement
            enemy.setVelocityX(0);
            enemy.anims.stop('enemy_walk');
        }
    }

    this.physics.collide(player, enemy, playerEnemyCollision, null, this);
}

function playerEnemyCollision(player, enemy) {
    // Définissez ici la logique des interactions entre le joueur et l'ennemi en cas de collision.
    // Par exemple, vous pouvez réduire la santé du joueur ou détruire l'ennemi.

    // Exemple : Réduire la santé du joueur
    pv -= 5; // Assurez-vous que playerHealth est une variable définie pour la santé du joueur
    healthText.setText('PV: ' + pv);

    if (healthText.text == "PV: 0"){
        gameOver = true;
    }
}

function simulateSwordAttack() {
    player.anims.play('attack', true);
    currentAnimation = 'attack';
    const attackRange = new Phaser.Geom.Rectangle(player.x - 50, player.y - 10, 100, 20); // portée de l'attaque

    // Parcourez tous les ennemis de votre jeu (si vous en avez plusieurs)
    // et vérifiez s'ils se trouvent dans la zone d'attaque
    player.once('animationcomplete', function () {
        if (enemy && Phaser.Geom.Rectangle.ContainsPoint(attackRange, enemy.getCenter())) {
            dealDamageToEnemy(enemy);
        }
    });
}

function dealDamageToEnemy(enemy) {
    enemyHealth -= attackDamage;

    if (enemyHealth <= 0) {
        enemy.destroy(); 
    }
}
