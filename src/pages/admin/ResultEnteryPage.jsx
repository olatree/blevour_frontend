
// // // src/pages/admin/ResultEntryPage.jsx
// // import { useEffect, useMemo, useState } from "react";
// // import api from "../../api/axios";
// // import { useAuth } from "../../hooks/useAuth";
// // import toast from "react-hot-toast";

// // const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// // const getId = (item) =>
// //   item?._id ?? item?.id ?? item?.subjectId ?? item?.classId ?? item?.armId;

// // export default function ResultEntryPage() {
// //   const { user } = useAuth();

// //   const [academicUnits, setAcademicUnits] = useState([]);
// //   const [subjects, setSubjects] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [arms, setArms] = useState([]);
// //   const [students, setStudents] = useState([]);
// //   const [scores, setScores] = useState({});

// //   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
// //   const [selectedSubject, setSelectedSubject] = useState(null);
// //   const [selectedClass, setSelectedClass] = useState(null);
// //   const [selectedArm, setSelectedArm] = useState(null);

// //   const [activeSession, setActiveSession] = useState(null);
// //   const [activeTerm, setActiveTerm] = useState(null);

// //   const [loadingUnits, setLoadingUnits] = useState(false);
// //   const [loadingSubjects, setLoadingSubjects] = useState(false);
// //   const [loadingClasses, setLoadingClasses] = useState(false);
// //   const [loadingStudents, setLoadingStudents] = useState(false);
// //   const [savingResults, setSavingResults] = useState(false);

// //   const selectedAcademicUnitObj = useMemo(
// //     () => academicUnits.find((unit) => getId(unit) === selectedAcademicUnit),
// //     [academicUnits, selectedAcademicUnit]
// //   );

// //   useEffect(() => {
// //     const fetchInitialData = async () => {
// //       try {
// //         setLoadingUnits(true);

// //         const [sessionRes, unitRes] = await Promise.all([
// //           api.get("/sessions/active"),
// //           api.get("/academic-units"),
// //         ]);

// //         const sessionPayload = getApiData(sessionRes);
// //         const unitPayload = getApiData(unitRes);

// //         setActiveSession(sessionPayload?.session || sessionRes.data?.session || null);
// //         setActiveTerm(sessionPayload?.term || sessionRes.data?.term || null);
// //         setAcademicUnits(Array.isArray(unitPayload) ? unitPayload : []);
// //       } catch (err) {
// //         console.error("Initial result entry load error:", err);
// //         toast.error("Failed to load active session or academic units.");
// //       } finally {
// //         setLoadingUnits(false);
// //       }
// //     };

// //     fetchInitialData();
// //   }, []);

// //   useEffect(() => {
// //     if (!user || !selectedAcademicUnit) {
// //       setSubjects([]);
// //       return;
// //     }

// //     const fetchSubjects = async () => {
// //       try {
// //         setLoadingSubjects(true);

// //         let res;

// //         if (user.role === "teacher") {
// //           res = await api.get(`/teacher-assignments/${user._id}/subjects`, {
// //             params: { academicUnitId: selectedAcademicUnit },
// //           });
// //         } else {
// //           res = await api.get("/subjects", {
// //             params: { academicUnitId: selectedAcademicUnit },
// //           });
// //         }

// //         const payload = getApiData(res);
// //         setSubjects(Array.isArray(payload) ? payload : []);
// //       } catch (err) {
// //         console.error("Error fetching subjects:", err);
// //         toast.error("Failed to load subjects");
// //         setSubjects([]);
// //       } finally {
// //         setLoadingSubjects(false);
// //       }
// //     };

// //     fetchSubjects();
// //   }, [user, selectedAcademicUnit]);

// //   useEffect(() => {
// //     if (!selectedAcademicUnit) {
// //       setClasses([]);
// //       return;
// //     }

// //     const fetchClasses = async () => {
// //       try {
// //         setLoadingClasses(true);

// //         const res = await api.get("/classes", {
// //           params: { academicUnitId: selectedAcademicUnit },
// //         });

// //         const payload = getApiData(res);
// //         setClasses(Array.isArray(payload) ? payload : []);
// //       } catch (err) {
// //         console.error("Error fetching classes:", err);
// //         toast.error("Failed to load classes");
// //         setClasses([]);
// //       } finally {
// //         setLoadingClasses(false);
// //       }
// //     };

// //     fetchClasses();
// //   }, [selectedAcademicUnit]);

// //   const resetFromAcademicUnit = () => {
// //     setSelectedSubject(null);
// //     setSelectedClass(null);
// //     setSelectedArm(null);
// //     setSubjects([]);
// //     setClasses([]);
// //     setArms([]);
// //     setStudents([]);
// //     setScores({});
// //   };

// //   const handleAcademicUnitSelect = (academicUnitId) => {
// //     resetFromAcademicUnit();
// //     setSelectedAcademicUnit(academicUnitId);
// //   };

// //   const handleSubjectSelect = (subjectId) => {
// //     const subject = subjects.find((s) => getId(s) === subjectId);

// //     setSelectedSubject(subject || null);
// //     setSelectedClass(null);
// //     setSelectedArm(null);
// //     setArms([]);
// //     setStudents([]);
// //     setScores({});
// //   };

// //   const handleClassSelect = (classId) => {
// //     const cls = classes.find((c) => getId(c) === classId);

// //     setSelectedClass(cls || null);
// //     setSelectedArm(null);
// //     setStudents([]);
// //     setScores({});
// //     setArms(cls?.arms ?? cls?.armsList ?? []);
// //   };

// //   const handleArmSelect = async (armId) => {
// //     const arm = arms.find((a) => getId(a) === armId);
// //     setSelectedArm(arm || null);
// //     setStudents([]);
// //     setScores({});

// //     if (
// //       !selectedAcademicUnit ||
// //       !selectedClass ||
// //       !selectedSubject ||
// //       !activeSession ||
// //       !activeTerm ||
// //       !arm
// //     ) {
// //       toast.error("Please select academic unit, subject, class, arm, session and term.");
// //       return;
// //     }

// //     try {
// //       setLoadingStudents(true);

// //       const classId = getId(selectedClass);
// //       const armIdValue = getId(arm);
// //       const subjectId = getId(selectedSubject);
// //       const sessionId = activeSession._id;
// //       const termId = activeTerm._id;

// //       const [stuRes, resultRes] = await Promise.all([
// //         api.get("/students", {
// //           params: {
// //             academicUnitId: selectedAcademicUnit,
// //             classId,
// //             armId: armIdValue,
// //             sessionId,
// //           },
// //         }),
// //         api.get("/results/by-subject", {
// //           params: {
// //             academicUnitId: selectedAcademicUnit,
// //             classId,
// //             armId: armIdValue,
// //             subjectId,
// //             sessionId,
// //             termId,
// //           },
// //         }),
// //       ]);

// //       const studentPayload = getApiData(stuRes);
// //       const resultPayload = getApiData(resultRes);

// //       const studentList = Array.isArray(studentPayload) ? studentPayload : [];
// //       const existingResults = Array.isArray(resultPayload) ? resultPayload : [];

// //       const newScores = {};

// //       existingResults.forEach((r) => {
// //         const enrollmentId = r.enrollmentId?._id ?? r.enrollmentId;
// //         if (!enrollmentId) return;

// //         newScores[enrollmentId] = {
// //           ca1: r.ca1 ?? "",
// //           ca2: r.ca2 ?? "",
// //           ca3: r.ca3 ?? "",
// //           ca4: r.ca4 ?? "",
// //           exam: r.exam ?? "",
// //         };
// //       });

// //       setStudents(studentList);
// //       setScores(newScores);
// //     } catch (err) {
// //       console.error("Error fetching arm data:", err);
// //       toast.error(err.response?.data?.message || "Failed to load students/results");
// //       setStudents([]);
// //       setScores({});
// //     } finally {
// //       setLoadingStudents(false);
// //     }
// //   };

// //   const handleScoreChange = (enrollmentId, field, value) => {
// //     let num = value === "" ? "" : Number(value);

// //     if (value !== "" && Number.isNaN(num)) return;

// //     if (field.startsWith("ca") && num !== "") {
// //       num = Math.max(0, Math.min(num, 10));
// //     }

// //     if (field === "exam" && num !== "") {
// //       num = Math.max(0, Math.min(num, 60));
// //     }

// //     setScores((prev) => ({
// //       ...prev,
// //       [enrollmentId]: {
// //         ...(prev[enrollmentId] || {}),
// //         [field]: num,
// //       },
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     if (!selectedAcademicUnit || !selectedSubject || !selectedClass || !selectedArm) {
// //       toast.error("Please select academic unit, subject, class and arm.");
// //       return;
// //     }

// //     if (!activeSession || !activeTerm) {
// //       toast.error("No active session/term found.");
// //       return;
// //     }

// //     const subjectId = getId(selectedSubject);
// //     const classId = getId(selectedClass);
// //     const armId = getId(selectedArm);

// //     const resultsArray = Object.entries(scores)
// //       .filter(([, sc]) => Object.values(sc).some((v) => v !== ""))
// //       .map(([enrollmentId, sc]) => {
// //         const result = { enrollmentId };

// //         ["ca1", "ca2", "ca3", "ca4", "exam"].forEach((field) => {
// //           if (sc[field] !== "" && sc[field] !== undefined) {
// //             result[field] = Number(sc[field]);
// //           }
// //         });

// //         return result;
// //       });

// //     if (resultsArray.length === 0) {
// //       toast.error("No scores entered.");
// //       return;
// //     }

// //     try {
// //       setSavingResults(true);

// //       await api.post("/results/add-or-update", {
// //         academicUnitId: selectedAcademicUnit,
// //         subjectId,
// //         classId,
// //         armId,
// //         sessionId: activeSession._id,
// //         termId: activeTerm._id,
// //         results: resultsArray,
// //       });

// //       toast.success("Results saved successfully!");
// //     } catch (err) {
// //       console.error("Error saving results:", err);
// //       toast.error(err.response?.data?.message || "Failed to save results.");
// //     } finally {
// //       setSavingResults(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-3 px-2 sm:px-4 md:px-6">
// //       <div className="mx-auto max-w-7xl">
// //         <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
// //           <h2 className="text-lg font-bold text-green-700 sm:text-xl">
// //             Result Entry
// //           </h2>
// //           <p className="mt-0.5 text-xs text-gray-600">
// //             {activeSession && activeTerm
// //               ? `${activeSession.name} • ${activeTerm.name}`
// //               : "No active session/term selected"}
// //           </p>

// //           {selectedAcademicUnitObj && (
// //             <p className="mt-1 text-xs font-semibold text-purple-700">
// //               Academic Unit: {selectedAcademicUnitObj.name}
// //             </p>
// //           )}
// //         </div>

// //         <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
// //           <label className="mb-1 block text-sm font-semibold text-gray-700">
// //             Select Academic Unit
// //           </label>

// //           <select
// //             value={selectedAcademicUnit}
// //             onChange={(e) => handleAcademicUnitSelect(e.target.value)}
// //             disabled={loadingUnits || savingResults}
// //             className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:bg-gray-100"
// //           >
// //             <option value="">-- Choose academic unit --</option>
// //             {academicUnits.map((unit) => (
// //               <option key={getId(unit)} value={getId(unit)}>
// //                 {unit.name}
// //               </option>
// //             ))}
// //           </select>

// //           {loadingUnits && (
// //             <p className="mt-1 text-xs text-gray-500">Loading academic units...</p>
// //           )}
// //         </div>

// //         {selectedAcademicUnit && (
// //           <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
// //             <label className="mb-1 block text-sm font-semibold text-green-700">
// //               Select Subject
// //             </label>

// //             <select
// //               value={selectedSubject ? getId(selectedSubject) : ""}
// //               onChange={(e) => handleSubjectSelect(e.target.value)}
// //               disabled={
// //                 loadingSubjects ||
// //                 loadingClasses ||
// //                 loadingStudents ||
// //                 savingResults
// //               }
// //               className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
// //             >
// //               <option value="">-- Choose a subject --</option>
// //               {subjects.map((subject) => (
// //                 <option key={getId(subject)} value={getId(subject)}>
// //                   {subject.name ?? subject.title}
// //                 </option>
// //               ))}
// //             </select>

// //             {loadingSubjects && (
// //               <p className="mt-1 text-xs text-gray-500">Loading subjects...</p>
// //             )}

// //             {!loadingSubjects && subjects.length === 0 && (
// //               <p className="mt-1 text-xs text-yellow-600">
// //                 No subjects found for this academic unit.
// //               </p>
// //             )}
// //           </div>
// //         )}

// //         {selectedSubject && (
// //           <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
// //             <label className="mb-1 block text-sm font-semibold text-purple-700">
// //               Select Class
// //             </label>

// //             <select
// //               value={selectedClass ? getId(selectedClass) : ""}
// //               onChange={(e) => handleClassSelect(e.target.value)}
// //               disabled={
// //                 loadingClasses ||
// //                 loadingStudents ||
// //                 savingResults ||
// //                 classes.length === 0
// //               }
// //               className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
// //             >
// //               <option value="">-- Choose a class --</option>
// //               {classes.map((cls) => (
// //                 <option key={getId(cls)} value={getId(cls)}>
// //                   {cls.name ?? cls.className}
// //                 </option>
// //               ))}
// //             </select>

// //             {loadingClasses && (
// //               <p className="mt-1 text-xs text-gray-500">Loading classes...</p>
// //             )}

// //             {!loadingClasses && classes.length === 0 && (
// //               <p className="mt-1 text-xs text-yellow-600">
// //                 No classes found for this academic unit.
// //               </p>
// //             )}
// //           </div>
// //         )}

// //         {selectedClass && (
// //           <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
// //             <label className="mb-1 block text-sm font-semibold text-blue-700">
// //               Select Arm
// //             </label>

// //             <select
// //               value={selectedArm ? getId(selectedArm) : ""}
// //               onChange={(e) => handleArmSelect(e.target.value)}
// //               disabled={savingResults || arms.length === 0}
// //               className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
// //             >
// //               <option value="">-- Choose an arm --</option>
// //               {arms.map((arm) => (
// //                 <option key={getId(arm)} value={getId(arm)}>
// //                   {arm.name ?? arm.armName}
// //                 </option>
// //               ))}
// //             </select>

// //             {arms.length === 0 && (
// //               <p className="mt-1 text-xs text-yellow-600">
// //                 No arms found for this class.
// //               </p>
// //             )}
// //           </div>
// //         )}

// //         {selectedArm && (
// //           <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
// //             <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
// //               <div>
// //                 <h3 className="text-sm font-semibold text-gray-800">
// //                   Scores Entry
// //                 </h3>
// //                 <p className="text-xs text-gray-500">
// //                   CA scores: 0-10 each • Exam: 0-60
// //                 </p>
// //               </div>

// //               {students.length > 0 && (
// //                 <button
// //                   onClick={handleSubmit}
// //                   disabled={savingResults}
// //                   className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
// //                 >
// //                   {savingResults ? "Saving..." : "Save Results"}
// //                 </button>
// //               )}
// //             </div>

// //             {loadingStudents ? (
// //               <div className="py-8 text-center">
// //                 <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-green-600"></div>
// //                 <p className="mt-2 text-sm text-gray-500">Loading students...</p>
// //               </div>
// //             ) : students.length === 0 ? (
// //               <div className="py-8 text-center">
// //                 <p className="text-sm text-gray-500">
// //                   No students found in this arm.
// //                 </p>
// //               </div>
// //             ) : (
// //               <>
// //                 <div className="space-y-3 md:hidden">
// //                   {students.map((enrollment) => {
// //                     const enrollmentId = enrollment._id;
// //                     const student = enrollment.studentId;
// //                     const current = scores[enrollmentId] || {};

// //                     return (
// //                       <div
// //                         key={enrollmentId}
// //                         className="rounded-lg border border-gray-200 bg-white p-3"
// //                       >
// //                         <div className="mb-3 border-b border-gray-100 pb-2">
// //                           <p className="text-sm font-semibold text-gray-900">
// //                             {student?.name || "Unknown Student"}
// //                           </p>
// //                           <p className="text-xs text-gray-500">
// //                             ID: {student?.admissionNumber || "—"}
// //                           </p>
// //                         </div>

// //                         <div className="grid grid-cols-5 gap-2">
// //                           {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
// //                             <div key={`${enrollmentId}-${field}`}>
// //                               <label className="mb-1 block text-center text-[10px] font-medium uppercase text-gray-500">
// //                                 {field === "exam" ? "Exam" : field.toUpperCase()}
// //                               </label>
// //                               <input
// //                                 type="number"
// //                                 inputMode="numeric"
// //                                 value={current[field] ?? ""}
// //                                 onChange={(e) =>
// //                                   handleScoreChange(
// //                                     enrollmentId,
// //                                     field,
// //                                     e.target.value
// //                                   )
// //                                 }
// //                                 placeholder="-"
// //                                 className="w-full rounded-lg border border-gray-300 p-2 text-center text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
// //                               />
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>

// //                 <div className="hidden overflow-x-auto md:block">
// //                   <table className="w-full border-collapse text-sm">
// //                     <thead>
// //                       <tr className="bg-green-600 text-white">
// //                         <th className="rounded-tl-lg p-3 text-left">Student</th>
// //                         <th className="p-3 text-center">CA1</th>
// //                         <th className="p-3 text-center">CA2</th>
// //                         <th className="p-3 text-center">CA3</th>
// //                         <th className="p-3 text-center">CA4</th>
// //                         <th className="rounded-tr-lg p-3 text-center">Exam</th>
// //                       </tr>
// //                     </thead>

// //                     <tbody>
// //                       {students.map((enrollment, idx) => {
// //                         const enrollmentId = enrollment._id;
// //                         const student = enrollment.studentId;
// //                         const current = scores[enrollmentId] || {};

// //                         return (
// //                           <tr
// //                             key={enrollmentId}
// //                             className={`border-b ${
// //                               idx % 2 === 0 ? "bg-white" : "bg-gray-50"
// //                             } hover:bg-gray-100`}
// //                           >
// //                             <td className="p-3">
// //                               <div className="font-medium text-gray-900">
// //                                 {student?.name || "Unknown Student"}
// //                               </div>
// //                               <div className="text-xs text-gray-500">
// //                                 {student?.admissionNumber || "—"}
// //                               </div>
// //                             </td>

// //                             {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
// //                               <td
// //                                 key={`${enrollmentId}-${field}`}
// //                                 className="p-2 text-center"
// //                               >
// //                                 <input
// //                                   type="number"
// //                                   value={current[field] ?? ""}
// //                                   onChange={(e) =>
// //                                     handleScoreChange(
// //                                       enrollmentId,
// //                                       field,
// //                                       e.target.value
// //                                     )
// //                                   }
// //                                   className="w-20 rounded-lg border border-gray-300 p-2 text-center focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
// //                                   placeholder="-"
// //                                 />
// //                               </td>
// //                             ))}
// //                           </tr>
// //                         );
// //                       })}
// //                     </tbody>
// //                   </table>
// //                 </div>

// //                 <div className="sticky bottom-0 mt-4 -mx-3 rounded-t-xl bg-white p-3 shadow-lg md:hidden">
// //                   <button
// //                     onClick={handleSubmit}
// //                     disabled={savingResults}
// //                     className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:bg-green-700 active:scale-95 disabled:opacity-60"
// //                   >
// //                     {savingResults ? "Saving..." : "Save All Results"}
// //                   </button>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// // src/pages/admin/ResultEntryPage.jsx
// import { useEffect, useMemo, useState } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../hooks/useAuth";
// import toast from "react-hot-toast";

// const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// const getId = (item) =>
//   item?._id ?? item?.id ?? item?.subjectId ?? item?.classId ?? item?.armId;

// export default function ResultEntryPage() {
//   const { user } = useAuth();

//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [arms, setArms] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [scores, setScores] = useState({});

//   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedArm, setSelectedArm] = useState(null);

//   const [activeSession, setActiveSession] = useState(null);
//   const [activeTerm, setActiveTerm] = useState(null);

//   const [loadingUnits, setLoadingUnits] = useState(false);
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [savingResults, setSavingResults] = useState(false);

//   const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
//     user?.role
//   );

//   const restrictedUnitName =
//     user?.role === "principal"
//       ? "secondary"
//       : user?.role === "head_teacher"
//       ? "primary"
//       : "";

//   const userAcademicUnitId =
//     user?.academicUnitId?._id ||
//     user?.academicUnitId ||
//     user?.classTeacherOf?.academicUnitId?._id ||
//     user?.classTeacherOf?.academicUnitId ||
//     "";

//   const isAcademicUnitLocked =
//     !isFullAccess && (restrictedUnitName || user?.role === "teacher");

//   const visibleAcademicUnits = useMemo(() => {
//     if (isFullAccess) return academicUnits;

//     if (user?.role === "teacher" && userAcademicUnitId) {
//       return academicUnits.filter((unit) => getId(unit) === userAcademicUnitId);
//     }

//     if (restrictedUnitName) {
//       return academicUnits.filter((unit) =>
//         unit.name?.toLowerCase().includes(restrictedUnitName)
//       );
//     }

//     return academicUnits;
//   }, [academicUnits, isFullAccess, restrictedUnitName, user?.role, userAcademicUnitId]);

//   const selectedAcademicUnitObj = useMemo(
//     () => academicUnits.find((unit) => getId(unit) === selectedAcademicUnit),
//     [academicUnits, selectedAcademicUnit]
//   );

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoadingUnits(true);

//         const [sessionRes, unitRes] = await Promise.all([
//           api.get("/sessions/active"),
//           api.get("/academic-units"),
//         ]);

//         const sessionPayload = getApiData(sessionRes);
//         const unitPayload = getApiData(unitRes);
//         const units = Array.isArray(unitPayload) ? unitPayload : [];

//         setActiveSession(sessionPayload?.session || sessionRes.data?.session || null);
//         setActiveTerm(sessionPayload?.term || sessionRes.data?.term || null);
//         setAcademicUnits(units);

//         if (!isFullAccess) {
//           let allowedUnit = null;

//           if (user?.role === "teacher" && userAcademicUnitId) {
//             allowedUnit = units.find((unit) => getId(unit) === userAcademicUnitId);
//           }

//           if (!allowedUnit && restrictedUnitName) {
//             allowedUnit = units.find((unit) =>
//               unit.name?.toLowerCase().includes(restrictedUnitName)
//             );
//           }

//           if (allowedUnit) {
//             setSelectedAcademicUnit(getId(allowedUnit));
//           }
//         }
//       } catch (err) {
//         console.error("Initial result entry load error:", err);
//         toast.error("Failed to load active session or academic units.");
//       } finally {
//         setLoadingUnits(false);
//       }
//     };

//     fetchInitialData();
//   }, [isFullAccess, restrictedUnitName, user?.role, userAcademicUnitId]);

//   useEffect(() => {
//     if (!user || !selectedAcademicUnit) {
//       setSubjects([]);
//       return;
//     }

//     const fetchSubjects = async () => {
//       try {
//         setLoadingSubjects(true);

//         let res;

//         if (user.role === "teacher") {
//           res = await api.get(`/teacher-assignments/${user._id}/subjects`, {
//             params: { academicUnitId: selectedAcademicUnit },
//           });
//         } else {
//           res = await api.get("/subjects", {
//             params: { academicUnitId: selectedAcademicUnit },
//           });
//         }

//         const payload = getApiData(res);
//         setSubjects(Array.isArray(payload) ? payload : []);
//       } catch (err) {
//         console.error("Error fetching subjects:", err);
//         toast.error("Failed to load subjects");
//         setSubjects([]);
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };

//     fetchSubjects();
//   }, [user, selectedAcademicUnit]);

//   useEffect(() => {
//     if (!selectedAcademicUnit) {
//       setClasses([]);
//       return;
//     }

//     const fetchClasses = async () => {
//       try {
//         setLoadingClasses(true);

//         const res = await api.get("/classes", {
//           params: { academicUnitId: selectedAcademicUnit },
//         });

//         const payload = getApiData(res);
//         setClasses(Array.isArray(payload) ? payload : []);
//       } catch (err) {
//         console.error("Error fetching classes:", err);
//         toast.error("Failed to load classes");
//         setClasses([]);
//       } finally {
//         setLoadingClasses(false);
//       }
//     };

//     fetchClasses();
//   }, [selectedAcademicUnit]);

//   const resetFromAcademicUnit = () => {
//     setSelectedSubject(null);
//     setSelectedClass(null);
//     setSelectedArm(null);
//     setSubjects([]);
//     setClasses([]);
//     setArms([]);
//     setStudents([]);
//     setScores({});
//   };

//   const handleAcademicUnitSelect = (academicUnitId) => {
//     resetFromAcademicUnit();
//     setSelectedAcademicUnit(academicUnitId);
//   };

//   const handleSubjectSelect = (subjectId) => {
//     const subject = subjects.find((s) => getId(s) === subjectId);

//     setSelectedSubject(subject || null);
//     setSelectedClass(null);
//     setSelectedArm(null);
//     setArms([]);
//     setStudents([]);
//     setScores({});
//   };

//   const handleClassSelect = (classId) => {
//     const cls = classes.find((c) => getId(c) === classId);

//     setSelectedClass(cls || null);
//     setSelectedArm(null);
//     setStudents([]);
//     setScores({});
//     setArms(cls?.arms ?? cls?.armsList ?? []);
//   };

//   const handleArmSelect = async (armId) => {
//     const arm = arms.find((a) => getId(a) === armId);
//     setSelectedArm(arm || null);
//     setStudents([]);
//     setScores({});

//     if (
//       !selectedAcademicUnit ||
//       !selectedClass ||
//       !selectedSubject ||
//       !activeSession ||
//       !activeTerm ||
//       !arm
//     ) {
//       toast.error("Please select academic unit, subject, class, arm, session and term.");
//       return;
//     }

//     try {
//       setLoadingStudents(true);

//       const classId = getId(selectedClass);
//       const armIdValue = getId(arm);
//       const subjectId = getId(selectedSubject);
//       const sessionId = activeSession._id;
//       const termId = activeTerm._id;

//       const [stuRes, resultRes] = await Promise.all([
//         api.get("/students", {
//           params: {
//             academicUnitId: selectedAcademicUnit,
//             classId,
//             armId: armIdValue,
//             sessionId,
//           },
//         }),
//         api.get("/results/by-subject", {
//           params: {
//             academicUnitId: selectedAcademicUnit,
//             classId,
//             armId: armIdValue,
//             subjectId,
//             sessionId,
//             termId,
//           },
//         }),
//       ]);

//       const studentPayload = getApiData(stuRes);
//       const resultPayload = getApiData(resultRes);

//       const studentList = Array.isArray(studentPayload) ? studentPayload : [];
//       const existingResults = Array.isArray(resultPayload) ? resultPayload : [];

//       const newScores = {};

//       existingResults.forEach((r) => {
//         const enrollmentId = r.enrollmentId?._id ?? r.enrollmentId;
//         if (!enrollmentId) return;

//         newScores[enrollmentId] = {
//           ca1: r.ca1 ?? "",
//           ca2: r.ca2 ?? "",
//           ca3: r.ca3 ?? "",
//           ca4: r.ca4 ?? "",
//           exam: r.exam ?? "",
//         };
//       });

//       setStudents(studentList);
//       setScores(newScores);
//     } catch (err) {
//       console.error("Error fetching arm data:", err);
//       toast.error(err.response?.data?.message || "Failed to load students/results");
//       setStudents([]);
//       setScores({});
//     } finally {
//       setLoadingStudents(false);
//     }
//   };

//   const handleScoreChange = (enrollmentId, field, value) => {
//     let num = value === "" ? "" : Number(value);

//     if (value !== "" && Number.isNaN(num)) return;

//     if (field.startsWith("ca") && num !== "") {
//       num = Math.max(0, Math.min(num, 10));
//     }

//     if (field === "exam" && num !== "") {
//       num = Math.max(0, Math.min(num, 60));
//     }

//     setScores((prev) => ({
//       ...prev,
//       [enrollmentId]: {
//         ...(prev[enrollmentId] || {}),
//         [field]: num,
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedAcademicUnit || !selectedSubject || !selectedClass || !selectedArm) {
//       toast.error("Please select academic unit, subject, class and arm.");
//       return;
//     }

//     if (!activeSession || !activeTerm) {
//       toast.error("No active session/term found.");
//       return;
//     }

//     const subjectId = getId(selectedSubject);
//     const classId = getId(selectedClass);
//     const armId = getId(selectedArm);

//     const resultsArray = Object.entries(scores)
//       .filter(([, sc]) => Object.values(sc).some((v) => v !== ""))
//       .map(([enrollmentId, sc]) => {
//         const result = { enrollmentId };

//         ["ca1", "ca2", "ca3", "ca4", "exam"].forEach((field) => {
//           if (sc[field] !== "" && sc[field] !== undefined) {
//             result[field] = Number(sc[field]);
//           }
//         });

//         return result;
//       });

//     if (resultsArray.length === 0) {
//       toast.error("No scores entered.");
//       return;
//     }

//     try {
//       setSavingResults(true);

//       await api.post("/results/add-or-update", {
//         academicUnitId: selectedAcademicUnit,
//         subjectId,
//         classId,
//         armId,
//         sessionId: activeSession._id,
//         termId: activeTerm._id,
//         results: resultsArray,
//       });

//       toast.success("Results saved successfully!");
//     } catch (err) {
//       console.error("Error saving results:", err);
//       toast.error(err.response?.data?.message || "Failed to save results.");
//     } finally {
//       setSavingResults(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-3 px-2 sm:px-4 md:px-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
//           <h2 className="text-lg font-bold text-green-700 sm:text-xl">
//             Result Entry
//           </h2>

//           <p className="mt-0.5 text-xs text-gray-600">
//             {activeSession && activeTerm
//               ? `${activeSession.name} • ${activeTerm.name}`
//               : "No active session/term selected"}
//           </p>

//           {selectedAcademicUnitObj && (
//             <p className="mt-1 text-xs font-semibold text-purple-700">
//               Academic Unit: {selectedAcademicUnitObj.name}
//             </p>
//           )}

//           {isAcademicUnitLocked && selectedAcademicUnitObj && (
//             <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
//               Restricted View: {selectedAcademicUnitObj.name}
//             </p>
//           )}
//         </div>

//         <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
//           <label className="mb-1 block text-sm font-semibold text-gray-700">
//             Select Academic Unit
//           </label>

//           <select
//             value={selectedAcademicUnit}
//             onChange={(e) => handleAcademicUnitSelect(e.target.value)}
//             disabled={loadingUnits || savingResults || isAcademicUnitLocked}
//             className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:bg-gray-100"
//           >
//             <option value="">-- Choose academic unit --</option>
//             {visibleAcademicUnits.map((unit) => (
//               <option key={getId(unit)} value={getId(unit)}>
//                 {unit.name}
//               </option>
//             ))}
//           </select>

//           {loadingUnits && (
//             <p className="mt-1 text-xs text-gray-500">Loading academic units...</p>
//           )}
//         </div>

//         {selectedAcademicUnit && (
//           <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
//             <label className="mb-1 block text-sm font-semibold text-green-700">
//               Select Subject
//             </label>

//             <select
//               value={selectedSubject ? getId(selectedSubject) : ""}
//               onChange={(e) => handleSubjectSelect(e.target.value)}
//               disabled={
//                 loadingSubjects ||
//                 loadingClasses ||
//                 loadingStudents ||
//                 savingResults
//               }
//               className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
//             >
//               <option value="">-- Choose a subject --</option>
//               {subjects.map((subject) => (
//                 <option key={getId(subject)} value={getId(subject)}>
//                   {subject.name ?? subject.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {selectedSubject && (
//           <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
//             <label className="mb-1 block text-sm font-semibold text-purple-700">
//               Select Class
//             </label>

//             <select
//               value={selectedClass ? getId(selectedClass) : ""}
//               onChange={(e) => handleClassSelect(e.target.value)}
//               disabled={
//                 loadingClasses ||
//                 loadingStudents ||
//                 savingResults ||
//                 classes.length === 0
//               }
//               className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
//             >
//               <option value="">-- Choose a class --</option>
//               {classes.map((cls) => (
//                 <option key={getId(cls)} value={getId(cls)}>
//                   {cls.name ?? cls.className}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {selectedClass && (
//           <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
//             <label className="mb-1 block text-sm font-semibold text-blue-700">
//               Select Arm
//             </label>

//             <select
//               value={selectedArm ? getId(selectedArm) : ""}
//               onChange={(e) => handleArmSelect(e.target.value)}
//               disabled={savingResults || arms.length === 0}
//               className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
//             >
//               <option value="">-- Choose an arm --</option>
//               {arms.map((arm) => (
//                 <option key={getId(arm)} value={getId(arm)}>
//                   {arm.name ?? arm.armName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {selectedArm && (
//           <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
//             <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800">
//                   Scores Entry
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   CA scores: 0-10 each • Exam: 0-60
//                 </p>
//               </div>

//               {students.length > 0 && (
//                 <button
//                   onClick={handleSubmit}
//                   disabled={savingResults}
//                   className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
//                 >
//                   {savingResults ? "Saving..." : "Save Results"}
//                 </button>
//               )}
//             </div>

//             {loadingStudents ? (
//               <div className="py-8 text-center">
//                 <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-green-600"></div>
//                 <p className="mt-2 text-sm text-gray-500">Loading students...</p>
//               </div>
//             ) : students.length === 0 ? (
//               <div className="py-8 text-center">
//                 <p className="text-sm text-gray-500">
//                   No students found in this arm.
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-3 md:hidden">
//                   {students.map((enrollment) => {
//                     const enrollmentId = enrollment._id;
//                     const student = enrollment.studentId;
//                     const current = scores[enrollmentId] || {};

//                     return (
//                       <div
//                         key={enrollmentId}
//                         className="rounded-lg border border-gray-200 bg-white p-3"
//                       >
//                         <div className="mb-3 border-b border-gray-100 pb-2">
//                           <p className="text-sm font-semibold text-gray-900">
//                             {student?.name || "Unknown Student"}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             ID: {student?.admissionNumber || "—"}
//                           </p>
//                         </div>

//                         <div className="grid grid-cols-5 gap-2">
//                           {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
//                             <div key={`${enrollmentId}-${field}`}>
//                               <label className="mb-1 block text-center text-[10px] font-medium uppercase text-gray-500">
//                                 {field === "exam" ? "Exam" : field.toUpperCase()}
//                               </label>
//                               <input
//                                 type="number"
//                                 inputMode="numeric"
//                                 value={current[field] ?? ""}
//                                 onChange={(e) =>
//                                   handleScoreChange(enrollmentId, field, e.target.value)
//                                 }
//                                 placeholder="-"
//                                 className="w-full rounded-lg border border-gray-300 p-2 text-center text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="hidden overflow-x-auto md:block">
//                   <table className="w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-green-600 text-white">
//                         <th className="rounded-tl-lg p-3 text-left">Student</th>
//                         <th className="p-3 text-center">CA1</th>
//                         <th className="p-3 text-center">CA2</th>
//                         <th className="p-3 text-center">CA3</th>
//                         <th className="p-3 text-center">CA4</th>
//                         <th className="rounded-tr-lg p-3 text-center">Exam</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {students.map((enrollment, idx) => {
//                         const enrollmentId = enrollment._id;
//                         const student = enrollment.studentId;
//                         const current = scores[enrollmentId] || {};

//                         return (
//                           <tr
//                             key={enrollmentId}
//                             className={`border-b ${
//                               idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                             } hover:bg-gray-100`}
//                           >
//                             <td className="p-3">
//                               <div className="font-medium text-gray-900">
//                                 {student?.name || "Unknown Student"}
//                               </div>
//                               <div className="text-xs text-gray-500">
//                                 {student?.admissionNumber || "—"}
//                               </div>
//                             </td>

//                             {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
//                               <td
//                                 key={`${enrollmentId}-${field}`}
//                                 className="p-2 text-center"
//                               >
//                                 <input
//                                   type="number"
//                                   value={current[field] ?? ""}
//                                   onChange={(e) =>
//                                     handleScoreChange(enrollmentId, field, e.target.value)
//                                   }
//                                   className="w-20 rounded-lg border border-gray-300 p-2 text-center focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
//                                   placeholder="-"
//                                 />
//                               </td>
//                             ))}
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="sticky bottom-0 mt-4 -mx-3 rounded-t-xl bg-white p-3 shadow-lg md:hidden">
//                   <button
//                     onClick={handleSubmit}
//                     disabled={savingResults}
//                     className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:bg-green-700 active:scale-95 disabled:opacity-60"
//                   >
//                     {savingResults ? "Saving..." : "Save All Results"}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// src/pages/admin/ResultEntryPage.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

const getId = (item) =>
  item?._id ?? item?.id ?? item?.subjectId ?? item?.classId ?? item?.armId;

export default function ResultEntryPage() {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);

  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingResults, setSavingResults] = useState(false);

  const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
    user?.role
  );

  const restrictedUnitName =
    user?.role === "principal"
      ? "secondary"
      : user?.role === "head_teacher"
      ? "primary"
      : "";

  const userAcademicUnitId =
    user?.academicUnitId?._id ||
    user?.academicUnitId ||
    user?.classTeacherOf?.academicUnitId?._id ||
    user?.classTeacherOf?.academicUnitId ||
    "";

  const isAcademicUnitLocked =
    !isFullAccess && (restrictedUnitName || user?.role === "teacher");

  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;

    if (user?.role === "teacher" && userAcademicUnitId) {
      return academicUnits.filter((unit) => getId(unit) === userAcademicUnitId);
    }

    if (restrictedUnitName) {
      return academicUnits.filter((unit) =>
        unit.name?.toLowerCase().includes(restrictedUnitName)
      );
    }

    return academicUnits;
  }, [academicUnits, isFullAccess, restrictedUnitName, user?.role, userAcademicUnitId]);

  const selectedAcademicUnitObj = useMemo(
    () => academicUnits.find((unit) => getId(unit) === selectedAcademicUnit),
    [academicUnits, selectedAcademicUnit]
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingUnits(true);

        const [sessionRes, unitRes] = await Promise.all([
          api.get("/sessions/active"),
          api.get("/academic-units"),
        ]);

        const sessionPayload = getApiData(sessionRes);
        const unitPayload = getApiData(unitRes);
        const units = Array.isArray(unitPayload) ? unitPayload : [];

        setActiveSession(sessionPayload?.session || sessionRes.data?.session || null);
        setActiveTerm(sessionPayload?.term || sessionRes.data?.term || null);
        setAcademicUnits(units);

        if (!isFullAccess) {
          let allowedUnit = null;

          if (user?.role === "teacher" && userAcademicUnitId) {
            allowedUnit = units.find((unit) => getId(unit) === userAcademicUnitId);
          }

          if (!allowedUnit && restrictedUnitName) {
            allowedUnit = units.find((unit) =>
              unit.name?.toLowerCase().includes(restrictedUnitName)
            );
          }

          if (allowedUnit) {
            setSelectedAcademicUnit(getId(allowedUnit));
          }
        }
      } catch (err) {
        console.error("Initial result entry load error:", err);
        toast.error("Failed to load active session or academic units.");
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchInitialData();
  }, [isFullAccess, restrictedUnitName, user?.role, userAcademicUnitId]);

  useEffect(() => {
    if (!user || !selectedAcademicUnit) {
      setSubjects([]);
      return;
    }

    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);

        let res;

        if (user.role === "teacher") {
          res = await api.get(`/teacher-assignments/${user._id}/subjects`, {
            params: { academicUnitId: selectedAcademicUnit },
          });
        } else {
          res = await api.get("/subjects", {
            params: { academicUnitId: selectedAcademicUnit },
          });
        }

        const payload = getApiData(res);
        setSubjects(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("Failed to load subjects");
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [user, selectedAcademicUnit]);

  useEffect(() => {
    if (!selectedAcademicUnit) {
      setClasses([]);
      return;
    }

    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);

        const res = await api.get("/classes", {
          params: { academicUnitId: selectedAcademicUnit },
        });

        const payload = getApiData(res);
        setClasses(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        toast.error("Failed to load classes");
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit]);

  const resetFromAcademicUnit = () => {
    setSelectedSubject(null);
    setSelectedClass(null);
    setSelectedArm(null);
    setSubjects([]);
    setClasses([]);
    setArms([]);
    setStudents([]);
    setScores({});
  };

  const handleAcademicUnitSelect = (academicUnitId) => {
    resetFromAcademicUnit();
    setSelectedAcademicUnit(academicUnitId);
  };

  const handleSubjectSelect = (subjectId) => {
    const subject = subjects.find((s) => getId(s) === subjectId);

    setSelectedSubject(subject || null);
    setSelectedClass(null);
    setSelectedArm(null);
    setArms([]);
    setStudents([]);
    setScores({});
  };

  const handleClassSelect = (classId) => {
    const cls = classes.find((c) => getId(c) === classId);

    setSelectedClass(cls || null);
    setSelectedArm(null);
    setStudents([]);
    setScores({});
    setArms(cls?.arms ?? cls?.armsList ?? []);
  };

  const handleArmSelect = async (armId) => {
    const arm = arms.find((a) => getId(a) === armId);
    setSelectedArm(arm || null);
    setStudents([]);
    setScores({});

    if (
      !selectedAcademicUnit ||
      !selectedClass ||
      !selectedSubject ||
      !activeSession ||
      !activeTerm ||
      !arm
    ) {
      toast.error("Please select academic unit, subject, class, arm, session and term.");
      return;
    }

    try {
      setLoadingStudents(true);

      const classId = getId(selectedClass);
      const armIdValue = getId(arm);
      const subjectId = getId(selectedSubject);
      const sessionId = activeSession._id;
      const termId = activeTerm._id;

      const [stuRes, resultRes] = await Promise.all([
        api.get("/students", {
          params: {
            academicUnitId: selectedAcademicUnit,
            classId,
            armId: armIdValue,
            sessionId,
          },
        }),
        api.get("/results/by-subject", {
          params: {
            academicUnitId: selectedAcademicUnit,
            classId,
            armId: armIdValue,
            subjectId,
            sessionId,
            termId,
          },
        }),
      ]);

      const studentPayload = getApiData(stuRes);
      const resultPayload = getApiData(resultRes);

      const studentList = Array.isArray(studentPayload) ? studentPayload : [];
      const existingResults = Array.isArray(resultPayload) ? resultPayload : [];

      const newScores = {};

      existingResults.forEach((r) => {
        const enrollmentId = r.enrollmentId?._id ?? r.enrollmentId;
        if (!enrollmentId) return;

        newScores[enrollmentId] = {
          ca1: r.ca1 ?? "",
          ca2: r.ca2 ?? "",
          ca3: r.ca3 ?? "",
          ca4: r.ca4 ?? "",
          exam: r.exam ?? "",
        };
      });

      setStudents(studentList);
      setScores(newScores);
    } catch (err) {
      console.error("Error fetching arm data:", err);
      toast.error(err.response?.data?.message || "Failed to load students/results");
      setStudents([]);
      setScores({});
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleScoreChange = (enrollmentId, field, value) => {
    let num = value === "" ? "" : Number(value);

    if (value !== "" && Number.isNaN(num)) return;

    if (field.startsWith("ca") && num !== "") {
      num = Math.max(0, Math.min(num, 10));
    }

    if (field === "exam" && num !== "") {
      num = Math.max(0, Math.min(num, 60));
    }

    setScores((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...(prev[enrollmentId] || {}),
        [field]: num,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedAcademicUnit || !selectedSubject || !selectedClass || !selectedArm) {
      toast.error("Please select academic unit, subject, class and arm.");
      return;
    }

    if (!activeSession || !activeTerm) {
      toast.error("No active session/term found.");
      return;
    }

    const subjectId = getId(selectedSubject);
    const classId = getId(selectedClass);
    const armId = getId(selectedArm);

    const resultsArray = Object.entries(scores)
      .filter(([, sc]) => Object.values(sc).some((v) => v !== ""))
      .map(([enrollmentId, sc]) => {
        const result = { enrollmentId };

        ["ca1", "ca2", "ca3", "ca4", "exam"].forEach((field) => {
          if (sc[field] !== "" && sc[field] !== undefined) {
            result[field] = Number(sc[field]);
          }
        });

        return result;
      });

    if (resultsArray.length === 0) {
      toast.error("No scores entered.");
      return;
    }

    try {
      setSavingResults(true);

      await api.post("/results/add-or-update", {
        academicUnitId: selectedAcademicUnit,
        subjectId,
        classId,
        armId,
        sessionId: activeSession._id,
        termId: activeTerm._id,
        results: resultsArray,
      });

      toast.success("Results saved successfully!");
    } catch (err) {
      console.error("Error saving results:", err);
      toast.error(err.response?.data?.message || "Failed to save results.");
    } finally {
      setSavingResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-3 px-2 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
          <h2 className="text-lg font-bold text-green-700 sm:text-xl">
            Result Entry
          </h2>

          <p className="mt-0.5 text-xs text-gray-600">
            {activeSession && activeTerm
              ? `${activeSession.name} • ${activeTerm.name}`
              : "No active session/term selected"}
          </p>

          {selectedAcademicUnitObj && (
            <p className="mt-1 text-xs font-semibold text-purple-700">
              Academic Unit: {selectedAcademicUnitObj.name}
            </p>
          )}

          {isAcademicUnitLocked && selectedAcademicUnitObj && (
            <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
              Restricted View: {selectedAcademicUnitObj.name}
            </p>
          )}
        </div>

        {/* Compact Filter Bar */}
        <div className="mb-3 rounded-xl bg-white p-3 shadow-sm sm:p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Academic Unit */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Academic Unit
              </label>
              <select
                value={selectedAcademicUnit}
                onChange={(e) => handleAcademicUnitSelect(e.target.value)}
                disabled={loadingUnits || savingResults || isAcademicUnitLocked}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:bg-gray-100"
              >
                <option value="">-- Unit --</option>
                {visibleAcademicUnits.map((unit) => (
                  <option key={getId(unit)} value={getId(unit)}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-green-700">
                Subject
              </label>
              <select
                value={selectedSubject ? getId(selectedSubject) : ""}
                onChange={(e) => handleSubjectSelect(e.target.value)}
                disabled={
                  !selectedAcademicUnit ||
                  loadingSubjects ||
                  loadingClasses ||
                  loadingStudents ||
                  savingResults
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
              >
                <option value="">-- Subject --</option>
                {subjects.map((subject) => (
                  <option key={getId(subject)} value={getId(subject)}>
                    {subject.name ?? subject.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-purple-700">
                Class
              </label>
              <select
                value={selectedClass ? getId(selectedClass) : ""}
                onChange={(e) => handleClassSelect(e.target.value)}
                disabled={
                  !selectedSubject ||
                  loadingClasses ||
                  loadingStudents ||
                  savingResults ||
                  classes.length === 0
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
              >
                <option value="">-- Class --</option>
                {classes.map((cls) => (
                  <option key={getId(cls)} value={getId(cls)}>
                    {cls.name ?? cls.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Arm */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-blue-700">
                Arm
              </label>
              <select
                value={selectedArm ? getId(selectedArm) : ""}
                onChange={(e) => handleArmSelect(e.target.value)}
                disabled={!selectedClass || savingResults || arms.length === 0}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              >
                <option value="">-- Arm --</option>
                {arms.map((arm) => (
                  <option key={getId(arm)} value={getId(arm)}>
                    {arm.name ?? arm.armName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingUnits && (
            <p className="mt-2 text-xs text-gray-500">Loading academic units...</p>
          )}
        </div>

        {selectedArm && (
          <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Scores Entry
                </h3>
                <p className="text-xs text-gray-500">
                  CA scores: 0-10 each • Exam: 0-60
                </p>
              </div>

              {students.length > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={savingResults}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                  {savingResults ? "Saving..." : "Save Results"}
                </button>
              )}
            </div>

            {loadingStudents ? (
              <div className="py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-green-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">
                  No students found in this arm.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 md:hidden">
                  {students.map((enrollment) => {
                    const enrollmentId = enrollment._id;
                    const student = enrollment.studentId;
                    const current = scores[enrollmentId] || {};

                    return (
                      <div
                        key={enrollmentId}
                        className="rounded-lg border border-gray-200 bg-white p-3"
                      >
                        <div className="mb-3 border-b border-gray-100 pb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {student?.name || "Unknown Student"}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {student?.admissionNumber || "—"}
                          </p>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
                            <div key={`${enrollmentId}-${field}`}>
                              <label className="mb-1 block text-center text-[10px] font-medium uppercase text-gray-500">
                                {field === "exam" ? "Exam" : field.toUpperCase()}
                              </label>
                              <input
                                type="number"
                                inputMode="numeric"
                                value={current[field] ?? ""}
                                onChange={(e) =>
                                  handleScoreChange(enrollmentId, field, e.target.value)
                                }
                                placeholder="-"
                                className="w-full rounded-lg border border-gray-300 p-2 text-center text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-green-600 text-white">
                        <th className="rounded-tl-lg p-3 text-left">Student</th>
                        <th className="p-3 text-center">CA1</th>
                        <th className="p-3 text-center">CA2</th>
                        <th className="p-3 text-center">CA3</th>
                        <th className="p-3 text-center">CA4</th>
                        <th className="rounded-tr-lg p-3 text-center">Exam</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((enrollment, idx) => {
                        const enrollmentId = enrollment._id;
                        const student = enrollment.studentId;
                        const current = scores[enrollmentId] || {};

                        return (
                          <tr
                            key={enrollmentId}
                            className={`border-b ${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-gray-100`}
                          >
                            <td className="p-3">
                              <div className="font-medium text-gray-900">
                                {student?.name || "Unknown Student"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student?.admissionNumber || "—"}
                              </div>
                            </td>

                            {["ca1", "ca2", "ca3", "ca4", "exam"].map((field) => (
                              <td
                                key={`${enrollmentId}-${field}`}
                                className="p-2 text-center"
                              >
                                <input
                                  type="number"
                                  value={current[field] ?? ""}
                                  onChange={(e) =>
                                    handleScoreChange(enrollmentId, field, e.target.value)
                                  }
                                  className="w-20 rounded-lg border border-gray-300 p-2 text-center focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                  placeholder="-"
                                />
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="sticky bottom-0 mt-4 -mx-3 rounded-t-xl bg-white p-3 shadow-lg md:hidden">
                  <button
                    onClick={handleSubmit}
                    disabled={savingResults}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:bg-green-700 active:scale-95 disabled:opacity-60"
                  >
                    {savingResults ? "Saving..." : "Save All Results"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}