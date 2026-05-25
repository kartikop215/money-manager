import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Onboarding.module.css";

function Onboarding() {
  const navigate = useNavigate();

  const [budget, setBudget] = useState("");
  const [rent, setRent] = useState("");
  const [food, setFood] = useState("");
  const [bills, setBills] = useState("");

  const saveData = () => {
    if (!budget) {
      alert("Enter budget");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...user,
      budget: Number(budget),
      fixedExpenses: [
        { title: "Rent", amount: Number(rent) || 0 },
        { title: "Food", amount: Number(food) || 0 },
        { title: "Bills", amount: Number(bills) || 0 },
      ],
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("budget", JSON.stringify(updatedUser.budget));
    localStorage.setItem(
      "fixedExpenses",
      JSON.stringify(updatedUser.fixedExpenses)
    );

    navigate("/dashboard");
  };

  return (
    <div className={styles.wrapper}>

      {/* LEFT SIDE */}
      <section className={styles.left}>
        <span className={styles.eyebrow}>Setup</span>

        <h1 className={styles.title}>
          Configure your monthly budget.
        </h1>

        <p className={styles.copy}>
          Add your essential expenses like rent, food, and bills to get
          accurate insights and smarter financial planning.
        </p>
      </section>

      {/* RIGHT SIDE */}
      <section className={styles.right}>
        <div className={styles.card}>

          <span className={styles.kicker}>Onboarding</span>
          <h2 className={styles.heading}>Budget Setup</h2>

          <div className={styles.form}>

            <label className={styles.label}>Monthly Budget</label>
            <input
              type="number"
              placeholder="50000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />

            <label className={styles.label}>Rent</label>
            <input
              type="number"
              placeholder="15000"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />

            <label className={styles.label}>Food</label>
            <input
              type="number"
              placeholder="8000"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />

            <label className={styles.label}>Bills</label>
            <input
              type="number"
              placeholder="5000"
              value={bills}
              onChange={(e) => setBills(e.target.value)}
            />

            <button className={styles.button} onClick={saveData}>
              Save & Continue 🚀
            </button>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Onboarding;