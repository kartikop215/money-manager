import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {

    window.location.href = "/login";
  }

}, []);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [budget, setBudget] = useState(
    Number(JSON.parse(localStorage.getItem("budget"))) || 10000
  );

  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [newBudget, setNewBudget] = useState(budget);

  // ✅ SAFE ARRAY
  const [expenses, setExpenses] = useState([]);

  const [fixedExpenses, setFixedExpenses] = useState(
    JSON.parse(localStorage.getItem("fixedExpenses")) || []
  );

  const [dailyBudget, setDailyBudget] = useState(0);

  // EXPENSE
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // FIXED
  const [fixedTitle, setFixedTitle] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");

  // 🤖 VIRTUAL CA
  const [caAmount, setCaAmount] = useState("");
  const [caPurpose, setCaPurpose] = useState("");
  const [caAdvice, setCaAdvice] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🤖 AI CHAT
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  // =========================
  // FETCH EXPENSES
  // =========================

  useEffect(() => {

    const fetchExpenses = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/expenses",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();

        console.log("FETCH:", data);

        // ✅ SAFE CHECK
        if (Array.isArray(data)) {
          setExpenses(data);
        } else {
          setExpenses([]);
        }

      } catch (err) {

        console.log("FETCH ERROR:", err);

        setExpenses([]);
      }
    };

    fetchExpenses();

  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalSpent =
    (expenses || []).reduce(
      (s, e) => s + Number(e.amount || 0),
      0
    ) +
    (fixedExpenses || []).reduce(
      (s, e) => s + Number(e.amount || 0),
      0
    );

  const remaining = budget - totalSpent;

  const usagePercent = Math.round(
    ((totalSpent / budget) * 100) || 0
  );

  useEffect(() => {

    const safeDaily = Math.floor(
      (remaining || 0) / 30
    );

    setDailyBudget(safeDaily);

  }, [remaining]);

  // =========================
  // ALERTS
  // =========================

  let alertMessage = "";
  let alertType = "";

  if (totalSpent > budget) {

    alertMessage = "❌ You have exceeded your budget!";
    alertType = "danger";

  } else if (usagePercent > 90) {

    alertMessage = "⚠️ Critical: Almost at your limit!";
    alertType = "warning";

  } else if (usagePercent > 70) {

    alertMessage = "⚠️ Caution: You're spending fast";
    alertType = "warning";

  } else {

    alertMessage = "✅ You're managing your budget well";
    alertType = "safe";
  }

  // =========================
  // ADD EXPENSE
  // =========================
const addExpense = async () => {

  if (!title || !amount) {

    alert("Enter all fields");

    return;
  }

  try {

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/expenses",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: token,
        },

        body: JSON.stringify({
          title: title.trim(),

          amount: Number(amount),

          category:
            category || "General",
        }),
      }
    );

    const data = await res.json();

    console.log("ADD RESPONSE:", data);

    // ✅ VALIDATION
    if (data && data._id) {

      const newExpense = {

        _id: data._id,

        title:
          data.title ||
          title,

        amount:
          Number(
            data.amount
          ) || Number(amount),

        category:
          data.category ||
          category ||
          "General",
      };

      setExpenses((prev) => [
        ...prev,
        newExpense,
      ]);

    } else {

      alert(
        data.message ||
          "Expense failed"
      );
    }

    setTitle("");
    setAmount("");
    setCategory("");

  } catch (err) {

    console.log(err);

    alert("Server error");
  }
};

  // =========================
  // DELETE
  // =========================

  const deleteExpense = async (_id) => {

    try {

      await fetch(
        `http://localhost:5000/api/expenses/${_id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setExpenses(
        expenses.filter((e) => e._id !== _id)
      );

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // FIXED EXPENSES
  // =========================

  const addFixedExpense = () => {

    if (!fixedTitle || !fixedAmount) return;

    const updated = [
      ...fixedExpenses,
      {
        title: fixedTitle,
        amount: Number(fixedAmount),
      },
    ];

    setFixedExpenses(updated);

    localStorage.setItem(
      "fixedExpenses",
      JSON.stringify(updated)
    );

    setFixedTitle("");
    setFixedAmount("");
  };

  // =========================
  // SAVE BUDGET
  // =========================

  const saveBudget = () => {

    if (!newBudget) return;

    setBudget(Number(newBudget));

    localStorage.setItem(
      "budget",
      JSON.stringify(newBudget)
    );

    setIsEditingBudget(false);
  };

  // =========================
  // 🤖 VIRTUAL CA
  // =========================

  const handleCA = () => {

    const amt = Number(caAmount);

    if (!amt) return;

    let suggestion = "";
    let prediction = "";
    let canProceed = false;

    if (amt > remaining) {

      suggestion = "❌ This exceeds your budget.";
      prediction = "You may enter deficit.";

    } else if (usagePercent > 85) {

      suggestion = "⚠️ Near your limit.";
      prediction = "High overspending risk.";
      canProceed = true;

    } else if (amt > dailyBudget * 2) {

      suggestion = "⚠️ Above your daily average.";
      prediction = "May disturb monthly balance.";
      canProceed = true;

    } else {

      suggestion = "✅ Safe expense.";
      prediction = `Projected spend ₹${totalSpent + amt}`;
      canProceed = true;
    }

    setCaAdvice({
      suggestion,
      prediction,
    });

    setShowConfirm(canProceed);
  };

  // ✅ FIXED PROCEED
  const proceedExpense = async () => {

  try {

    const res = await fetch(
      "http://localhost:5000/api/expenses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            localStorage.getItem("token"),
        },

        body: JSON.stringify({
          title:
            caPurpose || "AI Expense",

          amount:
            Number(caAmount),

          category:
            "AI Suggested",
        }),
      }
    );

    const data = await res.json();

    console.log("AI EXPENSE:", data);

    // ✅ SAFE UPDATE
    if (data && data._id) {

      setExpenses((prev) => [
        ...prev,
        data,
      ]);
    }

    setShowConfirm(false);

    setCaAmount("");
    setCaPurpose("");

  } catch (err) {

    console.log(err);

    alert("Failed to add AI expense");
  }
};

  // =========================
  // 🤖 AI CHAT
  // =========================

  const sendMessage = async (msg = input) => {

    if (!msg) return;

    setChat((prev) => [
      ...prev,
      { role: "user", text: msg },
    ]);

    try {

      const res = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },

          body: JSON.stringify({
            message: msg,
          }),
        }
      );

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply || "No response",
        },
      ]);

    } catch {

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ AI not responding",
        },
      ]);
    }

    setInput("");
  };

  const quickQuestions = [
    "Can I spend this amount?",
    "How can I reduce expenses?",
    "Am I overspending?",
  ];

  // =========================
  // CHARTS
  // =========================

  const chartData = (expenses || [])
  .filter(
    (e) =>
      e &&
      e.title &&
      e.amount
  )
  .slice(-6)
  .map((e) => ({

    name: e.title,

    amount:
      Number(e.amount) || 0,
  }));

  const pieData = [
    {
      name: "Spent",
      value: totalSpent,
    },
    {
      name: "Remaining",
      value: remaining > 0 ? remaining : 0,
    },
  ];

  const COLORS = ["#7c3aed", "#22c55e"];

  return (
    <div className={styles.dashboardWrapper}>

      <div className={styles.dashboard}>

        <h2 className={styles.heading}>
          Welcome {user.name || "User"}
        </h2>

        {/* STATS */}
        <div className={styles.stats}>

          <div className={styles["stat-card"]}>
            <span>Total Budget</span>
            <h2>₹{budget}</h2>
          </div>

          <div className={styles["stat-card"]}>
            <span>Total Spent</span>
            <h2>₹{totalSpent}</h2>
          </div>

          <div className={styles["stat-card"]}>
            <span>Remaining</span>
            <h2>₹{remaining}</h2>
          </div>

          <div className={styles["stat-card"]}>
            <span>Daily Budget</span>
            <h2>₹{dailyBudget}</h2>
          </div>

        </div>

        {/* ALERT */}
        <div className={`${styles.alertBox} ${styles[alertType]}`}>
          {alertMessage}
        </div>

        {/* CHARTS */}
        <div className={styles["grid-2"]}>

          <div className={styles.card}>

            <h3>Expense Analytics</h3>

            <ResponsiveContainer width="100%" height={250}>

              <BarChart data={chartData}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="amount"
                  fill="#7c3aed"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className={styles.card}>

            <h3>Budget Distribution</h3>

            <ResponsiveContainer width="100%" height={250}>

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={80}
                >

                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

            <div className={styles.legend}>
              <p>
                <span style={{ color: "#7c3aed" }}>
                  ■
                </span>{" "}
                Spent
              </p>

              <p>
                <span style={{ color: "#22c55e" }}>
                  ■
                </span>{" "}
                Remaining
              </p>
            </div>

          </div>

        </div>

        {/* EXPENSE TRACKER */}
        <div className={styles.card}>

          <h3>Expense Tracker</h3>

          {(expenses || []).map((e, index) => (

  <div
    key={e._id || index}
    className={styles["table-row"]}
  >

    <div>
      <strong>
        {e.title || "Untitled"}
      </strong>
    </div>

    <div>
      {e.category || "General"}
    </div>

    <div>

      ₹{Number(e.amount) || 0}

      <button
        onClick={() =>
          deleteExpense(e._id)
        }
      >
        ❌
      </button>

    </div>

  </div>

))}

        </div>

        {/* MAIN GRID */}
        <div className={styles["grid-3"]}>

          {/* ADD EXPENSE */}
          <div className={styles.card}>

            <h3>Add Expense</h3>

            <input
              placeholder="Name"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <input
              placeholder="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />

            <button onClick={addExpense}>
              Add Expense
            </button>

          </div>

          {/* FIXED */}
          <div className={styles.card}>

            <h3>Fixed Expenses</h3>

            {fixedExpenses.map((f, i) => (

              <div key={i}>
                {f.title} ₹{f.amount}
              </div>

            ))}

            <input
              placeholder="Name"
              value={fixedTitle}
              onChange={(e) =>
                setFixedTitle(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Amount"
              value={fixedAmount}
              onChange={(e) =>
                setFixedAmount(e.target.value)
              }
            />

            <button onClick={addFixedExpense}>
              Add Fixed
            </button>

          </div>

          {/* 🤖 VIRTUAL CA */}
          <div className={styles.card}>

            <h3>🤖 Virtual CA</h3>

            <input
              placeholder="Amount"
              value={caAmount}
              onChange={(e) =>
                setCaAmount(e.target.value)
              }
            />

            <input
              placeholder="Purpose"
              value={caPurpose}
              onChange={(e) =>
                setCaPurpose(e.target.value)
              }
            />

            <button onClick={handleCA}>
              Analyze Expense
            </button>

            {caAdvice && (
              <>
                <p>{caAdvice.suggestion}</p>
                <p>{caAdvice.prediction}</p>
              </>
            )}

            {showConfirm && (
              <button onClick={proceedExpense}>
                Proceed Anyway
              </button>
            )}

            <h4>Quick Ask</h4>

            {quickQuestions.map((q, i) => (

              <button
                key={i}
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>

            ))}

            <div className={styles.chatBox}>

              {chat.map((c, i) => (

                <div key={i}>
                  {c.text}
                </div>

              ))}

            </div>

            <input
              placeholder="Ask AI..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
            />

            <button onClick={() => sendMessage()}>
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;