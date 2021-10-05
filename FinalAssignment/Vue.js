//Firebase

// Import the functions you need from the SDKs you need
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
      
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyB3LwXQNGNhGkLYh2VoIwVC34Jwf1sWGvQ",
            authDomain: "weather-1st-project.firebaseapp.com",
            databaseURL: "https://weather-1st-project-default-rtdb.firebaseio.com",
            projectId: "weather-1st-project",
            storageBucket: "weather-1st-project.appspot.com",
            messagingSenderId: "1092620364426",
            appId: "1:1092620364426:web:27b22eae506f8f8f325b73"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const rootref = database.ref("users");






//Date,Day Rendering
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
let arr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 let arr1=[
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];






var icon = document.querySelector("body > div > div.container > div.leftbox > div.down > i");
var icon1=document.querySelector('body > div.container > div.rightbox > div.nextdays > ul > li:nth-child(1) > i');

let climatevalue="";
const weathermap =new Map([["Clouds",'cloud'],["Mist",'cloud-rain'],["Sunny",'sun'],["Clear",'sun'],["Haze",'cloud-meatball'],["Smoke",'smog'],["Wind",'wind'],["Rain",'cloud-showers-heavy'],['Drizzle','cloud-rain'],['Thunderstorm','cloud-showers-heavy']]);

var lochistor="";
var histor = "";

let app=Vue.createApp({
    data:function(){
        return{
        Today:arr1[today.getDay()],
        DateToday:dd + " " + arr[parseInt(mm)-1]+" "+yyyy,
        Locations:"Mumbai,IN",
        temp1:"29",
        climate1:"Sunny",
        ppt:0,
        humid:34,
        wind:0,
        Day1:arr1[(today.getDay()+1)%7].slice(0,3),
        Day2:arr1[(today.getDay()+2)%7].slice(0,3),
        Day3:arr1[(today.getDay()+3)%7].slice(0,3),
        City:"Mumbai",
        }

    },
    methods:{
        CityWeather(){
            console.log(this.City);
            fetch('https://api.openweathermap.org/data/2.5/weather?q='+this.City+'&appid=4d5af29a5f09853516973cfb67ae85af').then(response=>response.json())
            .then(data =>
       {var namevalue = data['name'];
        var tempvalue =data['main']['temp'];
        var country = data['sys']['country'];
        climatevalue= data['weather'][0]['main'];
        var pptvalue=data['clouds']['all'];
        var humidvalue=data['main']['humidity'];
        var windvalue=data['wind']['speed'];
        this.Locations=namevalue + "," + country;
        this.temp1=(Math.round(tempvalue-273));
        this.climate1=climatevalue;
        this.ppt=pptvalue;
        this.humid=humidvalue;
        this.wind=windvalue;
        histor=histor+this.Locations.split(",")[0]+" ";
        console.log(histor);
        console.log(weathermap.get(climatevalue));
        document.querySelector("body > div > div.container > div.leftbox > div.down > i").setAttribute("class","fas fa-"+weathermap.get(climatevalue)+" fa-4x");
        document.querySelector("body > div > div.container > div.rightbox > div.nextdays > ul > li:nth-child(1) > i").setAttribute("class",`fas fa-${weathermap.get(climatevalue)} fa-2x`);}).catch(err => {alert('Wrong city name!')});
        
        },
        LocationWeather(){
            
            if(!navigator.geolocation) {
                alert('Geolocation is not supported by your browser');
            } 
            else {
                alert('Locating…');
                navigator.geolocation.getCurrentPosition(this.getweather, this.error);
            }
        },
        getweather(position){
                const latitude=position.coords.latitude;
                const longitude=position.coords.longitude;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4d5af29a5f09853516973cfb67ae85af`).then(response=>response.json())
                .then(data=>
                    {
                        var namevalue = data['name'];
                        var tempvalue =data['main']['temp'];
                        var country = data['sys']['country'];
                        var climatevalue= data['weather'][0]['main'];
                        var pptvalue=data['clouds']['all'];
                        var humidvalue=data['main']['humidity'];
                        var windvalue=data['wind']['speed'];
                        this.Locations=namevalue + "," + country;
                        this.temp1=(Math.round(tempvalue-273));
                        this.climate1=climatevalue;
                        this.ppt=pptvalue;
                        this.humid=humidvalue;
                        this.wind=windvalue;
                        console.log(this.Locations);
                        lochistor=lochistor+this.Locations.split(",")[0]+" ";
                        console.log(lochistor);
                        document.querySelector("body > div > div.container > div.leftbox > div.down > i").setAttribute("class","fas fa-"+weathermap.get(climatevalue)+" fa-4x");
                        document.querySelector("body > div > div.container > div.rightbox > div.nextdays > ul > li:nth-child(1) > i").setAttribute("class",`fas fa-${weathermap.get(climatevalue)} fa-2x`);
                    }
    
                )
            },
        error(){
            alert("Location cannot be accessed.")
        },
        getHistory(){
            rootref.once("value",function(snapshot){
                if(users==" "){alert("Please Sign-up thorugh your BITS google account.")}
                else{
                    var present=0;
                    var data =snapshot.val();
                    for(let i in data){
                        if(data[i]["Name"]==users){
                            present=1;
                            console.log(data[i]["CityHis"],data[i]["LocHis"]);
                            userref=database.ref("users/"+users);
                            userref.set({
                                Name:users,
                                CityHis:data[i]["CityHis"]+histor,
                                LocHis:data[i]["LocHis"]+lochistor,
                            });
                            document.querySelector(".cityhistory").innerHTML=data[i]["CityHis"]+histor;
                            document.querySelector(".locationhistory").innerHTML=data[i]["LocHis"]+lochistor;
                            histor=lochistor="";
                            
                            break;
                        }
                    }
                    if(present==0){
                        database.ref("users/"+users).set({
                            Name:users,
                            CityHis:histor,
                            LocHis:lochistor,
                        });
                    }
                }
            })
        }
    }
})


app.mount(".Main");



















document.querySelector(".Todays").innerHTML=document.querySelector(".Todays").innerHTML.slice(0,3);



let users=" ";
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('Name: ' + profile.getName());
    document.getElementById("username").innerHTML="Hi, "+profile.getName()+" !";
    users=profile.getName();
}

document.querySelector(".but").addEventListener('click',function(){
    var x=document.querySelector(".histories");
})





let autocomplete;
function initAutocomplete(){
    autocomplete=new google.maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        {
            types:['(cities)'],
            fields:['name']
        }
    );
    autocomplete.addEventListener('place_changed',onPlaceChanged);
}
function onPlaceChanged(){
    var place=autocomplete.getPlace();
    document.getElementById("details")=place.name;

}