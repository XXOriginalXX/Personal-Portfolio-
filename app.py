from flask import Flask, request, jsonify
import joblib  # Load your machine learning model
import pandas as pd  # For data processing

app = Flask(__name__)

# Load your trained model
model = joblib.load('adaniprediction.pkl')  # Replace with your actual model filename

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get input from the frontend
    inputs = data['inputs']  # Example: [value1, value2, ...]
    # Convert inputs to a DataFrame (if needed)
    df = pd.DataFrame([inputs], columns=['feature1', 'feature2', ...])  # Replace with actual feature names
    prediction = model.predict(df)[0]  # Make prediction
    return jsonify({'prediction': prediction})  # Send prediction back

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Use port 5000 or the port Render specifies

