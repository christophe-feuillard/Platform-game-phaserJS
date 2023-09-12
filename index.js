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
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
let keyE;
// var isAttacking = false;
var currentAnimation = '';

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
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms); // ajoute la collision entre le joueur et les plateformes
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
}

function update ()
{
    if (gameOver){
        return;
    }

    // if (cursors.left.isDown) {
    //     player.setVelocityX(-160);
    //     player.anims.play('left', true);
    // } else if (cursors.right.isDown) {
    //     player.setVelocityX(160);
    //     player.anims.play('right', true);
    // } else if(keyE.isDown) {
    //     player.anims.play('attack', true);
    // } else if (cursors.up.isDown && player.body.touching.down) {
    //     player.anims.play('jump', true);
    //     player.setVelocityY(-250);
    // } else {
    //     player.setVelocityX(0);
    //     player.anims.play('turn');
    // }

    if (cursors.left.isDown) { // left
        player.setVelocityX(-160);
        player.anims.play('left', true);
        currentAnimation = 'left';
    } else if (cursors.right.isDown) { // right
        player.setVelocityX(160);
        player.anims.play('right', true);
        currentAnimation = 'right';
    } else if (keyE.isDown) { // attack
        // isAttacking = true;
        player.anims.play('attack', true);
        currentAnimation = 'attack';
        // player.once('animationcomplete', function () {
        //     isAttacking = false;
        // });
    } else if (cursors.up.isDown) { // jump
        if(player.body.touching.down) {
            player.anims.play('jump', true);
            player.setVelocityY(-250);
            currentAnimation = 'jump';
        }
        console.log(player.body.touching.down);
    } else { // rien
        player.setVelocityX(0);
        // player.anims.play('turn');
        // player.setVelocityX(0);
        if (currentAnimation === 'attack' || currentAnimation === 'jump') {
            // Si l'animation précédente était une attaque, la laisser se terminer
            player.once('animationcomplete', function () {
                player.anims.play('turn');
                currentAnimation = 'turn'; // Mettre à jour l'animation actuelle
            });
        } else {
            player.anims.play('turn');
            currentAnimation = 'turn'; // Mettre à jour l'animation actuelle
        }
    }
}