import pandas
import joblib

from sklearn.model_selection import (
    train_test_split,
    cross_val_score,
    StratifiedKFold
)


from sklearn.feature_extraction.text import TFIDFVectorizer
from sklearn.linear_model import logisticRegression