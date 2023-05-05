const baseCurrency = document.querySelector("#base-currency");
const amountValue = document.querySelector("#amount");
const targetCurrency = document.querySelector("#target-currency");
const convertedAmount = document.querySelector("#converted-amount");
const historicalResults = document.querySelector("#historical-rates-container");
const historicalButton = document.querySelector("#historical-rates");


let myHeaders = new Headers();
myHeaders.append("apiKey", "vMZCkTDY8IB7CyK9q2XpwvudptafDQFQ");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

//Fetch
fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    const baseCurrencyList = document.querySelector("#base-currency");
    const targetCurrencyList = document.querySelector("#target-currency");
    for (let symbol in data.symbols) {
      const option = document.createElement("option");
      option.value = symbol;
      option.text = symbol;
      baseCurrencyList.appendChild(option);
      const targetOption = option.cloneNode(true);
      targetCurrencyList.appendChild(targetOption);
    }
  })
  .catch((error) => console.log("error", error));

function convert() {
  const from = baseCurrency.value;
  const to = targetCurrency.value;
  const amount = amountValue.value;

  fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      const result = data.result;
      convertedAmount.textContent = `${result.toFixed(2)} ${
        targetCurrency.value
      }`;
      console.log(result);
    })
    .catch((error) => {
      console.log("error", error);
      alert("Error: Amount must be a number value greater than zero.");
    });
}

[baseCurrency, amountValue, targetCurrency].forEach((input) => {
  input.addEventListener("change", convert);
});

amountValue.addEventListener('input', () => {
  const amount = amountValue.value;
  if (isNaN(amount) || amount < 0) {
    amountValue.value = '';
  }
});

//Fetch Historical Exchange Rates

historicalButton.addEventListener("click", () => {
  const baseCurrency = document.querySelector("#base-currency").value;
  const targetCurrency = document.querySelector("#target-currency").value;
  const date = "2023-01-01";

  fetch(
    `https://api.apilayer.com/exchangerates_data/${date}?symbols=${targetCurrency}&base=${baseCurrency}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      let rates = data.rates;
      let rate = 0;
      for (let currency in rates) {
        if (currency === targetCurrency) {
          rate = rates[currency].toFixed(2);
          break;
        }
      }
      historicalResults.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${rate} ${targetCurrency}`;
    })
    .catch((error) => console.log("error", error));
});