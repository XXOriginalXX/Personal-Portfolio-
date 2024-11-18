from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        open_price = data['Open']
        high_price = data['High']
        low_price = data['Low']
        volume = data['Volume']
        turnover = data['Turnover']
        
        predicted_price = model.predict([open_price, high_price, low_price, volume, turnover])
        
        return jsonify({"Predicted Close Price": predicted_price[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
