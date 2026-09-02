import pandas as pd
import joblib

from sklearn.model_selection import (
    train_test_split,
    cross_val_score,
    StratifiedKFold
)


from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix
)



#data sources
DATA_PATH = "data/classification/documents_v2.csv"
MODEL_PATH = "backend/app/models/document_classifier_v2.joblib"


df = pd.read_csv(DATA_PATH)

X = df["text"]
y = df["label"]

print("\n========== DATASET ==========\n")
print("Total samples:", len(df))
print("\nClass distribution:")
print(y.value_counts())

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ============================================================
# MODEL PIPELINE
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
# TRAIN
# ============================================================

classifier.fit(X_train, y_train)


# ============================================================
# TEST EVALUATION
# ============================================================

y_pred = classifier.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n========== TEST RESULTS ==========\n")

print("Testing Accuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ============================================================
# TRAINING ACCURACY
# ============================================================

train_pred = classifier.predict(X_train)

train_accuracy = accuracy_score(
    y_train,
    train_pred
)

print("\nTraining Accuracy:", train_accuracy)


# ============================================================
# CROSS VALIDATION
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


print("\nMean CV Accuracy:", cv_scores.mean())

print("Standard Deviation:", cv_scores.std())


# ============================================================
# SAVE MODEL
# ============================================================

joblib.dump(
    classifier,
    MODEL_PATH
)

print(
    f"\nModel saved to: {MODEL_PATH}"
)

