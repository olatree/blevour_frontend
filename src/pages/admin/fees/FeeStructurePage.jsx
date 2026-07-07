
// // import React, { useEffect, useState } from "react";
// // import api from "../../../api/axios";

// // const FeeStructurePage = () => {
// //   const [sessions, setSessions] = useState([]);
// //   const [terms, setTerms] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [arms, setArms] = useState([]);
// //   const [feeTypes, setFeeTypes] = useState([]);
// //   const [structures, setStructures] = useState([]);

// //   const [editingId, setEditingId] = useState(null);

// //   const [form, setForm] = useState({
// //     sessionId: "",
// //     termId: "",
// //     classId: "",
// //     armId: "",
// //   });

// //   const [fees, setFees] = useState([{ feeTypeId: "", amount: "" }]);

// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [error, setError] = useState("");

// //   const fetchInitialData = async () => {
// //     try {
// //       const [sessionsRes, classesRes, feeTypesRes, structuresRes] =
// //         await Promise.all([
// //           api.get("/sessions"),
// //           api.get("/classes"),
// //           api.get("/fees/types/active"),
// //           api.get("/fees/structures"),
// //         ]);

// //       setSessions(sessionsRes.data.data || sessionsRes.data || []);
// //       setClasses(classesRes.data.data || classesRes.data || []);
// //       setFeeTypes(feeTypesRes.data.data || []);
// //       setStructures(structuresRes.data.data || []);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to load page data");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchInitialData();
// //   }, []);

// //   useEffect(() => {
// //     const selectedSession = sessions.find((s) => s._id === form.sessionId);
// //     setTerms(selectedSession?.terms || []);
// //   }, [form.sessionId, sessions]);

// //   useEffect(() => {
// //     const selectedClass = classes.find((cls) => cls._id === form.classId);
// //     setArms(selectedClass?.arms || []);
// //   }, [form.classId, classes]);

// //   const handleFeeChange = (index, field, value) => {
// //     const updated = [...fees];
// //     updated[index][field] = value;
// //     setFees(updated);
// //   };

// //   const addFeeRow = () => {
// //     setFees([...fees, { feeTypeId: "", amount: "" }]);
// //   };

// //   const removeFeeRow = (index) => {
// //     if (fees.length === 1) return;
// //     setFees(fees.filter((_, i) => i !== index));
// //   };

// //   const totalAmount = fees.reduce(
// //     (sum, fee) => sum + Number(fee.amount || 0),
// //     0
// //   );

// //   const resetForm = () => {
// //     setEditingId(null);

// //     setForm({
// //       sessionId: "",
// //       termId: "",
// //       classId: "",
// //       armId: "",
// //     });

// //     setFees([{ feeTypeId: "", amount: "" }]);
// //   };

// //   const handleEdit = (item) => {
// //     setMessage("");
// //     setError("");
// //     setEditingId(item._id);

// //     setForm({
// //       sessionId: item.sessionId?._id || item.sessionId || "",
// //       termId: item.termId?._id || item.termId || "",
// //       classId: item.classId?._id || item.classId || "",
// //       armId: item.armId?._id || item.armId || "",
// //     });

// //     setFees(
// //       item.fees?.length
// //         ? item.fees.map((fee) => ({
// //             feeTypeId: fee.feeTypeId?._id || fee.feeTypeId || "",
// //             amount: fee.amount || "",
// //           }))
// //         : [{ feeTypeId: "", amount: "" }]
// //     );

// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setMessage("");
// //     setError("");

// //     if (!form.sessionId || !form.termId || !form.classId) {
// //       setError("Session, term and class are required");
// //       return;
// //     }

// //     const cleanFees = fees
// //       .filter((fee) => fee.feeTypeId && Number(fee.amount) > 0)
// //       .map((fee) => ({
// //         feeTypeId: fee.feeTypeId,
// //         amount: Number(fee.amount),
// //       }));

// //     if (cleanFees.length === 0) {
// //       setError("Please add at least one valid fee item");
// //       return;
// //     }

// //     const duplicateCheck = new Set();

// //     for (const fee of cleanFees) {
// //       if (duplicateCheck.has(fee.feeTypeId)) {
// //         setError("You selected the same fee type more than once");
// //         return;
// //       }

// //       duplicateCheck.add(fee.feeTypeId);
// //     }

// //     try {
// //       setLoading(true);

// //       if (editingId) {
// //         const ok = window.confirm(
// //           "Updating this fee structure will also sync existing student fee accounts. New fee items will be added to students' accounts. Continue?"
// //         );

// //         if (!ok) {
// //           setLoading(false);
// //           return;
// //         }

// //         const res = await api.put(`/fees/structures/${editingId}`, {
// //           fees: cleanFees,
// //           isActive: true,
// //         });

// //         setMessage(
// //           `Fee structure updated successfully. Student accounts synced: ${
// //             res.data.accountsUpdated || 0
// //           }`
// //         );
// //       } else {
// //         await api.post("/fees/structures", {
// //           ...form,
// //           armId: form.armId || null,
// //           fees: cleanFees,
// //         });

// //         setMessage("Fee structure created successfully");
// //       }

// //       resetForm();
// //       fetchInitialData();
// //     } catch (err) {
// //       setError(
// //         err.response?.data?.message ||
// //           `Failed to ${editingId ? "update" : "create"} fee structure`
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDeactivate = async (id) => {
// //     if (!window.confirm("Deactivate this fee structure?")) return;

// //     try {
// //       await api.patch(`/fees/structures/${id}/deactivate`);
// //       setMessage("Fee structure deactivated successfully");
// //       fetchInitialData();
// //     } catch (err) {
// //       setError(
// //         err.response?.data?.message || "Failed to deactivate fee structure"
// //       );
// //     }
// //   };

// //   return (
// //     <div className="p-4 md:p-6">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">Fee Structures</h1>
// //         <p className="text-sm text-gray-500">
// //           Set and update fees payable by each class and arm for a session and
// //           term.
// //         </p>
// //       </div>

// //       {message && (
// //         <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
// //           {message}
// //         </div>
// //       )}

// //       {error && (
// //         <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
// //           {error}
// //         </div>
// //       )}

// //       <div className="grid gap-6 lg:grid-cols-3">
// //         <form
// //           onSubmit={handleSubmit}
// //           className="rounded-xl bg-white p-4 shadow lg:col-span-1"
// //         >
// //           <h2 className="mb-4 text-lg font-semibold text-gray-700">
// //             {editingId ? "Edit Fee Structure" : "Create Fee Structure"}
// //           </h2>

// //           {editingId && (
// //             <div className="mb-4 rounded-lg bg-yellow-100 px-3 py-2 text-sm text-yellow-800">
// //               Editing mode: changes will sync existing student fee accounts.
// //             </div>
// //           )}

// //           <div className="mb-4">
// //             <label className="mb-1 block text-sm font-medium text-gray-600">
// //               Session
// //             </label>
// //             <select
// //               value={form.sessionId}
// //               disabled={!!editingId}
// //               onChange={(e) =>
// //                 setForm({ ...form, sessionId: e.target.value, termId: "" })
// //               }
// //               className="w-full rounded-lg border px-3 py-2 outline-none focus:border-green-500 disabled:bg-gray-100"
// //             >
// //               <option value="">Select session</option>
// //               {sessions.map((session) => (
// //                 <option key={session._id} value={session._id}>
// //                   {session.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="mb-4">
// //             <label className="mb-1 block text-sm font-medium text-gray-600">
// //               Term
// //             </label>
// //             <select
// //               value={form.termId}
// //               disabled={!!editingId}
// //               onChange={(e) => setForm({ ...form, termId: e.target.value })}
// //               className="w-full rounded-lg border px-3 py-2 outline-none focus:border-green-500 disabled:bg-gray-100"
// //             >
// //               <option value="">Select term</option>
// //               {terms.map((term) => (
// //                 <option key={term._id} value={term._id}>
// //                   {term.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="mb-4">
// //             <label className="mb-1 block text-sm font-medium text-gray-600">
// //               Class
// //             </label>
// //             <select
// //               value={form.classId}
// //               disabled={!!editingId}
// //               onChange={(e) =>
// //                 setForm({ ...form, classId: e.target.value, armId: "" })
// //               }
// //               className="w-full rounded-lg border px-3 py-2 outline-none focus:border-green-500 disabled:bg-gray-100"
// //             >
// //               <option value="">Select class</option>
// //               {classes.map((cls) => (
// //                 <option key={cls._id} value={cls._id}>
// //                   {cls.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="mb-4">
// //             <label className="mb-1 block text-sm font-medium text-gray-600">
// //               Arm
// //             </label>
// //             <select
// //               value={form.armId}
// //               disabled={!!editingId}
// //               onChange={(e) => setForm({ ...form, armId: e.target.value })}
// //               className="w-full rounded-lg border px-3 py-2 outline-none focus:border-green-500 disabled:bg-gray-100"
// //             >
// //               <option value="">All arms / No arm</option>
// //               {arms.map((arm) => (
// //                 <option key={arm._id} value={arm._id}>
// //                   {arm.name}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className="mb-4">
// //             <div className="mb-2 flex items-center justify-between">
// //               <label className="text-sm font-medium text-gray-600">
// //                 Fee Items
// //               </label>
// //               <button
// //                 type="button"
// //                 onClick={addFeeRow}
// //                 className="rounded bg-green-600 px-3 py-1 text-xs text-white"
// //               >
// //                 Add
// //               </button>
// //             </div>

// //             <div className="space-y-3">
// //               {fees.map((fee, index) => (
// //                 <div key={index} className="rounded-lg border p-3">
// //                   <select
// //                     value={fee.feeTypeId}
// //                     onChange={(e) =>
// //                       handleFeeChange(index, "feeTypeId", e.target.value)
// //                     }
// //                     className="mb-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
// //                   >
// //                     <option value="">Select fee type</option>
// //                     {feeTypes.map((type) => (
// //                       <option key={type._id} value={type._id}>
// //                         {type.name}
// //                       </option>
// //                     ))}
// //                   </select>

// //                   <input
// //                     type="number"
// //                     value={fee.amount}
// //                     onChange={(e) =>
// //                       handleFeeChange(index, "amount", e.target.value)
// //                     }
// //                     placeholder="Amount"
// //                     className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
// //                   />

// //                   {fees.length > 1 && (
// //                     <button
// //                       type="button"
// //                       onClick={() => removeFeeRow(index)}
// //                       className="mt-2 text-xs text-red-600"
// //                     >
// //                       Remove
// //                     </button>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="mb-4 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold">
// //             Total: ₦{totalAmount.toLocaleString()}
// //           </div>

// //           <div className="flex gap-2">
// //             <button
// //               disabled={loading}
// //               className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
// //             >
// //               {loading
// //                 ? "Saving..."
// //                 : editingId
// //                 ? "Update & Sync"
// //                 : "Create Structure"}
// //             </button>

// //             {editingId && (
// //               <button
// //                 type="button"
// //                 onClick={resetForm}
// //                 className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
// //               >
// //                 Cancel
// //               </button>
// //             )}
// //           </div>
// //         </form>

// //         <div className="rounded-xl bg-white p-4 shadow lg:col-span-2">
// //           <h2 className="mb-4 text-lg font-semibold text-gray-700">
// //             Existing Fee Structures
// //           </h2>

// //           {structures.length === 0 ? (
// //             <p className="text-gray-500">No fee structures created yet.</p>
// //           ) : (
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full border text-sm">
// //                 <thead className="bg-gray-100 text-left">
// //                   <tr>
// //                     <th className="border px-3 py-2">Session/Term</th>
// //                     <th className="border px-3 py-2">Class</th>
// //                     <th className="border px-3 py-2">Fees</th>
// //                     <th className="border px-3 py-2">Total</th>
// //                     <th className="border px-3 py-2">Status</th>
// //                     <th className="border px-3 py-2">Action</th>
// //                   </tr>
// //                 </thead>

// //                 <tbody>
// //                   {structures.map((item) => (
// //                     <tr key={item._id}>
// //                       <td className="border px-3 py-2">
// //                         <div>{item.sessionId?.name}</div>
// //                         <div className="text-xs text-gray-500">
// //                           {item.termId?.name}
// //                         </div>
// //                       </td>

// //                       <td className="border px-3 py-2">
// //                         <div>{item.classId?.name}</div>
// //                         <div className="text-xs text-gray-500">
// //                           {item.armId?.name || "All arms"}
// //                         </div>
// //                       </td>

// //                       <td className="border px-3 py-2">
// //                         {item.fees?.map((fee) => (
// //                           <div key={fee._id} className="text-xs">
// //                             {fee.feeTypeName}: ₦
// //                             {Number(fee.amount || 0).toLocaleString()}
// //                           </div>
// //                         ))}
// //                       </td>

// //                       <td className="border px-3 py-2 font-semibold">
// //                         ₦{Number(item.totalAmount || 0).toLocaleString()}
// //                       </td>

// //                       <td className="border px-3 py-2">
// //                         <span
// //                           className={`rounded-full px-2 py-1 text-xs ${
// //                             item.isActive
// //                               ? "bg-green-100 text-green-700"
// //                               : "bg-red-100 text-red-700"
// //                           }`}
// //                         >
// //                           {item.isActive ? "Active" : "Inactive"}
// //                         </span>
// //                       </td>

// //                       <td className="border px-3 py-2">
// //                         <div className="flex flex-wrap gap-2">
// //                           <button
// //                             onClick={() => handleEdit(item)}
// //                             className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
// //                           >
// //                             Edit
// //                           </button>

// //                           {item.isActive && (
// //                             <button
// //                               onClick={() => handleDeactivate(item._id)}
// //                               className="rounded bg-red-600 px-3 py-1 text-xs text-white"
// //                             >
// //                               Deactivate
// //                             </button>
// //                           )}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default FeeStructurePage;

// import { useEffect, useMemo, useState } from "react";
// import api from "../../../api/axios";
// import toast from "react-hot-toast";
// import { Plus, Trash2, RefreshCw } from "lucide-react";

// const emptyAdditionalFee = {
//   feeType: "",
//   amount: "",
//   isCompulsory: true,
//   appliesOnce: false,
//   description: "",
// };

// const formatMoney = (value) =>
//   new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     maximumFractionDigits: 0,
//   }).format(Number(value || 0));

// const formatCategory = (value) =>
//   (value || "all")
//     .replace("_", " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// export default function FeeStructureManagement() {
//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [terms, setTerms] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [arms, setArms] = useState([]);
//   const [templates, setTemplates] = useState([]);
//   const [structures, setStructures] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     academicUnitId: "",
//     sessionId: "",
//     termId: "",
//     classId: "",
//     armId: "",
//     studentCategory: "returning",
//     feeTemplateId: "",
//     isPublished: true,
//     isActive: true,
//   });

//   const [additionalFees, setAdditionalFees] = useState([]);
//   const [removedFeeTypes, setRemovedFeeTypes] = useState([]);

//   const getData = (res) => res.data?.data ?? res.data ?? [];

//   const fetchInitialData = async () => {
//     try {
//       setLoading(true);

//       const [unitsRes, sessionsRes, structuresRes] = await Promise.all([
//         api.get("/academic-units"),
//         api.get("/sessions"),
//         api.get("/fee-structures"),
//       ]);

//       setAcademicUnits(getData(unitsRes));
//       setSessions(getData(sessionsRes));
//       setStructures(getData(structuresRes));
//     } catch (err) {
//       toast.error("Failed to load fee structure page");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     const selectedSession = sessions.find((s) => s._id === form.sessionId);
//     setTerms(selectedSession?.terms || selectedSession?.termIds || []);
//     setForm((prev) => ({ ...prev, termId: "" }));
//   }, [form.sessionId]);

//   useEffect(() => {
//     if (!form.academicUnitId) {
//       setClasses([]);
//       setTemplates([]);
//       setForm((prev) => ({
//         ...prev,
//         classId: "",
//         armId: "",
//         feeTemplateId: "",
//       }));
//       return;
//     }

//     const fetchUnitData = async () => {
//       try {
//         const [classesRes, templatesRes] = await Promise.all([
//           api.get("/classes", {
//             params: { academicUnitId: form.academicUnitId },
//           }),
//           api.get("/fee-templates", {
//             params: {
//               academicUnitId: form.academicUnitId,
//               isActive: true,
//             },
//           }),
//         ]);

//         setClasses(getData(classesRes));
//         setTemplates(getData(templatesRes));
//       } catch (err) {
//         toast.error("Failed to load classes/templates");
//         setClasses([]);
//         setTemplates([]);
//       }
//     };

//     fetchUnitData();

//     setForm((prev) => ({
//       ...prev,
//       classId: "",
//       armId: "",
//       feeTemplateId: "",
//     }));
//   }, [form.academicUnitId]);

//   useEffect(() => {
//     const selectedClass = classes.find((cls) => cls._id === form.classId);
//     setArms(selectedClass?.arms || []);
//     setForm((prev) => ({ ...prev, armId: "" }));
//   }, [form.classId]);

//   const selectedTemplate = templates.find(
//     (template) => template._id === form.feeTemplateId
//   );

//   const templateFees = selectedTemplate?.fees || [];

//   const effectiveFees = useMemo(() => {
//     const removed = new Set(
//       removedFeeTypes.map((name) => String(name).toLowerCase())
//     );

//     const baseFees = templateFees.filter(
//       (fee) => !removed.has(String(fee.feeType).toLowerCase())
//     );

//     const cleanedAdditional = additionalFees
//       .filter((fee) => fee.feeType && Number(fee.amount) >= 0)
//       .map((fee) => ({
//         feeType: fee.feeType.trim(),
//         amount: Number(fee.amount || 0),
//         isCompulsory: fee.isCompulsory !== false,
//         appliesOnce: !!fee.appliesOnce,
//         description: fee.description || "",
//       }));

//     const merged = [...baseFees];

//     cleanedAdditional.forEach((fee) => {
//       const existingIndex = merged.findIndex(
//         (item) =>
//           String(item.feeType).toLowerCase() ===
//           String(fee.feeType).toLowerCase()
//       );

//       if (existingIndex >= 0) {
//         merged[existingIndex] = fee;
//       } else {
//         merged.push(fee);
//       }
//     });

//     return merged;
//   }, [templateFees, additionalFees, removedFeeTypes]);

//   const totalAmount = effectiveFees.reduce(
//     (sum, fee) => sum + Number(fee.amount || 0),
//     0
//   );

//   const updateForm = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const addAdditionalFee = () => {
//     setAdditionalFees((prev) => [...prev, { ...emptyAdditionalFee }]);
//   };

//   const updateAdditionalFee = (index, field, value) => {
//     setAdditionalFees((prev) =>
//       prev.map((fee, i) => (i === index ? { ...fee, [field]: value } : fee))
//     );
//   };

//   const removeAdditionalFee = (index) => {
//     setAdditionalFees((prev) => prev.filter((_, i) => i !== index));
//   };

//   const toggleRemovedFee = (feeType) => {
//     setRemovedFeeTypes((prev) =>
//       prev.includes(feeType)
//         ? prev.filter((item) => item !== feeType)
//         : [...prev, feeType]
//     );
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setForm({
//       academicUnitId: "",
//       sessionId: "",
//       termId: "",
//       classId: "",
//       armId: "",
//       studentCategory: "returning",
//       feeTemplateId: "",
//       isPublished: true,
//       isActive: true,
//     });
//     setAdditionalFees([]);
//     setRemovedFeeTypes([]);
//   };

//   const validate = () => {
//     if (!form.academicUnitId) return toast.error("Select academic unit");
//     if (!form.sessionId) return toast.error("Select session");
//     if (!form.termId) return toast.error("Select term");
//     if (!form.classId) return toast.error("Select class");
//     if (!form.studentCategory) return toast.error("Select student category");
//     if (!form.feeTemplateId) return toast.error("Select fee template");

//     if (effectiveFees.length === 0) {
//       toast.error("Fee structure must have at least one effective fee");
//       return false;
//     }

//     const names = effectiveFees.map((fee) => fee.feeType.toLowerCase());
//     const duplicate = names.some((name, idx) => names.indexOf(name) !== idx);

//     if (duplicate) {
//       toast.error("Duplicate fee names are not allowed");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       setSaving(true);

//       const payload = {
//         ...form,
//         armId: form.armId || null,
//         additionalFees: additionalFees
//           .filter((fee) => fee.feeType)
//           .map((fee) => ({
//             ...fee,
//             feeType: fee.feeType.trim(),
//             amount: Number(fee.amount || 0),
//           })),
//         removedFeeTypes,
//       };

//       if (editingId) {
//         await api.put(`/fee-structures/${editingId}`, payload);
//         toast.success("Fee structure updated");
//       } else {
//         await api.post("/fee-structures", payload);
//         toast.success("Fee structure created");
//       }

//       await fetchInitialData();
//       resetForm();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Failed to save fee structure"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = async (structure) => {
//     setEditingId(structure._id);

//     const academicUnitId =
//       structure.academicUnitId?._id || structure.academicUnitId || "";

//     setForm({
//       academicUnitId,
//       sessionId: structure.sessionId?._id || structure.sessionId || "",
//       termId: structure.termId?._id || structure.termId || "",
//       classId: structure.classId?._id || structure.classId || "",
//       armId: structure.armId?._id || structure.armId || "",
//       studentCategory: structure.studentCategory || "returning",
//       feeTemplateId: structure.feeTemplateId?._id || structure.feeTemplateId || "",
//       isPublished: structure.isPublished !== false,
//       isActive: structure.isActive !== false,
//     });

//     setAdditionalFees(structure.additionalFees || []);
//     setRemovedFeeTypes(structure.removedFeeTypes || []);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this fee structure?")) return;

//     try {
//       await api.delete(`/fee-structures/${id}`);
//       toast.success("Fee structure deleted");
//       fetchInitialData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete structure");
//     }
//   };

//   const handleRecalculate = async (id) => {
//     try {
//       await api.patch(`/fee-structures/${id}/recalculate`);
//       toast.success("Fee structure recalculated");
//       fetchInitialData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to recalculate");
//     }
//   };

//   if (loading) {
//     return <p className="p-6 text-sm text-gray-600">Loading...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-5">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Fee Structure Management
//           </h1>
//           <p className="text-sm text-gray-500">
//             Apply fee templates to academic units, classes, terms, and student
//             categories.
//           </p>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <form
//             onSubmit={handleSubmit}
//             className="rounded-xl bg-white p-4 shadow-sm lg:col-span-1"
//           >
//             <h2 className="mb-4 text-lg font-semibold text-gray-800">
//               {editingId ? "Edit Fee Structure" : "Create Fee Structure"}
//             </h2>

//             <div className="space-y-4">
//               <select
//                 value={form.academicUnitId}
//                 onChange={(e) => updateForm("academicUnitId", e.target.value)}
//                 className="w-full rounded-lg border px-3 py-2 text-sm"
//               >
//                 <option value="">Select Academic Unit</option>
//                 {academicUnits.map((unit) => (
//                   <option key={unit._id} value={unit._id}>
//                     {unit.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={form.sessionId}
//                 onChange={(e) => updateForm("sessionId", e.target.value)}
//                 className="w-full rounded-lg border px-3 py-2 text-sm"
//               >
//                 <option value="">Select Session</option>
//                 {sessions.map((session) => (
//                   <option key={session._id} value={session._id}>
//                     {session.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={form.termId}
//                 onChange={(e) => updateForm("termId", e.target.value)}
//                 className="w-full rounded-lg border px-3 py-2 text-sm"
//               >
//                 <option value="">Select Term</option>
//                 {terms.map((term) => (
//                   <option key={term._id} value={term._id}>
//                     {term.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={form.classId}
//                 onChange={(e) => updateForm("classId", e.target.value)}
//                 disabled={!form.academicUnitId}
//                 className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Class</option>
//                 {classes.map((cls) => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={form.armId}
//                 onChange={(e) => updateForm("armId", e.target.value)}
//                 disabled={!form.classId}
//                 className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//               >
//                 <option value="">All Arms</option>
//                 {arms.map((arm) => (
//                   <option key={arm._id} value={arm._id}>
//                     {arm.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={form.studentCategory}
//                 onChange={(e) =>
//                   updateForm("studentCategory", e.target.value)
//                 }
//                 className="w-full rounded-lg border px-3 py-2 text-sm"
//               >
//                 <option value="all">All Students</option>
//                 <option value="returning">Returning</option>
//                 <option value="new_intake">New Intake</option>
//                 <option value="transfer">Transfer</option>
//               </select>

//               <select
//                 value={form.feeTemplateId}
//                 onChange={(e) => {
//                   updateForm("feeTemplateId", e.target.value);
//                   setRemovedFeeTypes([]);
//                 }}
//                 disabled={!form.academicUnitId}
//                 className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//               >
//                 <option value="">Select Fee Template</option>
//                 {templates
//                   .filter(
//                     (template) =>
//                       template.studentCategory === form.studentCategory ||
//                       template.studentCategory === "all"
//                   )
//                   .map((template) => (
//                     <option key={template._id} value={template._id}>
//                       {template.name} ({formatCategory(template.studentCategory)})
//                     </option>
//                   ))}
//               </select>

//               <div className="flex flex-wrap gap-4 text-sm">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={form.isPublished}
//                     onChange={(e) =>
//                       updateForm("isPublished", e.target.checked)
//                     }
//                   />
//                   Published
//                 </label>

//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={form.isActive}
//                     onChange={(e) => updateForm("isActive", e.target.checked)}
//                   />
//                   Active
//                 </label>
//               </div>
//             </div>

//             {templateFees.length > 0 && (
//               <div className="mt-5 rounded-xl border bg-gray-50 p-4">
//                 <h3 className="mb-2 font-semibold text-gray-800">
//                   Remove Template Fees
//                 </h3>

//                 <div className="space-y-2">
//                   {templateFees.map((fee) => (
//                     <label
//                       key={fee._id || fee.feeType}
//                       className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
//                     >
//                       <span>
//                         <input
//                           type="checkbox"
//                           checked={removedFeeTypes.includes(fee.feeType)}
//                           onChange={() => toggleRemovedFee(fee.feeType)}
//                           className="mr-2"
//                         />
//                         {fee.feeType}
//                       </span>

//                       <span>{formatMoney(fee.amount)}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="mt-5 rounded-xl border bg-gray-50 p-4">
//               <div className="mb-3 flex items-center justify-between">
//                 <h3 className="font-semibold text-gray-800">
//                   Additional Fees
//                 </h3>

//                 <button
//                   type="button"
//                   onClick={addAdditionalFee}
//                   className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white"
//                 >
//                   <Plus size={14} />
//                   Add
//                 </button>
//               </div>

//               {additionalFees.length === 0 ? (
//                 <p className="text-sm text-gray-500">No additional fees.</p>
//               ) : (
//                 <div className="space-y-3">
//                   {additionalFees.map((fee, index) => (
//                     <div key={index} className="rounded-lg border bg-white p-3">
//                       <input
//                         value={fee.feeType}
//                         onChange={(e) =>
//                           updateAdditionalFee(
//                             index,
//                             "feeType",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Fee name"
//                         className="mb-2 w-full rounded-lg border px-3 py-2 text-sm"
//                       />

//                       <input
//                         type="number"
//                         min="0"
//                         value={fee.amount}
//                         onChange={(e) =>
//                           updateAdditionalFee(index, "amount", e.target.value)
//                         }
//                         placeholder="Amount"
//                         className="mb-2 w-full rounded-lg border px-3 py-2 text-sm"
//                       />

//                       <textarea
//                         value={fee.description}
//                         onChange={(e) =>
//                           updateAdditionalFee(
//                             index,
//                             "description",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Description optional"
//                         rows={2}
//                         className="mb-2 w-full rounded-lg border px-3 py-2 text-sm"
//                       />

//                       <button
//                         type="button"
//                         onClick={() => removeAdditionalFee(index)}
//                         className="inline-flex items-center gap-1 text-xs font-semibold text-red-600"
//                       >
//                         <Trash2 size={14} />
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="mt-5 rounded-xl bg-gray-900 p-4 text-white">
//               <p className="text-sm">Effective Total</p>
//               <p className="text-2xl font-bold">{formatMoney(totalAmount)}</p>
//             </div>

//             <div className="mt-5 flex gap-2">
//               <button
//                 disabled={saving}
//                 className="flex-1 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
//               >
//                 {saving
//                   ? "Saving..."
//                   : editingId
//                   ? "Save Changes"
//                   : "Create Structure"}
//               </button>

//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>

//           <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
//             <h2 className="mb-4 text-lg font-semibold text-gray-800">
//               Existing Fee Structures
//             </h2>

//             {structures.length === 0 ? (
//               <p className="text-sm text-gray-500">
//                 No fee structures created yet.
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {structures.map((item) => (
//                   <div
//                     key={item._id}
//                     className="rounded-xl border bg-gray-50 p-4"
//                   >
//                     <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
//                       <div>
//                         <h3 className="font-bold text-gray-900">
//                           {item.academicUnitId?.name || "Unit"} /{" "}
//                           {item.classId?.name || "Class"} /{" "}
//                           {item.armId?.name || "All Arms"}
//                         </h3>

//                         <p className="mt-1 text-sm text-gray-500">
//                           {item.sessionId?.name || "Session"} •{" "}
//                           {item.termId?.name || "Term"} •{" "}
//                           {formatCategory(item.studentCategory)}
//                         </p>

//                         <p className="mt-1 text-sm text-gray-500">
//                           Template: {item.feeTemplateId?.name || "None"}
//                         </p>
//                       </div>

//                       <div className="text-left md:text-right">
//                         <p className="text-xl font-bold text-gray-900">
//                           {formatMoney(item.totalAmount)}
//                         </p>

//                         <div className="mt-2 flex flex-wrap gap-2 md:justify-end">
//                           <span
//                             className={`rounded-full px-2 py-1 text-xs font-semibold ${
//                               item.isPublished
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                             }`}
//                           >
//                             {item.isPublished ? "Published" : "Draft"}
//                           </span>

//                           <span
//                             className={`rounded-full px-2 py-1 text-xs font-semibold ${
//                               item.isActive
//                                 ? "bg-blue-100 text-blue-700"
//                                 : "bg-gray-200 text-gray-600"
//                             }`}
//                           >
//                             {item.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {(item.fees || []).slice(0, 6).map((fee) => (
//                         <span
//                           key={fee._id || fee.feeType}
//                           className="rounded-full bg-white px-3 py-1 text-xs"
//                         >
//                           {fee.feeType}: {formatMoney(fee.amount)}
//                         </span>
//                       ))}

//                       {(item.fees || []).length > 6 && (
//                         <span className="rounded-full bg-white px-3 py-1 text-xs">
//                           +{item.fees.length - 6} more
//                         </span>
//                       )}
//                     </div>

//                     <div className="mt-4 flex flex-wrap gap-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => handleRecalculate(item._id)}
//                         className="inline-flex items-center gap-1 rounded bg-purple-600 px-3 py-2 text-xs font-semibold text-white"
//                       >
//                         <RefreshCw size={13} />
//                         Recalculate
//                       </button>

//                       <button
//                         onClick={() => handleDelete(item._id)}
//                         className="rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { RefreshCw, Trash2 } from "lucide-react";

const categories = [
  { key: "returning", label: "Returning" },
  { key: "new_intake", label: "New Intake" },
  { key: "transfer", label: "Transfer" },
];

const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatCategory = (value) =>
  (value || "")
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const emptyMappings = {
  returning: { feeTemplateId: "", additionalFees: [], removedFeeTypes: [] },
  new_intake: { feeTemplateId: "", additionalFees: [], removedFeeTypes: [] },
  transfer: { feeTemplateId: "", additionalFees: [], removedFeeTypes: [] },
};

export default function FeeStructureManagement() {
  const [academicUnits, setAcademicUnits] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [structures, setStructures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    academicUnitId: "",
    sessionId: "",
    termId: "",
    classId: "",
    armId: "",
    isPublished: true,
    isActive: true,
  });

  const [mappings, setMappings] = useState(emptyMappings);

  const getData = (res) => res.data?.data ?? res.data ?? [];

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [unitsRes, sessionsRes, structuresRes] = await Promise.all([
        api.get("/academic-units"),
        api.get("/sessions"),
        api.get("/fee-structures"),
      ]);

      setAcademicUnits(getData(unitsRes));
      setSessions(getData(sessionsRes));
      setStructures(getData(structuresRes));
    } catch (err) {
      toast.error("Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const selectedSession = sessions.find((s) => s._id === form.sessionId);
    setTerms(selectedSession?.terms || selectedSession?.termIds || []);
    setForm((prev) => ({ ...prev, termId: "" }));
  }, [form.sessionId, sessions]);

  useEffect(() => {
    if (!form.academicUnitId) {
      setClasses([]);
      setTemplates([]);
      setForm((prev) => ({ ...prev, classId: "", armId: "" }));
      return;
    }

    const fetchUnitData = async () => {
      try {
        const [classesRes, templatesRes] = await Promise.all([
          api.get("/classes", { params: { academicUnitId: form.academicUnitId } }),
          api.get("/fee-templates", {
            params: { academicUnitId: form.academicUnitId, isActive: true },
          }),
        ]);

        setClasses(getData(classesRes));
        setTemplates(getData(templatesRes));
      } catch (err) {
        toast.error("Failed to load classes/templates");
      }
    };

    fetchUnitData();
    setForm((prev) => ({ ...prev, classId: "", armId: "" }));
  }, [form.academicUnitId]);

  useEffect(() => {
    const selectedClass = classes.find((cls) => cls._id === form.classId);
    setArms(selectedClass?.arms || []);
    setForm((prev) => ({ ...prev, armId: "" }));
  }, [form.classId, classes]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateMapping = (category, field, value) => {
    setMappings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      academicUnitId: "",
      sessionId: "",
      termId: "",
      classId: "",
      armId: "",
      isPublished: true,
      isActive: true,
    });
    setMappings(emptyMappings);
  };

  const getTemplate = (templateId) =>
    templates.find((template) => template._id === templateId);

  const previewMappingFees = (category) => {
    const mapping = mappings[category];
    const template = getTemplate(mapping.feeTemplateId);
    return template?.fees || [];
  };

  const previewTotal = (category) =>
    previewMappingFees(category).reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

  const validate = () => {
    if (!form.academicUnitId) return toast.error("Select academic unit");
    if (!form.sessionId) return toast.error("Select session");
    if (!form.termId) return toast.error("Select term");
    if (!form.classId) return toast.error("Select class");

    const selectedMappings = categories
      .map((cat) => ({
        studentCategory: cat.key,
        ...mappings[cat.key],
      }))
      .filter((mapping) => mapping.feeTemplateId);

    if (selectedMappings.length === 0) {
      toast.error("Select at least one category template");
      return false;
    }

    return true;
  };

  const buildPayloadMappings = () =>
    categories
      .map((cat) => ({
        studentCategory: cat.key,
        feeTemplateId: mappings[cat.key].feeTemplateId,
        additionalFees: mappings[cat.key].additionalFees || [],
        removedFeeTypes: mappings[cat.key].removedFeeTypes || [],
      }))
      .filter((mapping) => mapping.feeTemplateId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);

      const payload = {
        ...form,
        armId: form.armId || null,
        templateMappings: buildPayloadMappings(),
      };

      if (editingId) {
        await api.put(`/fee-structures/${editingId}`, payload);
        toast.success("Fee structure updated");
      } else {
        await api.post("/fee-structures", payload);
        toast.success("Fee structure created");
      }

      await fetchInitialData();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save fee structure");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (structure) => {
    const academicUnitId =
      structure.academicUnitId?._id || structure.academicUnitId || "";

    setEditingId(structure._id);

    setForm({
      academicUnitId,
      sessionId: structure.sessionId?._id || structure.sessionId || "",
      termId: structure.termId?._id || structure.termId || "",
      classId: structure.classId?._id || structure.classId || "",
      armId: structure.armId?._id || structure.armId || "",
      isPublished: structure.isPublished !== false,
      isActive: structure.isActive !== false,
    });

    const nextMappings = structuredClone(emptyMappings);

    (structure.templateMappings || []).forEach((mapping) => {
      nextMappings[mapping.studentCategory] = {
        feeTemplateId:
          mapping.feeTemplateId?._id || mapping.feeTemplateId || "",
        additionalFees: mapping.additionalFees || [],
        removedFeeTypes: mapping.removedFeeTypes || [],
      };
    });

    setMappings(nextMappings);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this fee structure?")) return;

    try {
      await api.delete(`/fee-structures/${id}`);
      toast.success("Fee structure deleted");
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete structure");
    }
  };

  const handleRecalculate = async (id) => {
    try {
      await api.patch(`/fee-structures/${id}/recalculate`);
      toast.success("Fee structure recalculated");
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to recalculate");
    }
  };

  const templatesForCategory = (category) =>
    templates.filter(
      (template) =>
        template.studentCategory === category || template.studentCategory === "all"
    );

  const structureGrandTotal = (structure) =>
    (structure.templateMappings || []).reduce(
      (sum, mapping) => sum + Number(mapping.totalAmount || 0),
      0
    );

  if (loading) return <p className="p-6 text-sm text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Fee Structure Management
          </h1>
          <p className="text-sm text-gray-500">
            One structure can now hold Returning, New Intake, and Transfer templates.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white p-4 shadow-sm lg:col-span-1"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              {editingId ? "Edit Fee Structure" : "Create Fee Structure"}
            </h2>

            <div className="space-y-4">
              <select
                value={form.academicUnitId}
                onChange={(e) => updateForm("academicUnitId", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select Academic Unit</option>
                {academicUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
                  </option>
                ))}
              </select>

              <select
                value={form.sessionId}
                onChange={(e) => updateForm("sessionId", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select Session</option>
                {sessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.name}
                  </option>
                ))}
              </select>

              <select
                value={form.termId}
                onChange={(e) => updateForm("termId", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Select Term</option>
                {terms.map((term) => (
                  <option key={term._id} value={term._id}>
                    {term.name}
                  </option>
                ))}
              </select>

              <select
                value={form.classId}
                onChange={(e) => updateForm("classId", e.target.value)}
                disabled={!form.academicUnitId}
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <select
                value={form.armId}
                onChange={(e) => updateForm("armId", e.target.value)}
                disabled={!form.classId}
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
              >
                <option value="">All Arms</option>
                {arms.map((arm) => (
                  <option key={arm._id} value={arm._id}>
                    {arm.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => updateForm("isPublished", e.target.checked)}
                  />
                  Published
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateForm("isActive", e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {categories.map((cat) => {
                const fees = previewMappingFees(cat.key);
                const total = previewTotal(cat.key);

                return (
                  <div key={cat.key} className="rounded-xl border bg-gray-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      {cat.label}
                    </h3>

                    <select
                      value={mappings[cat.key].feeTemplateId}
                      onChange={(e) =>
                        updateMapping(cat.key, "feeTemplateId", e.target.value)
                      }
                      disabled={!form.academicUnitId}
                      className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
                    >
                      <option value="">No template selected</option>
                      {templatesForCategory(cat.key).map((template) => (
                        <option key={template._id} value={template._id}>
                          {template.name} ({formatCategory(template.studentCategory)})
                        </option>
                      ))}
                    </select>

                    {fees.length > 0 && (
                      <div className="mt-3 rounded-lg bg-white p-3">
                        <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                          {fees.map((fee) => (
                            <div
                              key={fee._id || fee.feeType}
                              className="flex justify-between"
                            >
                              <span>{fee.feeType}</span>
                              <span>{formatMoney(fee.amount)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 border-t pt-2 text-right text-sm font-bold">
                          {formatMoney(total)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                disabled={saving}
                className="flex-1 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Structure"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Existing Fee Structures
            </h2>

            {structures.length === 0 ? (
              <p className="text-sm text-gray-500">No fee structures created yet.</p>
            ) : (
              <div className="space-y-3">
                {structures.map((item) => (
                  <div key={item._id} className="rounded-xl border bg-gray-50 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {item.academicUnitId?.name || "Unit"} /{" "}
                          {item.classId?.name || "Class"} /{" "}
                          {item.armId?.name || "All Arms"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.sessionId?.name || "Session"} •{" "}
                          {item.termId?.name || "Term"}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatMoney(structureGrandTotal(item))}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 md:justify-end">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              item.isPublished
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.isPublished ? "Published" : "Draft"}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              item.isActive
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      {(item.templateMappings || []).map((mapping) => (
                        <div
                          key={mapping._id || mapping.studentCategory}
                          className="rounded-lg bg-white p-3 text-sm"
                        >
                          <p className="font-semibold">
                            {formatCategory(mapping.studentCategory)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {mapping.feeTemplateId?.name || "Template"}
                          </p>
                          <p className="mt-2 font-bold">
                            {formatMoney(mapping.totalAmount)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleRecalculate(item._id)}
                        className="inline-flex items-center gap-1 rounded bg-purple-600 px-3 py-2 text-xs font-semibold text-white"
                      >
                        <RefreshCw size={13} />
                        Recalculate
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center gap-1 rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}