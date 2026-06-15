from fastapi import FastAPI
from supabase import create_client
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
import pandas as pd
import numpy as np
import os

from pathlib import Path

# ==================================================
# LOAD ENV
# ==================================================

env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY"
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# ==================================================
# SUPABASE
# ==================================================

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)

genai.configure(
    api_key=GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

# CHAT REQUEST
class ChatRequest(BaseModel):
    user_id: str
    message: str

# ==================================================
# APP
# ==================================================

app = FastAPI()

# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():
    return {
        "status": "Potli AI Running"
    }

# ==================================================
# OVERALL FORECAST
# ==================================================

@app.get("/forecast")
def forecast():

    result = (
        supabase
        .table("transactions")
        .select("*")
        .eq("type", "expense")
        .execute()
    )

    transactions = result.data

    if len(transactions) == 0:
        return {
            "forecast": [],
            "average": 0,
            "risk_score": 0,
            "confidence": 0,
            "message": "No transaction data"
        }

    amounts = [
        float(tx["amount"])
        for tx in transactions
    ]

    avg = float(np.mean(amounts))

    forecast_values = [
        round(avg * 0.95),
        round(avg * 1.02),
        round(avg * 0.98),
        round(avg * 1.04),
        round(avg * 1.10),
        round(avg * 1.15),
        round(avg * 1.08),
    ]

    total_spending = sum(amounts)

    if total_spending < 500:
        risk_score = 25
    elif total_spending < 1000:
        risk_score = 50
    elif total_spending < 2000:
        risk_score = 75
    else:
        risk_score = 90

    confidence = min(
        95,
        60 + len(amounts) * 5
    )

    return {
        "forecast": forecast_values,
        "average": round(avg),
        "risk_score": risk_score,
        "confidence": confidence,
        "total_spending": total_spending
    }

# ==================================================
# CATEGORY FORECAST
# ==================================================

@app.get("/forecast/{category_name}")
def forecast_by_category(category_name: str):

    # Find category
    category = (
        supabase
        .table("categories")
        .select("*")
        .ilike("name", category_name)
        .execute()
    )

    if len(category.data) == 0:
        return {
            "error": f"Category '{category_name}' not found"
        }

    category_id = category.data[0]["id"]

    # Get category expenses
    result = (
        supabase
        .table("transactions")
        .select("*")
        .eq("type", "expense")
        .eq("category_id", category_id)
        .execute()
    )

    transactions = result.data

    if len(transactions) == 0:
        return {
            "category": category_name,
            "forecast": [],
            "average": 0,
            "risk_score": 0,
            "confidence": 0,
            "total_spending": 0
        }

    amounts = [
        float(tx["amount"])
        for tx in transactions
    ]

    avg = float(np.mean(amounts))

    forecast_values = [
        round(avg * 0.95),
        round(avg * 1.02),
        round(avg * 0.98),
        round(avg * 1.04),
        round(avg * 1.10),
        round(avg * 1.15),
        round(avg * 1.08),
    ]

    total_spending = sum(amounts)

    if total_spending < 500:
        risk_score = 25
    elif total_spending < 1000:
        risk_score = 50
    elif total_spending < 2000:
        risk_score = 75
    else:
        risk_score = 90

    confidence = min(
        95,
        60 + len(amounts) * 5
    )

    transaction_count = len(transactions)

    if transaction_count == 1:
        ai_message = (
            f"You have only {transaction_count} "
            f"{category_name} transaction. "
            f"Add more data for better predictions."
        )

    elif risk_score >= 75:
        ai_message = (
            f"Your {category_name} spending is rising. "
            f"You spent ₹{total_spending:.0f} so far."
        )

    else:
        ai_message = (
            f"You spent ₹{total_spending:.0f} across "
            f"{transaction_count} {category_name} transactions. "
            f"Average spending is ₹{round(avg)}."
        )

    return {
        "category": category_name,
        "forecast": forecast_values,
        "average": round(avg),
        "risk_score": risk_score,
        "confidence": confidence,
        "total_spending": total_spending,
        "transaction_count": transaction_count,
        "ai_message": ai_message
    }

    # ==================================================
# GEMINI TEST
# ==================================================

@app.post("/test-ai")
def test_ai(request: ChatRequest):

    response = model.generate_content(
        request.message
    )

    return {
        "reply": response.text
    }

@app.post("/chat")
def chat(request: ChatRequest):

    user = (
        supabase
        .table("users")
        .select("*")
        .eq("auth_user_id", request.user_id)
        .single()
        .execute()
    )

    if not user.data:
        return {
            "reply": "User not found"
        }

    profile = user.data


    supabase.table("ai_chats").insert({
     "user_id": profile["id"],
     "role": "user",
     "message": request.message,
     "model": "gemini-2.5-flash"
    }).execute()

    history = (
     supabase
     .table("ai_chats")
     .select("*")
     .eq("user_id", profile["id"])
     .order("created_at", desc=True)
     .limit(50)
     .execute()
     )

    chat_history = ""
    history.data.reverse()

    for msg in history.data:
      chat_history += (
        f"{msg['role']}: {msg['message']}\n"
      )

    transactions = (
        supabase
        .table("transactions")
        .select("*")
        .eq("user_id", profile["id"])
        .execute()
    )

    txs = transactions.data
    category_summary = {}
    for tx in txs:

        if tx["type"] != "expense":
            continue

        category_id = tx.get("category_id")

        if not category_id:
            continue

        amount = float(tx["amount"])

        if category_id not in category_summary:
            category_summary[category_id] = 0

        category_summary[category_id] += amount

    categories = (
        supabase
        .table("categories")
        .select("*")
        .execute()
    )

    category_lookup = {}

    for cat in categories.data:
        category_lookup[cat["id"]] = cat["name"]

    category_text = ""

    for category_id, amount in category_summary.items():

        category_name = category_lookup.get(
            category_id,
            "Unknown"
        )

        category_text += (
            f"{category_name}: ₹{round(amount)}\n"
        )
    latest_transactions = []

    for tx in txs[-5:]:
        latest_transactions.append(
            {
                "amount": tx["amount"],
                "type": tx["type"],
                "date": tx["transaction_date"]
            }
        )

    total_expense = sum(
        float(tx["amount"])
        for tx in txs
        if tx["type"] == "expense"
    )

    total_income = float(
        profile.get("monthly_income") or 0
    )

    prompt = f"""
    You are Potli AI, a personal finance coach.

    User Information:

    Name: {profile.get('full_name')}
    Occupation: {profile.get('occupation')}
    Monthly Income: ₹{total_income}

    Category Spending:
    {category_text}

    Recent Transactions:
    {latest_transactions}

    Total Expenses Recorded:
    ₹{total_expense}

    Recent Conversation History:
    {chat_history}

    IMPORTANT:
    Use conversation history only as context.
    Always answer the CURRENT user question first.
    Do not continue old conversations unless relevant.

    Current User Question:
    {request.message}

    Answer like a helpful financial coach.
    Use the user's real data.
    Keep answers concise.
    """
    print(category_text)
    response = model.generate_content(prompt)

    supabase.table("ai_chats").insert({
    "user_id": profile["id"],
    "role": "assistant",
    "message": response.text,
    "model": "gemini-2.5-flash"
    }).execute()

    return {
        "reply": response.text
    }

@app.get("/chat-history/{auth_user_id}")
def chat_history(auth_user_id: str):

    user = (
        supabase
        .table("users")
        .select("*")
        .eq("auth_user_id", auth_user_id)
        .single()
        .execute()
    )

    if not user.data:
        return []

    profile = user.data

    history = (
        supabase
        .table("ai_chats")
        .select("*")
        .eq("user_id", profile["id"])
        .order("created_at")
        .execute()
    )

    return history.data