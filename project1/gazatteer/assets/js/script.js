const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelectorAll(".from select"),
toCurrency = document.querySelectorAll(".to select"),
getButton = document.querySelectorAll("form button");

for(let i=0; i< dropList.length; i++)
{
    for(currency_code in country_List){
        let selected;
        if( i == 0){
            selected = currency_code == "USD" ? "selected" : "" ;
               }else if(i == 1){
                selected = currency_code == "IND" ? "selected" : "" ;
               }
        // creating option tag with passing currency code as a text and value
       let optionTag = `<option value="${currency_code}" ${selected}>${currency-code}</option>`;
       // inserting options tag inside select tag
       dropList[i].insertAdjacentHTML("beforeend",optionTag);

    }
}
 getButton.addEventListener("click", e =>{
  e.preventDefault(); //preventing form from submitting
  getexchangeRate();
 });

 function getExchangeRate(){
    const amount = document.querySelector(".amount input");
    //if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    let amountVal = amount.value;
    if(amountVal == " " || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;

    }
    let url = `https://v6.echangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    //fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversation_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        const exchangeRateTxt = document.querySelector(".exchange-rate");
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = 118.16 NPR`;        


    })

 }



