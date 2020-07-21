const request = require('request')

const geocode = (address, callBack) =>{
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?access_token=pk.eyJ1IjoiNjZiYXBob21ldCIsImEiOiJja2M0aXJmdmEwODVjMnN1dGdseW8yajNlIn0.6hyicMBwl0fAxaPp1_F1kA&limit=1'

    request({url, json: true}, (error, {body} = {})=>{

        if(error){
            callBack('Unable to connect to location services!', undefined)
        }
        else if(body.message)
        {
            callBack('Unable to find location. Try another search!', undefined)
        }
        else if(body.features.length === 0){
            callBack('Unable to find location. Try another search!', undefined)
        }
        else{
            callBack(undefined, {
                lattitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }

    })
}

module.exports = geocode