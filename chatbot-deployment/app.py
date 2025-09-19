from flask import Flask, render_template, request, jsonify, send_from_directory
import os

from chat import get_response

app = Flask(__name__)

# Serve monastery pages from the parent directory
MONASTERY_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

@app.get("/")
def index_get():
    return send_from_directory(MONASTERY_DIR, "index.html")

@app.get("/<path:filename>")
def serve_monastery_pages(filename):
    # Serve HTML files and assets from the monastery directory
    if filename.endswith('.html'):
        return send_from_directory(MONASTERY_DIR, filename)
    elif filename.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico')):
        return send_from_directory(MONASTERY_DIR, filename)
    else:
        return send_from_directory(MONASTERY_DIR, filename)

@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    # TODO: check if text is valid
    response = get_response(text)
    message = {"answer": response}    
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
