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

/* ─── Global Styles ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }
    body { background: #080808; margin: 0; }

    :root {
      --green: #00e57a;
      --green-dim: rgba(0,229,122,0.12);
      --green-border: rgba(0,229,122,0.25);
      --red: #ff4d6a;
      --red-dim: rgba(255,77,106,0.12);
      --surface: #111111;
      --surface-2: #191919;
      --surface-3: #222222;
      --border: rgba(255,255,255,0.07);
      --border-hover: rgba(255,255,255,0.14);
      --text-primary: #f0f0f0;
      --text-secondary: #888;
      --text-muted: #444;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-green {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,122,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(0,229,122,0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: scale(0.96) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .fade-up { animation: fadeUp 0.4s ease both; }
    .slide-in { animation: slideIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }

    /* DatePicker overrides */
    .react-datepicker { background: #191919 !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px !important; font-family: 'Geist', sans-serif !important; overflow: hidden; }
    .react-datepicker__header { background: #111 !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; }
    .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day { color: #f0f0f0 !important; }
    .react-datepicker__day:hover { background: rgba(0,229,122,0.15) !important; border-radius: 6px !important; }
    .react-datepicker__day--selected { background: #00e57a !important; color: #000 !important; border-radius: 6px !important; font-weight: 600 !important; }
    .react-datepicker__day--keyboard-selected { background: rgba(0,229,122,0.2) !important; border-radius: 6px !important; }
    .react-datepicker__navigation-icon::before { border-color: #888 !important; }
    .react-datepicker__input-container input {
      background: #191919;
      border: 1px solid rgba(255,255,255,0.08);
      color: #f0f0f0;
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 13px;
      font-family: 'Geist', sans-serif;
      outline: none;
      width: 140px;
      transition: border-color 0.2s;
    }
    .react-datepicker__input-container input:focus { border-color: rgba(0,229,122,0.5); }

    /* Insight prose */
    .insight-text { line-height: 1.75; }
    .insight-text strong { color: var(--green); font-weight: 600; }
  `}</style>
);

/* ─── Icon Components ─────────────────────────────────────────── */
const ListIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#00e57a" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const ChartIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#00e57a" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

/* ─── Modal ───────────────────────────────────────────────────── */
const TransactionModal = ({ show, onClose, onSubmit, values, onChange, loading }) => {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      />
      {/* Panel */}
      <div
        className="slide-in"
        style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: "440px",
          background: "linear-gradient(145deg, #161616, #111111)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "20px", overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Top accent line */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #00e57a, transparent)" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.2em", fontWeight: 600, color: "#00e57a", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Geist Mono', monospace" }}>
              New Entry
            </p>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 400, color: "#f0f0f0", fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
              Add Transaction
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f0f0f0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#888"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "0 24px 8px", maxHeight: "60vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Title", name: "title", type: "text", placeholder: "e.g. Grocery Run" },
            { label: "Amount (₹)", name: "amount", type: "number", placeholder: "0.00" },
            { label: "Description", name: "description", type: "text", placeholder: "Brief note…" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Geist Mono', monospace" }}>
                {label}
              </label>
              <input
                name={name} type={type} placeholder={placeholder} value={values[name]} onChange={onChange}
                style={{ width: "100%", background: "#191919", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", fontFamily: "'Geist', sans-serif", outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,229,122,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>
          ))}

          {/* Type */}
          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Geist Mono', monospace" }}>
              Transaction Type
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { val: "credit", label: "↑ Credit", activeStyle: { background: "rgba(0,229,122,0.1)", border: "1px solid rgba(0,229,122,0.4)", color: "#00e57a" } },
                { val: "expense", label: "↓ Expense", activeStyle: { background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.4)", color: "#ff4d6a" } },
              ].map(({ val, label, activeStyle }) => (
                <button
                  key={val} type="button"
                  onClick={() => onChange({ target: { name: "transactionType", value: val } })}
                  style={{
                    padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Geist', sans-serif",
                    ...(values.transactionType === val ? activeStyle : { background: "#191919", border: "1px solid rgba(255,255,255,0.08)", color: "#666" })
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: "block", fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Geist Mono', monospace" }}>
              Date
            </label>
            <input
              type="date" name="date" value={values.date} onChange={onChange}
              style={{ width: "100%", background: "#191919", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "11px 14px", color: "#f0f0f0", fontSize: "14px", fontFamily: "'Geist', sans-serif", outline: "none", colorScheme: "dark", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "rgba(0,229,122,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "10px", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "8px" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Geist', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#f0f0f0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#888"; }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit} disabled={loading}
            style={{ flex: 1, padding: "12px", borderRadius: "10px", background: loading ? "#333" : "#00e57a", border: "none", color: loading ? "#666" : "#000", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "'Geist', sans-serif", animation: !loading ? "pulse-green 2s ease-in-out infinite" : "none" }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1affaa"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#00e57a"; }}
          >
            {loading ? "Saving…" : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Stats Card ──────────────────────────────────────────────── */
const StatsCard = ({ label, value, sub, accentColor }) => (
  <div style={{
    flex: "1 1 160px", minWidth: "140px", background: "#111",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px", padding: "20px 22px",
    borderTop: `2px solid ${accentColor}`,
    transition: "border-color 0.2s, transform 0.2s",
    position: "relative", overflow: "hidden",
  }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: `radial-gradient(circle at top right, ${accentColor}10, transparent 70%)`, pointerEvents: "none" }} />
    <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase", marginBottom: "10px", fontFamily: "'Geist Mono', monospace" }}>
      {label}
    </p>
    <p style={{ fontSize: "22px", fontWeight: 400, color: "#f0f0f0", margin: 0, fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.01em" }}>
      {value}
    </p>
  </div>
);

/* ─── Select ──────────────────────────────────────────────────── */
const StyledSelect = ({ label, value, onChange, name, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", color: "#444", textTransform: "uppercase", fontFamily: "'Geist Mono', monospace" }}>
      {label}
    </span>
    <div style={{ position: "relative" }}>
      <select
        name={name} value={value} onChange={onChange}
        style={{
          height: "36px", background: "#191919", border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0f0", fontSize: "13px", borderRadius: "10px", padding: "0 32px 0 12px",
          outline: "none", appearance: "none", cursor: "pointer", fontFamily: "'Geist', sans-serif",
          transition: "border-color 0.2s", minWidth: "130px",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(0,229,122,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      >
        {options.map(({ value: v, label: l }) => <option key={v} value={v}>{l}</option>)}
      </select>
      <svg style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  </div>
);

/* ─── View Toggle Button ──────────────────────────────────────── */
const ViewBtn = ({ active, onClick, icon, title }) => (
  <button
    onClick={onClick} title={title}
    style={{
      width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
      background: active ? "rgba(0,229,122,0.12)" : "transparent",
      border: active ? "1px solid rgba(0,229,122,0.3)" : "1px solid transparent",
      cursor: "pointer", transition: "all 0.2s",
    }}
  >
    {icon}
  </button>
);

/* ─── Main Component ──────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right", autoClose: 2500,
    hideProgressBar: false, closeOnClick: true,
    pauseOnHover: false, draggable: true, theme: "dark",
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
  //Insights
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
//Chat with Expenses
  const [question, setQuestion] =
  useState("");
const [answer, setAnswer] =
  useState("");

const [chatLoading, setChatLoading] =
  useState(false);

  

  const [values, setValues] = useState({
    title: "", amount: "", description: "",
    category: "", date: "", transactionType: "",
  });

 

//Insights function
  const getInsights = async () => {
    try {
      setLoadingInsight(true);
      const { data } = await axios.post("http://localhost:8000/api/insights", { userId: cUser._id });
      setInsight(data.insight);
    } catch (error) {
      console.log(error);
      toast.error("Could not load insights", toastOptions);
    } finally {
      setLoadingInsight(false);
    }
  };

  //Chat with Expenses function : 
  const askAI = async () => {

  try {

    setChatLoading(true);

    const { data } =
      await axios.post(
        "http://localhost:8000/api/chat",
        {
          userId: cUser._id,
          question,
        }
      );

    setAnswer(data.answer);

  } catch(error) {

    console.log(error);

  } finally {

    setChatLoading(false);
  }
};

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.isAvatarImageSet === false || user.avatarImage === "") navigate("/setAvatar");
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
        const { data } = await axios.post(getTransactions, { userId: cUser._id, frequency, startDate, endDate, type });
        setTransactions(data.transactions);
      } catch {
        toast.error("Failed to load transactions", toastOptions);
      } finally {
        setLoading(false);
      }
    };
    if (cUser) fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, date, transactionType } = values;
    if (!title || !amount || !description || !date || !transactionType)
      return toast.error("Please fill in all fields", toastOptions);
    setLoading(true);
    const { data } = await axios.post(addTransaction, {
      title, amount, description, date, transactionType, userId: cUser._id,
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

  const handleReset = () => { setType("all"); setStartDate(null); setEndDate(null); setFrequency("7"); };

  /* Derived */
  const totalCredit = transactions.filter(t => t.transactionType === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.transactionType === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const balance = totalCredit - totalExpense;
  const fmt = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <>
      <GlobalStyles />
      <Header />

      {loading && !transactions.length ? (
        <Spinner />
      ) : (
        <div
          className="fade-up"
          style={{
            minHeight: "100vh", background: "#080808",
            padding: "32px 24px 64px",
            maxWidth: "1200px", margin: "0 auto",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          {/* ── Page Heading ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.28em", fontWeight: 600, color: "#00e57a", textTransform: "uppercase", marginBottom: "6px", fontFamily: "'Geist Mono', monospace" }}>
                Finance Tracker
              </p>
              <h1 style={{ margin: 0, fontSize: "38px", fontWeight: 400, color: "#f0f0f0", fontFamily: "'Instrument Serif', serif", letterSpacing: "-0.02em", fontStyle: "italic", lineHeight: 1 }}>
                Transactions
              </h1>
            </div>
            <button
              onClick={() => setShow(true)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                height: "40px", padding: "0 20px",
                background: "#00e57a", color: "#000",
                border: "none", borderRadius: "10px",
                fontSize: "13px", fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s", fontFamily: "'Geist', sans-serif",
                boxShadow: "0 4px 24px rgba(0,229,122,0.25)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1affaa"; e.currentTarget.style.boxShadow = "0 4px 32px rgba(0,229,122,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#00e57a"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,229,122,0.25)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add New
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
            <StatsCard label="Total Earned" value={`₹${fmt(totalCredit)}`} accentColor="#00e57a" />
            <StatsCard label="Total Spent" value={`₹${fmt(totalExpense)}`} accentColor="#ff4d6a" />
            <StatsCard
              label="Net Balance"
              value={`${balance >= 0 ? "+" : "−"}₹${fmt(Math.abs(balance))}`}
              accentColor={balance >= 0 ? "#4d9fff" : "#ff8c4d"}
            />
            <StatsCard label="Entries" value={transactions.length} accentColor="#a855f7" />
          </div>

          {/* ── Control Bar ── */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px",
            padding: "16px 20px", background: "#111",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px", marginBottom: "12px",
          }}>
            <StyledSelect
              label="Frequency" name="frequency" value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              options={[
                { value: "7", label: "Last 7 days" },
                { value: "30", label: "Last 30 days" },
                { value: "365", label: "Last year" },
                { value: "custom", label: "Custom range" },
              ]}
            />

            <StyledSelect
              label="Type" name="type" value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: "all", label: "All types" },
                { value: "expense", label: "Expenses" },
                { value: "credit", label: "Credits" },
              ]}
            />

            {/* Separator */}
            <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.07)", alignSelf: "flex-end" }} />

            {/* View Toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.18em", color: "#444", textTransform: "uppercase", fontFamily: "'Geist Mono', monospace" }}>View</span>
              <div style={{ display: "flex", gap: "4px", background: "#191919", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "3px" }}>
                <ViewBtn active={view === "table"} onClick={() => setView("table")} title="Table view" icon={<ListIcon active={view === "table"} />} />
                <ViewBtn active={view === "chart"} onClick={() => setView("chart")} title="Analytics view" icon={<ChartIcon active={view === "chart"} />} />
              </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Reset */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "10px", color: "transparent", userSelect: "none" }}>_</span>
              <button
                onClick={handleReset}
                style={{ height: "36px", padding: "0 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#666", fontSize: "13px", fontWeight: 500, borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Geist', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#f0f0f0"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#666"; }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* ── Custom Date Range ── */}
          {frequency === "custom" && (
            <div
              className="fade-up"
              style={{
                display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "16px",
                padding: "14px 20px", background: "#111",
                border: "1px solid rgba(0,229,122,0.15)",
                borderRadius: "14px", marginBottom: "12px",
              }}
            >
              <p style={{ fontSize: "11px", color: "#555", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.1em", alignSelf: "center", margin: 0 }}>
                CUSTOM RANGE
              </p>
              {[
                { label: "From", selected: startDate, onChange: setStartDate, selectsStart: true },
                { label: "To", selected: endDate, onChange: setEndDate, selectsEnd: true, minDate: startDate },
              ].map(({ label, selected, onChange, selectsStart, selectsEnd, minDate }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#444", textTransform: "uppercase", fontFamily: "'Geist Mono', monospace" }}>{label}</span>
                  <DatePicker
                    selected={selected} onChange={onChange}
                    selectsStart={selectsStart} selectsEnd={selectsEnd}
                    startDate={startDate} endDate={endDate} minDate={minDate}
                  />
                </div>
              ))}
            </div>
          )}

         

          {/* ── AI Insights ── */}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={getInsights} disabled={loadingInsight}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 18px", borderRadius: "10px",
                background: loadingInsight ? "#191919" : "rgba(0,229,122,0.08)",
                border: `1px solid ${loadingInsight ? "rgba(255,255,255,0.07)" : "rgba(0,229,122,0.25)"}`,
                color: loadingInsight ? "#555" : "#00e57a",
                fontSize: "13px", fontWeight: 600, cursor: loadingInsight ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: "'Geist', sans-serif",
              }}
              onMouseEnter={e => { if (!loadingInsight) { e.currentTarget.style.background = "rgba(0,229,122,0.14)"; e.currentTarget.style.borderColor = "rgba(0,229,122,0.45)"; }}}
              onMouseLeave={e => { if (!loadingInsight) { e.currentTarget.style.background = "rgba(0,229,122,0.08)"; e.currentTarget.style.borderColor = "rgba(0,229,122,0.25)"; }}}
            >
              {loadingInsight ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Analysing…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  Generate AI Insights
                </>
              )}
            </button>

            {insight && (
              <div
                className="fade-up"
                style={{
                  marginTop: "12px", padding: "20px 24px",
                  background: "linear-gradient(135deg, rgba(0,229,122,0.04), rgba(0,229,122,0.02))",
                  border: "1px solid rgba(0,229,122,0.18)",
                  borderRadius: "14px", borderLeft: "3px solid #00e57a",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "radial-gradient(circle at top right, rgba(0,229,122,0.05), transparent 70%)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "16px" }}>✦</span>
                  <h3 style={{ margin: 0, fontSize: "12px", fontWeight: 600, letterSpacing: "0.18em", color: "#00e57a", textTransform: "uppercase", fontFamily: "'Geist Mono', monospace" }}>
                    AI Insights
                  </h3>
                </div>
                <p className="insight-text" style={{ margin: 0, color: "#bbb", fontSize: "14px", lineHeight: 1.75, fontFamily: "'Geist', sans-serif" }}>
                  {insight}
                </p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl mb-5">

  <h2 className="text-2xl font-bold text-emerald-400 mb-3">
    🤖 Ask AI
  </h2>

  <input
    type="text"
    value={question}
    onChange={(e) =>
      setQuestion(e.target.value)
    }
    placeholder="Where did I spend the most?"
    className="w-full p-3 rounded-lg bg-zinc-800 text-white"
  />

  <button
    onClick={askAI}
    className="mt-3 px-4 py-2 bg-emerald-500 text-black rounded-lg"
  >
    {
      chatLoading
      ? "Thinking..."
      : "Ask AI"
    }
  </button>

  {
    answer && (
      <div className="mt-4 p-4 rounded-lg bg-zinc-800 text-white">
        {answer}
      </div>
    )
  }

</div>

          {/* ── Content Table/Chart ── */}
          <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden" }}>
            {view === "table" ? (
              <TableData data={transactions} user={cUser} />
            ) : (
              <Analytics transactions={transactions} user={cUser} />
            )}
          </div>
        </div>
      )}

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