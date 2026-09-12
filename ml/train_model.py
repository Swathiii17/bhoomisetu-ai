import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Synthetic Training Dataset based on 500 Land Acquisition Projects
# Features: [approval_delay_days, legal_disputes, comp_pending_pct, rr_completion_pct, doc_issues]
X_train = np.array([
    [18, 8, 24.0, 68, 3], # High delay risk
    [5,  1, 4.0,  92, 0], # Low delay risk
    [45, 24, 52.0, 25, 6], # High delay risk
    [2,  0, 0.0, 100, 0], # Low delay risk
    [14, 5, 40.0, 40, 2], # Medium risk
    [30, 12, 60.0, 30, 5], # High risk
    [8,  2, 10.0, 85, 1], # Low risk
])

# Targets: 0 = Low Risk, 1 = Medium Risk, 2 = High Risk
y_train = np.array([2, 0, 2, 0, 1, 2, 0])

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

def predict_delay_risk_py(features):
    pred_class = clf.predict([features])[0]
    probs = clf.predict_proba([features])[0]
    
    categories = ["LOW", "MEDIUM", "HIGH"]
    return {
        "risk_category": categories[pred_class],
        "risk_score_pct": int(probs[pred_class] * 100)
    }

if __name__ == "__main__":
    sample = [18, 8, 24.0, 68, 3] # Showcase project params
    res = predict_delay_risk_py(sample)
    print("Python Random Forest Prediction Output:", res)
