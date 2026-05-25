import React from "react";
import styles from "./Reports.module.css";

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

function Reports() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // CATEGORY GROUPING
  const categoryTotals = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
    Miscellaneous: 0,
  };

  expenses.forEach((e) => {
    const cat = e.category?.toLowerCase();

    if (cat === "food") categoryTotals.Food += e.amount;
    else if (cat === "travel") categoryTotals.Travel += e.amount;
    else if (cat === "shopping") categoryTotals.Shopping += e.amount;
    else categoryTotals.Miscellaneous += e.amount;
  });

  const data = Object.keys(categoryTotals).map((key) => ({
    name: key,
    amount: categoryTotals[key],
  }));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 🔥 ADVANCED INSIGHTS
  const topCategory = data.reduce((a, b) =>
    a.amount > b.amount ? a : b
  );

  const highestExpense =
    expenses.length > 0
      ? expenses.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null;

  const avgDaily = Math.floor(total / 30);

  // 🔮 PREDICTION LOGIC
  const last5 = expenses.slice(-5);
  const prev5 = expenses.slice(-10, -5);

  const lastAvg =
    last5.length > 0
      ? last5.reduce((s, e) => s + e.amount, 0) / last5.length
      : 0;

  const prevAvg =
    prev5.length > 0
      ? prev5.reduce((s, e) => s + e.amount, 0) / prev5.length
      : 0;

  const trend =
    lastAvg > prevAvg
      ? "📈 Increasing spending trend"
      : lastAvg < prevAvg
      ? "📉 Decreasing spending trend"
      : "➡️ Stable spending";

  const predictedMonthly = Math.round(lastAvg * 30);

  const COLORS = ["#7c3aed", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className={styles.wrapper}>
      <div className={styles.reports}>

        <h2 className={styles.heading}>Analytics Dashboard</h2>

        {/* TOP CARDS */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Total Spending</h3>
            <h2>₹{total}</h2>
          </div>

          <div className={styles.card}>
            <h3>Top Category</h3>
            <h2>{topCategory.name}</h2>
          </div>

          <div className={styles.card}>
            <h3>Avg Daily Spend</h3>
            <h2>₹{avgDaily}</h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className={styles.grid2}>

          {/* BAR */}
          <div className={styles.card}>
            <h3>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="amount" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE */}
          <div className={styles.card}>
            <h3>Spending Ratio</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data} dataKey="amount">
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* 🎯 LEGEND */}
            <div className={styles.legend}>
              {data.map((item, index) => (
                <div key={item.name} className={styles.legendItem}>
                  <span
                    className={styles.colorBox}
                    style={{ background: COLORS[index] }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 🔮 PREDICTIONS */}
        <div className={styles.card}>
          <h3>Future Insights (AI Prediction)</h3>

          <p>🔮 Predicted monthly spending: <b>₹{predictedMonthly}</b></p>
          <p>{trend}</p>

          {predictedMonthly > total && (
            <p style={{ color: "#ef4444" }}>
              ⚠️ Your spending may increase next month
            </p>
          )}
        </div>

        {/* INSIGHTS */}
        <div className={styles.card}>
          <h3>Insights</h3>

          {highestExpense && (
            <p>
              💸 Highest expense: <b>{highestExpense.title}</b> (₹{highestExpense.amount})
            </p>
          )}

          <p>📊 You spend most on <b>{topCategory.name}</b></p>
          <p>📅 Average daily spend is ₹{avgDaily}</p>
        </div>

        {/* ALL EXPENSES */}
        <div className={styles.card}>
          <h3>All Expenses</h3>

          {expenses.length === 0 && <p>No expenses yet</p>}

          {expenses.map((e) => (
            <div key={e.id} className={styles.expense}>
              <div>
                <strong>{e.title}</strong>
                <br />
                <small>{e.category}</small>
              </div>

              <div>₹{e.amount}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Reports;