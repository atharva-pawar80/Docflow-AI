import joblib


MODEL_PATH = "backend/app/models/document_classifier.joblib"


classifier = joblib.load(MODEL_PATH)


def predict_document(text: str) -> str:
    prediction = classifier.predict([text])

    return prediction[0]