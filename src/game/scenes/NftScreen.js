import Phaser from 'phaser'
import config from '../config/config.js'
import gameSettings from '../config/gameSettings.js'

class NftScreen extends Phaser.Scene {
    constructor() {
        super('createNft')
    }

    init() {}

    preload() {
        this.cameras.main.fadeIn(1000)

        this.load.image(
            'background',
            'assets/images/backgrounds/background_title.png',
        )
        this.load.image('pixel', 'assets/shaders/16x16.png')
    }

    create() {
        // Create a black rectangle that covers the whole game
        let blackCover = this.add.rectangle(
            0,
            0,
            config.width,
            config.height,
            0x000000,
        );
        blackCover.setOrigin(0, 0);
        blackCover.setDepth(100);
    
        this.tweens.add({
            targets: blackCover,
            alpha: 0,
            duration: 2500,
            onComplete: function () {
                blackCover.destroy();
            },
        });
    
        // Create Background
        this.background = this.add.tileSprite(
            0,
            0,
            config.width,
            config.height,
            'background',
        );
        this.background.setOrigin(0, 0);
    
        // Create "SPACE" text
        const spaceText = this.add.text(
            config.width / 2,
            config.height / 2 - 200,
            'SUPER WARRIOR',
            {
                fontFamily: 'Pixelify Sans',
                fontSize: '80px',
                color: '#F3F8FF',
                align: 'center',
            },
        );
        spaceText.setOrigin(0.5);
        spaceText.setShadow(3, 3, '#F27CA4', 2, false, true);
    
        const guardianText = this.add.text(
            config.width / 2,
            config.height / 2 - 100,
            'Claim your stellar prize',
            {
                fontFamily: 'Pixelify Sans',
                color: '#F3F8FF',
                fontSize: '45px',
                align: 'center',
            },
        );
        guardianText.setOrigin(0.5);
        guardianText.setShadow(3, 3, '#F27CA4', 2, false, true);
    
        // Tween animation for the rainbow effect on "GUARDIAN"
        this.tweens.add({
            targets: guardianText,
            duration: 1000, // Adjust the duration as needed
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            alpha: 0.2, // Optional: You can adjust the alpha for a fading effect
        });
    
        // Tween animation for the rainbow effect on "SPACE"
        this.tweens.add({
            targets: spaceText,
            duration: 1000, // Adjust the duration as needed
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            alpha: 0.2, // Optional: You can adjust the alpha for a fading effect
        });
        
        // Pixel Transformation


        

        const source = this.textures.get('nft_texture').source[0].image;
        const canvas = this.textures.createCanvas('pad', 125, 125).source[0].image; // Change the size of the canvas to 25x25
        const ctx = canvas.getContext('2d');

        ctx.drawImage(source, 0, 0, 125, 125); // Add the width and height parameters to resize the image

        const imageData = ctx.getImageData(0, 0, 125, 125); // Get the image data from the resized image

    
        let x = 0;
        let y = 0;
        const color = new Phaser.Display.Color();
    
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const a = imageData.data[i + 3];
    
            if (a > 0) {
                const startX = Phaser.Math.Between(0, 1024);
                const startY = Phaser.Math.Between(0, 768);
    
                const dx = (config.width / 2 - config.width / 4 + 25) + x * 2;
                const dy = (config.height / 2 - 10  ) + y * 2;
    
                const image = this.add.image(startX, startY, 'pixel').setScale(0);
    
                color.setTo(r, g, b, a);
    
                image.setTint(color.color);
    
                this.tweens.add({
                    targets: image,
                    duration: 500,
                    x: dx,
                    y: dy,
                    scaleX: 1,
                    scaleY: 1,
                    angle: 360,
                    delay: i / 10,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 10000,
                    hold: 10000
                });
            }
    
            x++;
    
            if (x === 125) {
                x = 0;
                y++;
            }
        }

                // Add this to your create method
        // Add this to your create method
        // em vao day roi thay thanh cai button nhe
        let mintButton = this.add.text(config.width / 2 - config.width / 4, config.height / 2 + 100, 'Mint', { fill: '#0f0' }).setInteractive();

        mintButton.on('pointerdown', function (pointer) {
            // Add your code here that should be executed when the button is clicked
            console.log('Mint button clicked');
        });
    }
    
}

export default NftScreen;
