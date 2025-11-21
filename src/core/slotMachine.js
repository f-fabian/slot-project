export class SlotMachine {
    constructor(reels, payTable){
        this.reels = reels;
        this.payTable = payTable;
    }
    
    result(){
        const reelsSpins = this.reels.map(reel => reel.spin());
        
        const rows = [[],[],[]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < this.reels.length; j++){
                rows[i].push(reelsSpins[j][i]);
            }
        }
        
        return rows;
    }
    
    evaluate(rows){
        let totalPayout = 0;
        
        rows.forEach(row => {
            const symbol = row[0];
            let count = 0;
            for (let i = 0; i < row.length; i++) {
                if (row[i] === row[0]) {
                    count += 1;
                } else {
                    break;
                }
            }
            if (count >= 3) {
                totalPayout += this.payTable[symbol][count];
            }
        });
        return totalPayout;
    }
}
