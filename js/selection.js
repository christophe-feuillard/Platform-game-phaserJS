var player;
var cursors;
var score = 0;
var gameOver = false;
var keyE;
var currentAnimation = '';
var pv = 100;
var healthText;
var gameOverText = '';
var attackDamage = 50;
var enemyHealth = 100;
var isAttacking = false;
var plateforme;
var playerSpeed = 140;
var speedText = '';
var plateformes;
var groupe_ennemis;

export default class selection extends Phaser.Scene {
    constructor() {
        super({key : "selection"}); // mettre le meme nom que le nom de la classe
    }

    preload () {
        this.load.image("Phaser_tuilesdejeu", "assets/tuilesperso2.png");
        this.load.image('boots', 'assets/boots.png');
        this.load.image('potion', 'assets/potion.png');
        this.load.image('img_porte1', 'assets2/door1.png');
        // this.load.image('img_porte2', 'assets2/door2.png');
        // this.load.image('img_porte3', 'assets2/door3.png'); 

        this.load.tilemapTiledJSON("mapSelection", "assets/mapSelection.json");
        this.load.tilemapTiledJSON("niveau1_1", "assets/map2.json"); 

        this.load.spritesheet('soldier', 'assets/persosprite2.png', { frameWidth: 64, frameHeight: 48 });
        this.load.spritesheet('soldier_attack', 'assets/attack_sprite2.png', { frameWidth: 87, frameHeight: 48 });
        this.load.spritesheet('soldier_jump', 'assets/jump_sprite.png', { frameWidth: 86, frameHeight: 60 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 42, frameHeight: 49 });
    }

    create () {
        const mapSelection = this.add.tilemap("mapSelection");
        const tileset = mapSelection.addTilesetImage(
            "tuiles_selection_level",
            "Phaser_tuilesdejeu"
        );  

        const background = mapSelection.createStaticLayer(
            "background",
            tileset
        );
        plateforme = mapSelection.createStaticLayer(
            "plateforme",
            tileset
        );

        this.porte1 = this.physics.add.staticSprite(150, 430, "img_porte1");

        player = this.physics.add.sprite(0, 340, 'soldier');
        player.setBounce(0);
        player.setCollideWorldBounds(true);
        player.body.onWorldBounds = true; 
        
        plateforme.setCollisionByProperty({ collides: true });
        plateforme.setCollisionByExclusion([-1]);

        this.physics.world.setBounds(0, 0, 640, 480);  // redimentionnement du monde avec les dimensions calculées via tiled
        this.cameras.main.setBounds(0, 0, 640, 480); //  ajout du champs de la caméra de taille identique à celle du monde
        this.cameras.main.startFollow(player); // ancrage de la caméra sur le joueur

        this.physics.add.collider(player, plateforme);

        this.cursors = this.input.keyboard.createCursorKeys();

        healthText = this.add.text(16, 16, `PV: ${pv}`, { fontSize: '25px', fill: '#FFFFFF' });
        healthText.setScrollFactor(0); // fixe le texte à l'écran

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

    update () {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) == true) {
            if (this.physics.overlap(player, this.porte1)) this.scene.start("niveau1");
        } 

        if (this.cursors.left.isDown) { // left
            player.setVelocityX(-playerSpeed);
            player.anims.play('left', true);
            currentAnimation = 'left';
        } else if (this.cursors.right.isDown) { // right
            player.setVelocityX(playerSpeed);
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

        if (this.cursors.up.isDown && player.body.onFloor() && !this.cursors.right.isDown && !this.cursors.left.isDown) { // jump si le joueur est sur le sol
            player.setVelocityY(-330);
            player.anims.play('jump', true);
            currentAnimation = 'jump';
        } else if (this.cursors.up.isDown && player.body.onFloor() && (this.cursors.right.isDown || this.cursors.left.isDown)) {
            player.setVelocityY(-300); // pas d'anim de jump si le joueur marche a droite ou a gauche et il saute un peu moins haut
        }
    }
}

var config = { // configuration générale du jeu
    // type: Phaser.AUTO,
    // width: 900,
    // height: 600,
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: { y: 550 },
    //         debug: false
    //     }
    // },
    scene: {selection}
};

var game = new Phaser.Game(config); // création et lancement du jeu à partir de la configuration config
game.scene.start("selection"); // lancement de la scene selection








// var player;
// var platforms;
// var cursors;
// var gameOver = false;

// export default class selection extends Phaser.Scene {
 
//     constructor() {
//         super({key : "selection"}); // mettre le meme nom que le nom de la classe
//     }

//     preload () {
//         this.load.image('sky', 'assets2/sky.png');
//         this.load.image('ground', 'assets2/platform.png');
//         this.load.image('star', 'assets2/star.png');
//         this.load.image('bomb', 'assets2/bomb.png');
//         this.load.spritesheet('dude', 'assets2/dude.png', { frameWidth: 32, frameHeight: 48 });
//         this.load.image('img_porte1', 'assets2/door1.png');
//         this.load.image('img_porte2', 'assets2/door2.png');
//         this.load.image('img_porte3', 'assets2/door3.png'); 
//     }

//     create () {
//         this.add.image(400, 300, 'sky');

//         this.porte1 = this.physics.add.staticSprite(200, 514, "img_porte1");
//         this.porte2 = this.physics.add.staticSprite(50, 264, "img_porte2");
//         this.porte3 = this.physics.add.staticSprite(750, 234, "img_porte3");

//         platforms = this.physics.add.staticGroup();

//         platforms.create(400, 568, 'ground').setScale(2).refreshBody();

//         platforms.create(600, 400, 'ground');
//         platforms.create(50, 250, 'ground');
//         platforms.create(750, 220, 'ground');

//         player = this.physics.add.sprite(100, 450, 'dude');

//         player.setBounce(0.2);
//         player.setCollideWorldBounds(true);

//         this.anims.create({ 
//             key: 'left',
//             frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
//             frameRate: 10,
//             repeat: -1
//         });

//         this.anims.create({
//             key: 'turn',
//             frames: [ { key: 'dude', frame: 4 } ],
//             frameRate: 20
//         });

//         this.anims.create({
//             key: 'right',
//             frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
//             frameRate: 10,
//             repeat: -1
//         });

//         cursors = this.input.keyboard.createCursorKeys();

//         this.physics.add.collider(player, platforms); 
//     }

//     update () {
//         if (Phaser.Input.Keyboard.JustDown(cursors.space) == true) {
//             if (this.physics.overlap(player, this.porte1)) this.scene.start("niveau1");
//         } 

//         if (gameOver)
//         {
//             return;
//         }

//         if (cursors.left.isDown)
//         {
//             player.setVelocityX(-160);

//             player.anims.play('left', true);
//         }
//         else if (cursors.right.isDown)
//         {
//             player.setVelocityX(160);

//             player.anims.play('right', true);
//         }
//         else
//         {
//             player.setVelocityX(0);

//             player.anims.play('turn');
//         }

//         if (cursors.up.isDown && player.body.touching.down)
//         {
//             player.setVelocityY(-330);
//         }
//     }
// }

// var config = { // configuration générale du jeu
//     scene: {selection}
// };

// var game = new Phaser.Game(config); // création et lancement du jeu à partir de la configuration config
// game.scene.start("selection"); // lancement de la scene selection