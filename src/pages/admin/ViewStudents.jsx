// // src/pages/admin/ViewStudents.jsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import api from "../../api/axios";
// import toast from "react-hot-toast";

// const formatCategory = (value) =>
//   (value || "returning")
//     .replace("_", " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());

// const statusLabel = (student) => {
//   if (student?.status === "graduated") return "Graduated";
//   if (student?.archived) return "Archived";
//   if (student?.blocked) return "Blocked";
//   return "Active";
// };

// export default function ViewStudents() {
//   const [students, setStudents] = useState([]);
//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [classes, setClasses] = useState([]);

//   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedArm, setSelectedArm] = useState("");
//   const [studentStatus, setStudentStatus] = useState("active");
//   const [studentCategory, setStudentCategory] = useState("");
//   const [search, setSearch] = useState("");

//   const [activeSession, setActiveSession] = useState(null);
//   const [activeTerm, setActiveTerm] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const printRef = useRef();

//   const getResponseData = (res) => res.data?.data ?? res.data;

//   const fetchActiveSessionTerm = async () => {
//     try {
//       const res = await api.get("/sessions/active");
//       const payload = getResponseData(res);

//       setActiveSession(payload?.session || res.data?.session || null);
//       setActiveTerm(payload?.term || res.data?.term || null);
//     } catch (err) {
//       console.error("Failed to fetch active session/term:", err);
//     }
//   };

//   const fetchAcademicUnits = async () => {
//     try {
//       const res = await api.get("/academic-units");
//       const payload = getResponseData(res);
//       setAcademicUnits(Array.isArray(payload) ? payload : []);
//     } catch (err) {
//       console.error("Failed to fetch academic units:", err);
//       setAcademicUnits([]);
//     }
//   };

//   const fetchClasses = async (academicUnitId = selectedAcademicUnit) => {
//     try {
//       const params = {};
//       if (academicUnitId) params.academicUnitId = academicUnitId;

//       const res = await api.get("/classes", { params });
//       const payload = getResponseData(res);

//       setClasses(Array.isArray(payload) ? payload : []);
//     } catch (err) {
//       console.error("Failed to fetch classes:", err);
//       setClasses([]);
//     }
//   };

//   const fetchStudents = async () => {
//     if (!activeSession?._id) return;

//     try {
//       setLoading(true);
//       setError("");

//       const params = {
//         sessionId: activeSession._id,
//         studentStatus,
//       };

//       if (selectedAcademicUnit) params.academicUnitId = selectedAcademicUnit;
//       if (selectedClass) params.classId = selectedClass;
//       if (selectedArm) params.armId = selectedArm;

//       const res = await api.get("/students", { params });
//       const payload = getResponseData(res);

//       setStudents(Array.isArray(payload) ? payload : []);
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Failed to fetch students:", err);
//       setError("Failed to fetch students");
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveSessionTerm();
//     fetchAcademicUnits();
//   }, []);

//   useEffect(() => {
//     fetchClasses(selectedAcademicUnit);
//     setSelectedClass("");
//     setSelectedArm("");
//   }, [selectedAcademicUnit]);

//   useEffect(() => {
//     fetchStudents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     activeSession,
//     selectedAcademicUnit,
//     selectedClass,
//     selectedArm,
//     studentStatus,
//   ]);

//   const selectedAcademicUnitObj = academicUnits.find(
//     (u) => u._id === selectedAcademicUnit
//   );

//   const selectedClassObj = classes.find((c) => c._id === selectedClass);

//   const armsForSelectedClass = () => {
//     if (!selectedClass) return [];
//     return Array.isArray(selectedClassObj?.arms) ? selectedClassObj.arms : [];
//   };

//   const filteredStudents = useMemo(() => {
//     let list = Array.isArray(students) ? students : [];

//     if (studentCategory) {
//       list = list.filter((en) => en.studentCategory === studentCategory);
//     }

//     if (search.trim()) {
//       const q = search.trim().toLowerCase();

//       list = list.filter((en) => {
//         const student = en.studentId || {};

//         return (
//           student.name?.toLowerCase().includes(q) ||
//           student.admissionNumber?.toLowerCase().includes(q) ||
//           student.parentContact?.toLowerCase().includes(q)
//         );
//       });
//     }

//     return list;
//   }, [students, studentCategory, search]);

//   const totalPages = Math.ceil(filteredStudents.length / pageSize);

//   const paginatedStudents = filteredStudents.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const openModal = (student) => setSelectedStudent(student);
//   const closeModal = () => setSelectedStudent(null);

//   const toggleBlock = async () => {
//     if (!selectedStudent?.studentId?._id) return;

//     try {
//       const studentId = selectedStudent.studentId._id;

//       const url = selectedStudent.studentId.blocked
//         ? `/students/${studentId}/unblock`
//         : `/students/${studentId}/block`;

//       const res = await api.patch(url);
//       toast.success(res.data?.message || "Student status updated");

//       await fetchStudents();
//       closeModal();
//     } catch (err) {
//       console.error("Failed to toggle block:", err);
//       toast.error(
//         err.response?.data?.message || "Failed to update student status"
//       );
//     }
//   };

//   const handlePrintProfile = () => {
//     if (!printRef.current) return;

//     const printContents = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "height=700,width=900");

//     if (!printWindow) {
//       toast.error("Please allow popups to print student profile.");
//       return;
//     }

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Student Profile</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
//             .report-card { border: 1px solid #000; padding: 20px; max-width: 700px; margin: auto; }
//             .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
//             .profile { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
//             .profile img { width: 90px; height: 90px; border-radius: 50%; border: 1px solid #333; object-fit: cover; }
//             .section { margin-bottom: 15px; }
//             .section h3 { font-size: 14px; border-bottom: 1px solid #333; padding-bottom: 3px; margin-bottom: 8px; }
//             .section p { margin: 3px 0; }
//             .footer { margin-top: 30px; text-align: center; font-size: 11px; border-top: 1px solid #000; padding-top: 5px; }
//           </style>
//         </head>
//         <body>
//           <div class="report-card">${printContents}</div>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//   };

//   const handlePrintList = () => {
//     if (!filteredStudents.length) {
//       toast.error("No students to print");
//       return;
//     }

//     const rows = filteredStudents
//       .map(
//         (en, idx) => `
//           <tr>
//             <td>${idx + 1}</td>
//             <td>${en.studentId?.name || "—"}</td>
//             <td>${en.studentId?.admissionNumber || "—"}</td>
//             <td>${en.academicUnitId?.name || "—"}</td>
//             <td>${en.classId?.name || "—"}</td>
//             <td>${en.armId?.name || "—"}</td>
//             <td>${formatCategory(en.studentCategory)}</td>
//             <td>${statusLabel(en.studentId)}</td>
//           </tr>
//         `
//       )
//       .join("");

//     const printWindow = window.open("", "", "height=700,width=900");

//     if (!printWindow) {
//       toast.error("Please allow popups to print students list.");
//       return;
//     }

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Students List</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
//             .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
//             .header img { height: 60px; margin-bottom: 5px; }
//             .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
//             .header p { margin: 2px 0; font-size: 12px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; text-align: left; }
//             th { background: #f5f5f5; }
//             .footer { margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #000; padding-top: 10px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <img src="/school-logo.png" alt="School Logo" />
//             <h1>Moonlight School Management System</h1>
//             <p>
//               Students List — ${activeSession?.name || ""}
//               ${activeTerm ? `(${activeTerm.name})` : ""}
//             </p>
//             <p>
//               Academic Unit: ${selectedAcademicUnitObj?.name || "All"} |
//               Class: ${selectedClassObj?.name || "All"} |
//               Arm: ${selectedArm || "All"}
//             </p>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>SN</th>
//                 <th>Name</th>
//                 <th>Admission No</th>
//                 <th>Academic Unit</th>
//                 <th>Class</th>
//                 <th>Arm</th>
//                 <th>Category</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>${rows}</tbody>
//           </table>

//           <div class="footer">
//             Generated on ${new Date().toLocaleString()}
//           </div>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//   };

//   const exportCSV = () => {
//     if (!filteredStudents.length) {
//       toast.error("No students to export");
//       return;
//     }

//     const headers = [
//       "SN",
//       "Name",
//       "Admission No",
//       "Academic Unit",
//       "Class",
//       "Arm",
//       "Category",
//       "Status",
//       "Parent Contact",
//     ];

//     const rows = filteredStudents.map((en, idx) => [
//       idx + 1,
//       en.studentId?.name || "",
//       en.studentId?.admissionNumber || "",
//       en.academicUnitId?.name || "",
//       en.classId?.name || "",
//       en.armId?.name || "",
//       formatCategory(en.studentCategory),
//       statusLabel(en.studentId),
//       en.studentId?.parentContact || "",
//     ]);

//     const csv = [headers, ...rows]
//       .map((row) =>
//         row
//           .map((item) => `"${String(item).replace(/"/g, '""')}"`)
//           .join(",")
//       )
//       .join("\n");

//     const blob = new Blob([csv], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.setAttribute("download", "students-list.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const clearFilters = () => {
//     setSelectedAcademicUnit("");
//     setSelectedClass("");
//     setSelectedArm("");
//     setStudentStatus("active");
//     setStudentCategory("");
//     setSearch("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 Student Directory
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {activeSession && activeTerm
//                   ? `${activeSession.name} • ${activeTerm.name}`
//                   : "No active session/term"}
//               </p>
//             </div>

//             <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
//               {filteredStudents.length} student(s)
//             </span>
//           </div>
//         </div>

//         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//           <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
//             <div>
//               <label className="mb-1 block text-xs font-medium text-gray-700">
//                 Academic Unit
//               </label>
//               <select
//                 value={selectedAcademicUnit}
//                 onChange={(e) => {
//                   setSelectedAcademicUnit(e.target.value);
//                   setSelectedClass("");
//                   setSelectedArm("");
//                 }}
//                 className="w-full rounded-lg border p-2 text-sm"
//               >
//                 <option value="">All Units</option>
//                 {academicUnits.map((unit) => (
//                   <option key={unit._id} value={unit._id}>
//                     {unit.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-xs font-medium text-gray-700">
//                 Class
//               </label>
//               <select
//                 value={selectedClass}
//                 onChange={(e) => {
//                   setSelectedClass(e.target.value);
//                   setSelectedArm("");
//                 }}
//                 className="w-full rounded-lg border p-2 text-sm"
//               >
//                 <option value="">All Classes</option>
//                 {classes.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-xs font-medium text-gray-700">
//                 Arm
//               </label>
//               <select
//                 value={selectedArm}
//                 onChange={(e) => setSelectedArm(e.target.value)}
//                 disabled={!selectedClass}
//                 className="w-full rounded-lg border p-2 text-sm disabled:bg-gray-100"
//               >
//                 <option value="">All Arms</option>
//                 {armsForSelectedClass().map((a) => (
//                   <option key={a._id} value={a._id}>
//                     {a.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-xs font-medium text-gray-700">
//                 Status
//               </label>
//               <select
//                 value={studentStatus}
//                 onChange={(e) => setStudentStatus(e.target.value)}
//                 className="w-full rounded-lg border p-2 text-sm"
//               >
//                 <option value="active">Active</option>
//                 <option value="graduated">Graduated</option>
//                 <option value="archived">Archived</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-xs font-medium text-gray-700">
//                 Category
//               </label>
//               <select
//                 value={studentCategory}
//                 onChange={(e) => {
//                   setStudentCategory(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full rounded-lg border p-2 text-sm"
//               >
//                 <option value="">All Categories</option>
//                 <option value="returning">Returning</option>
//                 <option value="new_intake">New Intake</option>
//                 <option value="transfer">Transfer</option>
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-xs font-medium text-gray-700">
//                 Search
//               </label>
//               <input
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 placeholder="Name/admission/contact"
//                 className="w-full rounded-lg border p-2 text-sm"
//               />
//             </div>
//           </div>

//           <div className="mt-4 flex flex-wrap gap-2">
//             <button
//               onClick={fetchStudents}
//               disabled={loading}
//               className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//             >
//               {loading ? "Refreshing..." : "Refresh"}
//             </button>

//             <button
//               onClick={clearFilters}
//               className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
//             >
//               Clear Filters
//             </button>

//             <button
//               onClick={handlePrintList}
//               className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
//             >
//               Print List
//             </button>

//             <button
//               onClick={exportCSV}
//               className="rounded bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
//             >
//               Export CSV
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
//           <table className="min-w-full border-collapse text-sm">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-3">SN</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Admission No</th>
//                 <th className="p-3">Academic Unit</th>
//                 <th className="p-3">Class</th>
//                 <th className="p-3">Arm</th>
//                 <th className="p-3">Category</th>
//                 <th className="p-3">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="8" className="p-6 text-center text-gray-500">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredStudents.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="p-6 text-center text-gray-500">
//                     No students found
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedStudents.map((en, idx) => (
//                   <tr
//                     key={en._id}
//                     className="cursor-pointer border-t hover:bg-gray-50"
//                     onClick={() => openModal(en)}
//                   >
//                     <td className="p-3">
//                       {(currentPage - 1) * pageSize + idx + 1}
//                     </td>
//                     <td className="p-3">{en.studentId?.name || "—"}</td>
//                     <td className="p-3">
//                       {en.studentId?.admissionNumber || "—"}
//                     </td>
//                     <td className="p-3">{en.academicUnitId?.name || "—"}</td>
//                     <td className="p-3">{en.classId?.name || "—"}</td>
//                     <td className="p-3">{en.armId?.name || "—"}</td>
//                     <td className="p-3">{formatCategory(en.studentCategory)}</td>
//                     <td className="p-3">{statusLabel(en.studentId)}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {totalPages > 1 && (
//           <div className="mt-4 flex flex-wrap justify-center gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setCurrentPage(p)}
//                 className={`rounded px-3 py-1 text-sm ${
//                   currentPage === p
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-200 text-gray-800"
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {selectedStudent && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
//           onClick={closeModal}
//         >
//           <div
//             className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div ref={printRef}>
//               <div className="mb-4 text-center">
//                 <img
//                   src="/school-logo.png"
//                   alt="School Logo"
//                   className="mx-auto h-12"
//                 />
//                 <h1 className="text-lg font-bold">Student Profile</h1>
//               </div>

//               <div className="mb-4 flex items-center gap-4">
//                 <img
//                   src={selectedStudent.studentId?.image || "/placeholder.png"}
//                   alt="Student"
//                   className="h-28 w-28 rounded-full border-2 border-gray-400 object-cover"
//                 />

//                 <div className="text-sm">
//                   <p>
//                     <strong>Name:</strong>{" "}
//                     {selectedStudent.studentId?.name || "—"}
//                   </p>
//                   <p>
//                     <strong>Admission No:</strong>{" "}
//                     {selectedStudent.studentId?.admissionNumber || "—"}
//                   </p>
//                   <p>
//                     <strong>Gender:</strong>{" "}
//                     {selectedStudent.studentId?.gender || "—"}
//                   </p>
//                   <p>
//                     <strong>DOB:</strong>{" "}
//                     {selectedStudent.studentId?.dateOfBirth
//                       ? new Date(
//                           selectedStudent.studentId.dateOfBirth
//                         ).toLocaleDateString()
//                       : "—"}
//                   </p>
//                 </div>
//               </div>

//               <div className="mb-4 text-sm">
//                 <h3 className="mb-2 border-b font-semibold">
//                   Academic Placement
//                 </h3>
//                 <p>
//                   <strong>Academic Unit:</strong>{" "}
//                   {selectedStudent.academicUnitId?.name || "—"}
//                 </p>
//                 <p>
//                   <strong>Class:</strong>{" "}
//                   {selectedStudent.classId?.name || "—"}
//                 </p>
//                 <p>
//                   <strong>Arm:</strong> {selectedStudent.armId?.name || "—"}
//                 </p>
//                 <p>
//                   <strong>Category:</strong>{" "}
//                   {formatCategory(selectedStudent.studentCategory)}
//                 </p>
//                 <p>
//                   <strong>Status:</strong> {statusLabel(selectedStudent.studentId)}
//                 </p>
//               </div>

//               <div className="mb-4 text-sm">
//                 <h3 className="mb-2 border-b font-semibold">
//                   Guardian Information
//                 </h3>
//                 <p>
//                   <strong>Contact:</strong>{" "}
//                   {selectedStudent.studentId?.parentContact || "—"}
//                 </p>
//               </div>

//               <div className="mt-6 border-t pt-2 text-center text-xs">
//                 Printed on {new Date().toLocaleDateString()}
//               </div>
//             </div>

//             <div className="mt-4 flex flex-col gap-2 sm:flex-row">
//               {selectedStudent.studentId?.status !== "graduated" && (
//                 <button
//                   onClick={toggleBlock}
//                   className={`rounded px-4 py-2 text-white ${
//                     selectedStudent.studentId?.blocked
//                       ? "bg-green-600"
//                       : "bg-red-600"
//                   }`}
//                 >
//                   {selectedStudent.studentId?.blocked ? "Unblock" : "Block"}
//                 </button>
//               )}

//               <button
//                 onClick={handlePrintProfile}
//                 className="rounded bg-blue-600 px-4 py-2 text-white"
//               >
//                 Print
//               </button>

//               <button
//                 onClick={closeModal}
//                 className="rounded bg-gray-300 px-4 py-2"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// src/pages/admin/ViewStudents.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const formatCategory = (value) =>
  (value || "returning")
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const statusLabel = (student) => {
  if (student?.status === "graduated") return "Graduated";
  if (student?.archived) return "Archived";
  if (student?.blocked) return "Blocked";
  return "Active";
};

export default function ViewStudents() {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [academicUnits, setAcademicUnits] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");
  const [studentStatus, setStudentStatus] = useState("active");
  const [studentCategory, setStudentCategory] = useState("");
  const [search, setSearch] = useState("");

  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedStudent, setSelectedStudent] = useState(null);
  const printRef = useRef();

  const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
    user?.role
  );

  const restrictedUnitName =
    user?.role === "principal"
      ? "secondary"
      : user?.role === "head_teacher"
      ? "primary"
      : "";

  const isAcademicUnitLocked = !isFullAccess && !!restrictedUnitName;

  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;

    if (restrictedUnitName) {
      return academicUnits.filter((unit) =>
        unit.name?.toLowerCase().includes(restrictedUnitName)
      );
    }

    return academicUnits;
  }, [academicUnits, isFullAccess, restrictedUnitName]);

  const getResponseData = (res) => res.data?.data ?? res.data;

  const fetchActiveSessionTerm = async () => {
    try {
      const res = await api.get("/sessions/active");
      const payload = getResponseData(res);

      setActiveSession(payload?.session || res.data?.session || null);
      setActiveTerm(payload?.term || res.data?.term || null);
    } catch (err) {
      console.error("Failed to fetch active session/term:", err);
    }
  };

  const fetchAcademicUnits = async () => {
    try {
      const res = await api.get("/academic-units");
      const payload = getResponseData(res);
      const units = Array.isArray(payload) ? payload : [];

      setAcademicUnits(units);

      if (!isFullAccess && restrictedUnitName) {
        const allowedUnit = units.find((unit) =>
          unit.name?.toLowerCase().includes(restrictedUnitName)
        );

        if (allowedUnit) {
          setSelectedAcademicUnit(allowedUnit._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch academic units:", err);
      setAcademicUnits([]);
    }
  };

  const fetchClasses = async (academicUnitId = selectedAcademicUnit) => {
    try {
      const params = {};
      if (academicUnitId) params.academicUnitId = academicUnitId;

      const res = await api.get("/classes", { params });
      const payload = getResponseData(res);

      setClasses(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setClasses([]);
    }
  };

  const fetchStudents = async () => {
    if (!activeSession?._id) return;

    try {
      setLoading(true);
      setError("");

      const params = {
        sessionId: activeSession._id,
        studentStatus,
      };

      if (selectedAcademicUnit) params.academicUnitId = selectedAcademicUnit;
      if (selectedClass) params.classId = selectedClass;
      if (selectedArm) params.armId = selectedArm;

      const res = await api.get("/students", { params });
      const payload = getResponseData(res);

      setStudents(Array.isArray(payload) ? payload : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessionTerm();
    fetchAcademicUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    fetchClasses(selectedAcademicUnit);
    setSelectedClass("");
    setSelectedArm("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit]);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeSession,
    selectedAcademicUnit,
    selectedClass,
    selectedArm,
    studentStatus,
  ]);

  const selectedAcademicUnitObj = academicUnits.find(
    (u) => u._id === selectedAcademicUnit
  );

  const selectedClassObj = classes.find((c) => c._id === selectedClass);

  const armsForSelectedClass = () => {
    if (!selectedClass) return [];
    return Array.isArray(selectedClassObj?.arms) ? selectedClassObj.arms : [];
  };

  const filteredStudents = useMemo(() => {
    let list = Array.isArray(students) ? students : [];

    if (studentCategory) {
      list = list.filter((en) => en.studentCategory === studentCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();

      list = list.filter((en) => {
        const student = en.studentId || {};

        return (
          student.name?.toLowerCase().includes(q) ||
          student.admissionNumber?.toLowerCase().includes(q) ||
          student.parentContact?.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [students, studentCategory, search]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openModal = (student) => setSelectedStudent(student);
  const closeModal = () => setSelectedStudent(null);

  const toggleBlock = async () => {
    if (!selectedStudent?.studentId?._id) return;

    try {
      const studentId = selectedStudent.studentId._id;

      const url = selectedStudent.studentId.blocked
        ? `/students/${studentId}/unblock`
        : `/students/${studentId}/block`;

      const res = await api.patch(url);
      toast.success(res.data?.message || "Student status updated");

      await fetchStudents();
      closeModal();
    } catch (err) {
      console.error("Failed to toggle block:", err);
      toast.error(
        err.response?.data?.message || "Failed to update student status"
      );
    }
  };

  const handlePrintProfile = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "height=700,width=900");

    if (!printWindow) {
      toast.error("Please allow popups to print student profile.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Profile</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 13px; }
            .report-card { border: 1px solid #000; padding: 20px; max-width: 700px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
            .profile { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
            .profile img { width: 90px; height: 90px; border-radius: 50%; border: 1px solid #333; object-fit: cover; }
            .section { margin-bottom: 15px; }
            .section h3 { font-size: 14px; border-bottom: 1px solid #333; padding-bottom: 3px; margin-bottom: 8px; }
            .section p { margin: 3px 0; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; border-top: 1px solid #000; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="report-card">${printContents}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handlePrintList = () => {
    if (!filteredStudents.length) {
      toast.error("No students to print");
      return;
    }

    const rows = filteredStudents
      .map(
        (en, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${en.studentId?.name || "—"}</td>
            <td>${en.studentId?.admissionNumber || "—"}</td>
            <td>${en.academicUnitId?.name || "—"}</td>
            <td>${en.classId?.name || "—"}</td>
            <td>${en.armId?.name || "—"}</td>
            <td>${formatCategory(en.studentCategory)}</td>
            <td>${statusLabel(en.studentId)}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "", "height=700,width=900");

    if (!printWindow) {
      toast.error("Please allow popups to print students list.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Students List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .header img { height: 60px; margin-bottom: 5px; }
            .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; }
            .header p { margin: 2px 0; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; font-size: 12px; text-align: left; }
            th { background: #f5f5f5; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/school-logo.png" alt="School Logo" />
            <h1>Moonlight School Management System</h1>
            <p>
              Students List — ${activeSession?.name || ""}
              ${activeTerm ? `(${activeTerm.name})` : ""}
            </p>
            <p>
              Academic Unit: ${selectedAcademicUnitObj?.name || "All"} |
              Class: ${selectedClassObj?.name || "All"} |
              Arm: ${selectedArm || "All"}
            </p>
          </div>

          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Name</th>
                <th>Admission No</th>
                <th>Academic Unit</th>
                <th>Class</th>
                <th>Arm</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="footer">
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const exportCSV = () => {
    if (!filteredStudents.length) {
      toast.error("No students to export");
      return;
    }

    const headers = [
      "SN",
      "Name",
      "Admission No",
      "Academic Unit",
      "Class",
      "Arm",
      "Category",
      "Status",
      "Parent Contact",
    ];

    const rows = filteredStudents.map((en, idx) => [
      idx + 1,
      en.studentId?.name || "",
      en.studentId?.admissionNumber || "",
      en.academicUnitId?.name || "",
      en.classId?.name || "",
      en.armId?.name || "",
      formatCategory(en.studentCategory),
      statusLabel(en.studentId),
      en.studentId?.parentContact || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((item) => `"${String(item).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "students-list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    if (isFullAccess) {
      setSelectedAcademicUnit("");
    }

    setSelectedClass("");
    setSelectedArm("");
    setStudentStatus("active");
    setStudentCategory("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Student Directory
              </h2>
              <p className="text-sm text-gray-500">
                {activeSession && activeTerm
                  ? `${activeSession.name} • ${activeTerm.name}`
                  : "No active session/term"}
              </p>

              {isAcademicUnitLocked && selectedAcademicUnitObj && (
                <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  Restricted View: {selectedAcademicUnitObj.name}
                </p>
              )}
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              {filteredStudents.length} student(s)
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Academic Unit
              </label>
              <select
                value={selectedAcademicUnit}
                disabled={isAcademicUnitLocked}
                onChange={(e) => {
                  setSelectedAcademicUnit(e.target.value);
                  setSelectedClass("");
                  setSelectedArm("");
                }}
                className="w-full rounded-lg border p-2 text-sm disabled:bg-gray-100"
              >
                <option value="">All Units</option>
                {visibleAcademicUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedArm("");
                }}
                className="w-full rounded-lg border p-2 text-sm"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Arm
              </label>
              <select
                value={selectedArm}
                onChange={(e) => setSelectedArm(e.target.value)}
                disabled={!selectedClass}
                className="w-full rounded-lg border p-2 text-sm disabled:bg-gray-100"
              >
                <option value="">All Arms</option>
                {armsForSelectedClass().map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                value={studentStatus}
                onChange={(e) => setStudentStatus(e.target.value)}
                className="w-full rounded-lg border p-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Category
              </label>
              <select
                value={studentCategory}
                onChange={(e) => {
                  setStudentCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border p-2 text-sm"
              >
                <option value="">All Categories</option>
                <option value="returning">Returning</option>
                <option value="new_intake">New Intake</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Search
              </label>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Name/admission/contact"
                className="w-full rounded-lg border p-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={clearFilters}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Clear Filters
            </button>

            <button
              onClick={handlePrintList}
              className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Print List
            </button>

            <button
              onClick={exportCSV}
              className="rounded bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">SN</th>
                <th className="p-3">Name</th>
                <th className="p-3">Admission No</th>
                <th className="p-3">Academic Unit</th>
                <th className="p-3">Class</th>
                <th className="p-3">Arm</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((en, idx) => (
                  <tr
                    key={en._id}
                    className="cursor-pointer border-t hover:bg-gray-50"
                    onClick={() => openModal(en)}
                  >
                    <td className="p-3">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="p-3">{en.studentId?.name || "—"}</td>
                    <td className="p-3">
                      {en.studentId?.admissionNumber || "—"}
                    </td>
                    <td className="p-3">{en.academicUnitId?.name || "—"}</td>
                    <td className="p-3">{en.classId?.name || "—"}</td>
                    <td className="p-3">{en.armId?.name || "—"}</td>
                    <td className="p-3">{formatCategory(en.studentCategory)}</td>
                    <td className="p-3">{statusLabel(en.studentId)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`rounded px-3 py-1 text-sm ${
                  currentPage === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={printRef}>
              <div className="mb-4 text-center">
                <img
                  src="/school-logo.png"
                  alt="School Logo"
                  className="mx-auto h-12"
                />
                <h1 className="text-lg font-bold">Student Profile</h1>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <img
                  src={selectedStudent.studentId?.image || "/placeholder.png"}
                  alt="Student"
                  className="h-28 w-28 rounded-full border-2 border-gray-400 object-cover"
                />

                <div className="text-sm">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedStudent.studentId?.name || "—"}
                  </p>
                  <p>
                    <strong>Admission No:</strong>{" "}
                    {selectedStudent.studentId?.admissionNumber || "—"}
                  </p>
                  <p>
                    <strong>Gender:</strong>{" "}
                    {selectedStudent.studentId?.gender || "—"}
                  </p>
                  <p>
                    <strong>DOB:</strong>{" "}
                    {selectedStudent.studentId?.dateOfBirth
                      ? new Date(
                          selectedStudent.studentId.dateOfBirth
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mb-4 text-sm">
                <h3 className="mb-2 border-b font-semibold">
                  Academic Placement
                </h3>
                <p>
                  <strong>Academic Unit:</strong>{" "}
                  {selectedStudent.academicUnitId?.name || "—"}
                </p>
                <p>
                  <strong>Class:</strong>{" "}
                  {selectedStudent.classId?.name || "—"}
                </p>
                <p>
                  <strong>Arm:</strong> {selectedStudent.armId?.name || "—"}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {formatCategory(selectedStudent.studentCategory)}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {statusLabel(selectedStudent.studentId)}
                </p>
              </div>

              <div className="mb-4 text-sm">
                <h3 className="mb-2 border-b font-semibold">
                  Guardian Information
                </h3>
                <p>
                  <strong>Contact:</strong>{" "}
                  {selectedStudent.studentId?.parentContact || "—"}
                </p>
              </div>

              <div className="mt-6 border-t pt-2 text-center text-xs">
                Printed on {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {selectedStudent.studentId?.status !== "graduated" && (
                <button
                  onClick={toggleBlock}
                  className={`rounded px-4 py-2 text-white ${
                    selectedStudent.studentId?.blocked
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {selectedStudent.studentId?.blocked ? "Unblock" : "Block"}
                </button>
              )}

              <button
                onClick={handlePrintProfile}
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                Print
              </button>

              <button
                onClick={closeModal}
                className="rounded bg-gray-300 px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}