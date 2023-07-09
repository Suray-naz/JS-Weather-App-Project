//DOM
const form=document.querySelector(".top-banner form")
const input=document.querySelector(".top-banner form input")
const msgSpan=document.querySelector(".top-banner .msg")
const list=document.querySelector(".cities");


//variable

let units="metric";        //imperial (f), bos birakirsak default kelvin degeri alir
let lang="en";             // almanca icin de kullanilacak
let url;                   // Api istegi icin adres
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

let cities=[];

// const apiKey="54fcdc1aad8b0530ca72b7a4521f71cf"

// localStorage.setItem("apiKey","54fcdc1aad8b0530ca72b7a4521f71cf") // sifresiz gönderme

//  localStorage.setItem("apiKey",EncryptStringAES("54fcdc1aad8b0530ca72b7a4521f71cf"));

const apiKey=DecryptStringAES(localStorage.getItem("apiKey"))


//! Language

const clearAllButton=document.getElementById("clear-all");
const langButton=document.getElementById("lang");
const searchEl=document.getElementById("search");






//! Location

const locate=document.getElementById("locate");

locate.addEventListener("click",()=>{
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
    
    url=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&lang=${lang}`

    getWeatherDataFromApi();
});
});



// form submit
form.addEventListener("submit", (e)=>{
    e.preventDefault();


    if(input.value){
    
    const cityName=input.value
    // console.log(cityName);

    url=`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`

    getWeatherDataFromApi();
}


    form.reset()     //form icindaki tüm inputlari sifirlar
    
})

//!language button

langButton.addEventListener("click",(e)=>{
    if (e.target.id === "de"){
        lang="de"
        input.setAttribute("placeholder", "🔍 Suche nach einer Stadt");
        searchEl.innerHTML="SUCHE";
        clearAllButton.innerHTML="Alles Löschen"

    }else if (e.target.id == "en"){
        lang="en"
        input.setAttribute("placeholder", "🔍 Search for a city");
        searchEl.innerHTML="SEARCH";
        clearAllButton.innerHTML="Clear All"

    }else if (e.target.id == "clear-all"){
        cities=[];
        list.innerHTML=""
    }
})


const getWeatherDataFromApi=async() =>{
    try {
        const response = await axios(url)//.then((response)=> response.json());     //axios ile istek atma
        //console.log(response);

        // data destructure
        //const {main, name, weather, sys} =response     // fetch ile
        const {main, name, weather, sys} =response.data     // axios ile
        //console.log(weather[0].icon);          //gelen veriyi control etmek

        const iconUrl=`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`

        if (cities.indexOf(name) == -1) {

            cities.unshift(name)                    // arrayin basina ekler  push() sonuna ekler

            const resultData = document.createElement("li");
            resultData.classList.add("city");
            resultData.setAttribute("id",`${name}`);
            resultData.innerHTML = `
            <h2 class="city-name" >
            <div>
              <span>${name}</span>
              <sup>${sys.country}</sup> 
            </div>  
              <button type='button' class='single-clear-btn'>X</button>
          </h2>
          <div class="city-temp">${Math.round(
            main.temp
          )}<sup>°C</sup></div>
          <figure>
               <img class="city-icon" src="${iconUrl}">
              <figcaption>${weather[0].description}</figcaption>
          </figure>`
    
        //   list.append(resultData);      //sona ekler  -  push mantikli
          list.prepend(resultData)         //öne ekler   -  unshift mantikli


          const singleClearButton=document.querySelectorAll(".single-clear-btn")
          //console.log(singleClearButton);

          singleClearButton.forEach((button)=>{
            button.addEventListener("click",(e)=>{

                delete cities[cities.indexOf(e.target.closest(".city").id)]
                e.target.closest(".city").remove();
            })
          })


            
        } else {
            if (lang == "de") {
                msgSpan.innerText = `Sie kennen das Wetter für die ${name} bereits. Bitte suchen Sie nach einer anderen Stadt 😉`;
              } else {
                msgSpan.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
              }
          

           setInterval(()=>{
            msgSpan.innerText="";

           },8000)
        }
        


    } catch (error) {
        if (lang == "de") {
            msgSpan.innerText = `Stadt nicht gefunden!`;
          } else {
            msgSpan.innerText = "City not found!";
          }

        setInterval(()=>{

           },8000)
        
        
    }
};