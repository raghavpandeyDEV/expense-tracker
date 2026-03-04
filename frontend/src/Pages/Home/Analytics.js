import React from "react";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;

  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );

  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100;

  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100;

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = (totalTurnOverIncome / totalTurnOver) * 100;

  const TurnOverExpensePercent = (totalTurnOverExpense / totalTurnOver) * 100;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    Groceries: "#FF6384",
    Rent: "#36A2EB",
    Salary: "#FFCE56",
    Tip: "#4BC0C0",
    Food: "#9966FF",
    Medical: "#FF9F40",
    Utilities: "#8AC926",
    Entertainment: "#6A4C93",
    Transportation: "#1982C4",
    Other: "#F45B69",
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-lg h-full">
          <div className="bg-black text-white font-bold p-3 rounded-t-lg">
            Total Transactions: {TotalTransactions}
          </div>

          <div className="p-4">

            <h5 className="text-green-600 flex items-center font-semibold">
              Income: <ArrowDropUpIcon /> {totalIncomeTransactions.length}
            </h5>

            <h5 className="text-red-600 flex items-center font-semibold">
              Expense: <ArrowDropDownIcon /> {totalExpenseTransactions.length}
            </h5>

            <div className="flex justify-center mt-4">
              <CircularProgressBar
                percentage={totalIncomePercent.toFixed(0)}
                color="green"
              />
            </div>

            <div className="flex justify-center mt-6">
              <CircularProgressBar
                percentage={totalExpensePercent.toFixed(0)}
                color="red"
              />
            </div>

          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-lg h-full">
          <div className="bg-black text-white font-bold p-3 rounded-t-lg">
            Total TurnOver: {totalTurnOver}
          </div>

          <div className="p-4">

            <h5 className="text-green-600 flex items-center font-semibold">
              Income <ArrowDropUpIcon /> {totalTurnOverIncome} <CurrencyRupeeIcon />
            </h5>

            <h5 className="text-red-600 flex items-center font-semibold">
              Expense <ArrowDropDownIcon /> {totalTurnOverExpense} <CurrencyRupeeIcon />
            </h5>

            <div className="flex justify-center mt-4">
              <CircularProgressBar
                percentage={TurnOverIncomePercent.toFixed(0)}
                color="green"
              />
            </div>

            <div className="flex justify-center mt-6">
              <CircularProgressBar
                percentage={TurnOverExpensePercent.toFixed(0)}
                color="red"
              />
            </div>

          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-lg h-full">
          <div className="bg-black text-white font-bold p-3 rounded-t-lg">
            Categorywise Income
          </div>

          <div className="p-4">

            {categories.map((category) => {

              const income = transactions
                .filter(
                  (transaction) =>
                    transaction.transactionType === "credit" &&
                    transaction.category === category
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0);

              const incomePercent = (income / totalTurnOver) * 100;

              return (
                <>
                  {income > 0 && (
                    <LineProgressBar
                      label={category}
                      percentage={incomePercent.toFixed(0)}
                      lineColor={colors[category]}
                    />
                  )}
                </>
              );
            })}

          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white shadow-lg rounded-lg h-full">
          <div className="bg-black text-white font-bold p-3 rounded-t-lg">
            Categorywise Expense
          </div>

          <div className="p-4">

            {categories.map((category) => {

              const expenses = transactions
                .filter(
                  (transaction) =>
                    transaction.transactionType === "expense" &&
                    transaction.category === category
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0);

              const expensePercent = (expenses / totalTurnOver) * 100;

              return (
                <>
                  {expenses > 0 && (
                    <LineProgressBar
                      label={category}
                      percentage={expensePercent.toFixed(0)}
                      lineColor={colors[category]}
                    />
                  )}
                </>
              );
            })}

          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;