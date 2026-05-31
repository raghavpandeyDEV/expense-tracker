import React, { useEffect, useState } from "react";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const handleEditClick = (itemKey) => {
    console.log("Clicked button ID:", itemKey);
    if (transactions.length > 0) {
      const editTran = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      handleShow();
    }
  };

  const handleEditSubmit = async (e) => {
    const { data } = await axios.put(`${editTransactions}/${currId}`, {
      ...values,
    });

    if (data.success === true) {
      await handleClose();
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const handleDeleteClick = async (itemKey) => {
    console.log(user._id);
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);

    const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
      userId: props.user._id,
    });

    if (data.success === true) {
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="overflow-x-auto rounded-2xl border border-zinc-700 bg-zinc-900/40 shadow-2xl">
        <table className="min-w-full">

          <thead className="bg-zinc-800 text-white">
            <tr>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-left font-semibold">Title</th>
              <th className="p-4 text-left font-semibold">Amount</th>
              <th className="p-4 text-left font-semibold">Type</th>
              <th className="p-4 text-left font-semibold">Category</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {props.data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200"
              >
                <td className="p-4 text-gray-300">
                  {moment(item.date).format("YYYY-MM-DD")}
                </td>

                <td className="p-4 text-white font-medium">
                  {item.title}
                </td>

                <td
                  className={`p-4 font-bold ${
                    item.transactionType === "credit"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  ₹{item.amount}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.transactionType === "credit"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {item.transactionType}
                  </span>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                    {item.category}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-3">

                    <button
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-blue-500/20 transition-all"
                      onClick={() => handleEditClick(item._id)}
                    >
                      <EditNoteIcon sx={{ color: "#60a5fa" }} />
                    </button>

                    <button
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 transition-all"
                      onClick={() => handleDeleteClick(item._id)}
                    >
                      <DeleteForeverIcon sx={{ color: "#ef4444" }} />
                    </button>

                  </div>

                  {editingTransaction &&
                    show && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">

                        <div className="bg-zinc-900 border border-zinc-700 w-[500px] rounded-2xl shadow-2xl p-6">

                          <div className="flex justify-between items-center border-b border-zinc-700 pb-3">
                            <h2 className="text-xl font-bold text-white">
                              Update Transaction
                            </h2>

                            <button
                              onClick={handleClose}
                              className="text-zinc-400 hover:text-white text-2xl"
                            >
                              ×
                            </button>
                          </div>

                         <form
  onSubmit={handleEditSubmit}
  className="space-y-4 mt-5"
>

  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-400">Title</label>
    <input
      name="title"
      placeholder={editingTransaction[0].title}
      value={values.title}
      onChange={handleChange}
      className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg"
    />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-400">Amount</label>
    <input
      name="amount"
      type="number"
      placeholder={editingTransaction[0].amount}
      value={values.amount}
      onChange={handleChange}
      className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg"
    />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-400">Category</label>
    <select
      name="category"
      value={values.category}
      onChange={handleChange}
      className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg"
    >
      <option value="">{editingTransaction[0].category}</option>
      <option value="Groceries">Groceries</option>
      <option value="Rent">Rent</option>
      <option value="Salary">Salary</option>
      <option value="Tip">Tip</option>
      <option value="Food">Food</option>
      <option value="Medical">Medical</option>
      <option value="Utilities">Utilities</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Transportation">Transportation</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-400">Description</label>
    <input
      name="description"
      placeholder={editingTransaction[0].description}
      value={values.description}
      onChange={handleChange}
      className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg"
    />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-400">Transaction Type</label>
    <select
  name="transactionType"
  value={values.transactionType || editingTransaction[0].transactionType}
  onChange={handleChange}
  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg"
>
  <option value="credit">Credit</option>
  <option value="expense">Expense</option>
</select>
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium text-zinc-400">Date</label>
    <input
      type="date"
      name="date"
      value={values.date}
      onChange={handleChange}
      className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg"
    />
  </div>

  <div className="flex justify-end gap-3 pt-4">
    <button
      type="button"
      onClick={handleClose}
      className="px-5 py-2 rounded-lg bg-zinc-700 text-white"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-5 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
    >
      Save Changes
    </button>
  </div>

</form>

                        </div>

                      </div>
                    )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default TableData;