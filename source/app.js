const path = require('path')//built in node module
const express = require('express')
const hbs = require('hbs')
//customized js
const geocode = require('./utility/geocode.js')
const forecast = require('./utility/forecast')

const app = express()

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

        forecast(lattitude, longitude, (error, {timezone, weather, temperature, feelslike} = {})=>{
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
                feelslike

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

app.listen(3000, ()=>{
    console.log('server is upto port 3000')
})