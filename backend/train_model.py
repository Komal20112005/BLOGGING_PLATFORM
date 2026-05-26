import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# Sample dataset (replace with Kaggle dataset later)
data = {
    "text": [
        "I hate you",
        "You are stupid",
        "This is terrible"
    ],
    "label": [1,1,1]
}
df = pd.DataFrame(data)

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df["text"])

model = MultinomialNB()
model.fit(X, df["label"])

# Save model
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model trained")