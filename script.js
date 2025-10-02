// This function runs when the page is fully loaded to prevent errors.
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Get references to the HTML elements ---
    const locationSelect = document.getElementById('location');
    const currencySelect = document.getElementById('currency');
    const electricityInput = document.getElementById('cost-electricity');
    const waterInput = document.getElementById('cost-water');
    let locationRates = {}; // This will hold our data from rates.json

    // --- FETCH DATA and INITIALIZE THE CALCULATOR ---
    fetch('rates.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            locationRates = data;

            // --- DYNAMICALLY POPULATE DROPDOWNS ---
            const currencies = new Set();
            for (const locationId in locationRates) {
                // Populate location dropdown
                const option = document.createElement('option');
                option.value = locationId;
                option.textContent = locationRates[locationId].name;
                locationSelect.appendChild(option);
                
                // Collect all unique currencies
                currencies.add(locationRates[locationId].currency);
            }

            // Populate currency dropdown
            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency; 
                currencySelect.appendChild(option);
            });
            
            // --- EVENT HANDLER for location changes ---
            locationSelect.addEventListener('change', function() {
                const selectedLocation = this.value;
                if (locationRates[selectedLocation]) {
                    const rates = locationRates[selectedLocation];
                    electricityInput.value = rates.elec;
                    waterInput.value = rates.water;
                    currencySelect.value = rates.currency;
                    calculateSavings(); // Recalculate after updating values
                }
            });

            // Set the initial state when the page loads
            locationSelect.value = "custom";
            electricityInput.value = locationRates.custom.elec;
            waterInput.value = locationRates.custom.water;
            currencySelect.value = locationRates.custom.currency;
            
            // Run the initial calculation
            calculateSavings();
        })
        .catch(error => {
            console.error('Error fetching or parsing rates.json:', error);
            const calculatorDiv = document.getElementById('valiryo-calculator');
            calculatorDiv.innerHTML = `
                <h2 style="color: #D8000C;">Error Loading Data</h2>
                <p style="text-align: center; background-color: #FFBABA; padding: 10px; border-radius: 6px;">
                    Could not load 'rates.json'. Please ensure the file is in the same folder as your HTML and that you are running this page from a local web server.
                </p>`;
        });

    function calculateSavings() {
        // --- Get user inputs and provide default values ---
        const dailyUses = parseFloat(document.getElementById('daily-uses').value) || 0;
        const washFrequency = parseFloat(document.getElementById('wash-frequency').value) || 1;
        const costElectricity = parseFloat(electricityInput.value) || 0;
        const costWater = parseFloat(waterInput.value) || 0;
        const currencySymbol = currencySelect.value;

        // --- Constants based on the Valiryo document ---
        const electricityPerTowel = 6.126 / 6;
        const waterPerTowel = 3.52;
        const detergentPerTowel = 0.28 / 6;
        const softenerPerTowel = 0.12 / 6;
        const electricityValiryo = 0.1265;
        const co2PerKwh = 0.219;
        const co2PerGallon = 0.000789 / 0.264;
        const motorLifetimeUses = 225000;

        // --- Calculations ---
        const singleTowelCycleCost = (electricityPerTowel * costElectricity) + (waterPerTowel * costWater) + detergentPerTowel + softenerPerTowel;
        const effectiveTowelCost = singleTowelCycleCost / washFrequency;
        const valiryoCost = electricityValiryo * costElectricity;
        const savingsPerUse = effectiveTowelCost - valiryoCost;

        const annualSavings = savingsPerUse * dailyUses * 365;
        const lifetimeSavings = savingsPerUse * motorLifetimeUses;

        const co2TowelCycle = (electricityPerTowel * co2PerKwh) + (waterPerTowel * co2PerGallon);
        const effectiveCo2Towel = co2TowelCycle / washFrequency;
        const co2Valiryo = electricityValiryo * co2PerKwh;
        const annualCo2Savings = (effectiveCo2Towel - co2Valiryo) * dailyUses * 365;
        
        const lifetimeYears = (dailyUses > 0) ? (motorLifetimeUses / dailyUses) / 365 : 0;

        // --- Update the display ---
        document.getElementById('annual-savings').innerText = currencySymbol + annualSavings.toFixed(2);
        document.getElementById('lifetime-savings').innerText = currencySymbol + lifetimeSavings.toFixed(2);
        document.getElementById('annual-co2-savings').innerText = annualCo2Savings.toFixed(2) + ' kg';
        document.getElementById('device-lifetime').innerText = lifetimeYears.toFixed(0) + ' Years';
    }

    // --- Attach event listeners to all inputs to recalculate on any change ---
    const inputs = document.querySelectorAll('#daily-uses, #wash-frequency, #cost-electricity, #cost-water, #currency');
    inputs.forEach(input => {
        input.addEventListener('input', calculateSavings);
        input.addEventListener('change', calculateSavings);
    });
});

