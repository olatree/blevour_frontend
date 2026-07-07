// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "../../../api/axios";

// const FeeReceiptPage = () => {
//   const { paymentId } = useParams();

//   const [payment, setPayment] = useState(null);
//   const [error, setError] = useState("");

//   const fetchPayment = async () => {
//     try {
//       const res = await api.get(`/fees/payments/${paymentId}`);
//       setPayment(res.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load receipt");
//     }
//   };

//   useEffect(() => {
//     fetchPayment();
//   }, [paymentId]);

//   if (error) {
//     return (
//       <div className="p-6">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   if (!payment) {
//     return <div className="p-6 text-gray-500">Loading receipt...</div>;
//   }

//   const account = payment.feeAccountId;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 print:bg-white">
//       <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow print:shadow-none">
//         <div className="mb-6 flex justify-between print:hidden">
//           <Link
//             to={`/admin/fees/accounts/${account?._id}`}
//             className="rounded bg-gray-200 px-4 py-2 text-sm"
//           >
//             Back
//           </Link>

//           <button
//             onClick={() => window.print()}
//             className="rounded bg-green-600 px-4 py-2 text-sm text-white"
//           >
//             Print Receipt
//           </button>
//         </div>

//         <div className="border-b pb-4 text-center">
//           <h1 className="text-2xl font-bold uppercase text-gray-900">
//             DORCAS MEMORIAL SCHOOLS
//           </h1>
//           <p className="text-sm text-gray-600">
//             Official School Fee Payment Receipt
//           </p>
//         </div>

//         <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
//           <div>
//             <p>
//               <strong>Receipt No:</strong> {payment.reference}
//             </p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(payment.createdAt).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>Payment Method:</strong> {payment.paymentMethod}
//             </p>
//           </div>

//           <div>
//             <p>
//               <strong>Received By:</strong> {payment.receivedBy?.name}
//             </p>
//             <p>
//               <strong>Status:</strong> {payment.status}
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 rounded-lg border p-4 text-sm">
//           <h2 className="mb-3 font-bold text-gray-800">Student Details</h2>

//           <p>
//             <strong>Name:</strong> {payment.studentId?.name}
//           </p>
//           <p>
//             <strong>Admission No:</strong>{" "}
//             {payment.studentId?.admissionNumber}
//           </p>
//           <p>
//             <strong>Class:</strong> {account?.classId?.name}{" "}
//             {account?.armId?.name}
//           </p>
//           <p>
//             <strong>Session:</strong> {payment.sessionId?.name}
//           </p>
//           <p>
//             <strong>Term:</strong> {payment.termId?.name}
//           </p>
//         </div>

//         <div className="mt-6 overflow-x-auto">
//           <table className="w-full border text-sm">
//             <tbody>
//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Previous Balance
//                 </td>
//                 <td className="border px-4 py-3 text-right">
//                   ₦{Number(account?.previousBalance || 0).toLocaleString()}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Original Term Fees
//                 </td>
//                 <td className="border px-4 py-3 text-right">
//                   ₦{Number(account?.totalAmount || 0).toLocaleString()}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Total Discount
//                 </td>
//                 <td className="border px-4 py-3 text-right">
//                   ₦{Number(account?.totalDiscount || 0).toLocaleString()}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Net Payable
//                 </td>
//                 <td className="border px-4 py-3 text-right">
//                   ₦{Number(account?.netPayable || 0).toLocaleString()}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Amount Paid Now
//                 </td>
//                 <td className="border px-4 py-3 text-right font-bold text-green-700">
//                   ₦{Number(payment.amount || 0).toLocaleString()}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Total Paid So Far
//                 </td>
//                 <td className="border px-4 py-3 text-right">
//                   ₦{Number(account?.totalPaid || 0).toLocaleString()}
//                 </td>
//               </tr>

//               <tr>
//                 <td className="border px-4 py-3 font-semibold">
//                   Balance
//                 </td>
//                 <td className="border px-4 py-3 text-right font-bold text-red-700">
//                   ₦{Number(account?.totalDue || 0).toLocaleString()}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {payment.note && (
//           <div className="mt-6 text-sm">
//             <strong>Note:</strong> {payment.note}
//           </div>
//         )}

//         <div className="mt-12 flex justify-between text-sm">
//           <div>
//             <div className="mb-1 w-40 border-t border-gray-700"></div>
//             <p>Received By</p>
//           </div>

//           <div>
//             <div className="mb-1 w-40 border-t border-gray-700"></div>
//             <p>Parent/Guardian</p>
//           </div>
//         </div>

//         <p className="mt-8 text-center text-xs text-gray-500">
//           This receipt was generated electronically.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default FeeReceiptPage;


import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api/axios";

const formatMoney = (value) => `₦${Number(value || 0).toLocaleString()}`;

const formatText = (value) =>
  (value || "N/A").replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const FeeReceiptPage = () => {
  const { paymentId } = useParams();

  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  const fetchPayment = async () => {
    try {
      const res = await api.get(`/fees/payments/${paymentId}`);
      setPayment(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load receipt");
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  const account = payment?.feeAccountId;

  const summary = useMemo(() => {
    if (!account) return {};

    return {
      previousBalance: Number(account.previousBalance || 0),
      originalTermFees: Number(account.totalAmount || 0),
      totalDiscount: Number(account.totalDiscount || 0),
      netPayable: Number(account.netPayable || 0),
      amountPaidNow: Number(payment?.amount || 0),
      totalPaid: Number(account.totalPaid || 0),
      balance: Number(account.totalDue || 0),
    };
  }, [account, payment]);

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!payment) {
    return <div className="p-6 text-gray-500">Loading receipt...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow print:max-w-full print:rounded-none print:shadow-none">
        <div className="mb-6 flex justify-between print:hidden">
          <Link
            to={`/admin/fees/accounts/${account?._id}`}
            className="rounded bg-gray-200 px-4 py-2 text-sm"
          >
            Back
          </Link>

          <button
            onClick={() => window.print()}
            className="rounded bg-green-600 px-4 py-2 text-sm text-white"
          >
            Print Receipt
          </button>
        </div>

        <div className="border-b pb-4 text-center">
          <h1 className="text-2xl font-bold uppercase text-gray-900">
            Moonlight College
          </h1>
          <p className="text-sm text-gray-600">
            7, Wowo Street, Off Tolu Road, Olodi Apapa, Lagos
          </p>
          <p className="text-sm text-gray-600">
            08175967507, 08062961916
          </p>
          <p className="mt-2 text-sm font-semibold uppercase text-gray-700">
            Official School Fee Payment Receipt
          </p>
        </div>

        <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p>
              <strong>Receipt No:</strong> {payment.reference}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {payment.createdAt
                ? new Date(payment.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {formatText(payment.paymentMethod)}
            </p>
          </div>

          <div>
            <p>
              <strong>Received By:</strong>{" "}
              {payment.receivedBy?.name || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {formatText(payment.status)}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border p-4 text-sm">
          <h2 className="mb-3 font-bold text-gray-800">Student Details</h2>

          <div className="grid gap-2 md:grid-cols-2">
            <p>
              <strong>Name:</strong> {payment.studentId?.name || "N/A"}
            </p>
            <p>
              <strong>Admission No:</strong>{" "}
              {payment.studentId?.admissionNumber || "N/A"}
            </p>
            <p>
              <strong>Academic Unit:</strong>{" "}
              {account?.academicUnitId?.name || "N/A"}
            </p>
            <p>
              <strong>Billing Category:</strong>{" "}
              {formatText(account?.billingCategory)}
            </p>
            <p>
              <strong>Class:</strong> {account?.classId?.name || "N/A"}{" "}
              {account?.armId?.name || ""}
            </p>
            <p>
              <strong>Session:</strong> {payment.sessionId?.name || "N/A"}
            </p>
            <p>
              <strong>Term:</strong> {payment.termId?.name || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border text-sm">
            <tbody>
              <ReceiptRow
                label="Previous Balance"
                value={summary.previousBalance}
              />

              <ReceiptRow
                label="Original Term Fees"
                value={summary.originalTermFees}
              />

              <ReceiptRow
                label="Total Discount"
                value={summary.totalDiscount}
              />

              <ReceiptRow
                label="Net Payable"
                value={summary.netPayable}
              />

              <tr>
                <td className="border px-4 py-3 font-semibold">
                  Amount Paid Now
                </td>
                <td className="border px-4 py-3 text-right font-bold text-green-700">
                  {formatMoney(summary.amountPaidNow)}
                </td>
              </tr>

              <ReceiptRow
                label="Total Paid So Far"
                value={summary.totalPaid}
              />

              <tr>
                <td className="border px-4 py-3 font-semibold">Balance</td>
                <td className="border px-4 py-3 text-right font-bold text-red-700">
                  {formatMoney(summary.balance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {payment.note && (
          <div className="mt-6 text-sm">
            <strong>Note:</strong> {payment.note}
          </div>
        )}

        <div className="mt-12 flex justify-between text-sm">
          <div>
            <div className="mb-1 w-40 border-t border-gray-700"></div>
            <p>Received By</p>
          </div>

          <div>
            <div className="mb-1 w-40 border-t border-gray-700"></div>
            <p>Parent/Guardian</p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          This receipt was generated electronically and is valid without a
          physical signature.
        </p>
      </div>
    </div>
  );
};

const ReceiptRow = ({ label, value }) => (
  <tr>
    <td className="border px-4 py-3 font-semibold">{label}</td>
    <td className="border px-4 py-3 text-right">{formatMoney(value)}</td>
  </tr>
);

export default FeeReceiptPage;