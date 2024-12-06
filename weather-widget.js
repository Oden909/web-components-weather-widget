class WeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
        this.fetchWeatherData();
    }
    async fetchWeatherData() {
        const latitude = 55.7558;
        const longitude = 37.6173;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.updateWeather(data);
        } 
        catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    updateWeather(data) {
        const temperature = data.hourly.temperature_2m[0];
        const humidity = data.hourly.relative_humidity_2m[0];
        const precipitationProbability = data.hourly.precipitation_probability[0];
        const precipitation = data.hourly.precipitation[0];
        const tempElement = this.shadowRoot.querySelector('.temp');
        const humidityElement = this.shadowRoot.querySelector('.humidity');
        const precipitationElement = this.shadowRoot.querySelector('.precipitation');
        const conditionElement = this.shadowRoot.querySelector('.condition');
        const emojiElement = this.shadowRoot.querySelector('.emoji');
        const commentElement = this.shadowRoot.querySelector('.comment');
        tempElement.textContent = `${temperature}°C`;
        humidityElement.textContent = `Влажность: ${humidity}%`;
        precipitationElement.textContent = `Вероятность осадков: ${precipitationProbability}%`;
        conditionElement.textContent = `Осадки: ${precipitation} мм`;
        if (temperature <= 0) {
            emojiElement.textContent = "❄️";
            commentElement.textContent = "Холодно! Одевайтесь теплее!";
        } 
        else if (precipitationProbability > 50) {
            emojiElement.textContent = "🌧️";
            commentElement.textContent = "Дождь, возьмите зонт!";
        } 
        else if (temperature > 30) {
            emojiElement.textContent = "☀️";
            commentElement.textContent = "Жарко, пейте больше воды!";
        } 
        else {
            emojiElement.textContent = "🌤️";
            commentElement.textContent = "Погода хорошая, наслаждайтесь днем!";
        }
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${this._getStyles()}
            </style>
            <div class="weather-widget">
                <h2>Погода в Москве</h2>
                <div class="emoji"></div>
                <div class="temp">Загрузка...</div>
                <div class="humidity">Загрузка...</div>
                <div class="precipitation">Загрузка...</div>
                <div class="condition">Загрузка...</div>
                <div class="comment">Загрузка...</div>
            </div>
        `;
    }
    _getStyles() {
        return `
            :host {
                display: block;
                font-family: Arial, sans-serif;
                --bg-color: #FFFFFF;
                --text-color: #333;
                --font-size: 18px;
                --title-color: #339933;
                --accent-color: #555;
                --border-color: #339933;
                --shadow-color: #3aaa3a;
                --shadow-hover: #3aaa3a;
            }
            .weather-widget {
                background-color: var(--bg-color);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 8px var(--shadow-color);
                width: 300px;
                text-align: center;
                font-size: var(--font-size);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                margin: auto;
                display: block;
            }
            .weather-widget h2 {
                color: var(--title-color);
                font-size: 24px;
                margin-bottom: 10px;
            }
            .weather-widget .temp {
                font-size: 48px;
                font-weight: bold;
                color: var(--title-color);
            }
            .weather-widget .humidity,
            .weather-widget .precipitation,
            .weather-widget .condition {
                font-style: italic;
                margin-top: 10px;
                color: var(--accent-color);
            }
            .weather-widget .comment {
                margin-top: 20px;
                color: var(--text-color);
            }
            .weather-widget .emoji {
                font-size: 48px;
                margin: 20px;
            }
            .weather-widget::before {
                content: "🌡️";
                font-size: 36px;
            }
            .weather-widget:hover {
                box-shadow: 0 0 20px var(--shadow-hover);
                transition: all 0.3s ease;
            }
        `;
    }
}
customElements.define('weather-widget', WeatherWidget);
