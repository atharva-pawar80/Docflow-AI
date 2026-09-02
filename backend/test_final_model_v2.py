import pandas as pd
import joblib

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


MODEL_PATH = "backend/app/models/document_classifier_v2.joblib"
TEST_PATH = "data/classification/hard_test_documents.csv"


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load(MODEL_PATH)


# ============================================================
# LOAD HARD TEST DATA
# ============================================================

df = pd.read_csv(TEST_PATH)

X_test = df["text"]
y_test = df["label"]


print("\n========== V2 HARD TEST ==========\n")

print("Test samples:", len(df))


# ============================================================
# PREDICTIONS
# ============================================================

predictions = model.predict(X_test)


# ============================================================
# ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\nV2 Hard Test Accuracy:", accuracy)


# ============================================================
# CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions
    )
)


# ============================================================
# CONFUSION MATRIX
# ============================================================

print("Confusion Matrix:")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ============================================================
# FAILURE ANALYSIS
# ============================================================

print("\n========== FAILURE ANALYSIS ==========\n")

for i, (text, actual, predicted) in enumerate(
    zip(
        X_test,
        y_test,
        predictions
    ),
    start=1
):

    if actual != predicted:

        print(f"Document {i}")
        print(f"Actual:    {actual}")
        print(f"Predicted: {predicted}")
        print(f"Text:      {text}")
        print("-" * 60)