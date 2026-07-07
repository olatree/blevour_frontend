// import React, { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../../api/axios";

// const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

// const statusClass = (status) => {
//   switch (status) {
//     case "paid":
//       return "bg-green-100 text-green-700";
//     case "part_payment":
//       return "bg-yellow-100 text-yellow-700";
//     case "overpaid":
//       return "bg-purple-100 text-purple-700";
//     default:
//       return "bg-red-100 text-red-700";
//   }
// };

// const CashierPaymentPage = () => {
//   const [query, setQuery] = useState("");
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState(null);

//   const [paymentForm, setPaymentForm] = useState({
//     amount: "",
//     paymentMethod: "cash",
//     note: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [message, setMessage] = useState("");
//   const [receiptPaymentId, setReceiptPaymentId] = useState("");
//   const [error, setError] = useState("");

//   const searchAccounts = async () => {
//     if (!query.trim()) {
//       setError("Enter student name or admission number");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");
//       setReceiptPaymentId("");
//       setSelectedAccount(null);

//       const res = await api.get("/fees/accounts", {
//         params: {
//           search: query.trim(),
//           limit: 20,
//         },
//       });

//       setAccounts(res.data.data || []);
//     } catch (err) {
//       setAccounts([]);
//       setError(err.response?.data?.message || "Failed to search fee accounts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const remainingAfterPayment = useMemo(() => {
//     if (!selectedAccount) return 0;
//     return Number(selectedAccount.totalDue || 0) - Number(paymentForm.amount || 0);
//   }, [selectedAccount, paymentForm.amount]);

//   const handleRecordPayment = async (e) => {
//     e.preventDefault();

//     if (!selectedAccount?._id) {
//       setError("Select a fee account first");
//       return;
//     }

//     if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
//       setError("Enter a valid amount");
//       return;
//     }

//     try {
//       setRecording(true);
//       setError("");
//       setMessage("");
//       setReceiptPaymentId("");

//       const res = await api.post("/fees/payments", {
//         feeAccountId: selectedAccount._id,
//         amount: Number(paymentForm.amount),
//         paymentMethod: paymentForm.paymentMethod,
//         note: paymentForm.note,
//       });

//       const paymentId = res.data?.data?.payment?._id;

//       setMessage("Payment recorded successfully");
//       setReceiptPaymentId(paymentId || "");
//       setPaymentForm({
//         amount: "",
//         paymentMethod: "cash",
//         note: "",
//       });

//       await searchAccounts();
//       setSelectedAccount(null);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to record payment");
//     } finally {
//       setRecording(false);
//     }
//   };

//   useEffect(() => {
//     if (!query.trim()) {
//       setAccounts([]);
//       setSelectedAccount(null);
//     }
//   }, [query]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
//       <div className="mb-5">
//         <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
//           Cashier Payment Collection
//         </h1>
//         <p className="text-sm text-gray-500">
//           Search a student, receive payment, and print receipt.
//         </p>
//       </div>

//       {message && (
//         <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
//           {message}
//           {receiptPaymentId && (
//             <Link
//               to={`/admin/fees/receipts/${receiptPaymentId}`}
//               className="ml-3 font-semibold underline"
//             >
//               Print Receipt
//             </Link>
//           )}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
//         <label className="mb-1 block text-sm font-medium text-gray-700">
//           Search Student / Admission Number
//         </label>

//         <div className="flex flex-col gap-2 sm:flex-row">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") searchAccounts();
//             }}
//             placeholder="Type name or admission number..."
//             className="w-full rounded-lg border px-4 py-3 text-sm"
//           />

//           <button
//             onClick={searchAccounts}
//             disabled={loading}
//             className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
//           >
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </div>
//       </div>

//       <div className="grid gap-5 lg:grid-cols-2">
//         <div className="rounded-xl bg-white p-4 shadow-sm">
//           <h2 className="mb-4 text-base font-semibold text-gray-800">
//             Search Results
//           </h2>

//           {accounts.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No account selected. Search for a student to begin.
//             </p>
//           ) : (
//             <div className="space-y-3">
//               {accounts.map((account) => (
//                 <button
//                   key={account._id}
//                   type="button"
//                   onClick={() => {
//                     setSelectedAccount(account);
//                     setPaymentForm({
//                       amount: "",
//                       paymentMethod: "cash",
//                       note: "",
//                     });
//                   }}
//                   className={`w-full rounded-xl border p-4 text-left transition ${
//                     selectedAccount?._id === account._id
//                       ? "border-green-600 bg-green-50"
//                       : "bg-white hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="mb-2 flex items-start justify-between gap-3">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">
//                         {account.studentId?.name || "N/A"}
//                       </h3>
//                       <p className="text-xs text-gray-500">
//                         {account.studentId?.admissionNumber || "N/A"}
//                       </p>
//                     </div>

//                     <span
//                       className={`rounded-full px-2 py-1 text-xs capitalize ${statusClass(
//                         account.status
//                       )}`}
//                     >
//                       {account.status || "unpaid"}
//                     </span>
//                   </div>

//                   <p className="text-xs text-gray-500">
//                     {account.academicUnitId?.name || "N/A"} •{" "}
//                     {account.classId?.name || "N/A"} {account.armId?.name || ""} •{" "}
//                     {account.termId?.name || "N/A"}
//                   </p>

//                   <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
//                     <div className="rounded-lg bg-gray-100 p-2">
//                       <p className="text-gray-500">Payable</p>
//                       <p className="font-bold">{formatMoney(account.netPayable)}</p>
//                     </div>
//                     <div className="rounded-lg bg-green-50 p-2">
//                       <p className="text-gray-500">Paid</p>
//                       <p className="font-bold text-green-700">
//                         {formatMoney(account.totalPaid)}
//                       </p>
//                     </div>
//                     <div className="rounded-lg bg-red-50 p-2">
//                       <p className="text-gray-500">Due</p>
//                       <p className="font-bold text-red-700">
//                         {formatMoney(account.totalDue)}
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="rounded-xl bg-white p-4 shadow-sm">
//           <h2 className="mb-4 text-base font-semibold text-gray-800">
//             Receive Payment
//           </h2>

//           {!selectedAccount ? (
//             <p className="text-sm text-gray-500">
//               Select a student fee account to record payment.
//             </p>
//           ) : (
//             <>
//               <div className="mb-4 rounded-xl bg-gray-50 p-4">
//                 <h3 className="font-bold text-gray-900">
//                   {selectedAccount.studentId?.name}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {selectedAccount.studentId?.admissionNumber} •{" "}
//                   {selectedAccount.classId?.name} {selectedAccount.armId?.name}
//                 </p>

//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   <div className="rounded-lg bg-white p-3">
//                     <p className="text-xs text-gray-500">Outstanding</p>
//                     <p className="text-xl font-bold text-red-700">
//                       {formatMoney(selectedAccount.totalDue)}
//                     </p>
//                   </div>

//                   <div className="rounded-lg bg-white p-3">
//                     <p className="text-xs text-gray-500">Billing Category</p>
//                     <p className="text-sm font-bold capitalize">
//                       {(selectedAccount.billingCategory || "returning").replace(
//                         "_",
//                         " "
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <form onSubmit={handleRecordPayment} className="space-y-3">
//                 <input
//                   type="number"
//                   min="0"
//                   value={paymentForm.amount}
//                   onChange={(e) =>
//                     setPaymentForm({ ...paymentForm, amount: e.target.value })
//                   }
//                   placeholder="Amount paid"
//                   className="w-full rounded-lg border px-4 py-3 text-sm"
//                 />

//                 <div
//                   className={`rounded-lg p-3 text-sm ${
//                     remainingAfterPayment < 0 ? "bg-purple-50" : "bg-green-50"
//                   }`}
//                 >
//                   {remainingAfterPayment < 0 ? (
//                     <>
//                       <p className="text-purple-700">Overpayment</p>
//                       <p className="text-xl font-bold text-purple-800">
//                         +{formatMoney(Math.abs(remainingAfterPayment))}
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       <p className="text-green-700">Balance After Payment</p>
//                       <p className="text-xl font-bold text-green-800">
//                         {formatMoney(remainingAfterPayment)}
//                       </p>
//                     </>
//                   )}
//                 </div>

//                 <select
//                   value={paymentForm.paymentMethod}
//                   onChange={(e) =>
//                     setPaymentForm({
//                       ...paymentForm,
//                       paymentMethod: e.target.value,
//                     })
//                   }
//                   className="w-full rounded-lg border px-4 py-3 text-sm"
//                 >
//                   <option value="cash">Cash</option>
//                   <option value="bank_transfer">Bank Transfer</option>
//                   <option value="pos">POS</option>
//                   <option value="online">Online</option>
//                   <option value="cheque">Cheque</option>
//                 </select>

//                 <textarea
//                   value={paymentForm.note}
//                   onChange={(e) =>
//                     setPaymentForm({ ...paymentForm, note: e.target.value })
//                   }
//                   placeholder="Optional note"
//                   rows="3"
//                   className="w-full rounded-lg border px-4 py-3 text-sm"
//                 />

//                 <button
//                   type="submit"
//                   disabled={recording}
//                   className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
//                 >
//                   {recording ? "Recording..." : "Receive Payment"}
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CashierPaymentPage;


import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../api/axios";

const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

const statusClass = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "part_payment":
      return "bg-yellow-100 text-yellow-700";
    case "overpaid":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-red-100 text-red-700";
  }
};

const CashierPaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountIdFromUrl = searchParams.get("account");

  const [query, setQuery] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "cash",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const searchAccounts = async () => {
    if (!query.trim()) {
      setError("Enter student name or admission number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSelectedAccount(null);

      const res = await api.get("/fees/accounts", {
        params: {
          search: query.trim(),
          limit: 20,
        },
      });

      setAccounts(res.data.data || []);
    } catch (err) {
      setAccounts([]);
      setError(err.response?.data?.message || "Failed to search fee accounts");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountById = async (accountId) => {
    try {
      setLoadingAccount(true);
      setError("");

      const res = await api.get(`/fees/accounts/${accountId}`);
      const account = res.data.data;

      setSelectedAccount(account);
      setAccounts(account ? [account] : []);
    } catch (err) {
      setSelectedAccount(null);
      setAccounts([]);
      setError(err.response?.data?.message || "Failed to load fee account");
    } finally {
      setLoadingAccount(false);
    }
  };

  useEffect(() => {
    if (accountIdFromUrl) {
      fetchAccountById(accountIdFromUrl);
    }
  }, [accountIdFromUrl]);

  useEffect(() => {
    if (!query.trim() && !accountIdFromUrl) {
      setAccounts([]);
      setSelectedAccount(null);
    }
  }, [query, accountIdFromUrl]);

  const remainingAfterPayment = useMemo(() => {
    if (!selectedAccount) return 0;
    return Number(selectedAccount.totalDue || 0) - Number(paymentForm.amount || 0);
  }, [selectedAccount, paymentForm.amount]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();

    if (!selectedAccount?._id) {
      setError("Select a fee account first");
      return;
    }

    if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }

    try {
      setRecording(true);
      setError("");

      const res = await api.post("/fees/payments", {
        feeAccountId: selectedAccount._id,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        note: paymentForm.note,
      });

      const paymentId = res.data?.data?.payment?._id;

      if (paymentId) {
        navigate(`/admin/fees/receipts/${paymentId}`);
      } else {
        navigate(`/admin/fees/accounts/${selectedAccount._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Cashier Payment Collection
          </h1>
          <p className="text-sm text-gray-500">
            Search a student, receive payment, and print receipt.
          </p>
        </div>

        <Link
          to="/admin/fees/accounts"
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-700"
        >
          Back to Accounts
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loadingAccount && (
        <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Loading selected fee account...
        </div>
      )}

      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Search Student / Admission Number
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchAccounts();
            }}
            placeholder="Type name or admission number..."
            className="w-full rounded-lg border px-4 py-3 text-sm"
          />

          <button
            onClick={searchAccounts}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Fee Account
          </h2>

          {accounts.length === 0 ? (
            <p className="text-sm text-gray-500">
              No account selected. Search for a student or open from fee account details.
            </p>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => (
                <button
                  key={account._id}
                  type="button"
                  onClick={() => {
                    setSelectedAccount(account);
                    setPaymentForm({
                      amount: "",
                      paymentMethod: "cash",
                      note: "",
                    });
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedAccount?._id === account._id
                      ? "border-green-600 bg-green-50"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {account.studentId?.name || "N/A"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {account.studentId?.admissionNumber || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs capitalize ${statusClass(
                        account.status
                      )}`}
                    >
                      {account.status || "unpaid"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {account.academicUnitId?.name || "N/A"} •{" "}
                    {account.classId?.name || "N/A"} {account.armId?.name || ""} •{" "}
                    {account.termId?.name || "N/A"}
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <p className="text-gray-500">Payable</p>
                      <p className="font-bold">{formatMoney(account.netPayable)}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-2">
                      <p className="text-gray-500">Paid</p>
                      <p className="font-bold text-green-700">
                        {formatMoney(account.totalPaid)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-2">
                      <p className="text-gray-500">Due</p>
                      <p className="font-bold text-red-700">
                        {formatMoney(account.totalDue)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            Receive Payment
          </h2>

          {!selectedAccount ? (
            <p className="text-sm text-gray-500">
              Select a student fee account to record payment.
            </p>
          ) : (
            <>
              <div className="mb-4 rounded-xl bg-gray-50 p-4">
                <h3 className="font-bold text-gray-900">
                  {selectedAccount.studentId?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedAccount.studentId?.admissionNumber} •{" "}
                  {selectedAccount.classId?.name} {selectedAccount.armId?.name}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs text-gray-500">Outstanding</p>
                    <p className="text-xl font-bold text-red-700">
                      {formatMoney(selectedAccount.totalDue)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs text-gray-500">Billing Category</p>
                    <p className="text-sm font-bold capitalize">
                      {(selectedAccount.billingCategory || "returning").replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-3">
                <input
                  type="number"
                  min="0"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  placeholder="Amount paid"
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                />

                <div
                  className={`rounded-lg p-3 text-sm ${
                    remainingAfterPayment < 0 ? "bg-purple-50" : "bg-green-50"
                  }`}
                >
                  {remainingAfterPayment < 0 ? (
                    <>
                      <p className="text-purple-700">Overpayment</p>
                      <p className="text-xl font-bold text-purple-800">
                        +{formatMoney(Math.abs(remainingAfterPayment))}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-green-700">Balance After Payment</p>
                      <p className="text-xl font-bold text-green-800">
                        {formatMoney(remainingAfterPayment)}
                      </p>
                    </>
                  )}
                </div>

                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMethod: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="pos">POS</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                </select>

                <textarea
                  value={paymentForm.note}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, note: e.target.value })
                  }
                  placeholder="Optional note"
                  rows="3"
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                />

                <button
                  type="submit"
                  disabled={recording}
                  className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {recording ? "Recording..." : "Receive Payment"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierPaymentPage;