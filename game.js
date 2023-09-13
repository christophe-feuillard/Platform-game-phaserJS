var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    physics: {
        default: 'arcade', // moteur phyisque le plus simple, le plus léger et le mieux adapter pour des jeux en 2D
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
var platforms;
var cursors;
var score = 0;
var gameOver = false;
let keyE;
var currentAnimation = '';
var pv = 100;
var healthText;
var gameOverText = '';

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background.jpg');
    this.load.image('rockplatform', 'assets/rockplatform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('soldier', 'assets/persosprite2.png', { frameWidth: 64, frameHeight: 48 });
    this.load.spritesheet('soldier_attack', 'assets/attack_sprite2.png', { frameWidth: 87, frameHeight: 48 });
    this.load.spritesheet('soldier_jump', 'assets/jump_sprite.png', { frameWidth: 86, frameHeight: 60 });
    this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 42, frameHeight: 49 });
}

function create () {
    this.add.image(400, 300, 'background'); // background
    keyE = this.input.keyboard.addKey('E');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'rockplatform').setScale(1).refreshBody(); // le sol
    // platforms.create(1000, 510, 'rockplatform'); // autre plateformes

    player = this.physics.add.sprite(100, 450, 'soldier');
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    enemy = this.physics.add.sprite(400, 450, 'enemy'); // Remplacez 'enemy' par le nom de votre image d'ennemi
    enemy.setBounce(0);
    enemy.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms); // ajoute la collision entre le joueur et les plateformes
    this.physics.add.collider(enemy, platforms); // ajoute la collision entre le joueur et les plateformes
    // this.physics.add.collider(enemy, player); // ajoute la collision entre le joueur et les plateformes

    healthText = this.add.text(16, 16, `PV: 100`, { fontSize: '32px', fill: '#FFFFFF' });
    gameOverText = this.add.text(370, 300, `TES DEAD`, { fontSize: '32px', fill: '#FFFFFF' });
    gameOverText.setAlpha(0); // Masquer le texte en le rendant transparent
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
    // if (gameOver){
    //     gameOverText = this.add.text(370, 300, `TES DEAD`, { fontSize: '32px', fill: '#FFFFFF' });
    //     return;
    // }
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

    if (cursors.left.isDown) { // left
        player.setVelocityX(-160);
        player.anims.play('left', true);
        currentAnimation = 'left';
    } else if (cursors.right.isDown) { // right
        player.setVelocityX(160);
        player.anims.play('right', true);
        currentAnimation = 'right';
    } else if (keyE.isDown) { // attack
        player.anims.play('attack', true);
        currentAnimation = 'attack';
    } else if (cursors.up.isDown) { // jump
        if(player.body.touching.down) {
            player.anims.play('jump', true);
            player.setVelocityY(-250);
            currentAnimation = 'jump';
        }
        console.log(player.body.touching.down);
    } else { // rien
        player.setVelocityX(0);
        if (currentAnimation === 'attack' || currentAnimation === 'jump') { // je laisse l'animation précédente se terminer
            player.once('animationcomplete', function () {
                player.anims.play('turn');
                currentAnimation = 'turn'; // met à jour l'animation actuelle
            });
        } else {
            player.anims.play('turn');
            currentAnimation = 'turn';
        }
    }

    // console.log(enemy.x);

    // Logique de suivi de l'ennemi
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

    this.physics.collide(player, enemy, playerEnemyCollision, null, this);

}

function playerEnemyCollision(player, enemy) {
    // Définissez ici la logique des interactions entre le joueur et l'ennemi en cas de collision.
    // Par exemple, vous pouvez réduire la santé du joueur ou détruire l'ennemi.

    // Exemple : Réduire la santé du joueur
    pv -= 10; // Assurez-vous que playerHealth est une variable définie pour la santé du joueur
    healthText.setText('PV: ' + pv);
    console.log(healthText.text == "PV: 0");

    if (healthText.text == "PV: 0"){
        gameOver = true;
    }
}