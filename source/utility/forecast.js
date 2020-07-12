const request = require('request')
const forecast = (lattitude, longitude, callBack)=>{
    const url = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lattitude+'&lon='+longitude+'&%20exclude=hourly,daily&appid=0708f1686ab7d8c8604b8c8c2ba43ec4&units=metric'

    request({url, json: true}, (error, {body})=>{


        if(error){
            callBack('Unable to connect to location services!', undefined)
        }
        else if(body.message){
            callBack('Unable to find location! Try another search!', undefined)
        }
        else{
            const {current} = body
            callBack(undefined, {
                timezone: body.timezone,
                weather: current.weather[0].main,
                description: current.weather[0].description,
                temperature: current.temp,
                feelslike: current.feels_like,
                uvi: current.uvi
            })
        }

    })
}

module.exports = forecast