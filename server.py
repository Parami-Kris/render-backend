from flask import Flask, request, jsonify
import pandas as pd
import anthropic
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   
client = anthropic.Anthropic(api_key="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")

df = pd.read_csv("synthetic_user_data.csv")
total_groups = df["GROUP_ID"].nunique()
unpaid_groups = df[df["status"].str.lower() == "unpaid"]["GROUP_ID"].nunique()
percentage_unpaid = (unpaid_groups / total_groups) * 100
room_counts = df["room category"].value_counts().to_dict()

@app.route("/query", methods=["POST"])
def query():
    question = request.json["question"]
    prompt = (
        f"Based on the dataset:\n"
        f"- Total groups: {total_groups}\n"
        f"- Unpaid groups: {unpaid_groups} ({percentage_unpaid:.2f}%)\n"
        f"- Room bookings: {room_counts}\n\n"
        f"Question: {question}"
    )

    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=300,
        temperature=0.5,
        messages=[{"role": "user", "content": prompt}]
    )
    return jsonify({"answer": response.content[0].text})

if __name__ == "__main__":
    app.run(debug=True)
