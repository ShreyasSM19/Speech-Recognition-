import numpy as np
from sklearn import svm
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from joblib import dump

# Sample training data
commands = ["iron man", "naruto", "spiderman", "batman", "start", "stop"]
labels = ["Marvel collection", "Anime", "Friendly neighborhood superhero", "DC Universe", "Listening started...", "Listening stopped."]

# Convert commands to feature vectors
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(commands)

# Train SVM model
model = svm.SVC(kernel='linear')
model.fit(X, labels)

# Save the model and vectorizer
dump(model, 'svm_model.joblib')
dump(vectorizer, 'vectorizer.joblib')
