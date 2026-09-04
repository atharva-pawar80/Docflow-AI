import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# CONFIGURATION
# ============================================================

DATA_PATH = Path("data/processed/company_documents.csv")
MODEL_PATH = Path(
    "backend/app/models/document_classifier.joblib"
)


# ============================================================
# 1. LOAD PROCESSED DATA
# ============================================================

print("\n========== LOADING DATA ==========\n")

df = pd.read_csv(DATA_PATH)

print(f"Total documents: {len(df)}")
print(f"Columns: {df.columns.tolist()}")

X = df["text"]
y = df["label"]


print("\nClass distribution:")
print(y.value_counts())


# ============================================================
# 2. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n========== DATA SPLIT ==========\n")

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")


# ============================================================
# 3. ML PIPELINE
# ============================================================

classifier = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2)
        )
    ),
    (
        "model",
        LogisticRegression(
            max_iter=1000
        )
    )
])


# ============================================================
# 4. TRAIN MODEL
# ============================================================

print("\n========== TRAINING ==========\n")

classifier.fit(X_train, y_train)

print("✓ Model training complete")


# ============================================================
# 5. TEST SET EVALUATION
# ============================================================

y_pred = classifier.predict(X_test)

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n========== TEST RESULTS ==========\n")

print(f"Accuracy: {accuracy:.4f}")

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        y_pred
    )
)

print("Confusion Matrix:\n")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# ============================================================
# 6. CROSS-VALIDATION
# ============================================================

print("\n========== 5-FOLD CROSS-VALIDATION ==========\n")

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

cv_scores = cross_val_score(
    classifier,
    X,
    y,
    cv=cv,
    scoring="accuracy"
)

print("Fold accuracies:")

for i, score in enumerate(
    cv_scores,
    start=1
):
    print(f"Fold {i}: {score:.4f}")


print(
    f"\nMean CV Accuracy: {cv_scores.mean():.4f}"
)

print(
    f"CV Standard Deviation: {cv_scores.std():.4f}"
)


# ============================================================
# 7. SAVE MODEL
# ============================================================

MODEL_PATH.parent.mkdir(
    parents=True,
    exist_ok=True
)

joblib.dump(
    classifier,
    MODEL_PATH
)

print(
    f"\n✓ Model saved to: {MODEL_PATH}"
)

print("\n========== TRAINING COMPLETE ==========\n")