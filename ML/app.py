# app.py
from flask import Flask, request, jsonify
import joblib # type: ignore
import pandas as pd # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

models = joblib.load("box_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    required_fields = [
        "length", "width", "height", "weight", "quantity", "layers",
        "volume_per_item", "total_volume", "total_weight", "density"
    ]

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing one or more required input features"}), 400

    input_df = pd.DataFrame([{
        field: data[field] for field in required_fields
    }])

    try:
        pred_length = models["target_length"].predict(input_df)[0]
        pred_width = models["target_width"].predict(input_df)[0]
        pred_height = models["target_height"].predict(input_df)[0]
        pred_weight = models["target_max_weight"].predict(input_df)[0]

        result = {
            "length": round(pred_length, 2),
            "width": round(pred_width, 2),
            "height": round(pred_height, 2),
            "max_weight": round(pred_weight, 2)
        }
        return jsonify(result)
    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({"error": "Internal prediction failure"}), 500

@app.route('/')
def home():
    return "ML Box Prediction API is running ✅"

if __name__ == '__main__':
    app.run(port=5001, debug=True)
