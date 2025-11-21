export class Reel {
    constructor(symbolSet){
        this.symbolSet = symbolSet;
    }

    spin(){
        return [
            this.symbolSet.getRandomSymbol(),
            this.symbolSet.getRandomSymbol(),
            this.symbolSet.getRandomSymbol()
        ]
    }
}