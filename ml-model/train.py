import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

def train_model():
    print("Starting ML Model Training Pipeline...")
    
    # In a real scenario, we'd load dataset from MongoDB or a CSV
    # Mock data for demonstration
    data = {
        'url_length': [25, 150, 45, 200, 30],
        'num_dots': [2, 5, 2, 8, 1],
        'has_urgent_keywords': [0, 1, 0, 1, 0],
        'label': [0, 1, 0, 1, 0] # 0 = safe, 1 = phishing
    }
    
    df = pd.DataFrame(data)
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    
    print(f"Model trained. Accuracy on mock test set: {model.score(X_test, y_test):.2f}")
    
    # Save the model
    os.makedirs('models', exist_ok=True)
    with open('models/phishing_model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    print("Model saved to models/phishing_model.pkl")

if __name__ == "__main__":
    train_model()
