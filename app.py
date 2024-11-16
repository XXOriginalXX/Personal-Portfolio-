from flask import Flask, request, render_template, jsonify
import pandas as pd
import joblib

# Load the trained model
model = joblib.load('adaniprediction.pkl')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # A simple HTML form for user input

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from the form
        open_price = float(request.form['Open'])
        high_price = float(request.form['High'])
        low_price = float(request.form['Low'])
        volume = int(request.form['Volume'])
        turnover = float(request.form['Turnover'])

        # Prepare input data as a DataFrame
        input_data = {
            'Open': [open_price],
            'High': [high_price],
            'Low': [low_price],
            'Volume': [volume],
            'Turnover': [turnover]
        }
        input_df = pd.DataFrame(input_data)

        # Predict using the model
        predicted_close = model.predict(input_df)
        result = f"Predicted Close Price: {predicted_close[0]:.2f}"
    except Exception as e:
        result = f"Error: {str(e)}"
    
    return render_template('result.html', result=result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
