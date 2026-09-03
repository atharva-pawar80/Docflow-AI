import joblib


MODEL_PATH = "backend/app/models/document_classifier_v2.joblib"


classifier = joblib.load(MODEL_PATH)


def predict_document(text: str) -> dict:

    # Get prediction
    prediction = classifier.predict([text])[0]

    # Get probability for each class
    probabilities = classifier.predict_proba([text])[0]

    # Get class names
    classes = classifier.classes_

    # Create probability dictionary
    probability_dict = {
        class_name: round(float(probability), 4)
        for class_name, probability in zip(classes, probabilities)
    }

    # Get confidence of predicted class
    confidence = max(probabilities)

    return {
        "document_type": prediction,
        "confidence": round(float(confidence), 4),
        "probabilities": probability_dict
    }