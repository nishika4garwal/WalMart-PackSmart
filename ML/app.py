from flask import Flask, request, jsonify
import joblib  # ✅ use joblib to load model
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ✅ Load model with joblib
model = joblib.load('best_box_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    weight = data.get('total_weight')
    volume = data.get('total_volume')

    input_df = pd.DataFrame([{
        'total_volume': volume,
        'total_weight': weight
    }])

    prediction = model.predict(input_df)
    print("Prediction input:", input_df)
    return jsonify({'predicted_box': int(prediction[0])})

@app.route('/')
def home():
    return "ML API is running!"

if __name__ == '__main__':
    app.run(port=5001, debug=True)
