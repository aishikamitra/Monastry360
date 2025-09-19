from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import sys

# Add chatbot directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'chatbot-deployment'))

from chat import get_response

app = Flask(__name__)

@app.route("/")
def index():
    return send_from_directory('.', 'index.html')

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory('.', filename)

@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory('assets', filename)

@app.route("/predict", methods=['POST'])
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    message = {"answer": response}    
    return jsonify(message)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    args = parser.parse_args()
    app.run(debug=True, host='127.0.0.1', port=args.port)