import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


# ============================================================
# 1. LOAD DATA
# ============================================================

DATA_PATH = "data/classification/documents.csv"
MODEL_PATH = "backend/app/models/document_classifier.joblib"

df = pd.read_csv(DATA_PATH)

X = df["text"]
y = df["label"]


# ============================================================
# 2. CREATE SAME TEST SET
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ============================================================
# 3. LOAD SAVED MODEL
# ============================================================

classifier = joblib.load(MODEL_PATH)


# ============================================================
# 4. PREDICTIONS
# ============================================================

predictions = classifier.predict(X_test)
probabilities = classifier.predict_proba(X_test)


# ============================================================
# 5. DISPLAY RESULTS
# ============================================================

print("\n========== CONFIDENCE ANALYSIS ==========\n")

for i, (text, actual, predicted, probs) in enumerate(
    zip(X_test, y_test, predictions, probabilities),
    start=1
):

    confidence = max(probs)

    status = "CORRECT" if actual == predicted else "WRONG"

    print(f"Document {i}")
    print(f"Actual:      {actual}")
    print(f"Predicted:   {predicted}")
    print(f"Confidence:  {confidence:.4f}")
    print(f"Status:      {status}")

    print("Probabilities:")

    for label, probability in zip(
        classifier.classes_,
        probs
    ):
        print(f"  {label}: {probability:.4f}")

    print("-" * 50)


# ============================================================
# 6. OVERALL ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\nOverall Accuracy:", accuracy)