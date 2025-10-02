# Valiryo Body Dryer Savings Calculator

An **interactive web-based calculator** designed for Valiryo vendors and customers to estimate the **financial and environmental savings** of using a Valiryo Body Dryer compared to traditional towel laundering.  

This tool demonstrates the long-term value of the product by providing **personalized savings projections** based on local utility costs and usage habits.  

> ⚠️ **Note:** Replace `placeholder.png` with a screenshot of your calculator for a better visual introduction.

---

## 🚀 Live Demo

[View the live calculator here](#https://17yo17.github.io/valiryo-savings-calculator/)

> ⚠️ **Action Required:** Replace the link above with your actual GitHub Pages URL after deploying.

---

## ✨ Features

- **Dynamic Calculations:** Results update in real-time as inputs change.  
- **Location-Based Presets:** Auto-populates average electricity and water costs for select major cities.  
- **Manual Cost Entry:** Users can override presets with their exact local utility rates.  
- **Financial Savings:** Calculates annual and total lifetime savings.  
- **Environmental Impact:** Estimates annual reduction in CO₂ emissions.  
- **Device Longevity:** Projects the Valiryo motor lifespan in years based on daily usage.  
- **Currency Selection:** Supports multiple currencies (USD, EUR, GBP, JPY).  

---

## 🔧 How to Use

1. **Select Your Location:**  
   Choose a preset location from the dropdown to automatically load average utility rates, or select **Custom/Manual Entry** to input your own.  

2. **Adjust Usage:**  
   - **Daily Showers:** Enter the number of times the dryer will be used per day.  
   - **Towel Uses Before Washing:** Match your current laundry habits.  

3. **Review Your Savings:**  
   The projected savings automatically update at the bottom of the calculator.  

---

## 📊 Updating Utility Rate Data

Location-based utility data is stored in a **simple, easy-to-edit file**. Anyone can add new locations or update existing rates **without modifying the main code**.  

1. Navigate to the `rates.json` file in the repository.  
2. Click the **pencil icon** (Edit this file) in the top right.  
3. **Add a New Location:**  

```json
"au_sydney": { "elec": 0.21, "water": 0.0025, "currency": "$" }
