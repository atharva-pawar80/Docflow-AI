import pandas as pd
import joblib

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


DATA_PATH = "data/classification/hard_test_documents.csv"
MODEL_PATH = "backend/app/models/document_classifier.joblib"


# ============================================================
# 1. LOAD UNSEEN TEST DATA
# ============================================================

df = pd.read_csv(DATA_PATH)

X_test = df["text"]
y_test = df["label"]


# ============================================================
# 2. LOAD SAVED MODEL
# ============================================================

model = joblib.load(MODEL_PATH)


# ============================================================
# 3. PREDICT
# ============================================================

predictions = model.predict(X_test)


# ============================================================
# 4. ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n========== FINAL UNSEEN TEST ==========\n")

print("Test samples:", len(X_test))

print("\nFinal Test Accuracy:", accuracy)


# ============================================================
# 5. CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions,
        labels=["invoice", "receipt", "unknown"],
        zero_division=0
    )
)


# ============================================================
# 6. CONFUSION MATRIX
# ============================================================

print("Confusion Matrix:\n")

print(
    confusion_matrix(
        y_test,
        predictions,
        labels=["invoice", "receipt", "unknown"]
    )
)


# ============================================================
# 7. INDIVIDUAL PREDICTIONS
# ============================================================

print("\n========== PREDICTIONS ==========\n")

for i, (actual, predicted) in enumerate(
    zip(y_test, predictions),
    start=1
):

    status = "CORRECT" if actual == predicted else "WRONG"

    print(f"Document {i}")
    print(f"Actual:    {actual}")
    print(f"Predicted: {predicted}")
    print(f"Status:    {status}")
    print("-" * 40)

print("\n========== FAILURE ANALYSIS ==========\n")

for i, (text, actual, predicted) in enumerate(
    zip(X_test, y_test, predictions),
    start=1
):

    if actual != predicted:

        print(f"Document {i}")
        print(f"Actual:    {actual}")
        print(f"Predicted: {predicted}")
        print(f"Text:      {text}")
        print("-" * 60)