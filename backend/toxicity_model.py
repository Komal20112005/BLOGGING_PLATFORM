import sys
import pickle
model=pickle.load(open("model.pkl","rb"))
vectorizer=pickle.load(open("vectorizer.pkl","rb"))
text=sys.argv[1]
X=vectorizer.transform([text])
prediction=model.predict(X)[0]
print("TOXIC" if prediction == 1 else "SAFE")