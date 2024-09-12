//const riskFactor = 0.00621;
const riskFactor = 0.0069;

class CrashBettingGame {
    constructor() {
        this.crashPoint = 0;
        this.currentMultiplier = 0.0;
        this.betting = false;
        this.betAmount = 0;
        this.balance = document.getElementById('balance').textContent;
        this.pastCrashPoints = '';
    }

    startGame(betAmount) {
        if (betAmount > this.balance) {
            document.getElementById('startGame').style.color = 'red';
            document.getElementById('startGame').textContent = 'insufficient balance';
            setTimeout(() => {
                document.getElementById('startGame').style.color = 'black';
                document.getElementById('startGame').textContent = 'BET';
            }, 500);
        } else if (!this.betting) {
            document.getElementById('gameStatus').style.color = 'white';
            this.betAmount = betAmount;
            this.crashPoint = this.simulateCrash();
            this.currentMultiplier = 1.0;
            this.betting = true;
            this.balance -= parseFloat(this.betAmount);
            
            document.getElementById('gameStatus').textContent = `${this.currentMultiplier.toFixed(2)}x`;
            
            document.getElementById('cashoutButton').style.color = 'black';
            document.getElementById('startGame').style.color = 'gray';
            
            this.updateMultiplier();
        }
    }
    
    simulateCrash() {
        // Constants
        const maxMultiplier = 100;
        const baseRiskFactor = riskFactor; // Adjust this to control the risk
        
        // Generate a random crash point using an exponential decay
        const randomValue = Math.random();
        const crashPoint = maxMultiplier / (Math.log(randomValue + 1) / baseRiskFactor);
        //const crashPoint = 1;

        return crashPoint.toFixed(2); // Round to 2 decimal places
    }
    
    updateMultiplier() {
        if (!this.betting) return;

        if (this.currentMultiplier >= this.crashPoint) {
            this.betting = false;
            
            document.getElementById('cashoutButton').style.color = 'gray';
            document.getElementById('startGame').style.color = 'black';

            document.getElementById('gameStatus').style.color = 'red';
            document.getElementById('gameStatus').textContent = `${parseFloat(this.crashPoint).toFixed(2)}x`;
            document.getElementById('betHistory').innerHTML += `<div class="pastMultipliers">${this.crashPoint}x</div>`;
        } else {
            document.getElementById('gameStatus').textContent = `${this.currentMultiplier.toFixed(2)}x`;
            setTimeout(() => this.updateMultiplier(), 100); // Update every 0.1 seconds
        }

        this.currentMultiplier = parseFloat((this.currentMultiplier + Math.random() * 0.04).toFixed(2));
    }

    cashOut(cashoutMultiplier) {
        if (!this.betting) return;
        

        if (cashoutMultiplier < this.crashPoint) {
            document.getElementById('gameStatus').style.color = '#00c900';
            document.getElementById('gameStatus').innerHTML = `${cashoutMultiplier.toFixed(2)}x`;
            document.getElementById('addBalance').innerHTML = `+${(this.betAmount * cashoutMultiplier).toFixed(2)}`
            document.getElementById('addBalance').classList.add('animate');

            setTimeout(() => {
                document.getElementById('addBalance').innerHTML = '';
                document.getElementById('addBalance').classList.remove('animate');
            }, 1000);
            this.balance += parseFloat(this.betAmount) * parseFloat(cashoutMultiplier);
            document.getElementById('betHistory').innerHTML += `<div class="pastMultipliers">${this.crashPoint}x</div>`
        } else {
            document.getElementById('gameStatus').style.color = 'red';
            document.getElementById('gameStatus').textContent = `${this.crashPoint}x`;
            document.getElementById('betHistory').innerHTML += `<div class="pastMultipliers">${this.crashPoint}x</div>`;
        }

        this.betting = false;
        document.getElementById('cashoutButton').style.color = 'gray';
        document.getElementById('startGame').style.color = 'black';
    }
}

function simulateCrashes(game) {
    let lessThanOnePointFive = 0;
    let lessThanTwo = 0;
    let lessThanFive = 0;
    let lessThanTen = 0;
    let lessThan50 = 0;
    let lessThan100 = 0;
    let greaterThanEqual100 = 0;
    let between1_5and2_5 = 0;
    let lessThan1_1 = 0;
    let equalsOne = 0;
    for (let i = 0; i < 1000000; i++) {
        crash = game.simulateCrash();
        
        if (crash < 1.5) {lessThanOnePointFive += 1}
        else if (crash < 2) {lessThanTwo += 1}
        else if (crash < 5) {lessThanFive += 1}
        else if (crash < 10) {lessThanTen += 1}
        else if (crash < 50) {lessThan50 += 1}
        else if (crash < 100) {lessThan100 += 1}
        else {greaterThanEqual100 += 1}
        if (crash > 1.5 && crash < 2.5) {between1_5and2_5 += 1}
        if (crash < 1.1) {lessThan1_1 += 1}
        if (crash == 1.00) {equalsOne += 1}        
    }
    console.log(`1 to 1.5: ${(lessThanOnePointFive)/10000}%`)
    console.log(`1.5 to 2: ${(lessThanTwo)/10000}%`)
    console.log(`2 to 5: ${(lessThanFive)/10000}%`)
    console.log(`5 to 10: ${(lessThanTen)/10000}%`)
    console.log(`10 to 50: ${(lessThan50)/10000}%`)
    console.log(`50 to 100: ${(lessThan100)/10000}%`)
    console.log(`>100: ${(greaterThanEqual100)/10000}%`)
    console.log(`1.5<x<2.5: ${(between1_5and2_5)/10000}%`)
    console.log(`1 to 1.1: ${(lessThan1_1)/10000}%`)
    console.log(`1.00: ${(equalsOne)/10000}%`)
    console.log('-----');
}

function simulateCrashes2(game) {
    let gE1_1 = 0;
    let gE1_5 = 0;
    let gE2 = 0;
    let gE5 = 0;
    let gE10 = 0;
    let gE100 = 0;
    let gE200 = 0;
    let gE1000 = 0;

    const startTime = performance.now();
    for (let i = 0; i < 10000000; i++) {
	crash = game.simulateCrash();

	if (crash >= 1.1) {gE1_1 += 1;}
	if (crash >= 1.5) {gE1_5 += 1;}
	if (crash >= 2) {gE2 += 1;}
	if (crash >= 5) {gE5 += 1;}
	if (crash >= 10) {gE10 += 1;}
	if (crash >= 100) {gE100 += 1;}
	if (crash >= 200) {gE200 += 1;}
	if (crash >= 1000) {gE1000 += 1;}

	//console.log(`crash ${i+1}`);
    }
    const endTime = performance.now();
    const duration = endTime - startTime;
    const pD = 100000;
    
    console.log(`Time taken: ${duration.toFixed(2)} milliseconds`);
    console.log('The chances that the game crashes at or after...');
    console.log(`1.10 ..... ${gE1_1/pD}%`);
    console.log(`1.50 ..... ${gE1_5/pD}%`);
    console.log(`2.00 ..... ${gE2/pD}%`);
    console.log(`5.00 ..... ${gE5/pD}%`);
    console.log(`10.00 .... ${gE10/pD}%`);
    console.log(`100.00 ... ${gE100/pD}%`);
    console.log(`200.00 ... ${gE200/pD}%`);
    console.log(`1000.00 .. ${gE1000/pD}%`);
    console.log('based on 10 million simulated crashes.');
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new CrashBettingGame();

    //simulateCrashes2(game);
    
    document.getElementById('startGame').addEventListener('click', () => {
        const betAmount = parseFloat(document.getElementById('bet').value);
        if (isNaN(betAmount) || betAmount <= 0) {
            alert("Please enter a valid bet amount.");
            return;
        }

        game.startGame(betAmount);
        document.getElementById('balance').textContent = game.balance.toFixed(2);
    });

    document.getElementById('cashoutButton').addEventListener('click', () => {
        const cashoutMultiplier = game.currentMultiplier;
        if (isNaN(cashoutMultiplier) || cashoutMultiplier < 1.00) {
            return;
        }

        game.cashOut(cashoutMultiplier);
        document.getElementById('balance').textContent = game.balance.toFixed(2);
    });
});
