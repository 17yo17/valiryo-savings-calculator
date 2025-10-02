// This function runs when the page is fully loaded to prevent errors.
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Get references to the HTML elements ---
    const locationSelect = document.getElementById('location');
    const displayCurrencySelect = document.getElementById('display-currency');
    const electricityInput = document.getElementById('cost-electricity');
    const waterInput = document.getElementById('cost-water');
    
    let locations = {};
    let currencyDefinitions = {};
    let exchangeRates = {};

    // --- FETCH DATA and INITIALIZE THE CALCULATOR ---
    // Fetches both the static location data and the dynamic currency data.
    Promise.all([
        fetch('locations.json').then(response => response.json()),
        fetch('currencies.json').then(response => response.json())
    ])
    .then(([locationsData, currenciesData]) => {
        locations = locationsData;
        currencyDefinitions = currenciesData.definitions;
        exchangeRates = currenciesData.exchangeRates;

        // --- DYNAMICALLY POPULATE DROPDOWNS ---
        for (const locationId in locations) {
            const option = document.createElement('option');
            option.value = locationId;
            option.textContent = locations[locationId].name;
            locationSelect.appendChild(option);
        }

        // Populate the 'Display Savings In' dropdown
        for (const currencyId in currencyDefinitions) {
            const option = document.createElement('option');
            option.value = currencyId;
            const currencyInfo = currencyDefinitions[currencyId];
            option.textContent = `${currencyInfo.name} (${currencyInfo.symbol})`;
            displayCurrencySelect.appendChild(option);
        }
        
        // --- EVENT HANDLERS ---
        locationSelect.addEventListener('change', () => updateInputsForLocation(locationSelect.value));
        
        // Set the initial state of the calculator and run the first calculation
        updateInputsForLocation("custom");
    })
    .catch(error => {
        console.error('Error during initialization:', error);
        document.getElementById('valiryo-calculator').innerHTML = `<h2>Error Loading Data</h2><p>Could not load required configuration files. Please ensure locations.json and currencies.json are available.</p>`;
    });

    function updateInputsForLocation(locationId) {
        if (locations[locationId]) {
            const locationData = locations[locationId];
            electricityInput.value = locationData.elec;
            waterInput.value = locationData.water;
            calculateSavings();
        }
    }

    function calculateSavings() {
        // --- Get user inputs ---
        const dailyUses = parseFloat(document.getElementById('daily-uses').value) || 0;
        const washFrequency = parseFloat(document.getElementById('wash-frequency').value) || 1;
        const costElectricity = parseFloat(electricityInput.value) || 0;
        const costWater = parseFloat(waterInput.value) || 0;
        const solarReimbursement = parseFloat(document.getElementById('solar-reimbursement').value) || 0;
        
        const selectedLocationId = locationSelect.value;
        const localCurrencyId = locations[selectedLocationId]?.currencyId || 'USD';
        const displayCurrencyId = displayCurrencySelect.value;

        // --- Constants ---
        const electricityPerTowel = 6.126 / 6;
        const waterPerTowel = 3.52;
        const detergentPerTowel = 0.28 / 6;
        const softenerPerTowel = 0.12 / 6;
        const electricityValiryo = 0.1265;
        const co2PerKwh = 0.219;
        const co2PerGallon = 0.000789 / 0.264;
        const motorLifetimeUses = 225000;

        // --- Calculations in LOCAL currency ---
        const gridCostTowel = (electricityPerTowel * costElectricity) + (waterPerTowel * costWater) + detergentPerTowel + softenerPerTowel;
        const effectiveGridCostTowel = gridCostTowel / washFrequency;
        const gridCostValiryo = (electricityValiryo * costElectricity);
        const gridSavingsPerUse = effectiveGridCostTowel - gridCostValiryo;
        const electricitySavedPerUse = (electricityPerTowel - electricityValiryo) / washFrequency;
        const additionalSolarBenefit = electricitySavedPerUse * solarReimbursement;
        const totalSavingsPerUseLocal = gridSavingsPerUse + additionalSolarBenefit;
        
        // --- Convert to DISPLAY currency using live rates ---
        const localRate = exchangeRates[localCurrencyId] || 1;
        const displayRate = exchangeRates[displayCurrencyId] || 1;
        const totalSavingsPerUseDisplay = (totalSavingsPerUseLocal / localRate) * displayRate;

        const annualSavings = totalSavingsPerUseDisplay * dailyUses * 365;
        const lifetimeSavings = totalSavingsPerUseDisplay * motorLifetimeUses;
        
        const annualCo2Savings = (( (electricityPerTowel * co2PerKwh) + (waterPerTowel * co2PerGallon) ) / washFrequency - (electricityValiryo * co2PerKwh)) * dailyUses * 365;
        const lifetimeYears = (dailyUses > 0) ? (motorLifetimeUses / dailyUses) / 365 : 0;

        // --- Update the display ---
        const displaySymbol = currencyDefinitions[displayCurrencyId]?.symbol || '$';
        const numberFormatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        };

        document.getElementById('annual-savings').innerText = displaySymbol + annualSavings.toLocaleString(undefined, numberFormatOptions);
        document.getElementById('lifetime-savings').innerText = displaySymbol + lifetimeSavings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        document.getElementById('annual-co2-savings').innerText = annualCo2Savings.toLocaleString(undefined, numberFormatOptions) + ' kg';
        document.getElementById('device-lifetime').innerText = lifetimeYears.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' Years';
    }

    // --- Attach event listeners ---
    const inputs = document.querySelectorAll('#daily-uses, #wash-frequency, #cost-electricity, #cost-water, #solar-reimbursement, #display-currency');
    inputs.forEach(input => {
        input.addEventListener('input', calculateSavings);
        input.addEventListener('change', calculateSavings);
    });
});

