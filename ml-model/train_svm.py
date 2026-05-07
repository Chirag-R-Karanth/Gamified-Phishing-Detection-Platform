from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from dataset import get_dummy_data
import time

def train():
    print("--- Training Support Vector Machine ---")
    X, y = get_dummy_data(1000)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = SVC()
    
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Training Time: {training_time:.4f} seconds")
    print(classification_report(y_test, predictions))
    
    return accuracy, training_time

if __name__ == "__main__":
    train()
