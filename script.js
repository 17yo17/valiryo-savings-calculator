// This function runs when the page is fully loaded to prevent errors.
document.addEventListener('DOMContentLoaded', function() {

    // --- LOCATION DATA: Add more locations and their average rates here ---
    // Note: Rates are estimates for demonstration and can be updated with more precise data.
    const locationRates = {
        "custom":      { elec: 0.27, water: 0.0006, currency: "$" },
        "us_sandiego": { elec: 0.47, water: 0.0070, currency: "$" },
        "us_newyork":  { elec: 0.24, water: 0.0040, currency: "$" },
        "uk_london":   { elec: 0.38, water: 0.0090, currency: "£" },
        "jp_tokyo":    { elec: 0.20, water: 0.0020, currency: "¥" },
        "es_madrid":   { elec: 0.25, water: 0.0020, currency: "€" }
    };

    // --- Get references to the HTML elements we need to interact with ---
    const locationSelect = document.getElementById('location');
    const currencySelect = document.getElementById('currency');
    const electricityInput = document.getElementById('cost-electricity');
    const waterInput = document.getElementById('cost-water');

    // --- EVENT HANDLER: Update costs when a new location is selected ---
    locationSelect.addEventListener('change', function() {
        const selectedLocation = this.value;
        if (locationRates[selectedLocation]) {
            const rates = locationRates[selectedLocation];
            electricityInput.value = rates.elec;
            waterInput.value = rates.water;
            currencySelect.value = rates.currency;
            // It's important to recalculate after the values are updated.
            calculateSavings();
        }
    });

    function calculateSavings() {
        // --- Get user inputs and provide default values to prevent errors ---
        const dailyUses = parseFloat(document.getElementById('daily-uses').value) || 0;
        const washFrequency = parseFloat(document.getElementById('wash-frequency').value) || 1;
        const costElectricity = parseFloat(electricityInput.value) || 0;
        const costWater = parseFloat(waterInput.value) || 0;
        const currencySymbol = currencySelect.value;

        // --- Constants based on the Valiryo document ---
        const electricityPerTowel = 6.126 / 6;    // 1.021 kWh
        const waterPerTowel = 3.52;
        const detergentPerTowel = 0.28 / 6;       // ~$0.047
        const softenerPerTowel = 0.12 / 6;        // ~$0.019
        const electricityValiryo = 0.1265;
        const co2PerKwh = 0.219;
        const co2PerGallon = 0.000789 / 0.264;    // ~0.003
        const motorLifetimeUses = 225000;

        // --- Perform all the calculations ---
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

        // --- Update the display with the calculated results ---
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
    
    // --- Set the initial state when the page loads ---
    // This ensures the default 'Custom' values are loaded and calculated.
    locationSelect.value = "custom";
    electricityInput.value = "0.27";
    waterInput.value = "0.0006";
    currencySelect.value = "$";

    // Run the initial calculation on page load
    calculateSavings();
});

