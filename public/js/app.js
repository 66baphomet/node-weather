const weatherMsg = document.querySelectorAll('section p')
let weatherMsg1 = weatherMsg[0]
let weatherMsg2 = weatherMsg[1]



const fetchData = (location)=>{

    fetch('/weather?address=' + location).then((response) => {
        response.json().then(( data )=>{
            showData(data)
        })
    })

}

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')

weatherForm.addEventListener('submit', (e)=>{

    e.preventDefault()

    weatherMsg1.innerText = 'Loading...'
    weatherMsg2.innerText = ''

    let location = search.value

    fetchData(location)

})

const showData = (data)=>{

    if(!data.error){
        weatherMsg1.innerText = data.location
        weatherMsg2.innerHTML = 'Weather Conditon: ' + data.weather + '<br/>Temperature: ' + data.temperature + '<br/>Feels Like: ' + data.feelslike + '<br/>UV Index: ' + data.uvi
    }else{
        weatherMsg1.innerText = data.error
        weatherMsg2.innerText =''
    }

}
