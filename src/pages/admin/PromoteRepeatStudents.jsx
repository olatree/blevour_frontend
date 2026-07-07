

// // src/pages/admin/PromoteRepeatStudent.jsx
// import { useEffect, useMemo, useState } from "react";
// import api from "../../api/axios";

// const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// export default function PromoteRepeatStudent() {
//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sessions, setSessions] = useState([]);

//   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");

//   const [fromSessionId, setFromSessionId] = useState("");
//   const [toSessionId, setToSessionId] = useState("");

//   const [fromClassId, setFromClassId] = useState("");
//   const [fromArmId, setFromArmId] = useState("");

//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState({});

//   const [loading, setLoading] = useState(false);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [unitRes, sessionRes] = await Promise.all([
//           api.get("/academic-units"),
//           api.get("/sessions"),
//         ]);

//         const unitsPayload = getApiData(unitRes);
//         const sessionsPayload = getApiData(sessionRes);

//         setAcademicUnits(Array.isArray(unitsPayload) ? unitsPayload : []);
//         setSessions(Array.isArray(sessionsPayload) ? sessionsPayload : []);
//       } catch (err) {
//         console.error("Error loading data:", err);
//         setError("Failed to load academic units or sessions.");
//       }
//     };

//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       if (!selectedAcademicUnit) {
//         setClasses([]);
//         return;
//       }

//       try {
//         setLoadingClasses(true);
//         setError("");

//         const res = await api.get("/classes", {
//           params: {
//             academicUnitId: selectedAcademicUnit,
//           },
//         });

//         const classesPayload = getApiData(res);
//         setClasses(Array.isArray(classesPayload) ? classesPayload : []);
//       } catch (err) {
//         console.error("Error loading classes:", err);
//         setClasses([]);
//         setError("Failed to load classes for selected academic unit.");
//       } finally {
//         setLoadingClasses(false);
//       }
//     };

//     fetchClasses();
//   }, [selectedAcademicUnit]);

//   const selectedUnit = useMemo(
//     () => academicUnits.find((unit) => unit._id === selectedAcademicUnit),
//     [academicUnits, selectedAcademicUnit]
//   );

//   const fromClass = useMemo(
//     () => classes.find((cls) => cls._id === fromClassId),
//     [classes, fromClassId]
//   );

//   const isGraduatingClass = !!fromClass?.isGraduatingClass;

//   const resetStudents = () => {
//     setStudents([]);
//     setSelectedStudents({});
//   };

//   const resetSourceClass = () => {
//     setFromClassId("");
//     setFromArmId("");
//     setToSessionId("");
//     resetStudents();
//   };

//   const loadStudents = async () => {
//     if (!selectedAcademicUnit) {
//       setError("Please select academic unit.");
//       return;
//     }

//     if (!fromSessionId || !fromClassId || !fromArmId) {
//       setError("Please select source session, source class, and source arm.");
//       return;
//     }

//     if (!isGraduatingClass && !toSessionId) {
//       setError("Please select target session.");
//       return;
//     }

//     if (!isGraduatingClass && fromSessionId === toSessionId) {
//       setError("Source session and target session cannot be the same.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");

//       const res = await api.get("/students", {
//         params: {
//           academicUnitId: selectedAcademicUnit,
//           sessionId: fromSessionId,
//           classId: fromClassId,
//           armId: fromArmId,
//         },
//       });

//       const list = Array.isArray(getApiData(res)) ? getApiData(res) : [];
//       setStudents(list);

//       const initialSelected = {};

//       list.forEach((enrollment) => {
//         const studentId = enrollment.studentId?._id;
//         if (!studentId) return;

//         initialSelected[studentId] = {
//           checked: true,
//           studentId,
//           action: isGraduatingClass ? "graduate" : "promote",
//           toClassId: "",
//           toArmId: "",
//         };
//       });

//       setSelectedStudents(initialSelected);
//     } catch (err) {
//       console.error("Error loading students:", err);
//       setError(err.response?.data?.message || "Failed to load students.");
//       resetStudents();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStudent = (studentId, field, value) => {
//     setSelectedStudents((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         [field]: value,
//       },
//     }));
//   };

//   const toggleStudent = (studentId) => {
//     setSelectedStudents((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         checked: !prev[studentId]?.checked,
//       },
//     }));
//   };

//   const selectAllStudents = () => {
//     setSelectedStudents((prev) => {
//       const updated = {};

//       Object.entries(prev).forEach(([studentId, item]) => {
//         updated[studentId] = {
//           ...item,
//           checked: true,
//         };
//       });

//       return updated;
//     });
//   };

//   const clearAllSelections = () => {
//     setSelectedStudents((prev) => {
//       const updated = {};

//       Object.entries(prev).forEach(([studentId, item]) => {
//         updated[studentId] = {
//           ...item,
//           checked: false,
//         };
//       });

//       return updated;
//     });
//   };

//   const markAllAsRepeat = () => {
//     setSelectedStudents((prev) => {
//       const updated = {};

//       Object.entries(prev).forEach(([studentId, item]) => {
//         updated[studentId] = {
//           ...item,
//           action: "repeat",
//           toClassId: fromClassId,
//           toArmId: fromArmId,
//         };
//       });

//       return updated;
//     });
//   };

//   const markAllAsGraduate = () => {
//     setSelectedStudents((prev) => {
//       const updated = {};

//       Object.entries(prev).forEach(([studentId, item]) => {
//         updated[studentId] = {
//           ...item,
//           action: "graduate",
//           toClassId: "",
//           toArmId: "",
//         };
//       });

//       return updated;
//     });
//   };

//   const getSummary = () => {
//     const selected = Object.values(selectedStudents).filter(
//       (item) => item.checked
//     );

//     return {
//       total: selected.length,
//       promote: selected.filter((item) => item.action === "promote").length,
//       repeat: selected.filter((item) => item.action === "repeat").length,
//       graduate: selected.filter((item) => item.action === "graduate").length,
//     };
//   };

//   const handleSubmit = async () => {
//     try {
//       setSubmitting(true);
//       setError("");
//       setMessage("");

//       if (!selectedAcademicUnit) {
//         setError("Academic unit is required.");
//         return;
//       }

//       if (!fromSessionId || !fromClassId || !fromArmId) {
//         setError("Source session, source class, and source arm are required.");
//         return;
//       }

//       const studentsPayload = Object.values(selectedStudents)
//         .filter((item) => item.checked)
//         .map((item) => ({
//           studentId: item.studentId,
//           action: item.action,
//           toClassId: item.action === "graduate" ? undefined : item.toClassId,
//           toArmId: item.action === "graduate" ? undefined : item.toArmId,
//         }));

//       if (studentsPayload.length === 0) {
//         setError("Please select at least one student.");
//         return;
//       }

//       const invalid = studentsPayload.find((item) => {
//         if (!item.studentId || !item.action) return true;
//         if (item.action === "graduate") return false;
//         return !item.toClassId || !item.toArmId;
//       });

//       if (invalid) {
//         setError("Every promote/repeat student must have target class and target arm.");
//         return;
//       }

//       const hasPromoteOrRepeat = studentsPayload.some(
//         (item) => item.action === "promote" || item.action === "repeat"
//       );

//       if (hasPromoteOrRepeat && !toSessionId) {
//         setError("Target session is required for promote/repeat.");
//         return;
//       }

//       if (hasPromoteOrRepeat && fromSessionId === toSessionId) {
//         setError("Source session and target session cannot be the same.");
//         return;
//       }

//       const summary = getSummary();

//       const ok = window.confirm(
//         `Confirm action:\n\n` +
//           `Academic Unit: ${selectedUnit?.name || "Selected Unit"}\n\n` +
//           `Promote: ${summary.promote}\n` +
//           `Repeat: ${summary.repeat}\n` +
//           `Graduate: ${summary.graduate}\n\n` +
//           `Graduated students will NOT get a new enrollment.\n\nContinue?`
//       );

//       if (!ok) return;

//       const res = await api.post("/promotions", {
//         academicUnitId: selectedAcademicUnit,
//         fromSessionId,
//         toSessionId,
//         fromClassId,
//         fromArmId,
//         students: studentsPayload,
//       });

//       const data = res.data?.data;

//       setMessage(
//         `Completed. Promoted: ${data?.promotedCount || 0}, Repeated: ${
//           data?.repeatedCount || 0
//         }, Graduated: ${data?.graduatedCount || 0}, Skipped: ${
//           data?.skippedCount || 0
//         }`
//       );
//     } catch (err) {
//       console.error("Promotion error:", err);
//       setError(err.response?.data?.message || "Promotion process failed.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//           <h2 className="text-lg font-bold text-green-700">
//             Promote / Repeat / Graduate Students
//           </h2>
//           <p className="text-xs text-gray-500">
//             Create next-session enrollments or graduate final-year students.
//           </p>
//         </div>

//         {message && (
//           <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//           <h3 className="mb-3 font-semibold text-gray-800">Source Details</h3>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
//             <select
//               value={selectedAcademicUnit}
//               onChange={(e) => {
//                 setSelectedAcademicUnit(e.target.value);
//                 resetSourceClass();
//               }}
//               className="rounded-lg border p-2 text-sm"
//             >
//               <option value="">Academic Unit</option>
//               {academicUnits.map((unit) => (
//                 <option key={unit._id} value={unit._id}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={fromSessionId}
//               onChange={(e) => {
//                 setFromSessionId(e.target.value);
//                 resetStudents();
//               }}
//               className="rounded-lg border p-2 text-sm"
//             >
//               <option value="">From Session</option>
//               {sessions.map((session) => (
//                 <option key={session._id} value={session._id}>
//                   {session.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={toSessionId}
//               onChange={(e) => {
//                 setToSessionId(e.target.value);
//                 resetStudents();
//               }}
//               disabled={isGraduatingClass}
//               className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
//             >
//               <option value="">
//                 {isGraduatingClass ? "Not needed for graduation" : "To Session"}
//               </option>
//               {sessions.map((session) => (
//                 <option key={session._id} value={session._id}>
//                   {session.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={fromClassId}
//               onChange={(e) => {
//                 setFromClassId(e.target.value);
//                 setFromArmId("");
//                 setToSessionId("");
//                 resetStudents();
//               }}
//               disabled={!selectedAcademicUnit || loadingClasses}
//               className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
//             >
//               <option value="">
//                 {loadingClasses ? "Loading classes..." : "From Class"}
//               </option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name} {cls.isGraduatingClass ? "🎓" : ""}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={fromArmId}
//               onChange={(e) => {
//                 setFromArmId(e.target.value);
//                 resetStudents();
//               }}
//               disabled={!fromClassId}
//               className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
//             >
//               <option value="">From Arm</option>
//               {(fromClass?.arms || []).map((arm) => (
//                 <option key={arm._id} value={arm._id}>
//                   {arm.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedUnit && (
//             <p className="mt-3 rounded-lg bg-green-50 p-3 text-xs text-green-700">
//               Academic Unit: <b>{selectedUnit.name}</b>
//             </p>
//           )}

//           {isGraduatingClass && (
//             <p className="mt-3 rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
//               🎓 This is a graduating class. Students can graduate or repeat.
//               Graduation does not create a new enrollment.
//             </p>
//           )}

//           <div className="mt-3 flex flex-wrap gap-2">
//             <button
//               onClick={loadStudents}
//               disabled={
//                 loading ||
//                 !selectedAcademicUnit ||
//                 !fromSessionId ||
//                 !fromClassId ||
//                 !fromArmId ||
//                 (!isGraduatingClass && !toSessionId)
//               }
//               className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50"
//             >
//               {loading ? "Loading..." : "Load Students"}
//             </button>

//             <button
//               onClick={selectAllStudents}
//               disabled={!students.length}
//               className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
//             >
//               Select All
//             </button>

//             <button
//               onClick={clearAllSelections}
//               disabled={!students.length}
//               className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white disabled:opacity-50"
//             >
//               Clear All
//             </button>

//             {isGraduatingClass && (
//               <button
//                 onClick={markAllAsGraduate}
//                 disabled={!students.length}
//                 className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white disabled:opacity-50"
//               >
//                 Graduate All
//               </button>
//             )}

//             <button
//               onClick={markAllAsRepeat}
//               disabled={!students.length}
//               className="rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white disabled:opacity-50"
//             >
//               Mark All Repeat
//             </button>
//           </div>
//         </div>

//         {students.length > 0 && (
//           <div className="rounded-xl bg-white p-4 shadow-sm">
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="font-semibold text-gray-800">Students</h3>
//               <span className="text-xs text-gray-500">
//                 {students.length} loaded
//               </span>
//             </div>

//             <div className="space-y-3">
//               {students.map((enrollment) => {
//                 const student = enrollment.studentId;
//                 const studentId = student?._id;

//                 if (!studentId) return null;

//                 const selected = selectedStudents[studentId] || {};
//                 const studentTargetClass = classes.find(
//                   (cls) => cls._id === selected.toClassId
//                 );

//                 return (
//                   <div
//                     key={studentId}
//                     className="rounded-xl border bg-gray-50 p-3"
//                   >
//                     <div className="mb-3 flex items-start gap-3">
//                       <input
//                         type="checkbox"
//                         checked={!!selected.checked}
//                         onChange={() => toggleStudent(studentId)}
//                         className="mt-1"
//                       />

//                       <div className="flex-1">
//                         <p className="font-semibold text-gray-800">
//                           {student.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {student.admissionNumber} • {enrollment.classId?.name}{" "}
//                           {enrollment.armId?.name}
//                         </p>
//                       </div>
//                     </div>

//                     <div
//                       className={`grid grid-cols-1 gap-2 ${
//                         selected.action === "graduate"
//                           ? "sm:grid-cols-1"
//                           : "sm:grid-cols-3"
//                       }`}
//                     >
//                       <select
//                         value={
//                           selected.action ||
//                           (isGraduatingClass ? "graduate" : "promote")
//                         }
//                         onChange={(e) => {
//                           const action = e.target.value;

//                           if (action === "repeat") {
//                             setSelectedStudents((prev) => ({
//                               ...prev,
//                               [studentId]: {
//                                 ...prev[studentId],
//                                 action,
//                                 toClassId: fromClassId,
//                                 toArmId: fromArmId,
//                               },
//                             }));
//                           } else if (action === "graduate") {
//                             setSelectedStudents((prev) => ({
//                               ...prev,
//                               [studentId]: {
//                                 ...prev[studentId],
//                                 action,
//                                 toClassId: "",
//                                 toArmId: "",
//                               },
//                             }));
//                           } else {
//                             setSelectedStudents((prev) => ({
//                               ...prev,
//                               [studentId]: {
//                                 ...prev[studentId],
//                                 action,
//                                 toClassId: "",
//                                 toArmId: "",
//                               },
//                             }));
//                           }
//                         }}
//                         disabled={!selected.checked}
//                         className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
//                       >
//                         {isGraduatingClass ? (
//                           <>
//                             <option value="graduate">Graduate</option>
//                             <option value="repeat">Repeat</option>
//                           </>
//                         ) : (
//                           <>
//                             <option value="promote">Promote</option>
//                             <option value="repeat">Repeat</option>
//                           </>
//                         )}
//                       </select>

//                       {selected.action !== "graduate" && (
//                         <>
//                           <select
//                             value={selected.toClassId || ""}
//                             onChange={(e) => {
//                               updateStudent(
//                                 studentId,
//                                 "toClassId",
//                                 e.target.value
//                               );
//                               updateStudent(studentId, "toArmId", "");
//                             }}
//                             disabled={
//                               !selected.checked || selected.action === "repeat"
//                             }
//                             className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
//                           >
//                             <option value="">Target Class</option>
//                             {classes.map((cls) => (
//                               <option key={cls._id} value={cls._id}>
//                                 {cls.name}
//                               </option>
//                             ))}
//                           </select>

//                           <select
//                             value={selected.toArmId || ""}
//                             onChange={(e) =>
//                               updateStudent(studentId, "toArmId", e.target.value)
//                             }
//                             disabled={
//                               !selected.checked ||
//                               !selected.toClassId ||
//                               selected.action === "repeat"
//                             }
//                             className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
//                           >
//                             <option value="">Target Arm</option>
//                             {(studentTargetClass?.arms || []).map((arm) => (
//                               <option key={arm._id} value={arm._id}>
//                                 {arm.name}
//                               </option>
//                             ))}
//                           </select>
//                         </>
//                       )}
//                     </div>

//                     {selected.action === "repeat" && (
//                       <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-700">
//                         This student will repeat {enrollment.classId?.name}{" "}
//                         {enrollment.armId?.name} in the target session.
//                       </p>
//                     )}

//                     {selected.action === "graduate" && (
//                       <p className="mt-2 rounded-lg bg-purple-50 p-2 text-xs text-purple-700">
//                         This student will graduate. No new enrollment will be
//                         created.
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={submitting}
//               className="sticky bottom-3 mt-5 w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-lg disabled:opacity-50"
//             >
//               {submitting ? "Processing..." : "Submit"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// src/pages/admin/PromoteRepeatStudent.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

export default function PromoteRepeatStudent() {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");

  const [fromSessionId, setFromSessionId] = useState("");
  const [toSessionId, setToSessionId] = useState("");

  const [fromClassId, setFromClassId] = useState("");
  const [fromArmId, setFromArmId] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [unitRes, sessionRes] = await Promise.all([
          api.get("/academic-units"),
          api.get("/sessions"),
        ]);

        const unitsPayload = getApiData(unitRes);
        const sessionsPayload = getApiData(sessionRes);

        const units = Array.isArray(unitsPayload) ? unitsPayload : [];

        setAcademicUnits(units);
        setSessions(Array.isArray(sessionsPayload) ? sessionsPayload : []);

        if (!isFullAccess && restrictedUnitName) {
          const allowedUnit = units.find((unit) =>
            unit.name?.toLowerCase().includes(restrictedUnitName)
          );

          if (allowedUnit) {
            setSelectedAcademicUnit(allowedUnit._id);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load academic units or sessions.");
      }
    };

    fetchInitialData();
  }, [isFullAccess, restrictedUnitName]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedAcademicUnit) {
        setClasses([]);
        return;
      }

      try {
        setLoadingClasses(true);
        setError("");

        const res = await api.get("/classes", {
          params: {
            academicUnitId: selectedAcademicUnit,
          },
        });

        const classesPayload = getApiData(res);
        setClasses(Array.isArray(classesPayload) ? classesPayload : []);
      } catch (err) {
        console.error("Error loading classes:", err);
        setClasses([]);
        setError("Failed to load classes for selected academic unit.");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit]);

  const selectedUnit = useMemo(
    () => academicUnits.find((unit) => unit._id === selectedAcademicUnit),
    [academicUnits, selectedAcademicUnit]
  );

  const fromClass = useMemo(
    () => classes.find((cls) => cls._id === fromClassId),
    [classes, fromClassId]
  );

  const isGraduatingClass = !!fromClass?.isGraduatingClass;

  const resetStudents = () => {
    setStudents([]);
    setSelectedStudents({});
  };

  const resetSourceClass = () => {
    setFromClassId("");
    setFromArmId("");
    setToSessionId("");
    resetStudents();
  };

  const loadStudents = async () => {
    if (!selectedAcademicUnit) {
      setError("Please select academic unit.");
      return;
    }

    if (!fromSessionId || !fromClassId || !fromArmId) {
      setError("Please select source session, source class, and source arm.");
      return;
    }

    if (!isGraduatingClass && !toSessionId) {
      setError("Please select target session.");
      return;
    }

    if (!isGraduatingClass && fromSessionId === toSessionId) {
      setError("Source session and target session cannot be the same.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await api.get("/students", {
        params: {
          academicUnitId: selectedAcademicUnit,
          sessionId: fromSessionId,
          classId: fromClassId,
          armId: fromArmId,
        },
      });

      const list = Array.isArray(getApiData(res)) ? getApiData(res) : [];
      setStudents(list);

      const initialSelected = {};

      list.forEach((enrollment) => {
        const studentId = enrollment.studentId?._id;
        if (!studentId) return;

        initialSelected[studentId] = {
          checked: true,
          studentId,
          action: isGraduatingClass ? "graduate" : "promote",
          toClassId: "",
          toArmId: "",
        };
      });

      setSelectedStudents(initialSelected);
    } catch (err) {
      console.error("Error loading students:", err);
      setError(err.response?.data?.message || "Failed to load students.");
      resetStudents();
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = (studentId, field, value) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        checked: !prev[studentId]?.checked,
      },
    }));
  };

  const selectAllStudents = () => {
    setSelectedStudents((prev) => {
      const updated = {};

      Object.entries(prev).forEach(([studentId, item]) => {
        updated[studentId] = {
          ...item,
          checked: true,
        };
      });

      return updated;
    });
  };

  const clearAllSelections = () => {
    setSelectedStudents((prev) => {
      const updated = {};

      Object.entries(prev).forEach(([studentId, item]) => {
        updated[studentId] = {
          ...item,
          checked: false,
        };
      });

      return updated;
    });
  };

  const markAllAsRepeat = () => {
    setSelectedStudents((prev) => {
      const updated = {};

      Object.entries(prev).forEach(([studentId, item]) => {
        updated[studentId] = {
          ...item,
          action: "repeat",
          toClassId: fromClassId,
          toArmId: fromArmId,
        };
      });

      return updated;
    });
  };

  const markAllAsGraduate = () => {
    setSelectedStudents((prev) => {
      const updated = {};

      Object.entries(prev).forEach(([studentId, item]) => {
        updated[studentId] = {
          ...item,
          action: "graduate",
          toClassId: "",
          toArmId: "",
        };
      });

      return updated;
    });
  };

  const getSummary = () => {
    const selected = Object.values(selectedStudents).filter(
      (item) => item.checked
    );

    return {
      total: selected.length,
      promote: selected.filter((item) => item.action === "promote").length,
      repeat: selected.filter((item) => item.action === "repeat").length,
      graduate: selected.filter((item) => item.action === "graduate").length,
    };
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      if (!selectedAcademicUnit) {
        setError("Academic unit is required.");
        return;
      }

      if (!fromSessionId || !fromClassId || !fromArmId) {
        setError("Source session, source class, and source arm are required.");
        return;
      }

      const studentsPayload = Object.values(selectedStudents)
        .filter((item) => item.checked)
        .map((item) => ({
          studentId: item.studentId,
          action: item.action,
          toClassId: item.action === "graduate" ? undefined : item.toClassId,
          toArmId: item.action === "graduate" ? undefined : item.toArmId,
        }));

      if (studentsPayload.length === 0) {
        setError("Please select at least one student.");
        return;
      }

      const invalid = studentsPayload.find((item) => {
        if (!item.studentId || !item.action) return true;
        if (item.action === "graduate") return false;
        return !item.toClassId || !item.toArmId;
      });

      if (invalid) {
        setError("Every promote/repeat student must have target class and target arm.");
        return;
      }

      const hasPromoteOrRepeat = studentsPayload.some(
        (item) => item.action === "promote" || item.action === "repeat"
      );

      if (hasPromoteOrRepeat && !toSessionId) {
        setError("Target session is required for promote/repeat.");
        return;
      }

      if (hasPromoteOrRepeat && fromSessionId === toSessionId) {
        setError("Source session and target session cannot be the same.");
        return;
      }

      const summary = getSummary();

      const ok = window.confirm(
        `Confirm action:\n\n` +
          `Academic Unit: ${selectedUnit?.name || "Selected Unit"}\n\n` +
          `Promote: ${summary.promote}\n` +
          `Repeat: ${summary.repeat}\n` +
          `Graduate: ${summary.graduate}\n\n` +
          `Graduated students will NOT get a new enrollment.\n\nContinue?`
      );

      if (!ok) return;

      const res = await api.post("/promotions", {
        academicUnitId: selectedAcademicUnit,
        fromSessionId,
        toSessionId,
        fromClassId,
        fromArmId,
        students: studentsPayload,
      });

      const data = res.data?.data;

      setMessage(
        `Completed. Promoted: ${data?.promotedCount || 0}, Repeated: ${
          data?.repeatedCount || 0
        }, Graduated: ${data?.graduatedCount || 0}, Skipped: ${
          data?.skippedCount || 0
        }`
      );
    } catch (err) {
      console.error("Promotion error:", err);
      setError(err.response?.data?.message || "Promotion process failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-green-700">
            Promote / Repeat / Graduate Students
          </h2>
          <p className="text-xs text-gray-500">
            Create next-session enrollments or graduate final-year students.
          </p>

          {isAcademicUnitLocked && selectedUnit && (
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
              Restricted View: {selectedUnit.name}
            </p>
          )}
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-gray-800">Source Details</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <select
              value={selectedAcademicUnit}
              disabled={isAcademicUnitLocked}
              onChange={(e) => {
                setSelectedAcademicUnit(e.target.value);
                resetSourceClass();
              }}
              className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Academic Unit</option>
              {visibleAcademicUnits.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>

            <select
              value={fromSessionId}
              onChange={(e) => {
                setFromSessionId(e.target.value);
                resetStudents();
              }}
              className="rounded-lg border p-2 text-sm"
            >
              <option value="">From Session</option>
              {sessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.name}
                </option>
              ))}
            </select>

            <select
              value={toSessionId}
              onChange={(e) => {
                setToSessionId(e.target.value);
                resetStudents();
              }}
              disabled={isGraduatingClass}
              className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            >
              <option value="">
                {isGraduatingClass ? "Not needed for graduation" : "To Session"}
              </option>
              {sessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.name}
                </option>
              ))}
            </select>

            <select
              value={fromClassId}
              onChange={(e) => {
                setFromClassId(e.target.value);
                setFromArmId("");
                setToSessionId("");
                resetStudents();
              }}
              disabled={!selectedAcademicUnit || loadingClasses}
              className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            >
              <option value="">
                {loadingClasses ? "Loading classes..." : "From Class"}
              </option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} {cls.isGraduatingClass ? "🎓" : ""}
                </option>
              ))}
            </select>

            <select
              value={fromArmId}
              onChange={(e) => {
                setFromArmId(e.target.value);
                resetStudents();
              }}
              disabled={!fromClassId}
              className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            >
              <option value="">From Arm</option>
              {(fromClass?.arms || []).map((arm) => (
                <option key={arm._id} value={arm._id}>
                  {arm.name}
                </option>
              ))}
            </select>
          </div>

          {selectedUnit && (
            <p className="mt-3 rounded-lg bg-green-50 p-3 text-xs text-green-700">
              Academic Unit: <b>{selectedUnit.name}</b>
            </p>
          )}

          {isGraduatingClass && (
            <p className="mt-3 rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
              🎓 This is a graduating class. Students can graduate or repeat.
              Graduation does not create a new enrollment.
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={loadStudents}
              disabled={
                loading ||
                !selectedAcademicUnit ||
                !fromSessionId ||
                !fromClassId ||
                !fromArmId ||
                (!isGraduatingClass && !toSessionId)
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load Students"}
            </button>

            <button
              onClick={selectAllStudents}
              disabled={!students.length}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Select All
            </button>

            <button
              onClick={clearAllSelections}
              disabled={!students.length}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Clear All
            </button>

            {isGraduatingClass && (
              <button
                onClick={markAllAsGraduate}
                disabled={!students.length}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Graduate All
              </button>
            )}

            <button
              onClick={markAllAsRepeat}
              disabled={!students.length}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Mark All Repeat
            </button>
          </div>
        </div>

        {students.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Students</h3>
              <span className="text-xs text-gray-500">
                {students.length} loaded
              </span>
            </div>

            <div className="space-y-3">
              {students.map((enrollment) => {
                const student = enrollment.studentId;
                const studentId = student?._id;

                if (!studentId) return null;

                const selected = selectedStudents[studentId] || {};
                const studentTargetClass = classes.find(
                  (cls) => cls._id === selected.toClassId
                );

                return (
                  <div
                    key={studentId}
                    className="rounded-xl border bg-gray-50 p-3"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!selected.checked}
                        onChange={() => toggleStudent(studentId)}
                        className="mt-1"
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.admissionNumber} • {enrollment.classId?.name}{" "}
                          {enrollment.armId?.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 gap-2 ${
                        selected.action === "graduate"
                          ? "sm:grid-cols-1"
                          : "sm:grid-cols-3"
                      }`}
                    >
                      <select
                        value={
                          selected.action ||
                          (isGraduatingClass ? "graduate" : "promote")
                        }
                        onChange={(e) => {
                          const action = e.target.value;

                          if (action === "repeat") {
                            setSelectedStudents((prev) => ({
                              ...prev,
                              [studentId]: {
                                ...prev[studentId],
                                action,
                                toClassId: fromClassId,
                                toArmId: fromArmId,
                              },
                            }));
                          } else if (action === "graduate") {
                            setSelectedStudents((prev) => ({
                              ...prev,
                              [studentId]: {
                                ...prev[studentId],
                                action,
                                toClassId: "",
                                toArmId: "",
                              },
                            }));
                          } else {
                            setSelectedStudents((prev) => ({
                              ...prev,
                              [studentId]: {
                                ...prev[studentId],
                                action,
                                toClassId: "",
                                toArmId: "",
                              },
                            }));
                          }
                        }}
                        disabled={!selected.checked}
                        className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
                      >
                        {isGraduatingClass ? (
                          <>
                            <option value="graduate">Graduate</option>
                            <option value="repeat">Repeat</option>
                          </>
                        ) : (
                          <>
                            <option value="promote">Promote</option>
                            <option value="repeat">Repeat</option>
                          </>
                        )}
                      </select>

                      {selected.action !== "graduate" && (
                        <>
                          <select
                            value={selected.toClassId || ""}
                            onChange={(e) => {
                              updateStudent(
                                studentId,
                                "toClassId",
                                e.target.value
                              );
                              updateStudent(studentId, "toArmId", "");
                            }}
                            disabled={
                              !selected.checked || selected.action === "repeat"
                            }
                            className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
                          >
                            <option value="">Target Class</option>
                            {classes.map((cls) => (
                              <option key={cls._id} value={cls._id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={selected.toArmId || ""}
                            onChange={(e) =>
                              updateStudent(studentId, "toArmId", e.target.value)
                            }
                            disabled={
                              !selected.checked ||
                              !selected.toClassId ||
                              selected.action === "repeat"
                            }
                            className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
                          >
                            <option value="">Target Arm</option>
                            {(studentTargetClass?.arms || []).map((arm) => (
                              <option key={arm._id} value={arm._id}>
                                {arm.name}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </div>

                    {selected.action === "repeat" && (
                      <p className="mt-2 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-700">
                        This student will repeat {enrollment.classId?.name}{" "}
                        {enrollment.armId?.name} in the target session.
                      </p>
                    )}

                    {selected.action === "graduate" && (
                      <p className="mt-2 rounded-lg bg-purple-50 p-2 text-xs text-purple-700">
                        This student will graduate. No new enrollment will be
                        created.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="sticky bottom-3 mt-5 w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white shadow-lg disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}