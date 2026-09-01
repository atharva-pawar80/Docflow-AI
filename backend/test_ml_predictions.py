from backend.app.services.classification.train_classifier import classifier


test_documents = {

    "hard_invoice": """
    Apex Technologies

    Services provided:
    Cloud infrastructure setup
    Monthly maintenance

    Client:
    ABC Solutions

    Amount payable: ₹45,000
    Payment terms: 30 days
    """,

    "hard_receipt": """
    Fresh Mart

    2 x Milk ₹120
    1 x Bread ₹45

    Amount paid: ₹165
    Payment method: UPI

    Thank you for shopping.
    """,

    "hard_unknown": """
    Rahul Sharma

    Python
    Machine Learning
    SQL
    Docker

    Projects:
    Document Classification System
    Recommendation Engine
    """
}


for name, text in test_documents.items():

    prediction = classifier.predict([text])[0]

    print(f"{name}: {prediction}")