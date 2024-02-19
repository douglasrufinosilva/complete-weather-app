const key = '87a09bd0e3e597ed79ce85572e48221d'
const btnLocation = document.querySelector('.btnLocation')
const todayInfo = document.querySelector('.todayInfo')
const todayWeatherIcon = document.querySelector('.todayWeather i')
const weatherTemp = document.querySelector('.weatherTemp')
const daysList = document.querySelector('.daysList')
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
}



function fetchWeatherData(location) {
    const apiData = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${key}&units=metric`

    const weatherTranslations = {
        'clear sky': 'céu limpo',
        'few clouds': 'poucas nuvens',
        'scattered clouds': 'nuvens dispersas',
        'broken clouds': 'nuvens quebradas',
        'shower rain': 'chuva passageira',
        'light rain': 'chuva leve',
        'rain': 'chuva',
        'thunderstorm': 'trovoada',
        'snow': 'neve',
        'mist': 'névoa'
    }
    
    function translateWeather(description) {
        return weatherTranslations[description] || description;
    }

    fetch(apiData)
    .then(response => response.json())
    .then
    (data => {
        const todayWeather = translateWeather(data.list[0].weather[0].description)

        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`

        const todayWeatherIconCode = data.list[0].weather[0].icon

        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
        
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric'})

        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`

        weatherTemp.textContent = todayTemperature

        const locationElement = document.querySelector('.todayInfo > div > span')

        locationElement.textContent = `${data.city.name}, ${data.city.country}`

        const weatherDescriptionElement = document.querySelector('.todayWeather > h3')

        weatherDescriptionElement.textContent = todayWeather

        const todayPrecipitation = `${data.list[0].pop}%`
        const todayHumidity = `${data.list[0].main.humidity}%`
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`

        const dayInfoContainer = document.querySelector('.dayInfo')
        dayInfoContainer.innerHTML = `
            <div>
                <span class="title">PRECIPITAÇÃO</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">HUMIDADE</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">VEL. DO VENTO</span>
                <span class="value">${todayWindSpeed}</span>
            </div>
        `

        const today = new Date()
        const nextDaysData = data.list.slice(1)

        const uniqueDays = new Set()
        let count = 0
        daysList.innerHTML = ''

        for(const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt)
            const dayAbbreviation = forecastDate.toLocaleDateString('pt-BR', { weekday: 'short'})
            const dayTemp = `${Math.round(dayData.main.temp)}°C`
            const iconCode = dayData.weather[0].icon

            if(!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbreviation)
                daysList.innerHTML += `
                
                <li>
                    <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                    <span>${dayAbbreviation}</span>
                    <span class="dayTemp">${dayTemp}</span>
                </li>
                `
                count++
            }

            if (count === 4) break
        }
    }).catch(error => {
        alert(`Erro ao buscar dados meteorológicos.`)
        document.querySelector('.searchInput').value = ''
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Rio de Janeiro'
    fetchWeatherData(defaultLocation)
})

btnLocation.addEventListener('click', () => {
    const location = document.querySelector('.searchInput').value
    if(!location) return

    fetchWeatherData(location)
})