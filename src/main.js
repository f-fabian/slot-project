import * as PIXI from "pixi.js";
import { SymbolSet } from "./core/SymbolSet.js";
import { Reel } from "./core/Reel.js";
import { payTable } from "./core/PayTable.js";
import { SlotMachine } from "./core/SlotMachine.js";

async function main() {
    // Create app without constructor options to avoid deprecation warning.
    const app = new PIXI.Application();
    // Prefer the newer init API when available (avoids constructor-deprecation warnings).
    if (app.init && typeof app.init === "function") {
        await app.init({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb
        });
    } else {
        // Fallback for builds without `init` — resize renderer and set background if possible.
        if (app.renderer && typeof app.renderer.resize === "function") {
            app.renderer.resize(800, 600);
        }
        if (app.renderer && "backgroundColor" in app.renderer) {
            app.renderer.backgroundColor = 0x1099bb;
        }
    }
    
    const spinButton = document.createElement("button");
    spinButton.textContent = "Spin";
    document.body.appendChild(spinButton);

    const depositButton = document.createElement("button");
    depositButton.textContent = "Deposit $100";
    document.body.appendChild(depositButton);
    
    const money = document.createElement("div");
    money.textContent = "Money:";
    document.body.appendChild(money);
    
    const amount = document.createElement("div");
    amount.textContent = "50";
    document.body.appendChild(amount);
    
    // `Application.view` is deprecated; prefer `canvas` when present for older builds.
    document.body.appendChild(app.canvas);
    
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

    // Preload textures from the `public/` folder using PIXI.Assets.load with an array of URLs.
    // This ensures the browser fetches the images and avoids cache lookup warnings.
    try {
        await PIXI.Assets.load(["/Lucky7_rainbow.png", "/cherries.png", "/bell.png"]);
    } catch (e) {
        // If the Assets loader fails, log and fall back to creating textures directly.
        // This helps diagnose 404s or network errors in the dev server.
        console.warn("PIXI.Assets.load failed:", e);
    }

    const textures = {
        "7": PIXI.Texture.from("/Lucky7_rainbow.png"),
        "cherry": PIXI.Texture.from("/cherries.png"),
        "bell": PIXI.Texture.from("/bell.png")
    };

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
                const texture = textures[symbol] || PIXI.Texture.EMPTY;
                const sprite = new PIXI.Sprite(texture);
                
                sprite.x = column * symbolWidth;
                sprite.y = row * symbolHeight;
                
                reelContainer.addChild(sprite);
                reelSprites[column][row] = sprite;
            }
        }
    }
    
    spinButton.addEventListener("click", () => {
        if (checkGameOver()){
            alert("Game Over!, Make new Deposit!");
        } else {
            const newResult = slot.result();
            updateReels(newResult);
            const payout = slot.evaluate(newResult);
            updateMoney(payout);
        }
    });

    depositButton.addEventListener("click", () => {
        let total = Number(amount.textContent);
        total += 100;
        amount.textContent = String(total);
    })
    
    function updateReels(newResult) {
        for (let column = 0; column < reels.length; column++) {
            for (let row = 0; row < 3; row++) {
                const symbol = newResult[row][column];
                reelSprites[column][row].texture = textures[symbol] || PIXI.Texture.EMPTY;
            }
        }
    }
    
    function updateMoney(payout) {
        let total = Number(amount.textContent);
        
        if (payout > 0) {
            total += payout;
            amount.textContent = String(total);
        } else {
            total -= 50;
            amount.textContent = String(total);
        }
    }
    
    function checkGameOver() {
        if (Number(amount.textContent) < 50) {
            return true;
        }
        return false;
    }

    setup();
}

main();