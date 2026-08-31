import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score


DATA_PATH = "data/classification/documents.csv"

df = pd.read_csv(DATA_PATH)

print(df.head())