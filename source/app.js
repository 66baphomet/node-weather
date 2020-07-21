//git test again 2
const path = require('path')//built in node module
const express = require('express')
const hbs = require('hbs')
const unirest = require('unirest')
const requestIp = require('request-ip')
let ip;
//customized js
const geocode = require('./utility/geocode.js')
const forecast = require('./utility/forecast')

const app = express()

const port = process.env.PORT || 3000

//define path fo express config
const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//set up handlebars engine and viesws location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//set up static directory to serve
app.use(express.static(publicDirectory))

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather App',
        name: 'Dipto'
    })
})

app.get('/location', (req, res)=>{

    const clientIp = requestIp.getClientIp(req)
    
    var apiCall = unirest("GET",
    "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/" + clientIp
  );
  apiCall.headers({
    "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
	"x-rapidapi-key": "eec0b3c358msh59bc2af18495d1fp104c66jsn10aa698cd664",
	"useQueryString": true
  });
  apiCall.end(function(result) {
    if (res.error) throw new Error(result.error);
    console.log(result.body);
    res.send(result.body);
  });
})



app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About',
        name: 'Dipto'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Help',
        msg: 'help message from views'
    })
})

app.get('/weather',(req, res)=>{

    if(!req.query.address){
        return res.send({
            error: 'Address must be provided.'
        })
    }

    geocode(req.query.address, (error, {lattitude, longitude, location} = {})=>{
        if(error){
            return res.send({
                error //'Valid address must be provided.  from geocode'
            })
        }

        forecast(lattitude, longitude, (error, {timezone, weather, temperature, feelslike, humidity, wind_speed} = {})=>{
            if(error){
                return res.send({
                    error
                })
            }

            res.send({
                timezone,
                location,
                address: req.query.address,
                weather,
                temperature,
                feelslike,
                humidity
            })
        })
    })
})

app.get('/products', (req, res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search item'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })

})

app.get('/help/*', (req, res)=>{
    res.render('404', {
        title: '404',
        errorMsg: 'Help article not found'
    })
})

app.get('*', (req, res)=>{
    res.render('404', {
        title: '404',
        errorMsg: 'Page not found'
    })
})

app.listen(port, ()=>{
    console.log('server is upto port ' + port)
})