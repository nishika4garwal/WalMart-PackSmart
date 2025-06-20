from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend/backend can call this

# Load your trained model
with open('best_box_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    weight = data.get('weight')
    volume = data.get('volume')

    # Example input for model: [[weight, volume]]
    prediction = model.predict([[weight, volume]])
    return jsonify({'predicted_box': prediction[0]})

# Optional route to check server
@app.route('/')
def home():
    return "ML API is running!"

if __name__ == '__main__':
    app.run(port=5001, debug=True)
