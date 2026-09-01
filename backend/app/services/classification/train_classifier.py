import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix
)

DATA_PATH = "data/classification/documents.csv"
MODEL_PATH = "backend/app/models/document_classifier.joblib"

# 1. Load dataset
df = pd.read_csv(DATA_PATH)

print("Dataset:")
print(df)


# 2. Separate input and target
X = df["text"]
y = df["label"]


# 3. Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# 4. Create ML pipeline
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


# 5. Train
classifier.fit(X_train, y_train)


# 6. Predict on unseen test data
y_pred = classifier.predict(X_test)


# 7. Evaluate
accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test,
        y_pred
    )
)



train_pred = classifier.predict(X_train)

train_accuracy = accuracy_score(
    y_train,
    train_pred
)

print("\nTraining Accuracy:", train_accuracy)
print("Testing Accuracy:", accuracy)

joblib.dump(
    classifier,
    MODEL_PATH
)

print(f"\nModel saved to: {MODEL_PATH}")