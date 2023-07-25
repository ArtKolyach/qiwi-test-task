const selectorElement = document.getElementById('selector');
console.log(selectorElement);

const getValues = async () => {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const data = await response.json();
    return data;
};

const displayOption = async () => {
    const options = await getValues();
    const currencies = options.Valute
    const dates = {
        currentDate: localizeDate(options.Date),
        previousDate: localizeDate(options.PreviousDate),
    }
    console.log(`Даты: ` , dates)
    console.log(`Все опции: ` ,options, currencies)
    for (let currency in currencies) {
        const valute = {
            ...currencies[currency]
        }
        console.log("Валюта: " , valute)

        const newOption = document.createElement("option");

        newOption.value = valute.CharCode;
        newOption.text = valute.ID + ' - ' + valute.Name;
        selectorElement.appendChild(newOption);
    }

    selectorElement.addEventListener('change', (event => {
        const selectedValue = event.target.value
        console.log(selectedValue)
        addDescription(currencies[selectedValue], dates)
    }))
};

const addDescription = (valute, dates) => {
    console.log(valute)
    const descriptionElement = document.getElementById('description');

    if (!valute) {
        descriptionElement.style.display = 'none'
        return
    }
    else descriptionElement.style.display = 'block'

    const titleDescription = document.getElementById('description__header');
    const currentValueDescription = document.getElementById('description__currentValue');
    const previousValueDescription = document.getElementById('description__previousValue');

    titleDescription.textContent = `${valute.ID} - ${valute.Name} (${valute.CharCode})`
    currentValueDescription.textContent = `${dates.currentDate} - ${valute.Value}`
    previousValueDescription.textContent = `${dates.previousDate} - ${valute.Previous}`


}

const formatDate = (date) => {
    const resultDate = addZero(date.getDate())
    const resultMonth = addZero(date.getMonth() + 1)
    const resultYear = date.getFullYear()
    const resultHours = addZero(date.getHours())
    const resultMinutes = addZero(date.getMinutes())
    const resultSeconds = addZero(date.getSeconds())
    return `${resultDate}/${resultMonth}/${resultYear}, ${resultHours}:${resultMinutes}:${resultSeconds}`
}

const addZero = (number) => {
    if (number < 10) return '0' + number
    else return number
}

const localizeDate = (dateString) => {
    const date = new Date(dateString)
    console.log(date.toLocaleString())
    return (date.toLocaleString().replaceAll('.','/'))
}

displayOption();