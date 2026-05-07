import pickle
import numpy as np

def load_model():
    try:
        with open('models/phishing_model.pkl', 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        print("Model not found. Please run train.py first.")
        return None

def predict_phishing(features):
    """
    Expects features in the order: url_length, num_dots, has_urgent_keywords
    """
    model = load_model()
    if model:
        prediction = model.predict(np.array(features).reshape(1, -1))
        probability = model.predict_proba(np.array(features).reshape(1, -1))[0]
        
        return {
            "is_phishing": bool(prediction[0]),
            "confidence": float(probability[1] if prediction[0] else probability[0])
        }
    return None

if __name__ == "__main__":
    # Test prediction
    test_features = [180, 6, 1] # Likely phishing
    result = predict_phishing(test_features)
    print(f"Prediction result: {result}")
