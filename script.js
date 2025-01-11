const commandSpan = document.getElementById("command");
let isListening = true; // Listening by default

// Initialize Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US"; // Default language is English
recognition.interimResults = false;

let currentLang = "en-US";  // Store the current language
const supportedLanguages = {
    "english": "en-US",
    "french": "fr-FR",
    "spanish": "es-ES"
};

function switchLanguage(language) {
    currentLang = supportedLanguages[language.toLowerCase()] || "en-US";
    recognition.lang = currentLang;
    console.log(`Switched to ${currentLang}`);
}

// Function to start listening
function startListening() {
    if (isListening) {
        recognition.start();
    }
}

recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    commandSpan.textContent = command;

    // Check if the command starts with "switch to" and handle language switching
    if (command.startsWith("switch to ")) {
        const lang = command.replace("switch to ", "").trim();
        switchLanguage(lang); // Switch to the requested language
    }

    // Send the command to the backend
    fetch("/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
    })
    .then(response => response.json())
    .then(data => {
        // Change the background image if available
        if (data.image) {
            document.body.style.backgroundImage = `url('/static/images/${data.image}')`;
            document.body.style.backgroundSize = "contain"; // Adjust to fix zoom issue
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundPosition = "center";
        }

        // Handle special commands
        if (command === "stop") {
            isListening = false; // Stop listening
        } else if (command === "start") {
            isListening = true; // Restart listening
            startListening();
        } else {
            // Continue listening for unrecognized or other valid commands
            if (isListening) {
                startListening(); // Restart listening
            }
        }
    })
    .catch(error => {
        console.error("Error processing command:", error);

        // Restart listening even if there's an error
        if (isListening) {
            startListening();
        }
    });
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);

    // Restart listening on error
    if (isListening) {
        startListening();
    }
};

// Automatically restart recognition when it ends
recognition.onend = () => {
    if (isListening) {
        startListening();
    }
};

// Automatically start listening when the page loads
startListening();
