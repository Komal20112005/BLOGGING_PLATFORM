import sys
import nltk  
from nltk.corpus import stopwords
from collections import Counter
from textblob import TextBlob


text = sys.argv[1]

words = nltk.word_tokenize(text.lower())
words = [w for w in words if w.isalnum()]

stop_words = set(stopwords.words('english'))
words = [w for w in words if w not in stop_words]

common_words = Counter(words).most_common(5)

tags = [word for word, count in common_words]

print(",".join(tags))

blob = TextBlob(text)
sentiment = blob.sentiment.polarity

if sentiment > 0:
    mood = "Positive"
elif sentiment < 0:
    mood = "Negative"
else:
    mood = "Neutral"

print(",".join(tags) + "|" + mood)
 