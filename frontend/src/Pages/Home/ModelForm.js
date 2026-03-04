import React, { useState } from "react";

const ModelForm = ({ transaction, onClose, isShow }) => {

  const [show, setShow] = useState(false);

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

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div>
      {isShow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-semibold">
                Update Transaction Details
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 text-xl"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 space-y-4">

              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder={transaction.title}
                  value={values.title}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <input
                  name="amount"
                  type="number"
                  placeholder={transaction.amount}
                  value={values.amount}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Choose...</option>
                  <option value="groceries">Groceries</option>
                  <option value="rent">Rent</option>
                  <option value="rent">Salary</option>
                  <option value="rent">Tip</option>
                  <option value="rent">Food</option>
                  <option value="rent">Medical</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="transportation">Transportation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder={transaction.description}
                  value={values.description}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
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
                  className="w-full border rounded p-2"
                >
                  <option value="">Choose...</option>
                  <option value="credit">Credit</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6 border-t pt-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ModelForm;