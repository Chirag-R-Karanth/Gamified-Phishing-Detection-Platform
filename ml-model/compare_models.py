import train_lr
import train_svm
import train_gb
import train_rf
import pandas as pd

def main():
    print("="*50)
    print("Starting Model Comparison...")
    print("="*50)
    
    results = []
    
    # 1. Logistic Regression
    acc_lr, time_lr = train_lr.train()
    results.append({'Model': 'Logistic Regression', 'Accuracy': acc_lr, 'Training Time (s)': time_lr})
    print("-" * 50)
    
    # 2. Support Vector Machine
    acc_svm, time_svm = train_svm.train()
    results.append({'Model': 'Support Vector Machine', 'Accuracy': acc_svm, 'Training Time (s)': time_svm})
    print("-" * 50)
    
    # 3. Gradient Boosting
    acc_gb, time_gb = train_gb.train()
    results.append({'Model': 'Gradient Boosting', 'Accuracy': acc_gb, 'Training Time (s)': time_gb})
    print("-" * 50)
    
    # 4. Random Forest
    acc_rf, time_rf = train_rf.train()
    results.append({'Model': 'Random Forest', 'Accuracy': acc_rf, 'Training Time (s)': time_rf})
    print("-" * 50)
    
    # Summary
    df_results = pd.DataFrame(results)
    df_results = df_results.sort_values(by='Accuracy', ascending=False).reset_index(drop=True)
    
    print("\n" + "="*50)
    print("COMPARISON RESULTS")
    print("="*50)
    print(df_results.to_string(index=False))
    print("="*50)

if __name__ == "__main__":
    main()
