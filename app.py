from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np

app = Flask(__name__)

# Load the pre-trained SVM model and vectorizer
model = joblib.load('svm_model.joblib')
vectorizer = joblib.load('vectorizer.joblib')

# Define the image paths corresponding to responses
image_paths = {
    "Marvel collection": "iron_man.jpeg",
    "Colección Marvel":"iron_man.jpeg",
    "Anime": "naruto.jpeg",
    "Anime": "naruto.jpeg",
    "Friendly neighborhood superhero": "spiderman.jpeg",
    "Superhéroe vecino amistoso": "spiderman.jpeg",
    "DC Universe": "batman.avif",
    "Universo DC": "batman.avif",
    "Listening started...": "start.jpeg",
    "Escucha iniciada...": "start.jpeg",
    "Listening stopped.": "stop.jpeg",
    "Escucha detenida.": "stop.jpeg",
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/process", methods=["POST"])
def process_command():
    data = request.get_json()
    command = data.get("command", "").lower()

    # Transform the input command using the same vectorizer used for training
    command_vector = vectorizer.transform([command])

    # Predict the category/label using the trained model
    predicted_label = model.predict(command_vector)[0]

    # Get the associated image for the predicted label
    image = image_paths.get(predicted_label, "not_recognized.jpeg")

    # Return the response as JSON
    response = {
        "text": predicted_label,
        "image": image
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
