export class SymbolSet {
    constructor(symbols = ["7", "cherry", "bell"]){
        this.symbols = symbols;
    }

    getRandomSymbol(){
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }
}
