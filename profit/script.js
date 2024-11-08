class CoinProfitCalculator {
    constructor(initialCoins, initialPrice) {
        this.initialCoins = initialCoins;
        this.initialPrice = initialPrice;
    }

    calculateEqualUsdPerSale(salePrices) {
        const totalInvestment = this.initialCoins * this.initialPrice;
        const targetAmountPerSale = totalInvestment / salePrices.length;

        const coinsToSellAtEachPrice = salePrices.map(price => targetAmountPerSale / price);
        const totalCoinsSold = coinsToSellAtEachPrice.reduce((acc, val) => acc + val, 0);
        const scalingFactor = this.initialCoins / totalCoinsSold;

        return coinsToSellAtEachPrice.map(coins => coins * scalingFactor);
    }

    calculateProfit(salePrices, coinsToSellAtEachPrice) {
        let totalProfit = 0;
        let totalReceived = 0;

        salePrices.forEach((price, index) => {
            const coinsSold = coinsToSellAtEachPrice[index];
            const amountReceived = coinsSold * price;
            totalReceived += amountReceived;

            const initialCost = coinsSold * this.initialPrice;
            const profit = amountReceived - initialCost;
            totalProfit += profit;
        });

        return { totalProfit, totalReceived };
    }
}

document.getElementById("calculate-button").addEventListener("click", () => {
    const initialCoins = parseFloat(document.getElementById("initial-coins").value);
    const initialPrice = parseFloat(document.getElementById("initial-price").value);
    const salePrices = document.getElementById("sale-prices").value.split(",").map(price => parseFloat(price.trim()));

    if (isNaN(initialCoins) || isNaN(initialPrice) || salePrices.some(isNaN)) {
        alert("Please enter valid numbers.");
        return;
    }

    const calculator = new CoinProfitCalculator(initialCoins, initialPrice);
    const coinsToSellAtEachPrice = calculator.calculateEqualUsdPerSale(salePrices);
    const { totalProfit, totalReceived } = calculator.calculateProfit(salePrices, coinsToSellAtEachPrice);
    const targetAmountPerSale = (initialCoins * initialPrice) / salePrices.length;

    document.getElementById("total-amount-per-sale").textContent = `Target Amount per Sale: $${targetAmountPerSale.toFixed(2)}`;
    document.getElementById("total-received").textContent = `Total Amount Received: $${totalReceived.toFixed(2)}`;
    document.getElementById("total-profit").textContent = `Total Profit: $${totalProfit.toFixed(2)}`;

    const coinsList = document.getElementById("coins-per-sale-list");
    coinsList.innerHTML = "";
    salePrices.forEach((price, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `At $${price.toFixed(2)} per coin: ${coinsToSellAtEachPrice[index].toFixed(2)} coins`;
        coinsList.appendChild(listItem);
    });

    document.querySelector(".results").style.display = "block";
});
