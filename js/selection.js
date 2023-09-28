var player;
var platforms;
var cursors;
var gameOver = false;

export default class selection extends Phaser.Scene {
 
    constructor() {
        super({key : "selection"}); // mettre le meme nom que le nom de la classe
    }

    preload () {
        this.load.image('sky', 'assets2/sky.png');
        this.load.image('ground', 'assets2/platform.png');
        this.load.image('star', 'assets2/star.png');
        this.load.image('bomb', 'assets2/bomb.png');
        this.load.spritesheet('dude', 'assets2/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('img_porte1', 'assets2/door1.png');
        this.load.image('img_porte2', 'assets2/door2.png');
        this.load.image('img_porte3', 'assets2/door3.png'); 
    }

    create () {
        this.add.image(400, 300, 'sky');

        this.porte1 = this.physics.add.staticSprite(200, 514, "img_porte1");
        this.porte2 = this.physics.add.staticSprite(50, 264, "img_porte2");
        this.porte3 = this.physics.add.staticSprite(750, 234, "img_porte3");

        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({ 
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms); 
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(cursors.space) == true) {
            if (this.physics.overlap(player, this.porte1)) this.scene.start("niveau1");
        } 

        if (gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }
}

var config = { // configuration générale du jeu
    scene: {selection}
};

var game = new Phaser.Game(config); // création et lancement du jeu à partir de la configuration config
game.scene.start("selection"); // lancement de la scene selection