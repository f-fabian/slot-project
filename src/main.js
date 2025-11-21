import * as PIXI from "pixi.js";
import { SymbolSet } from "./core/SymbolSet.js";
import { Reel } from "./core/Reel.js";
import { payTable } from "./core/payTable.js";
import { SlotMachine } from "./core/SlotMachine.js";

async function main() {
    const app = new PIXI.Application();
    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb
    });

    const spinButton = document.createElement("button");
    spinButton.textContent = "Spin";

    document.body.appendChild(spinButton);
    document.body.appendChild(app.canvas); // add canvas to DOM

    const mySymbolSet = new SymbolSet();
    const reels = [
        new Reel(mySymbolSet),
        new Reel(mySymbolSet),
        new Reel(mySymbolSet),
        new Reel(mySymbolSet),
        new Reel(mySymbolSet)
    ]

    const slot = new SlotMachine(reels, payTable);
    const reelSprites = []; // array to store each reel sprites

    await PIXI.Assets.load({
        "7": "/Lucky7_rainbow.png",
        "cherry": "/cherries.png",
        "bell": "/bell.png"
    });

    function setup() {
        const spinResult = slot.result(); // ask for the result of the spin
        const symbolWidth = 100;
        const symbolHeight = 100;
        
        for (let column = 0; column < reels.length; column++){
            const reelContainer = new PIXI.Container(); // create 1 container per reel
            app.stage.addChild(reelContainer); // add created container to the machine
            
            reelSprites[column] = []; // initialize an array for this reel
            
            for (let row = 0; row < 3; row++) {
                const symbol = spinResult[row][column]; // symbol for this row and column
                const texture = PIXI.Assets.get(symbol);
                const sprite = new PIXI.Sprite(texture);
                
                sprite.x = column * symbolWidth;
                sprite.y = row * symbolHeight;
                
                reelContainer.addChild(sprite);
                reelSprites[column][row] = sprite;
            }
        }
    }

    spinButton.addEventListener("click", () => {
        const newResult = slot.result();
        updateReels(newResult);
    });

    function updateReels(newResult) {
        for (let column = 0; column < reels.length; column++) {
            for (let row = 0; row < 3; row++) {
                const symbol = newResult[row][column];
                reelSprites[column][row].texture = PIXI.Assets.get(symbol);
            }
        }
    }

    setup();
}

main();