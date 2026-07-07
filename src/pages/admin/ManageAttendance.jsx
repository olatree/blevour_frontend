
// // src/pages/admin/ManageAttendance.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../hooks/useAuth";

// const PAGE_SIZE = 10;

// const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// const ManageAttendance = () => {
//   const { user } = useAuth();

//   const [activeSession, setActiveSession] = useState(null);
//   const [activeTerm, setActiveTerm] = useState(null);

//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [arms, setArms] = useState([]);

//   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedArm, setSelectedArm] = useState("");

//   const [attendance, setAttendance] = useState([]);
//   const [timesOpened, setTimesOpened] = useState(0);

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const isClassTeacherOnly =
//     user?.role === "teacher" &&
//     user?.isClassTeacher === true &&
//     user?.classTeacherOf?.classId &&
//     user?.classTeacherOf?.armId;

//   const assignedClassId =
//     user?.classTeacherOf?.classId?._id || user?.classTeacherOf?.classId;

//   const assignedArmId =
//     user?.classTeacherOf?.armId?._id || user?.classTeacherOf?.armId;

//   useEffect(() => {
//     const fetchActive = async () => {
//       try {
//         const res = await api.get("/sessions/active");
//         setActiveSession(res.data?.session || null);
//         setActiveTerm(res.data?.term || null);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load active session.");
//       }
//     };

//     fetchActive();
//   }, []);

//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const res = await api.get("/academic-units");
//         const payload = getApiData(res);
//         setAcademicUnits(Array.isArray(payload) ? payload : []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch academic units.");
//       }
//     };

//     fetchUnits();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const params = {};
//         if (selectedAcademicUnit) params.academicUnitId = selectedAcademicUnit;

//         const res = await api.get("/classes", { params });
//         const payload = getApiData(res);
//         const allClasses = Array.isArray(payload) ? payload : [];

//         if (isClassTeacherOnly) {
//           const assignedClass = allClasses.find(
//             (cls) => cls._id === assignedClassId
//           );

//           if (!assignedClass) {
//             setError("Assigned class not found in this academic unit.");
//             setClasses([]);
//             return;
//           }

//           const assignedArm = assignedClass.arms?.find(
//             (arm) => arm._id === assignedArmId
//           );

//           setClasses([assignedClass]);
//           setArms(assignedClass.arms || []);
//           setSelectedAcademicUnit(
//             assignedClass.academicUnitId?._id ||
//               assignedClass.academicUnitId ||
//               selectedAcademicUnit
//           );
//           setSelectedClass(assignedClass._id);

//           if (assignedArm) {
//             setSelectedArm(assignedArm._id);
//           } else {
//             setError("Assigned arm not found.");
//           }

//           return;
//         }

//         setClasses(allClasses);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch classes.");
//       }
//     };

//     fetchClasses();
//   }, [selectedAcademicUnit, isClassTeacherOnly, assignedClassId, assignedArmId]);

//   useEffect(() => {
//     if (!selectedClass) {
//       setArms([]);
//       setSelectedArm("");
//       return;
//     }

//     const cls = classes.find((c) => c._id === selectedClass);
//     setArms(cls?.arms || []);

//     if (!isClassTeacherOnly) {
//       setSelectedArm("");
//       setAttendance([]);
//       setTimesOpened(0);
//       setCurrentPage(1);
//     }
//   }, [selectedClass, classes, isClassTeacherOnly]);

//   const fetchAttendance = async () => {
//     try {
//       if (!selectedClass || !selectedArm || !activeSession || !activeTerm) {
//         return;
//       }

//       setLoading(true);
//       setSuccess("");
//       setError("");

//       const res = await api.get("/attendance/summary", {
//         params: {
//           academicUnitId: selectedAcademicUnit,
//           classId: selectedClass,
//           armId: selectedArm,
//           sessionId: activeSession._id,
//           termId: activeTerm._id,
//         },
//       });

//       const payload = getApiData(res);

//       setAttendance(payload.records || []);
//       setTimesOpened(Number(payload.timesOpened || 0));
//       setCurrentPage(1);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to load attendance.");
//       setAttendance([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (
//       isClassTeacherOnly &&
//       selectedClass &&
//       selectedArm &&
//       activeSession?._id &&
//       activeTerm?._id
//     ) {
//       fetchAttendance();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isClassTeacherOnly, selectedClass, selectedArm, activeSession, activeTerm]);

//   const updateAttendance = (studentId, value) => {
//     let numeric = Number(value);
//     if (numeric < 0) numeric = 0;
//     if (numeric > timesOpened) numeric = timesOpened;

//     setAttendance((prev) =>
//       prev.map((student) =>
//         student.studentId === studentId
//           ? { ...student, timesPresent: numeric }
//           : student
//       )
//     );
//   };

//   const saveAttendance = async () => {
//     try {
//       if (!selectedClass || !selectedArm || !activeSession || !activeTerm) {
//         setError("Please select class and arm.");
//         return;
//       }

//       setSaving(true);
//       setSuccess("");
//       setError("");

//       await api.post("/attendance/summary", {
//         academicUnitId: selectedAcademicUnit,
//         classId: selectedClass,
//         armId: selectedArm,
//         sessionId: activeSession._id,
//         termId: activeTerm._id,
//         timesOpened,
//         records: attendance.map((student) => ({
//           studentId: student.studentId,
//           timesPresent: Number(student.timesPresent || 0),
//         })),
//       });

//       setSuccess("Attendance saved successfully.");
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to save attendance.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredAttendance = useMemo(() => {
//     return attendance.filter((student) => {
//       const searchText = search.toLowerCase();

//       return (
//         student.name?.toLowerCase().includes(searchText) ||
//         student.admissionNumber?.toLowerCase().includes(searchText)
//       );
//     });
//   }, [attendance, search]);

//   const totalPages = Math.ceil(filteredAttendance.length / PAGE_SIZE);

//   const paginatedAttendance = useMemo(() => {
//     const start = (currentPage - 1) * PAGE_SIZE;
//     return filteredAttendance.slice(start, start + PAGE_SIZE);
//   }, [filteredAttendance, currentPage]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-6xl p-3 sm:p-5">
//         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//           <h1 className="text-lg font-bold text-green-700 sm:text-xl">
//             Attendance Recording
//           </h1>

//           {activeSession && activeTerm && (
//             <p className="mt-1 text-xs text-gray-500 sm:text-sm">
//               Session: <b>{activeSession.name}</b> | Term:{" "}
//               <b>{activeTerm.name}</b>
//             </p>
//           )}

//           {isClassTeacherOnly && (
//             <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
//               You can only manage attendance for your assigned class.
//             </p>
//           )}
//         </div>

//         {success && (
//           <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
//             {success}
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
//             <select
//               value={selectedAcademicUnit}
//               onChange={(e) => {
//                 setSelectedAcademicUnit(e.target.value);
//                 setSelectedClass("");
//                 setSelectedArm("");
//                 setAttendance([]);
//                 setTimesOpened(0);
//               }}
//               disabled={isClassTeacherOnly}
//               className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//             >
//               <option value="">Select Academic Unit</option>
//               {academicUnits.map((unit) => (
//                 <option key={unit._id} value={unit._id}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               disabled={isClassTeacherOnly}
//               className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//             >
//               <option value="">Select Class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedArm}
//               onChange={(e) => {
//                 setSelectedArm(e.target.value);
//                 setAttendance([]);
//                 setTimesOpened(0);
//                 setCurrentPage(1);
//               }}
//               disabled={!selectedClass || isClassTeacherOnly}
//               className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
//             >
//               <option value="">Select Arm</option>
//               {arms.map((arm) => (
//                 <option key={arm._id} value={arm._id}>
//                   {arm.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               placeholder="Search student..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="rounded-lg border px-3 py-2 text-sm"
//             />

//             <button
//               onClick={fetchAttendance}
//               disabled={!selectedClass || !selectedArm || loading}
//               className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
//             >
//               {loading ? "Loading..." : isClassTeacherOnly ? "Reload" : "Load"}
//             </button>
//           </div>
//         </div>

//         {attendance.length > 0 && (
//           <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//             <label className="mb-2 block text-sm font-medium text-gray-700">
//               Times School Opened
//             </label>

//             <input
//               type="number"
//               min="0"
//               value={timesOpened}
//               onChange={(e) => {
//                 const value = Math.max(0, Number(e.target.value));
//                 setTimesOpened(value);

//                 setAttendance((prev) =>
//                   prev.map((student) => ({
//                     ...student,
//                     timesPresent:
//                       Number(student.timesPresent || 0) > value
//                         ? value
//                         : Number(student.timesPresent || 0),
//                   }))
//                 );
//               }}
//               className="w-full rounded-lg border px-3 py-2 sm:w-40"
//             />
//           </div>
//         )}

//         {loading && (
//           <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
//             Loading attendance...
//           </div>
//         )}

//         {!loading && attendance.length === 0 && (
//           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
//             {isClassTeacherOnly
//               ? "No attendance records found for your assigned class."
//               : "Select academic unit, class and arm, then click Load."}
//           </div>
//         )}

//         {!loading && attendance.length > 0 && (
//           <div className="rounded-xl bg-white p-4 shadow-sm">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="font-semibold text-green-700">
//                 Student Attendance
//               </h2>

//               <span className="text-xs text-gray-500">
//                 {filteredAttendance.length} students
//               </span>
//             </div>

//             <div className="space-y-3">
//               {paginatedAttendance.map((student) => (
//                 <div
//                   key={student.studentId}
//                   className="rounded-xl border bg-gray-50 p-3"
//                 >
//                   <div className="mb-3 flex items-center gap-3">
//                     <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
//                       {student.image ? (
//                         <img
//                           src={student.image}
//                           alt={student.name}
//                           className="h-full w-full object-cover"
//                         />
//                       ) : null}
//                     </div>

//                     <div>
//                       <p className="text-sm font-semibold">{student.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {student.admissionNumber}
//                       </p>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="mb-1 block text-xs text-gray-500">
//                       Times Present
//                     </label>

//                     <input
//                       type="number"
//                       min="0"
//                       max={timesOpened}
//                       value={student.timesPresent}
//                       onChange={(e) =>
//                         updateAttendance(student.studentId, e.target.value)
//                       }
//                       className="w-full rounded-lg border px-3 py-2"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-6 flex items-center justify-center gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
//                 >
//                   Prev
//                 </button>

//                 <span className="text-sm text-gray-600">
//                   {currentPage} / {totalPages}
//                 </span>

//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(p + 1, totalPages))
//                   }
//                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}

//             <div className="sticky bottom-0 mt-6 bg-white pt-4">
//               <button
//                 onClick={saveAttendance}
//                 disabled={saving}
//                 className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {saving ? "Saving Attendance..." : "Save Attendance"}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageAttendance;


// src/pages/admin/ManageAttendance.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const PAGE_SIZE = 10;

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

const ManageAttendance = () => {
  const { user } = useAuth();

  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  const [academicUnits, setAcademicUnits] = useState([]);
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");

  const [attendance, setAttendance] = useState([]);
  const [timesOpened, setTimesOpened] = useState(0);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
    user?.role
  );

  const restrictedUnitName =
    user?.role === "principal"
      ? "secondary"
      : user?.role === "head_teacher"
      ? "primary"
      : "";

  const isClassTeacherOnly =
    user?.role === "teacher" &&
    user?.isClassTeacher === true &&
    user?.classTeacherOf?.classId &&
    user?.classTeacherOf?.armId;

  const assignedAcademicUnitId =
    user?.classTeacherOf?.academicUnitId?._id ||
    user?.classTeacherOf?.academicUnitId ||
    user?.academicUnitId?._id ||
    user?.academicUnitId ||
    "";

  const assignedClassId =
    user?.classTeacherOf?.classId?._id || user?.classTeacherOf?.classId;

  const assignedArmId =
    user?.classTeacherOf?.armId?._id || user?.classTeacherOf?.armId;

  const isAcademicUnitLocked =
    isClassTeacherOnly || (!isFullAccess && !!restrictedUnitName);

  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;

    if (isClassTeacherOnly && assignedAcademicUnitId) {
      return academicUnits.filter((unit) => unit._id === assignedAcademicUnitId);
    }

    if (restrictedUnitName) {
      return academicUnits.filter((unit) =>
        unit.name?.toLowerCase().includes(restrictedUnitName)
      );
    }

    return academicUnits;
  }, [
    academicUnits,
    isFullAccess,
    isClassTeacherOnly,
    assignedAcademicUnitId,
    restrictedUnitName,
  ]);

  const selectedAcademicUnitObj = academicUnits.find(
    (unit) => unit._id === selectedAcademicUnit
  );

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await api.get("/sessions/active");
        setActiveSession(res.data?.session || null);
        setActiveTerm(res.data?.term || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load active session.");
      }
    };

    fetchActive();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await api.get("/academic-units");
        const payload = getApiData(res);
        const units = Array.isArray(payload) ? payload : [];

        setAcademicUnits(units);

        if (isClassTeacherOnly && assignedAcademicUnitId) {
          setSelectedAcademicUnit(assignedAcademicUnitId);
          return;
        }

        if (!isFullAccess && restrictedUnitName) {
          const allowedUnit = units.find((unit) =>
            unit.name?.toLowerCase().includes(restrictedUnitName)
          );

          if (allowedUnit) {
            setSelectedAcademicUnit(allowedUnit._id);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch academic units.");
      }
    };

    fetchUnits();
  }, [
    isFullAccess,
    restrictedUnitName,
    isClassTeacherOnly,
    assignedAcademicUnitId,
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedAcademicUnit) {
        setClasses([]);
        setSelectedClass("");
        setSelectedArm("");
        return;
      }

      try {
        const res = await api.get("/classes", {
          params: { academicUnitId: selectedAcademicUnit },
        });

        const payload = getApiData(res);
        const allClasses = Array.isArray(payload) ? payload : [];

        if (isClassTeacherOnly) {
          const assignedClass = allClasses.find(
            (cls) => cls._id === assignedClassId
          );

          if (!assignedClass) {
            setError("Assigned class not found in this academic unit.");
            setClasses([]);
            return;
          }

          const assignedArm = assignedClass.arms?.find(
            (arm) => arm._id === assignedArmId
          );

          setClasses([assignedClass]);
          setArms(assignedClass.arms || []);
          setSelectedClass(assignedClass._id);

          if (assignedArm) {
            setSelectedArm(assignedArm._id);
          } else {
            setError("Assigned arm not found.");
          }

          return;
        }

        setClasses(allClasses);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch classes.");
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit, isClassTeacherOnly, assignedClassId, assignedArmId]);

  useEffect(() => {
    if (!selectedClass) {
      setArms([]);
      setSelectedArm("");
      return;
    }

    const cls = classes.find((c) => c._id === selectedClass);
    setArms(cls?.arms || []);

    if (!isClassTeacherOnly) {
      setSelectedArm("");
      setAttendance([]);
      setTimesOpened(0);
      setCurrentPage(1);
    }
  }, [selectedClass, classes, isClassTeacherOnly]);

  const fetchAttendance = async () => {
    try {
      if (!selectedAcademicUnit || !selectedClass || !selectedArm || !activeSession || !activeTerm) {
        setError("Please select academic unit, class and arm.");
        return;
      }

      setLoading(true);
      setSuccess("");
      setError("");

      const res = await api.get("/attendance/summary", {
        params: {
          academicUnitId: selectedAcademicUnit,
          classId: selectedClass,
          armId: selectedArm,
          sessionId: activeSession._id,
          termId: activeTerm._id,
        },
      });

      const payload = getApiData(res);

      setAttendance(payload.records || []);
      setTimesOpened(Number(payload.timesOpened || 0));
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load attendance.");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      isClassTeacherOnly &&
      selectedAcademicUnit &&
      selectedClass &&
      selectedArm &&
      activeSession?._id &&
      activeTerm?._id
    ) {
      fetchAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isClassTeacherOnly,
    selectedAcademicUnit,
    selectedClass,
    selectedArm,
    activeSession,
    activeTerm,
  ]);

  const updateAttendance = (studentId, value) => {
    let numeric = Number(value);
    if (numeric < 0) numeric = 0;
    if (numeric > timesOpened) numeric = timesOpened;

    setAttendance((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? { ...student, timesPresent: numeric }
          : student
      )
    );
  };

  const saveAttendance = async () => {
    try {
      if (!selectedAcademicUnit || !selectedClass || !selectedArm || !activeSession || !activeTerm) {
        setError("Please select academic unit, class and arm.");
        return;
      }

      setSaving(true);
      setSuccess("");
      setError("");

      await api.post("/attendance/summary", {
        academicUnitId: selectedAcademicUnit,
        classId: selectedClass,
        armId: selectedArm,
        sessionId: activeSession._id,
        termId: activeTerm._id,
        timesOpened,
        records: attendance.map((student) => ({
          studentId: student.studentId,
          timesPresent: Number(student.timesPresent || 0),
        })),
      });

      setSuccess("Attendance saved successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((student) => {
      const searchText = search.toLowerCase();

      return (
        student.name?.toLowerCase().includes(searchText) ||
        student.admissionNumber?.toLowerCase().includes(searchText)
      );
    });
  }, [attendance, search]);

  const totalPages = Math.ceil(filteredAttendance.length / PAGE_SIZE);

  const paginatedAttendance = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAttendance.slice(start, start + PAGE_SIZE);
  }, [filteredAttendance, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-3 sm:p-5">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-lg font-bold text-green-700 sm:text-xl">
            Attendance Recording
          </h1>

          {activeSession && activeTerm && (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Session: <b>{activeSession.name}</b> | Term:{" "}
              <b>{activeTerm.name}</b>
            </p>
          )}

          {selectedAcademicUnitObj && isAcademicUnitLocked && (
            <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
              Restricted View: {selectedAcademicUnitObj.name}
            </p>
          )}

          {isClassTeacherOnly && (
            <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
              You can only manage attendance for your assigned class.
            </p>
          )}
        </div>

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select
              value={selectedAcademicUnit}
              onChange={(e) => {
                setSelectedAcademicUnit(e.target.value);
                setSelectedClass("");
                setSelectedArm("");
                setAttendance([]);
                setTimesOpened(0);
              }}
              disabled={isAcademicUnitLocked}
              className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select Academic Unit</option>
              {visibleAcademicUnits.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={isClassTeacherOnly || !selectedAcademicUnit}
              className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={selectedArm}
              onChange={(e) => {
                setSelectedArm(e.target.value);
                setAttendance([]);
                setTimesOpened(0);
                setCurrentPage(1);
              }}
              disabled={!selectedClass || isClassTeacherOnly}
              className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select Arm</option>
              {arms.map((arm) => (
                <option key={arm._id} value={arm._id}>
                  {arm.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            />

            <button
              onClick={fetchAttendance}
              disabled={!selectedAcademicUnit || !selectedClass || !selectedArm || loading}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : isClassTeacherOnly ? "Reload" : "Load"}
            </button>
          </div>
        </div>

        {attendance.length > 0 && (
          <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Times School Opened
            </label>

            <input
              type="number"
              min="0"
              value={timesOpened}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                setTimesOpened(value);

                setAttendance((prev) =>
                  prev.map((student) => ({
                    ...student,
                    timesPresent:
                      Number(student.timesPresent || 0) > value
                        ? value
                        : Number(student.timesPresent || 0),
                  }))
                );
              }}
              className="w-full rounded-lg border px-3 py-2 sm:w-40"
            />
          </div>
        )}

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading attendance...
          </div>
        )}

        {!loading && attendance.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
            {isClassTeacherOnly
              ? "No attendance records found for your assigned class."
              : "Select academic unit, class and arm, then click Load."}
          </div>
        )}

        {!loading && attendance.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-green-700">
                Student Attendance
              </h2>

              <span className="text-xs text-gray-500">
                {filteredAttendance.length} students
              </span>
            </div>

            <div className="space-y-3">
              {paginatedAttendance.map((student) => (
                <div
                  key={student.studentId}
                  className="rounded-xl border bg-gray-50 p-3"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                      {student.image ? (
                        <img
                          src={student.image}
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        {student.admissionNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Times Present
                    </label>

                    <input
                      type="number"
                      min="0"
                      max={timesOpened}
                      value={student.timesPresent}
                      onChange={(e) =>
                        updateAttendance(student.studentId, e.target.value)
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}

            <div className="sticky bottom-0 mt-6 bg-white pt-4">
              <button
                onClick={saveAttendance}
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving Attendance..." : "Save Attendance"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAttendance;