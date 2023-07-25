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
    for (let currency in currencies) {
        const valute = {
            ...currencies[currency]
        }

        const newOption = document.createElement("option");

        newOption.value = valute.CharCode;
        newOption.text = valute.ID + ' - ' + valute.Name;
        selectorElement.appendChild(newOption);
    }

    selectorElement.addEventListener('change', (event => {
        const selectedValue = event.target.value
        addDescription(currencies[selectedValue], dates)
    }))
};

const addDescription = (valute, dates) => {
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

const localizeDate = (dateString) => {
    const date = new Date(dateString)
    return (date.toLocaleString().replaceAll('.','/'))
}

displayOption();