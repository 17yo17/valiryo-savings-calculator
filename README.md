Valiryo Body Dryer Savings Calculator
An interactive web-based calculator designed for Valiryo vendors and customers to estimate the financial and environmental savings of using a Valiryo Body Dryer compared to traditional towel laundering.

This tool helps demonstrate the long-term value of the product by providing personalized savings projections based on local utility costs and usage habits.

(Note: Replace placeholder.png with a screenshot of your calculator for a better visual introduction.)

🚀 Live Demo
>> View the live calculator here <<

(Action Required: Replace the link above with your actual GitHub Pages URL after deploying.)

✨ Features
Dynamic Calculations: All results update in real-time as you change the inputs.

Location-Based Presets: Automatically populates average electricity and water costs for select major cities.

Manual Cost Entry: Users can override presets and enter their exact local utility rates for a more accurate calculation.

Financial Savings: Calculates annual and total lifetime financial savings.

Environmental Impact: Estimates the annual reduction in CO₂ emissions.

Device Longevity: Shows the projected lifespan of the Valiryo motor in years based on daily usage.

Currency Selection: Supports multiple currencies (USD, EUR, GBP, JPY).

🔧 How to Use
Select Your Location: Choose a preset location from the dropdown to automatically load average utility rates, or select "Custom/Manual Entry" to input your own.

Adjust Usage:

Enter the Daily Showers to reflect how many times the dryer will be used per day.

Enter the Towel Uses Before Washing to match your current laundry habits.

Review Your Savings: The projected savings will automatically update at the bottom of the calculator.

📊 How to Update Utility Rate Data
The location-based utility data is stored in a simple, easy-to-edit file. This allows anyone to add new locations or update existing rates without touching the main application code.

In the repository, navigate to the rates.json file.

Click the pencil icon (Edit this file) in the top right.

To add a new location, add a new key-value pair following the existing JSON format. The key should be a unique identifier. For example:

"au_sydney": { "elec": 0.21, "water": 0.0025, "currency": "$" }


To update an existing rate, simply change the elec or water value for the desired location.

Click "Commit changes" at the bottom of the page. The live calculator will now use the updated data.

💻 Local Development
To run this project on your local machine for testing or development:

Clone or download this repository.

Ensure all three files (index.html, script.js, rates.json) are in the same folder.

Open the index.html file in any modern web browser.

The calculator will be fully functional locally.

📂 Project File Structure
index.html: Contains the HTML structure and layout of the calculator.

script.js: Holds all the JavaScript logic for calculations and user interactions.

rates.json: A simple database file that stores the utility costs and currency for different locations.

📈 Data Sources
The foundational data for towel vs. Valiryo energy and water consumption is based on the internal document "US Savings_Emissions- Valiryo Body Dryer.docx".

Preset utility rates for specific locations are representative averages and may vary. Users are encouraged to input their own local rates for maximum accuracy.
