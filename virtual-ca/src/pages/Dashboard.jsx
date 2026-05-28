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

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =========================
  // STATES
  // =========================

  const [budget, setBudget] = useState(
    Number(
      JSON.parse(
        localStorage.getItem("budget")
      )
    ) || 10000
  );

  const [isEditingBudget, setIsEditingBudget] =
    useState(false);

  const [newBudget, setNewBudget] =
    useState(budget);

  const [expenses, setExpenses] =
    useState([]);

  const [fixedExpenses, setFixedExpenses] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "fixedExpenses"
        ) || "[]"
      )
    );

  const [dailyBudget, setDailyBudget] =
    useState(0);

  // EXPENSE
  const [title, setTitle] = useState("");
  const [amount, setAmount] =
    useState("");
  const [category, setCategory] =
    useState("");

  // FIXED
  const [fixedTitle, setFixedTitle] =
    useState("");

  const [fixedAmount, setFixedAmount] =
    useState("");

  // EDIT FIXED
  const [editingIndex, setEditingIndex] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  // 🤖 VIRTUAL CA
  const [caAmount, setCaAmount] =
    useState("");

  const [caPurpose, setCaPurpose] =
    useState("");

  const [caAdvice, setCaAdvice] =
    useState(null);

  const [showConfirm, setShowConfirm] =
    useState(false);

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
          "https://kartik-money-manager.onrender.com/api/expenses",
          {
            headers: {
              Authorization:
                localStorage.getItem(
                  "token"
                ),
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {

          setExpenses(data);

        } else {

          setExpenses([]);
        }

      } catch (err) {

        console.log(err);

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
      (s, e) =>
        s + Number(e.amount || 0),
      0
    ) +
    (fixedExpenses || []).reduce(
      (s, e) =>
        s + Number(e.amount || 0),
      0
    );

  const remaining = Math.max(
    budget - totalSpent,
    0
  );

  const usagePercent = budget
    ? Math.round(
        (totalSpent / budget) * 100
      )
    : 0;

  useEffect(() => {

    const safeDaily = Math.floor(
      remaining / 30
    );

    setDailyBudget(safeDaily);

  }, [remaining]);

  // =========================
  // ALERTS
  // =========================

  let alertMessage = "";
  let alertType = "";

  if (totalSpent > budget) {

    alertMessage =
      "❌ You have exceeded your budget!";

    alertType = "danger";

  } else if (usagePercent > 90) {

    alertMessage =
      "⚠️ Critical: Almost at your limit!";

    alertType = "warning";

  } else if (usagePercent > 70) {

    alertMessage =
      "⚠️ Caution: You're spending fast";

    alertType = "warning";

  } else {

    alertMessage =
      "✅ You're managing your budget well";

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

      const res = await fetch(
        "https://kartik-money-manager.onrender.com/api/expenses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              localStorage.getItem(
                "token"
              ),
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

      if (data && data._id) {

        setExpenses((prev) => [
          ...prev,
          data,
        ]);
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
  // DELETE EXPENSE
  // =========================

  const deleteExpense = async (_id) => {

    try {

      await fetch(
        `https://kartik-money-manager.onrender.com/api/expenses/${_id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              localStorage.getItem(
                "token"
              ),
          },
        }
      );

      setExpenses(
        expenses.filter(
          (e) => e._id !== _id
        )
      );

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // FIXED EXPENSES
  // =========================

  const addFixedExpense = () => {

    if (
      !fixedTitle ||
      !fixedAmount
    )
      return;

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

  const deleteFixedExpense = (index) => {

    const updated =
      fixedExpenses.filter(
        (_, i) => i !== index
      );

    setFixedExpenses(updated);

    localStorage.setItem(
      "fixedExpenses",
      JSON.stringify(updated)
    );
  };

  const startEdit = (item, index) => {

    setEditingIndex(index);

    setEditTitle(item.title);

    setEditAmount(item.amount);
  };

  const saveEdit = () => {

    const updated = [...fixedExpenses];

    updated[editingIndex] = {
      title: editTitle,
      amount: Number(editAmount),
    };

    setFixedExpenses(updated);

    localStorage.setItem(
      "fixedExpenses",
      JSON.stringify(updated)
    );

    setEditingIndex(null);

    setEditTitle("");

    setEditAmount("");
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

      suggestion =
        "❌ This exceeds your budget.";

      prediction =
        "You may enter deficit.";

    } else {

      suggestion =
        "✅ Safe expense.";

      prediction =
        `Projected spend ₹${totalSpent + amt}`;

      canProceed = true;
    }

    setCaAdvice({
      suggestion,
      prediction,
    });

    setShowConfirm(canProceed);
  };

  const proceedExpense =
    async () => {

      try {

        const res = await fetch(
          "https://kartik-money-manager.onrender.com/api/expenses",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                localStorage.getItem(
                  "token"
                ),
            },

            body: JSON.stringify({
              title:
                caPurpose ||
                "AI Expense",

              amount:
                Number(caAmount),

              category:
                "AI Suggested",
            }),
          }
        );

        const data =
          await res.json();

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
      }
    };

  // =========================
  // AI CHAT
  // =========================

  const sendMessage =
    async (msg = input) => {

      if (!msg) return;

      setChat((prev) => [
        ...prev,
        {
          role: "user",
          text: msg,
        },
      ]);

      try {

        const res = await fetch(
          "https://kartik-money-manager.onrender.com/api/ai/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                localStorage.getItem(
                  "token"
                ),
            },

            body: JSON.stringify({
              message: msg,
            }),
          }
        );

        const data =
          await res.json();

        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text:
              data.reply ||
              "No response",
          },
        ]);

      } catch {

        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text:
              "⚠️ AI not responding",
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

  const chartData =
    (expenses || [])
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
      value: remaining,
    },
  ];

  const COLORS = [
    "#7c3aed",
    "#22c55e",
  ];

  return (

    <div className={styles.dashboardWrapper}>

      <div className={styles.dashboard}>

        <h2 className={styles.heading}>
          Welcome{" "}
          {user?.name || "User"}
        </h2>

        {/* STATS */}
        <div className={styles.stats}>

          <div className={styles["stat-card"]}>

            <span>Total Budget</span>

            {isEditingBudget ? (

              <>

                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) =>
                    setNewBudget(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={saveBudget}
                >
                  Save
                </button>

              </>

            ) : (

              <>

                <h2>₹{budget}</h2>

                <button
                  onClick={() =>
                    setIsEditingBudget(
                      true
                    )
                  }
                >
                  Edit Budget
                </button>

              </>

            )}

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

          </div>

        </div>

        {/* EXPENSES */}
        <div className={styles.card}>

          <h3>Expense Tracker</h3>

          {(expenses || []).map((e, index) => (

            <div
              key={e._id || index}
              className={styles["table-row"]}
            >

              <div>
                <strong>
                  {e.title}
                </strong>
              </div>

              <div>
                {e.category}
              </div>

              <div>

                ₹{e.amount}

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

            {(fixedExpenses || []).map((f, i) => (

              <div
                key={i}
                style={{
                  marginBottom: "10px",
                }}
              >

                {editingIndex === i ? (

                  <>

                    <input
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }
                    />

                    <input
                      value={editAmount}
                      onChange={(e) =>
                        setEditAmount(
                          e.target.value
                        )
                      }
                    />

                    <button
                      onClick={saveEdit}
                    >
                      Save
                    </button>

                  </>

                ) : (

                  <>

                    <div>
                      {f.title} ₹{f.amount}
                    </div>

                    <button
                      onClick={() =>
                        startEdit(f, i)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteFixedExpense(i)
                      }
                    >
                      Delete
                    </button>

                  </>

                )}

              </div>

            ))}

            <input
              placeholder="Name"
              value={fixedTitle}
              onChange={(e) =>
                setFixedTitle(
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="Amount"
              value={fixedAmount}
              onChange={(e) =>
                setFixedAmount(
                  e.target.value
                )
              }
            />

            <button
              onClick={addFixedExpense}
            >
              Add Fixed
            </button>

          </div>

          {/* AI */}
          <div className={styles.card}>

            <h3>🤖 Virtual CA</h3>

            <input
              placeholder="Amount"
              value={caAmount}
              onChange={(e) =>
                setCaAmount(
                  e.target.value
                )
              }
            />

            <input
              placeholder="Purpose"
              value={caPurpose}
              onChange={(e) =>
                setCaPurpose(
                  e.target.value
                )
              }
            />

            <button onClick={handleCA}>
              Analyze Expense
            </button>

            {caAdvice && (
              <>
                <p>
                  {caAdvice.suggestion}
                </p>

                <p>
                  {caAdvice.prediction}
                </p>
              </>
            )}

            {showConfirm && (
              <button
                onClick={proceedExpense}
              >
                Proceed Anyway
              </button>
            )}

            <h4>Quick Ask</h4>

            {quickQuestions.map((q, i) => (

              <button
                key={i}
                onClick={() =>
                  sendMessage(q)
                }
              >
                {q}
              </button>

            ))}

            <div className={styles.chatBox}>

              {(chat || []).map((c, i) => (

                <div key={i}>
                  {c.text}
                </div>

              ))}

            </div>

            <input
              placeholder="Ask AI..."
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
            />

            <button
              onClick={() =>
                sendMessage()
              }
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;