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
    <div className="max-w-6xl mx-auto p-4">

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {props.data.map((item, index) => (
              <tr key={index} className="text-center border">

                <td className="p-3 border">
                  {moment(item.date).format("YYYY-MM-DD")}
                </td>

                <td className="p-3 border">{item.title}</td>

                <td className="p-3 border">{item.amount}</td>

                <td className="p-3 border">{item.transactionType}</td>

                <td className="p-3 border">{item.category}</td>

                <td className="p-3 border">

                  <div className="flex gap-3 justify-center">

                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={item._id}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />

                  </div>

                  {editingTransaction ? (

                    show && (

                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

                        <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">

                          {/* Header */}
                          <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-lg font-semibold">
                              Update Transaction Details
                            </h2>

                            <button
                              onClick={handleClose}
                              className="text-xl"
                            >
                              ×
                            </button>
                          </div>

                          {/* Form */}
                          <form
                            onSubmit={handleEditSubmit}
                            className="space-y-4 mt-4"
                          >

                            <div>
                              <label className="block mb-1 font-medium">
                                Title
                              </label>

                              <input
                                name="title"
                                type="text"
                                placeholder={editingTransaction[0].title}
                                value={values.title}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                              />
                            </div>

                            <div>
                              <label className="block mb-1 font-medium">
                                Amount
                              </label>

                              <input
                                name="amount"
                                type="number"
                                placeholder={editingTransaction[0].amount}
                                value={values.amount}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                              />
                            </div>

                            <div>
                              <label className="block mb-1 font-medium">
                                Category
                              </label>

                              <select
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                              >

                                <option value="">
                                  {editingTransaction[0].category}
                                </option>

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
                              <label className="block mb-1 font-medium">
                                Description
                              </label>

                              <input
                                type="text"
                                name="description"
                                placeholder={editingTransaction[0].description}
                                value={values.description}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                              />
                            </div>

                            <div>
                              <label className="block mb-1 font-medium">
                                Transaction Type
                              </label>

                              <select
                                name="transactionType"
                                value={values.transactionType}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                              >

                                <option value={editingTransaction[0].transactionType}>
                                  {editingTransaction[0].transactionType}
                                </option>

                                <option value="Credit">Credit</option>
                                <option value="Expense">Expense</option>

                              </select>
                            </div>

                            <div>
                              <label className="block mb-1 font-medium">
                                Date
                              </label>

                              <input
                                type="date"
                                name="date"
                                value={values.date}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                              />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-4">

                              <button
                                type="button"
                                onClick={handleClose}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                              >
                                Close
                              </button>

                              <button
                                type="submit"
                                onClick={handleEditSubmit}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                              >
                                Submit
                              </button>

                            </div>

                          </form>

                        </div>

                      </div>

                    )

                  ) : (
                    <></>
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