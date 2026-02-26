import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Analytics from "./Analytics";

/* ─── Icon Components ─────────────────────────────────────────── */
const ListIcon = ({ active }) => (
  <svg
    className={`w-5 h-5 transition-colors duration-200 ${active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ChartIcon = ({ active }) => (
  <svg
    className={`w-5 h-5 transition-colors duration-200 ${active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ─── Modal ───────────────────────────────────────────────────── */
const TransactionModal = ({ show, onClose, onSubmit, values, onChange, loading }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden animate-[fadeUp_0.2s_ease_both]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-400 uppercase">New Entry</p>
            <h2 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Add Transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto scrollbar-thin">
          {[
            { label: "Title", name: "title", type: "text", placeholder: "e.g. Grocery Run" },
            { label: "Amount", name: "amount", type: "number", placeholder: "0.00" },
            { label: "Description", name: "description", type: "text", placeholder: "Brief note..." },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1.5">
                {label}
              </label>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={values[name]}
                onChange={onChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          ))}

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={values.category}
              onChange={onChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all appearance-none"
            >
              <option value="">Choose category…</option>
              {["Groceries","Rent","Salary","Tip","Food","Medical","Utilities","Entertainment","Transportation","Other"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["credit", "expense"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange({ target: { name: "transactionType", value: t } })}
                  className={`py-2.5 rounded-lg border text-sm font-semibold capitalize transition-all ${
                    values.transactionType === t
                      ? t === "credit"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {t === "credit" ? "↑ Credit" : "↓ Expense"}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1.5">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={values.date}
              onChange={onChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-zinc-500 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Pill Select ─────────────────────────────────────────────── */
const PillSelect = ({ label, value, onChange, name, options }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="h-9 bg-zinc-800/80 border border-zinc-700 text-white text-sm rounded-lg px-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all appearance-none pr-8 cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%236b7280' d='M4.646 6.646a.5.5 0 01.708 0L8 9.293l2.646-2.647a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 010-.708z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center" }}
    >
      {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
);

/* ─── Stats Card ──────────────────────────────────────────────── */
const StatsCard = ({ label, value, accent }) => (
  <div className={`flex-1 min-w-[140px] rounded-xl border bg-zinc-900/60 px-5 py-4 ${accent}`}>
    <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase mb-1">{label}</p>
    <p className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const [values, setValues] = useState({
    title: "", amount: "", description: "",
    category: "", date: "", transactionType: "",
  });

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };
    avatarFunc();
  }, [navigate]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id, frequency, startDate, endDate, type,
        });
        setTransactions(data.transactions);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    if (cUser) fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } = values;
    if (!title || !amount || !description || !category || !date || !transactionType) {
      return toast.error("Please fill in all fields", toastOptions);
    }
    setLoading(true);
    const { data } = await axios.post(addTransaction, {
      title, amount, description, category, date, transactionType, userId: cUser._id,
    });
    if (data.success) {
      toast.success(data.message, toastOptions);
      setShow(false);
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  /* ── Derived stats ── */
  const totalCredit = transactions.filter(t => t.transactionType === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.transactionType === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalCredit - totalExpense;
  const fmt = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <>
      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
        body { background-color: #0a0a0a; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.35s ease both; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>

      <Header />

      {loading ? (
        <Spinner />
      ) : (
        <div
          className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-10 py-8 animate-fadeUp"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* ── Page heading ── */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[10px] tracking-[0.25em] font-semibold text-emerald-400 uppercase mb-1">
                Finance Tracker
              </p>
              <h1
                className="text-3xl text-white font-bold leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Transactions
              </h1>
            </div>
            {/* Add New — top right */}
            <button
              onClick={() => setShow(true)}
              className="flex items-center gap-2 h-9 px-5 text-sm font-bold bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black rounded-lg transition-all shadow-lg shadow-emerald-900/40"
            >
              <span className="text-base leading-none">+</span> Add New
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div className="flex flex-wrap gap-3 mb-6">
            <StatsCard label="Total Earned" value={`₹${fmt(totalCredit)}`} accent="border-emerald-900/60" />
            <StatsCard label="Total Spent" value={`₹${fmt(totalExpense)}`} accent="border-red-900/60" />
            <StatsCard
              label="Net Balance"
              value={`${balance >= 0 ? "+" : "−"}₹${fmt(Math.abs(balance))}`}
              accent={balance >= 0 ? "border-blue-900/60" : "border-orange-900/60"}
            />
            <StatsCard label="Transactions" value={transactions.length} accent="border-zinc-700/60" />
          </div>

          {/* ── Control Bar ── */}
          <div className="flex flex-wrap items-end gap-3 mb-5 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <PillSelect
              label="Frequency"
              name="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              options={[
                { value: "7", label: "Last Week" },
                { value: "30", label: "Last Month" },
                { value: "365", label: "Last Year" },
                { value: "custom", label: "Custom Range" },
              ]}
            />

            <PillSelect
              label="Type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: "all", label: "All" },
                { value: "expense", label: "Expense" },
                { value: "credit", label: "Earned" },
              ]}
            />

            {/* Divider */}
            <div className="hidden sm:block w-px h-9 bg-zinc-700/60 self-end" />

            {/* View toggles */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">View</span>
              <div className="flex items-center gap-0.5 h-9 bg-zinc-800 border border-zinc-700 rounded-lg px-1">
                <button
                  onClick={() => setView("table")}
                  title="Table view"
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${view === "table" ? "bg-zinc-600 shadow-inner" : "hover:bg-zinc-700/60"}`}
                >
                  <ListIcon active={view === "table"} />
                </button>
                <button
                  onClick={() => setView("chart")}
                  title="Chart view"
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${view === "chart" ? "bg-zinc-600 shadow-inner" : "hover:bg-zinc-700/60"}`}
                >
                  <ChartIcon active={view === "chart"} />
                </button>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Reset */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-600 uppercase select-none">&nbsp;</span>
              <button
                onClick={handleReset}
                className="h-9 px-4 text-sm font-semibold text-zinc-400 border border-zinc-700 rounded-lg hover:border-zinc-500 hover:text-white transition-all"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* ── Custom Date Range ── */}
          {frequency === "custom" && (
            <div className="flex flex-wrap items-end gap-6 mb-5 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-xl animate-fadeUp">
              {[
                { label: "Start Date", selected: startDate, onChange: setStartDate, selectsStart: true },
                { label: "End Date", selected: endDate, onChange: setEndDate, selectsEnd: true, minDate: startDate },
              ].map(({ label, selected, onChange, selectsStart, selectsEnd, minDate }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">{label}</span>
                  <DatePicker
                    selected={selected}
                    onChange={onChange}
                    selectsStart={selectsStart}
                    selectsEnd={selectsEnd}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    className="h-9 bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 focus:outline-none focus:border-emerald-500 w-36"
                    wrapperClassName="block"
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Content ── */}
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/30">
            {view === "table" ? (
              <TableData data={transactions} user={cUser} />
            ) : (
              <Analytics transactions={transactions} user={cUser} />
            )}
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      <TransactionModal
        show={show}
        onClose={() => setShow(false)}
        onSubmit={handleSubmit}
        values={values}
        onChange={handleChange}
        loading={loading}
      />

      <ToastContainer />
    </>
  );
};

export default Home;
