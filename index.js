var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    physics: {
        default: 'arcade', // moteur phyisque le plus simple, le plus léger et le mieux adapter pour des jeux en 2D
        arcade: {
            gravity: { y: 400 },
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
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', 'assets/background.jpg');
    this.load.image('rockplatform', 'assets/rockplatform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('soldier', 'assets/persosprite.png', { frameWidth: 64, frameHeight: 48 });
    this.load.spritesheet('soldier_attack', 'assets/spriteattack.png', { frameWidth: 64, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'background');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'rockplatform').setScale(1).refreshBody();

    //  Now let's create some ledges
    // platforms.create(600, 400, 'rockplatform');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'soldier'); // les sprites c'est des images avec des animations

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
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
        frames: this.anims.generateFrameNumbers('soldier_attack', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0, // 0 signifie qu'elle ne se répète pas
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms 
    this.physics.add.collider(player, platforms); // ajoute la collision entre le joueur et les plateformes
}

function update ()
{
    if (gameOver){
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-250);
    }
}