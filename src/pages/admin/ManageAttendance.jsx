

// // // // // src/pages/admin/ManageAttendance.jsx
// // // // import React, { useEffect, useMemo, useState } from "react";
// // // // import api from "../../api/axios";
// // // // import { useAuth } from "../../hooks/useAuth";

// // // // const PAGE_SIZE = 10;

// // // // const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// // // // const ManageAttendance = () => {
// // // //   const { user } = useAuth();

// // // //   const [activeSession, setActiveSession] = useState(null);
// // // //   const [activeTerm, setActiveTerm] = useState(null);

// // // //   const [academicUnits, setAcademicUnits] = useState([]);
// // // //   const [classes, setClasses] = useState([]);
// // // //   const [arms, setArms] = useState([]);

// // // //   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
// // // //   const [selectedClass, setSelectedClass] = useState("");
// // // //   const [selectedArm, setSelectedArm] = useState("");

// // // //   const [attendance, setAttendance] = useState([]);
// // // //   const [timesOpened, setTimesOpened] = useState(0);

// // // //   const [loading, setLoading] = useState(false);
// // // //   const [saving, setSaving] = useState(false);

// // // //   const [success, setSuccess] = useState("");
// // // //   const [error, setError] = useState("");

// // // //   const [search, setSearch] = useState("");
// // // //   const [currentPage, setCurrentPage] = useState(1);

// // // //   const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
// // // //     user?.role
// // // //   );

// // // //   const restrictedUnitName =
// // // //     user?.role === "principal"
// // // //       ? "secondary"
// // // //       : user?.role === "head_teacher"
// // // //       ? "primary"
// // // //       : "";

// // // //   const isClassTeacherOnly =
// // // //     user?.role === "teacher" &&
// // // //     user?.isClassTeacher === true &&
// // // //     user?.classTeacherOf?.classId &&
// // // //     user?.classTeacherOf?.armId;

// // // //   const assignedAcademicUnitId =
// // // //     user?.classTeacherOf?.academicUnitId?._id ||
// // // //     user?.classTeacherOf?.academicUnitId ||
// // // //     user?.academicUnitId?._id ||
// // // //     user?.academicUnitId ||
// // // //     "";

// // // //   const assignedClassId =
// // // //     user?.classTeacherOf?.classId?._id || user?.classTeacherOf?.classId;

// // // //   const assignedArmId =
// // // //     user?.classTeacherOf?.armId?._id || user?.classTeacherOf?.armId;

// // // //   const isAcademicUnitLocked =
// // // //     isClassTeacherOnly || (!isFullAccess && !!restrictedUnitName);

// // // //   const visibleAcademicUnits = useMemo(() => {
// // // //     if (isFullAccess) return academicUnits;

// // // //     if (isClassTeacherOnly && assignedAcademicUnitId) {
// // // //       return academicUnits.filter((unit) => unit._id === assignedAcademicUnitId);
// // // //     }

// // // //     if (restrictedUnitName) {
// // // //       return academicUnits.filter((unit) =>
// // // //         unit.name?.toLowerCase().includes(restrictedUnitName)
// // // //       );
// // // //     }

// // // //     return academicUnits;
// // // //   }, [
// // // //     academicUnits,
// // // //     isFullAccess,
// // // //     isClassTeacherOnly,
// // // //     assignedAcademicUnitId,
// // // //     restrictedUnitName,
// // // //   ]);

// // // //   const selectedAcademicUnitObj = academicUnits.find(
// // // //     (unit) => unit._id === selectedAcademicUnit
// // // //   );

// // // //   useEffect(() => {
// // // //     const fetchActive = async () => {
// // // //       try {
// // // //         const res = await api.get("/sessions/active");
// // // //         setActiveSession(res.data?.session || null);
// // // //         setActiveTerm(res.data?.term || null);
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setError("Failed to load active session.");
// // // //       }
// // // //     };

// // // //     fetchActive();
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     const fetchUnits = async () => {
// // // //       try {
// // // //         const res = await api.get("/academic-units");
// // // //         const payload = getApiData(res);
// // // //         const units = Array.isArray(payload) ? payload : [];

// // // //         setAcademicUnits(units);

// // // //         if (isClassTeacherOnly && assignedAcademicUnitId) {
// // // //           setSelectedAcademicUnit(assignedAcademicUnitId);
// // // //           return;
// // // //         }

// // // //         if (!isFullAccess && restrictedUnitName) {
// // // //           const allowedUnit = units.find((unit) =>
// // // //             unit.name?.toLowerCase().includes(restrictedUnitName)
// // // //           );

// // // //           if (allowedUnit) {
// // // //             setSelectedAcademicUnit(allowedUnit._id);
// // // //           }
// // // //         }
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setError("Failed to fetch academic units.");
// // // //       }
// // // //     };

// // // //     fetchUnits();
// // // //   }, [
// // // //     isFullAccess,
// // // //     restrictedUnitName,
// // // //     isClassTeacherOnly,
// // // //     assignedAcademicUnitId,
// // // //   ]);

// // // //   useEffect(() => {
// // // //     const fetchClasses = async () => {
// // // //       if (!selectedAcademicUnit) {
// // // //         setClasses([]);
// // // //         setSelectedClass("");
// // // //         setSelectedArm("");
// // // //         return;
// // // //       }

// // // //       try {
// // // //         const res = await api.get("/classes", {
// // // //           params: { academicUnitId: selectedAcademicUnit },
// // // //         });

// // // //         const payload = getApiData(res);
// // // //         const allClasses = Array.isArray(payload) ? payload : [];

// // // //         if (isClassTeacherOnly) {
// // // //           const assignedClass = allClasses.find(
// // // //             (cls) => cls._id === assignedClassId
// // // //           );

// // // //           if (!assignedClass) {
// // // //             setError("Assigned class not found in this academic unit.");
// // // //             setClasses([]);
// // // //             return;
// // // //           }

// // // //           const assignedArm = assignedClass.arms?.find(
// // // //             (arm) => arm._id === assignedArmId
// // // //           );

// // // //           setClasses([assignedClass]);
// // // //           setArms(assignedClass.arms || []);
// // // //           setSelectedClass(assignedClass._id);

// // // //           if (assignedArm) {
// // // //             setSelectedArm(assignedArm._id);
// // // //           } else {
// // // //             setError("Assigned arm not found.");
// // // //           }

// // // //           return;
// // // //         }

// // // //         setClasses(allClasses);
// // // //       } catch (err) {
// // // //         console.error(err);
// // // //         setError("Failed to fetch classes.");
// // // //       }
// // // //     };

// // // //     fetchClasses();
// // // //   }, [selectedAcademicUnit, isClassTeacherOnly, assignedClassId, assignedArmId]);

// // // //   useEffect(() => {
// // // //     if (!selectedClass) {
// // // //       setArms([]);
// // // //       setSelectedArm("");
// // // //       return;
// // // //     }

// // // //     const cls = classes.find((c) => c._id === selectedClass);
// // // //     setArms(cls?.arms || []);

// // // //     if (!isClassTeacherOnly) {
// // // //       setSelectedArm("");
// // // //       setAttendance([]);
// // // //       setTimesOpened(0);
// // // //       setCurrentPage(1);
// // // //     }
// // // //   }, [selectedClass, classes, isClassTeacherOnly]);

// // // //   const fetchAttendance = async () => {
// // // //     try {
// // // //       if (!selectedAcademicUnit || !selectedClass || !selectedArm || !activeSession || !activeTerm) {
// // // //         setError("Please select academic unit, class and arm.");
// // // //         return;
// // // //       }

// // // //       setLoading(true);
// // // //       setSuccess("");
// // // //       setError("");

// // // //       const res = await api.get("/attendance/summary", {
// // // //         params: {
// // // //           academicUnitId: selectedAcademicUnit,
// // // //           classId: selectedClass,
// // // //           armId: selectedArm,
// // // //           sessionId: activeSession._id,
// // // //           termId: activeTerm._id,
// // // //         },
// // // //       });

// // // //       const payload = getApiData(res);

// // // //       setAttendance(payload.records || []);
// // // //       setTimesOpened(Number(payload.timesOpened || 0));
// // // //       setCurrentPage(1);
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       setError(err.response?.data?.message || "Failed to load attendance.");
// // // //       setAttendance([]);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     if (
// // // //       isClassTeacherOnly &&
// // // //       selectedAcademicUnit &&
// // // //       selectedClass &&
// // // //       selectedArm &&
// // // //       activeSession?._id &&
// // // //       activeTerm?._id
// // // //     ) {
// // // //       fetchAttendance();
// // // //     }
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [
// // // //     isClassTeacherOnly,
// // // //     selectedAcademicUnit,
// // // //     selectedClass,
// // // //     selectedArm,
// // // //     activeSession,
// // // //     activeTerm,
// // // //   ]);

// // // //   const updateAttendance = (studentId, value) => {
// // // //     let numeric = Number(value);
// // // //     if (numeric < 0) numeric = 0;
// // // //     if (numeric > timesOpened) numeric = timesOpened;

// // // //     setAttendance((prev) =>
// // // //       prev.map((student) =>
// // // //         student.studentId === studentId
// // // //           ? { ...student, timesPresent: numeric }
// // // //           : student
// // // //       )
// // // //     );
// // // //   };

// // // //   const saveAttendance = async () => {
// // // //     try {
// // // //       if (!selectedAcademicUnit || !selectedClass || !selectedArm || !activeSession || !activeTerm) {
// // // //         setError("Please select academic unit, class and arm.");
// // // //         return;
// // // //       }

// // // //       setSaving(true);
// // // //       setSuccess("");
// // // //       setError("");

// // // //       await api.post("/attendance/summary", {
// // // //         academicUnitId: selectedAcademicUnit,
// // // //         classId: selectedClass,
// // // //         armId: selectedArm,
// // // //         sessionId: activeSession._id,
// // // //         termId: activeTerm._id,
// // // //         timesOpened,
// // // //         records: attendance.map((student) => ({
// // // //           studentId: student.studentId,
// // // //           timesPresent: Number(student.timesPresent || 0),
// // // //         })),
// // // //       });

// // // //       setSuccess("Attendance saved successfully.");
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       setError(err.response?.data?.message || "Failed to save attendance.");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const filteredAttendance = useMemo(() => {
// // // //     return attendance.filter((student) => {
// // // //       const searchText = search.toLowerCase();

// // // //       return (
// // // //         student.name?.toLowerCase().includes(searchText) ||
// // // //         student.admissionNumber?.toLowerCase().includes(searchText)
// // // //       );
// // // //     });
// // // //   }, [attendance, search]);

// // // //   const totalPages = Math.ceil(filteredAttendance.length / PAGE_SIZE);

// // // //   const paginatedAttendance = useMemo(() => {
// // // //     const start = (currentPage - 1) * PAGE_SIZE;
// // // //     return filteredAttendance.slice(start, start + PAGE_SIZE);
// // // //   }, [filteredAttendance, currentPage]);

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50">
// // // //       <div className="mx-auto max-w-6xl p-3 sm:p-5">
// // // //         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
// // // //           <h1 className="text-lg font-bold text-green-700 sm:text-xl">
// // // //             Attendance Recording
// // // //           </h1>

// // // //           {activeSession && activeTerm && (
// // // //             <p className="mt-1 text-xs text-gray-500 sm:text-sm">
// // // //               Session: <b>{activeSession.name}</b> | Term:{" "}
// // // //               <b>{activeTerm.name}</b>
// // // //             </p>
// // // //           )}

// // // //           {selectedAcademicUnitObj && isAcademicUnitLocked && (
// // // //             <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
// // // //               Restricted View: {selectedAcademicUnitObj.name}
// // // //             </p>
// // // //           )}

// // // //           {isClassTeacherOnly && (
// // // //             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
// // // //               You can only manage attendance for your assigned class.
// // // //             </p>
// // // //           )}
// // // //         </div>

// // // //         {success && (
// // // //           <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
// // // //             {success}
// // // //           </div>
// // // //         )}

// // // //         {error && (
// // // //           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
// // // //             {error}
// // // //           </div>
// // // //         )}

// // // //         <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
// // // //           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
// // // //             <select
// // // //               value={selectedAcademicUnit}
// // // //               onChange={(e) => {
// // // //                 setSelectedAcademicUnit(e.target.value);
// // // //                 setSelectedClass("");
// // // //                 setSelectedArm("");
// // // //                 setAttendance([]);
// // // //                 setTimesOpened(0);
// // // //               }}
// // // //               disabled={isAcademicUnitLocked}
// // // //               className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
// // // //             >
// // // //               <option value="">Select Academic Unit</option>
// // // //               {visibleAcademicUnits.map((unit) => (
// // // //                 <option key={unit._id} value={unit._id}>
// // // //                   {unit.name}
// // // //                 </option>
// // // //               ))}
// // // //             </select>

// // // //             <select
// // // //               value={selectedClass}
// // // //               onChange={(e) => setSelectedClass(e.target.value)}
// // // //               disabled={isClassTeacherOnly || !selectedAcademicUnit}
// // // //               className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
// // // //             >
// // // //               <option value="">Select Class</option>
// // // //               {classes.map((cls) => (
// // // //                 <option key={cls._id} value={cls._id}>
// // // //                   {cls.name}
// // // //                 </option>
// // // //               ))}
// // // //             </select>

// // // //             <select
// // // //               value={selectedArm}
// // // //               onChange={(e) => {
// // // //                 setSelectedArm(e.target.value);
// // // //                 setAttendance([]);
// // // //                 setTimesOpened(0);
// // // //                 setCurrentPage(1);
// // // //               }}
// // // //               disabled={!selectedClass || isClassTeacherOnly}
// // // //               className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
// // // //             >
// // // //               <option value="">Select Arm</option>
// // // //               {arms.map((arm) => (
// // // //                 <option key={arm._id} value={arm._id}>
// // // //                   {arm.name}
// // // //                 </option>
// // // //               ))}
// // // //             </select>

// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search student..."
// // // //               value={search}
// // // //               onChange={(e) => {
// // // //                 setSearch(e.target.value);
// // // //                 setCurrentPage(1);
// // // //               }}
// // // //               className="rounded-lg border px-3 py-2 text-sm"
// // // //             />

// // // //             <button
// // // //               onClick={fetchAttendance}
// // // //               disabled={!selectedAcademicUnit || !selectedClass || !selectedArm || loading}
// // // //               className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
// // // //             >
// // // //               {loading ? "Loading..." : isClassTeacherOnly ? "Reload" : "Load"}
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {attendance.length > 0 && (
// // // //           <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
// // // //             <label className="mb-2 block text-sm font-medium text-gray-700">
// // // //               Times School Opened
// // // //             </label>

// // // //             <input
// // // //               type="number"
// // // //               min="0"
// // // //               value={timesOpened}
// // // //               onChange={(e) => {
// // // //                 const value = Math.max(0, Number(e.target.value));
// // // //                 setTimesOpened(value);

// // // //                 setAttendance((prev) =>
// // // //                   prev.map((student) => ({
// // // //                     ...student,
// // // //                     timesPresent:
// // // //                       Number(student.timesPresent || 0) > value
// // // //                         ? value
// // // //                         : Number(student.timesPresent || 0),
// // // //                   }))
// // // //                 );
// // // //               }}
// // // //               className="w-full rounded-lg border px-3 py-2 sm:w-40"
// // // //             />
// // // //           </div>
// // // //         )}

// // // //         {loading && (
// // // //           <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
// // // //             Loading attendance...
// // // //           </div>
// // // //         )}

// // // //         {!loading && attendance.length === 0 && (
// // // //           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
// // // //             {isClassTeacherOnly
// // // //               ? "No attendance records found for your assigned class."
// // // //               : "Select academic unit, class and arm, then click Load."}
// // // //           </div>
// // // //         )}

// // // //         {!loading && attendance.length > 0 && (
// // // //           <div className="rounded-xl bg-white p-4 shadow-sm">
// // // //             <div className="mb-4 flex items-center justify-between">
// // // //               <h2 className="font-semibold text-green-700">
// // // //                 Student Attendance
// // // //               </h2>

// // // //               <span className="text-xs text-gray-500">
// // // //                 {filteredAttendance.length} students
// // // //               </span>
// // // //             </div>

// // // //             <div className="space-y-3">
// // // //               {paginatedAttendance.map((student) => (
// // // //                 <div
// // // //                   key={student.studentId}
// // // //                   className="rounded-xl border bg-gray-50 p-3"
// // // //                 >
// // // //                   <div className="mb-3 flex items-center gap-3">
// // // //                     <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
// // // //                       {student.image ? (
// // // //                         <img
// // // //                           src={student.image}
// // // //                           alt={student.name}
// // // //                           className="h-full w-full object-cover"
// // // //                         />
// // // //                       ) : null}
// // // //                     </div>

// // // //                     <div>
// // // //                       <p className="text-sm font-semibold">{student.name}</p>
// // // //                       <p className="text-xs text-gray-500">
// // // //                         {student.admissionNumber}
// // // //                       </p>
// // // //                     </div>
// // // //                   </div>

// // // //                   <div>
// // // //                     <label className="mb-1 block text-xs text-gray-500">
// // // //                       Times Present
// // // //                     </label>

// // // //                     <input
// // // //                       type="number"
// // // //                       min="0"
// // // //                       max={timesOpened}
// // // //                       value={student.timesPresent}
// // // //                       onChange={(e) =>
// // // //                         updateAttendance(student.studentId, e.target.value)
// // // //                       }
// // // //                       className="w-full rounded-lg border px-3 py-2"
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>

// // // //             {totalPages > 1 && (
// // // //               <div className="mt-6 flex items-center justify-center gap-2">
// // // //                 <button
// // // //                   disabled={currentPage === 1}
// // // //                   onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
// // // //                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
// // // //                 >
// // // //                   Prev
// // // //                 </button>

// // // //                 <span className="text-sm text-gray-600">
// // // //                   {currentPage} / {totalPages}
// // // //                 </span>

// // // //                 <button
// // // //                   disabled={currentPage === totalPages}
// // // //                   onClick={() =>
// // // //                     setCurrentPage((p) => Math.min(p + 1, totalPages))
// // // //                   }
// // // //                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
// // // //                 >
// // // //                   Next
// // // //                 </button>
// // // //               </div>
// // // //             )}

// // // //             <div className="sticky bottom-0 mt-6 bg-white pt-4">
// // // //               <button
// // // //                 onClick={saveAttendance}
// // // //                 disabled={saving}
// // // //                 className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
// // // //               >
// // // //                 {saving ? "Saving Attendance..." : "Save Attendance"}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ManageAttendance;

// // // // src/pages/admin/ManageAttendance.jsx
// // // import React, { useEffect, useMemo, useState } from "react";
// // // import api from "../../api/axios";
// // // import { useAuth } from "../../hooks/useAuth";

// // // const PAGE_SIZE = 10;

// // // const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// // // const ManageAttendance = () => {
// // //   const { user } = useAuth();

// // //   const [activeSession, setActiveSession] = useState(null);
// // //   const [activeTerm, setActiveTerm] = useState(null);

// // //   const [academicUnits, setAcademicUnits] = useState([]);
// // //   const [classes, setClasses] = useState([]);
// // //   const [arms, setArms] = useState([]);

// // //   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
// // //   const [selectedClass, setSelectedClass] = useState("");
// // //   const [selectedArm, setSelectedArm] = useState("");

// // //   const [attendance, setAttendance] = useState([]);
// // //   const [timesOpened, setTimesOpened] = useState(0);

// // //   const [loading, setLoading] = useState(false);
// // //   const [loadingUnits, setLoadingUnits] = useState(false);
// // //   const [loadingClasses, setLoadingClasses] = useState(false);
// // //   const [saving, setSaving] = useState(false);

// // //   const [success, setSuccess] = useState("");
// // //   const [error, setError] = useState("");

// // //   const [search, setSearch] = useState("");
// // //   const [currentPage, setCurrentPage] = useState(1);

// // //   /*
// // //    * Access rule:
// // //    * Only users whose isClassTeacher value is true can use the dropdowns
// // //    * and manage attendance on this page.
// // //    */
// // //   const hasAttendanceAccess = user?.isClassTeacher === true;

// // //   const selectedAcademicUnitObj = useMemo(
// // //     () =>
// // //       academicUnits.find(
// // //         (unit) => String(unit._id) === String(selectedAcademicUnit)
// // //       ),
// // //     [academicUnits, selectedAcademicUnit]
// // //   );

// // //   const selectedClassObj = useMemo(
// // //     () =>
// // //       classes.find((cls) => String(cls._id) === String(selectedClass)),
// // //     [classes, selectedClass]
// // //   );

// // //   useEffect(() => {
// // //     const fetchActiveSessionAndTerm = async () => {
// // //       try {
// // //         setError("");

// // //         const res = await api.get("/sessions/active");
// // //         const payload = getApiData(res);

// // //         setActiveSession(
// // //           payload?.session ||
// // //             res.data?.session ||
// // //             payload?.activeSession ||
// // //             null
// // //         );

// // //         setActiveTerm(
// // //           payload?.term ||
// // //             res.data?.term ||
// // //             payload?.activeTerm ||
// // //             null
// // //         );
// // //       } catch (err) {
// // //         console.error("Fetch active session error:", err);
// // //         setError(
// // //           err.response?.data?.message || "Failed to load active session."
// // //         );
// // //       }
// // //     };

// // //     fetchActiveSessionAndTerm();
// // //   }, []);

// // //   useEffect(() => {
// // //     const fetchAcademicUnits = async () => {
// // //       try {
// // //         setLoadingUnits(true);
// // //         setError("");

// // //         const res = await api.get("/academic-units");
// // //         const payload = getApiData(res);

// // //         setAcademicUnits(Array.isArray(payload) ? payload : []);
// // //       } catch (err) {
// // //         console.error("Fetch academic units error:", err);
// // //         setAcademicUnits([]);
// // //         setError(
// // //           err.response?.data?.message || "Failed to fetch academic units."
// // //         );
// // //       } finally {
// // //         setLoadingUnits(false);
// // //       }
// // //     };

// // //     fetchAcademicUnits();
// // //   }, []);

// // //   useEffect(() => {
// // //     const fetchClasses = async () => {
// // //       if (!selectedAcademicUnit) {
// // //         setClasses([]);
// // //         setArms([]);
// // //         setSelectedClass("");
// // //         setSelectedArm("");
// // //         return;
// // //       }

// // //       try {
// // //         setLoadingClasses(true);
// // //         setError("");

// // //         const res = await api.get("/classes", {
// // //           params: {
// // //             academicUnitId: selectedAcademicUnit,
// // //           },
// // //         });

// // //         const payload = getApiData(res);
// // //         const classList = Array.isArray(payload) ? payload : [];

// // //         setClasses(classList);
// // //       } catch (err) {
// // //         console.error("Fetch classes error:", err);

// // //         setClasses([]);
// // //         setArms([]);
// // //         setSelectedClass("");
// // //         setSelectedArm("");

// // //         setError(err.response?.data?.message || "Failed to fetch classes.");
// // //       } finally {
// // //         setLoadingClasses(false);
// // //       }
// // //     };

// // //     fetchClasses();
// // //   }, [selectedAcademicUnit]);

// // //   useEffect(() => {
// // //     if (!selectedClass) {
// // //       setArms([]);
// // //       setSelectedArm("");
// // //       return;
// // //     }

// // //     const classArms =
// // //       selectedClassObj?.arms || selectedClassObj?.armsList || [];

// // //     setArms(Array.isArray(classArms) ? classArms : []);
// // //     setSelectedArm("");
// // //     setAttendance([]);
// // //     setTimesOpened(0);
// // //     setCurrentPage(1);
// // //   }, [selectedClass, selectedClassObj]);

// // //   const resetAttendanceData = () => {
// // //     setAttendance([]);
// // //     setTimesOpened(0);
// // //     setSearch("");
// // //     setCurrentPage(1);
// // //     setSuccess("");
// // //   };

// // //   const handleAcademicUnitChange = (academicUnitId) => {
// // //     setSelectedAcademicUnit(academicUnitId);
// // //     setSelectedClass("");
// // //     setSelectedArm("");
// // //     setClasses([]);
// // //     setArms([]);
// // //     resetAttendanceData();
// // //     setError("");
// // //   };

// // //   const handleClassChange = (classId) => {
// // //     setSelectedClass(classId);
// // //     setSelectedArm("");
// // //     setArms([]);
// // //     resetAttendanceData();
// // //     setError("");
// // //   };

// // //   const handleArmChange = (armId) => {
// // //     setSelectedArm(armId);
// // //     resetAttendanceData();
// // //     setError("");
// // //   };

// // //   const fetchAttendance = async () => {
// // //     if (!hasAttendanceAccess) {
// // //       setError("Only a class teacher can manage attendance.");
// // //       return;
// // //     }

// // //     if (
// // //       !selectedAcademicUnit ||
// // //       !selectedClass ||
// // //       !selectedArm ||
// // //       !activeSession?._id ||
// // //       !activeTerm?._id
// // //     ) {
// // //       setError(
// // //         "Please select academic unit, class and arm. An active session and term are also required."
// // //       );
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       setSuccess("");
// // //       setError("");

// // //       const res = await api.get("/attendance/summary", {
// // //         params: {
// // //           academicUnitId: selectedAcademicUnit,
// // //           classId: selectedClass,
// // //           armId: selectedArm,
// // //           sessionId: activeSession._id,
// // //           termId: activeTerm._id,
// // //         },
// // //       });

// // //       const payload = getApiData(res);

// // //       setAttendance(
// // //         Array.isArray(payload?.records) ? payload.records : []
// // //       );

// // //       setTimesOpened(Number(payload?.timesOpened || 0));
// // //       setCurrentPage(1);
// // //     } catch (err) {
// // //       console.error("Fetch attendance error:", err);

// // //       setAttendance([]);
// // //       setTimesOpened(0);

// // //       setError(
// // //         err.response?.data?.message || "Failed to load attendance."
// // //       );
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const updateAttendance = (studentId, value) => {
// // //     let numeric = Number(value);

// // //     if (Number.isNaN(numeric)) numeric = 0;
// // //     if (numeric < 0) numeric = 0;
// // //     if (numeric > timesOpened) numeric = timesOpened;

// // //     setAttendance((prev) =>
// // //       prev.map((student) =>
// // //         String(student.studentId) === String(studentId)
// // //           ? {
// // //               ...student,
// // //               timesPresent: numeric,
// // //             }
// // //           : student
// // //       )
// // //     );
// // //   };

// // //   const saveAttendance = async () => {
// // //     if (!hasAttendanceAccess) {
// // //       setError("Only a class teacher can manage attendance.");
// // //       return;
// // //     }

// // //     if (
// // //       !selectedAcademicUnit ||
// // //       !selectedClass ||
// // //       !selectedArm ||
// // //       !activeSession?._id ||
// // //       !activeTerm?._id
// // //     ) {
// // //       setError(
// // //         "Please select academic unit, class and arm. An active session and term are also required."
// // //       );
// // //       return;
// // //     }

// // //     if (attendance.length === 0) {
// // //       setError("There are no attendance records to save.");
// // //       return;
// // //     }

// // //     try {
// // //       setSaving(true);
// // //       setSuccess("");
// // //       setError("");

// // //       await api.post("/attendance/summary", {
// // //         academicUnitId: selectedAcademicUnit,
// // //         classId: selectedClass,
// // //         armId: selectedArm,
// // //         sessionId: activeSession._id,
// // //         termId: activeTerm._id,
// // //         timesOpened: Number(timesOpened || 0),

// // //         records: attendance.map((student) => ({
// // //           studentId: student.studentId,
// // //           timesPresent: Number(student.timesPresent || 0),
// // //         })),
// // //       });

// // //       setSuccess("Attendance saved successfully.");
// // //     } catch (err) {
// // //       console.error("Save attendance error:", err);

// // //       setError(
// // //         err.response?.data?.message || "Failed to save attendance."
// // //       );
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const filteredAttendance = useMemo(() => {
// // //     const searchText = search.trim().toLowerCase();

// // //     if (!searchText) return attendance;

// // //     return attendance.filter((student) => {
// // //       const studentName = student.name?.toLowerCase() || "";
// // //       const admissionNumber =
// // //         student.admissionNumber?.toLowerCase() || "";

// // //       return (
// // //         studentName.includes(searchText) ||
// // //         admissionNumber.includes(searchText)
// // //       );
// // //     });
// // //   }, [attendance, search]);

// // //   const totalPages = Math.max(
// // //     1,
// // //     Math.ceil(filteredAttendance.length / PAGE_SIZE)
// // //   );

// // //   const paginatedAttendance = useMemo(() => {
// // //     const start = (currentPage - 1) * PAGE_SIZE;

// // //     return filteredAttendance.slice(start, start + PAGE_SIZE);
// // //   }, [filteredAttendance, currentPage]);

// // //   const dropdownsDisabled = !hasAttendanceAccess;

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       <div className="mx-auto max-w-6xl p-3 sm:p-5">
// // //         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
// // //           <h1 className="text-lg font-bold text-green-700 sm:text-xl">
// // //             Attendance Recording
// // //           </h1>

// // //           {activeSession && activeTerm ? (
// // //             <p className="mt-1 text-xs text-gray-500 sm:text-sm">
// // //               Session: <b>{activeSession.name}</b> | Term:{" "}
// // //               <b>{activeTerm.name}</b>
// // //             </p>
// // //           ) : (
// // //             <p className="mt-1 text-xs text-red-500 sm:text-sm">
// // //               No active session or term found.
// // //             </p>
// // //           )}

// // //           {selectedAcademicUnitObj && (
// // //             <p className="mt-2 text-xs font-semibold text-purple-700">
// // //               Academic Unit: {selectedAcademicUnitObj.name}
// // //             </p>
// // //           )}

// // //           {hasAttendanceAccess ? (
// // //             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
// // //               Class teacher access enabled. You can select any available
// // //               academic unit, class and arm.
// // //             </p>
// // //           ) : (
// // //             <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
// // //               Attendance management is available only to users marked as class
// // //               teachers.
// // //             </p>
// // //           )}
// // //         </div>

// // //         {success && (
// // //           <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
// // //             {success}
// // //           </div>
// // //         )}

// // //         {error && (
// // //           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
// // //             {error}
// // //           </div>
// // //         )}

// // //         <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
// // //           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
// // //             <select
// // //               value={selectedAcademicUnit}
// // //               onChange={(e) =>
// // //                 handleAcademicUnitChange(e.target.value)
// // //               }
// // //               disabled={
// // //                 dropdownsDisabled || loadingUnits || saving
// // //               }
// // //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// // //             >
// // //               <option value="">
// // //                 {loadingUnits
// // //                   ? "Loading Academic Units..."
// // //                   : "Select Academic Unit"}
// // //               </option>

// // //               {academicUnits.map((unit) => (
// // //                 <option key={unit._id} value={unit._id}>
// // //                   {unit.name}
// // //                 </option>
// // //               ))}
// // //             </select>

// // //             <select
// // //               value={selectedClass}
// // //               onChange={(e) => handleClassChange(e.target.value)}
// // //               disabled={
// // //                 dropdownsDisabled ||
// // //                 !selectedAcademicUnit ||
// // //                 loadingClasses ||
// // //                 saving
// // //               }
// // //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// // //             >
// // //               <option value="">
// // //                 {loadingClasses
// // //                   ? "Loading Classes..."
// // //                   : "Select Class"}
// // //               </option>

// // //               {classes.map((cls) => (
// // //                 <option key={cls._id} value={cls._id}>
// // //                   {cls.name}
// // //                 </option>
// // //               ))}
// // //             </select>

// // //             <select
// // //               value={selectedArm}
// // //               onChange={(e) => handleArmChange(e.target.value)}
// // //               disabled={
// // //                 dropdownsDisabled ||
// // //                 !selectedClass ||
// // //                 arms.length === 0 ||
// // //                 saving
// // //               }
// // //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// // //             >
// // //               <option value="">Select Arm</option>

// // //               {arms.map((arm) => (
// // //                 <option key={arm._id} value={arm._id}>
// // //                   {arm.name}
// // //                 </option>
// // //               ))}
// // //             </select>

// // //             <input
// // //               type="text"
// // //               placeholder="Search student..."
// // //               value={search}
// // //               onChange={(e) => {
// // //                 setSearch(e.target.value);
// // //                 setCurrentPage(1);
// // //               }}
// // //               disabled={!hasAttendanceAccess}
// // //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// // //             />

// // //             <button
// // //               type="button"
// // //               onClick={fetchAttendance}
// // //               disabled={
// // //                 !hasAttendanceAccess ||
// // //                 !selectedAcademicUnit ||
// // //                 !selectedClass ||
// // //                 !selectedArm ||
// // //                 !activeSession?._id ||
// // //                 !activeTerm?._id ||
// // //                 loading
// // //               }
// // //               className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
// // //             >
// // //               {loading ? "Loading..." : "Load Attendance"}
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {attendance.length > 0 && (
// // //           <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
// // //             <label className="mb-2 block text-sm font-medium text-gray-700">
// // //               Times School Opened
// // //             </label>

// // //             <input
// // //               type="number"
// // //               min="0"
// // //               value={timesOpened}
// // //               disabled={!hasAttendanceAccess}
// // //               onChange={(e) => {
// // //                 const value = Math.max(
// // //                   0,
// // //                   Number(e.target.value) || 0
// // //                 );

// // //                 setTimesOpened(value);

// // //                 setAttendance((prev) =>
// // //                   prev.map((student) => ({
// // //                     ...student,
// // //                     timesPresent:
// // //                       Number(student.timesPresent || 0) > value
// // //                         ? value
// // //                         : Number(student.timesPresent || 0),
// // //                   }))
// // //                 );
// // //               }}
// // //               className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100 sm:w-40"
// // //             />
// // //           </div>
// // //         )}

// // //         {loading && (
// // //           <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
// // //             Loading attendance...
// // //           </div>
// // //         )}

// // //         {!loading &&
// // //           hasAttendanceAccess &&
// // //           attendance.length === 0 && (
// // //             <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
// // //               Select academic unit, class and arm, then click Load
// // //               Attendance.
// // //             </div>
// // //           )}

// // //         {!loading && !hasAttendanceAccess && (
// // //           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
// // //             Your account is not marked as a class teacher.
// // //           </div>
// // //         )}

// // //         {!loading && attendance.length > 0 && (
// // //           <div className="rounded-xl bg-white p-4 shadow-sm">
// // //             <div className="mb-4 flex items-center justify-between">
// // //               <h2 className="font-semibold text-green-700">
// // //                 Student Attendance
// // //               </h2>

// // //               <span className="text-xs text-gray-500">
// // //                 {filteredAttendance.length} students
// // //               </span>
// // //             </div>

// // //             <div className="space-y-3">
// // //               {paginatedAttendance.map((student) => (
// // //                 <div
// // //                   key={student.studentId}
// // //                   className="rounded-xl border bg-gray-50 p-3"
// // //                 >
// // //                   <div className="mb-3 flex items-center gap-3">
// // //                     <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
// // //                       {student.image && (
// // //                         <img
// // //                           src={student.image}
// // //                           alt={student.name}
// // //                           className="h-full w-full object-cover"
// // //                         />
// // //                       )}
// // //                     </div>

// // //                     <div>
// // //                       <p className="text-sm font-semibold">
// // //                         {student.name}
// // //                       </p>

// // //                       <p className="text-xs text-gray-500">
// // //                         {student.admissionNumber}
// // //                       </p>
// // //                     </div>
// // //                   </div>

// // //                   <div>
// // //                     <label className="mb-1 block text-xs text-gray-500">
// // //                       Times Present
// // //                     </label>

// // //                     <input
// // //                       type="number"
// // //                       min="0"
// // //                       max={timesOpened}
// // //                       value={student.timesPresent ?? 0}
// // //                       disabled={!hasAttendanceAccess}
// // //                       onChange={(e) =>
// // //                         updateAttendance(
// // //                           student.studentId,
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
// // //                     />
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {totalPages > 1 && (
// // //               <div className="mt-6 flex items-center justify-center gap-2">
// // //                 <button
// // //                   type="button"
// // //                   disabled={currentPage === 1}
// // //                   onClick={() =>
// // //                     setCurrentPage((page) =>
// // //                       Math.max(page - 1, 1)
// // //                     )
// // //                   }
// // //                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
// // //                 >
// // //                   Prev
// // //                 </button>

// // //                 <span className="text-sm text-gray-600">
// // //                   {currentPage} / {totalPages}
// // //                 </span>

// // //                 <button
// // //                   type="button"
// // //                   disabled={currentPage === totalPages}
// // //                   onClick={() =>
// // //                     setCurrentPage((page) =>
// // //                       Math.min(page + 1, totalPages)
// // //                     )
// // //                   }
// // //                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
// // //                 >
// // //                   Next
// // //                 </button>
// // //               </div>
// // //             )}

// // //             <div className="sticky bottom-0 mt-6 bg-white pt-4">
// // //               <button
// // //                 type="button"
// // //                 onClick={saveAttendance}
// // //                 disabled={!hasAttendanceAccess || saving}
// // //                 className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
// // //               >
// // //                 {saving
// // //                   ? "Saving Attendance..."
// // //                   : "Save Attendance"}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ManageAttendance;


// // // src/pages/admin/ManageAttendance.jsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import api from "../../api/axios";
// // import { useAuth } from "../../hooks/useAuth";

// // const PAGE_SIZE = 10;

// // const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// // // Helper: a field on the user doc might be a populated object ({ _id, name })
// // // or a raw ObjectId string. Normalize to a plain id string either way.
// // const idOf = (value) => {
// //   if (!value) return "";
// //   if (typeof value === "string") return value;
// //   if (value.$oid) return value.$oid;
// //   if (value._id) return String(value._id);
// //   return String(value);
// // };

// // const ManageAttendance = () => {
// //   const { user } = useAuth();

// //   const [activeSession, setActiveSession] = useState(null);
// //   const [activeTerm, setActiveTerm] = useState(null);

// //   const [academicUnits, setAcademicUnits] = useState([]);
// //   const [classes, setClasses] = useState([]);
// //   const [arms, setArms] = useState([]);

// //   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
// //   const [selectedClass, setSelectedClass] = useState("");
// //   const [selectedArm, setSelectedArm] = useState("");

// //   const [attendance, setAttendance] = useState([]);
// //   const [timesOpened, setTimesOpened] = useState(0);

// //   const [loading, setLoading] = useState(false);
// //   const [loadingUnits, setLoadingUnits] = useState(false);
// //   const [loadingClasses, setLoadingClasses] = useState(false);
// //   const [saving, setSaving] = useState(false);

// //   const [success, setSuccess] = useState("");
// //   const [error, setError] = useState("");

// //   const [search, setSearch] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);

// //   /* ------------------------------------------------------------------ */
// //   /* Access rules                                                       */
// //   /* ------------------------------------------------------------------ */
// //   // admin / super_admin / master_admin -> unrestricted, every dropdown open
// //   const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
// //     user?.role
// //   );

// //   // principal -> locked to the "secondary" academic unit
// //   // head_teacher -> locked to the "primary" academic unit
// //   const restrictedUnitName =
// //     user?.role === "principal"
// //       ? "secondary"
// //       : user?.role === "head_teacher"
// //       ? "primary"
// //       : "";

// //   // A class teacher is any user with role "teacher", isClassTeacher true,
// //   // and a valid classTeacherOf.classId + armId (matches the sample user doc).
// //   const isClassTeacherOnly =
// //     user?.role === "teacher" &&
// //     user?.isClassTeacher === true &&
// //     !!idOf(user?.classTeacherOf?.classId) &&
// //     !!idOf(user?.classTeacherOf?.armId);

// //   // The user doc stores academicUnitId at the TOP level (not nested inside
// //   // classTeacherOf), per the sample record. Fall back to a nested value
// //   // in case some records do carry it there.
// //   const assignedAcademicUnitId =
// //     idOf(user?.academicUnitId) || idOf(user?.classTeacherOf?.academicUnitId);

// //   const assignedClassId = idOf(user?.classTeacherOf?.classId);
// //   const assignedArmId = idOf(user?.classTeacherOf?.armId);

// //   // Does this role have any restriction at all on the page?
// //   const isRestrictedRole =
// //     !isFullAccess && (isClassTeacherOnly || !!restrictedUnitName);

// //   // Academic unit dropdown is locked (pre-selected, disabled) for anyone
// //   // who isn't full-access.
// //   const isAcademicUnitLocked = !isFullAccess && isRestrictedRole;

// //   const hasAttendanceAccess = isFullAccess || isRestrictedRole;

// //   /* ------------------------------------------------------------------ */
// //   /* Derived data                                                       */
// //   /* ------------------------------------------------------------------ */
// //   const visibleAcademicUnits = useMemo(() => {
// //     if (isFullAccess) return academicUnits;

// //     if (isClassTeacherOnly && assignedAcademicUnitId) {
// //       return academicUnits.filter(
// //         (unit) => String(unit._id) === String(assignedAcademicUnitId)
// //       );
// //     }

// //     if (restrictedUnitName) {
// //       return academicUnits.filter((unit) =>
// //         unit.name?.toLowerCase().includes(restrictedUnitName)
// //       );
// //     }

// //     return academicUnits;
// //   }, [
// //     academicUnits,
// //     isFullAccess,
// //     isClassTeacherOnly,
// //     assignedAcademicUnitId,
// //     restrictedUnitName,
// //   ]);

// //   const selectedAcademicUnitObj = useMemo(
// //     () =>
// //       academicUnits.find(
// //         (unit) => String(unit._id) === String(selectedAcademicUnit)
// //       ),
// //     [academicUnits, selectedAcademicUnit]
// //   );

// //   const selectedClassObj = useMemo(
// //     () => classes.find((cls) => String(cls._id) === String(selectedClass)),
// //     [classes, selectedClass]
// //   );

// //   /* ------------------------------------------------------------------ */
// //   /* Load active session / term                                         */
// //   /* ------------------------------------------------------------------ */
// //   useEffect(() => {
// //     const fetchActiveSessionAndTerm = async () => {
// //       try {
// //         setError("");

// //         const res = await api.get("/sessions/active");
// //         const payload = getApiData(res);

// //         setActiveSession(
// //           payload?.session || res.data?.session || payload?.activeSession || null
// //         );
// //         setActiveTerm(
// //           payload?.term || res.data?.term || payload?.activeTerm || null
// //         );
// //       } catch (err) {
// //         console.error("Fetch active session error:", err);
// //         setError(err.response?.data?.message || "Failed to load active session.");
// //       }
// //     };

// //     fetchActiveSessionAndTerm();
// //   }, []);

// //   /* ------------------------------------------------------------------ */
// //   /* Load academic units, then pre-select based on role                 */
// //   /* ------------------------------------------------------------------ */
// //   useEffect(() => {
// //     const fetchAcademicUnits = async () => {
// //       try {
// //         setLoadingUnits(true);
// //         setError("");

// //         const res = await api.get("/academic-units");
// //         const payload = getApiData(res);
// //         const units = Array.isArray(payload) ? payload : [];

// //         setAcademicUnits(units);

// //         if (isClassTeacherOnly && assignedAcademicUnitId) {
// //           setSelectedAcademicUnit(assignedAcademicUnitId);
// //           return;
// //         }

// //         if (!isFullAccess && restrictedUnitName) {
// //           const allowedUnit = units.find((unit) =>
// //             unit.name?.toLowerCase().includes(restrictedUnitName)
// //           );

// //           if (allowedUnit) {
// //             setSelectedAcademicUnit(allowedUnit._id);
// //           } else {
// //             setError(
// //               `No "${restrictedUnitName}" academic unit was found for your role.`
// //             );
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Fetch academic units error:", err);
// //         setAcademicUnits([]);
// //         setError(err.response?.data?.message || "Failed to fetch academic units.");
// //       } finally {
// //         setLoadingUnits(false);
// //       }
// //     };

// //     fetchAcademicUnits();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [isFullAccess, restrictedUnitName, isClassTeacherOnly, assignedAcademicUnitId]);

// //   /* ------------------------------------------------------------------ */
// //   /* Load classes for the selected academic unit                        */
// //   /* ------------------------------------------------------------------ */
// //   useEffect(() => {
// //     const fetchClasses = async () => {
// //       if (!selectedAcademicUnit) {
// //         setClasses([]);
// //         setArms([]);
// //         setSelectedClass("");
// //         setSelectedArm("");
// //         return;
// //       }

// //       try {
// //         setLoadingClasses(true);
// //         setError("");

// //         const res = await api.get("/classes", {
// //           params: { academicUnitId: selectedAcademicUnit },
// //         });

// //         const payload = getApiData(res);
// //         const allClasses = Array.isArray(payload) ? payload : [];

// //         if (isClassTeacherOnly) {
// //           const assignedClass = allClasses.find(
// //             (cls) => String(cls._id) === String(assignedClassId)
// //           );

// //           if (!assignedClass) {
// //             setError("Your assigned class was not found in this academic unit.");
// //             setClasses([]);
// //             setArms([]);
// //             return;
// //           }

// //           const classArms = assignedClass.arms || assignedClass.armsList || [];
// //           const assignedArm = classArms.find(
// //             (arm) => String(arm._id) === String(assignedArmId)
// //           );

// //           setClasses([assignedClass]);
// //           setArms(Array.isArray(classArms) ? classArms : []);
// //           setSelectedClass(assignedClass._id);

// //           if (assignedArm) {
// //             setSelectedArm(assignedArm._id);
// //           } else {
// //             setError("Your assigned arm was not found on your assigned class.");
// //           }

// //           return;
// //         }

// //         setClasses(allClasses);
// //       } catch (err) {
// //         console.error("Fetch classes error:", err);
// //         setClasses([]);
// //         setArms([]);
// //         setSelectedClass("");
// //         setSelectedArm("");
// //         setError(err.response?.data?.message || "Failed to fetch classes.");
// //       } finally {
// //         setLoadingClasses(false);
// //       }
// //     };

// //     fetchClasses();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [selectedAcademicUnit, isClassTeacherOnly, assignedClassId, assignedArmId]);

// //   /* ------------------------------------------------------------------ */
// //   /* Keep arms in sync when a non-class-teacher picks a class manually  */
// //   /* ------------------------------------------------------------------ */
// //   useEffect(() => {
// //     if (!selectedClass) {
// //       setArms([]);
// //       setSelectedArm("");
// //       return;
// //     }

// //     const classArms = selectedClassObj?.arms || selectedClassObj?.armsList || [];
// //     setArms(Array.isArray(classArms) ? classArms : []);

// //     if (!isClassTeacherOnly) {
// //       setSelectedArm("");
// //       setAttendance([]);
// //       setTimesOpened(0);
// //       setCurrentPage(1);
// //     }
// //   }, [selectedClass, selectedClassObj, isClassTeacherOnly]);

// //   /* ------------------------------------------------------------------ */
// //   /* Handlers                                                            */
// //   /* ------------------------------------------------------------------ */
// //   const resetAttendanceData = () => {
// //     setAttendance([]);
// //     setTimesOpened(0);
// //     setSearch("");
// //     setCurrentPage(1);
// //     setSuccess("");
// //   };

// //   const handleAcademicUnitChange = (academicUnitId) => {
// //     if (isAcademicUnitLocked) return;
// //     setSelectedAcademicUnit(academicUnitId);
// //     setSelectedClass("");
// //     setSelectedArm("");
// //     setClasses([]);
// //     setArms([]);
// //     resetAttendanceData();
// //     setError("");
// //   };

// //   const handleClassChange = (classId) => {
// //     if (isClassTeacherOnly) return;
// //     setSelectedClass(classId);
// //     setSelectedArm("");
// //     setArms([]);
// //     resetAttendanceData();
// //     setError("");
// //   };

// //   const handleArmChange = (armId) => {
// //     if (isClassTeacherOnly) return;
// //     setSelectedArm(armId);
// //     resetAttendanceData();
// //     setError("");
// //   };

// //   const fetchAttendance = async () => {
// //     if (!hasAttendanceAccess) {
// //       setError("You do not have permission to manage attendance.");
// //       return;
// //     }

// //     if (
// //       !selectedAcademicUnit ||
// //       !selectedClass ||
// //       !selectedArm ||
// //       !activeSession?._id ||
// //       !activeTerm?._id
// //     ) {
// //       setError(
// //         "Please select academic unit, class and arm. An active session and term are also required."
// //       );
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setSuccess("");
// //       setError("");

// //       const res = await api.get("/attendance/summary", {
// //         params: {
// //           academicUnitId: selectedAcademicUnit,
// //           classId: selectedClass,
// //           armId: selectedArm,
// //           sessionId: activeSession._id,
// //           termId: activeTerm._id,
// //         },
// //       });

// //       const payload = getApiData(res);

// //       setAttendance(Array.isArray(payload?.records) ? payload.records : []);
// //       setTimesOpened(Number(payload?.timesOpened || 0));
// //       setCurrentPage(1);
// //     } catch (err) {
// //       console.error("Fetch attendance error:", err);
// //       setAttendance([]);
// //       setTimesOpened(0);
// //       setError(err.response?.data?.message || "Failed to load attendance.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Class teachers land on a fixed class/arm automatically, so auto-load
// //   // their attendance once everything required is resolved.
// //   useEffect(() => {
// //     if (
// //       isClassTeacherOnly &&
// //       selectedAcademicUnit &&
// //       selectedClass &&
// //       selectedArm &&
// //       activeSession?._id &&
// //       activeTerm?._id
// //     ) {
// //       fetchAttendance();
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [
// //     isClassTeacherOnly,
// //     selectedAcademicUnit,
// //     selectedClass,
// //     selectedArm,
// //     activeSession,
// //     activeTerm,
// //   ]);

// //   const updateAttendance = (studentId, value) => {
// //     let numeric = Number(value);

// //     if (Number.isNaN(numeric)) numeric = 0;
// //     if (numeric < 0) numeric = 0;
// //     if (numeric > timesOpened) numeric = timesOpened;

// //     setAttendance((prev) =>
// //       prev.map((student) =>
// //         String(student.studentId) === String(studentId)
// //           ? { ...student, timesPresent: numeric }
// //           : student
// //       )
// //     );
// //   };

// //   const saveAttendance = async () => {
// //     if (!hasAttendanceAccess) {
// //       setError("You do not have permission to manage attendance.");
// //       return;
// //     }

// //     if (
// //       !selectedAcademicUnit ||
// //       !selectedClass ||
// //       !selectedArm ||
// //       !activeSession?._id ||
// //       !activeTerm?._id
// //     ) {
// //       setError(
// //         "Please select academic unit, class and arm. An active session and term are also required."
// //       );
// //       return;
// //     }

// //     if (attendance.length === 0) {
// //       setError("There are no attendance records to save.");
// //       return;
// //     }

// //     try {
// //       setSaving(true);
// //       setSuccess("");
// //       setError("");

// //       await api.post("/attendance/summary", {
// //         academicUnitId: selectedAcademicUnit,
// //         classId: selectedClass,
// //         armId: selectedArm,
// //         sessionId: activeSession._id,
// //         termId: activeTerm._id,
// //         timesOpened: Number(timesOpened || 0),
// //         records: attendance.map((student) => ({
// //           studentId: student.studentId,
// //           timesPresent: Number(student.timesPresent || 0),
// //         })),
// //       });

// //       setSuccess("Attendance saved successfully.");
// //     } catch (err) {
// //       console.error("Save attendance error:", err);
// //       setError(err.response?.data?.message || "Failed to save attendance.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const filteredAttendance = useMemo(() => {
// //     const searchText = search.trim().toLowerCase();
// //     if (!searchText) return attendance;

// //     return attendance.filter((student) => {
// //       const studentName = student.name?.toLowerCase() || "";
// //       const admissionNumber = student.admissionNumber?.toLowerCase() || "";
// //       return (
// //         studentName.includes(searchText) || admissionNumber.includes(searchText)
// //       );
// //     });
// //   }, [attendance, search]);

// //   const totalPages = Math.max(1, Math.ceil(filteredAttendance.length / PAGE_SIZE));

// //   const paginatedAttendance = useMemo(() => {
// //     const start = (currentPage - 1) * PAGE_SIZE;
// //     return filteredAttendance.slice(start, start + PAGE_SIZE);
// //   }, [filteredAttendance, currentPage]);

// //   const dropdownsDisabled = !hasAttendanceAccess;

// //   /* ------------------------------------------------------------------ */
// //   /* Render                                                              */
// //   /* ------------------------------------------------------------------ */
// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="mx-auto max-w-6xl p-3 sm:p-5">
// //         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
// //           <h1 className="text-lg font-bold text-green-700 sm:text-xl">
// //             Attendance Recording
// //           </h1>

// //           {activeSession && activeTerm ? (
// //             <p className="mt-1 text-xs text-gray-500 sm:text-sm">
// //               Session: <b>{activeSession.name}</b> | Term: <b>{activeTerm.name}</b>
// //             </p>
// //           ) : (
// //             <p className="mt-1 text-xs text-red-500 sm:text-sm">
// //               No active session or term found.
// //             </p>
// //           )}

// //           {selectedAcademicUnitObj && isAcademicUnitLocked && (
// //             <p className="mt-2 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">
// //               Restricted View: {selectedAcademicUnitObj.name}
// //             </p>
// //           )}

// //           {isFullAccess && (
// //             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
// //               Full access enabled. You can select any academic unit, class and arm.
// //             </p>
// //           )}

// //           {isClassTeacherOnly && (
// //             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
// //               You can only manage attendance for your assigned class and arm.
// //             </p>
// //           )}

// //           {!isFullAccess && restrictedUnitName && !isClassTeacherOnly && (
// //             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
// //               You can manage attendance for classes within the{" "}
// //               {restrictedUnitName} academic unit.
// //             </p>
// //           )}

// //           {!hasAttendanceAccess && (
// //             <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
// //               Your account does not have permission to manage attendance.
// //             </p>
// //           )}
// //         </div>

// //         {success && (
// //           <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
// //             {success}
// //           </div>
// //         )}

// //         {error && (
// //           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
// //             {error}
// //           </div>
// //         )}

// //         <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
// //           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
// //             <select
// //               value={selectedAcademicUnit}
// //               onChange={(e) => handleAcademicUnitChange(e.target.value)}
// //               disabled={dropdownsDisabled || isAcademicUnitLocked || loadingUnits || saving}
// //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// //             >
// //               <option value="">
// //                 {loadingUnits ? "Loading Academic Units..." : "Select Academic Unit"}
// //               </option>

// //               {visibleAcademicUnits.map((unit) => (
// //                 <option key={unit._id} value={unit._id}>
// //                   {unit.name}
// //                 </option>
// //               ))}
// //             </select>

// //             <select
// //               value={selectedClass}
// //               onChange={(e) => handleClassChange(e.target.value)}
// //               disabled={
// //                 dropdownsDisabled ||
// //                 isClassTeacherOnly ||
// //                 !selectedAcademicUnit ||
// //                 loadingClasses ||
// //                 saving
// //               }
// //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// //             >
// //               <option value="">
// //                 {loadingClasses ? "Loading Classes..." : "Select Class"}
// //               </option>

// //               {classes.map((cls) => (
// //                 <option key={cls._id} value={cls._id}>
// //                   {cls.name}
// //                 </option>
// //               ))}
// //             </select>

// //             <select
// //               value={selectedArm}
// //               onChange={(e) => handleArmChange(e.target.value)}
// //               disabled={
// //                 dropdownsDisabled ||
// //                 isClassTeacherOnly ||
// //                 !selectedClass ||
// //                 arms.length === 0 ||
// //                 saving
// //               }
// //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// //             >
// //               <option value="">Select Arm</option>

// //               {arms.map((arm) => (
// //                 <option key={arm._id} value={arm._id}>
// //                   {arm.name}
// //                 </option>
// //               ))}
// //             </select>

// //             <input
// //               type="text"
// //               placeholder="Search student..."
// //               value={search}
// //               onChange={(e) => {
// //                 setSearch(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               disabled={!hasAttendanceAccess}
// //               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
// //             />

// //             <button
// //               type="button"
// //               onClick={fetchAttendance}
// //               disabled={
// //                 !hasAttendanceAccess ||
// //                 !selectedAcademicUnit ||
// //                 !selectedClass ||
// //                 !selectedArm ||
// //                 !activeSession?._id ||
// //                 !activeTerm?._id ||
// //                 loading
// //               }
// //               className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
// //             >
// //               {loading ? "Loading..." : isClassTeacherOnly ? "Reload" : "Load Attendance"}
// //             </button>
// //           </div>
// //         </div>

// //         {attendance.length > 0 && (
// //           <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
// //             <label className="mb-2 block text-sm font-medium text-gray-700">
// //               Times School Opened
// //             </label>

// //             <input
// //               type="number"
// //               min="0"
// //               value={timesOpened}
// //               disabled={!hasAttendanceAccess}
// //               onChange={(e) => {
// //                 const value = Math.max(0, Number(e.target.value) || 0);
// //                 setTimesOpened(value);

// //                 setAttendance((prev) =>
// //                   prev.map((student) => ({
// //                     ...student,
// //                     timesPresent:
// //                       Number(student.timesPresent || 0) > value
// //                         ? value
// //                         : Number(student.timesPresent || 0),
// //                   }))
// //                 );
// //               }}
// //               className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100 sm:w-40"
// //             />
// //           </div>
// //         )}

// //         {loading && (
// //           <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
// //             Loading attendance...
// //           </div>
// //         )}

// //         {!loading && hasAttendanceAccess && attendance.length === 0 && (
// //           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
// //             {isClassTeacherOnly
// //               ? "No attendance records found for your assigned class."
// //               : "Select academic unit, class and arm, then click Load Attendance."}
// //           </div>
// //         )}

// //         {!loading && !hasAttendanceAccess && (
// //           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
// //             Your account does not have permission to manage attendance.
// //           </div>
// //         )}

// //         {!loading && attendance.length > 0 && (
// //           <div className="rounded-xl bg-white p-4 shadow-sm">
// //             <div className="mb-4 flex items-center justify-between">
// //               <h2 className="font-semibold text-green-700">Student Attendance</h2>
// //               <span className="text-xs text-gray-500">
// //                 {filteredAttendance.length} students
// //               </span>
// //             </div>

// //             <div className="space-y-3">
// //               {paginatedAttendance.map((student) => (
// //                 <div key={student.studentId} className="rounded-xl border bg-gray-50 p-3">
// //                   <div className="mb-3 flex items-center gap-3">
// //                     <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
// //                       {student.image && (
// //                         <img
// //                           src={student.image}
// //                           alt={student.name}
// //                           className="h-full w-full object-cover"
// //                         />
// //                       )}
// //                     </div>

// //                     <div>
// //                       <p className="text-sm font-semibold">{student.name}</p>
// //                       <p className="text-xs text-gray-500">{student.admissionNumber}</p>
// //                     </div>
// //                   </div>

// //                   <div>
// //                     <label className="mb-1 block text-xs text-gray-500">
// //                       Times Present
// //                     </label>

// //                     <input
// //                       type="number"
// //                       min="0"
// //                       max={timesOpened}
// //                       value={student.timesPresent ?? 0}
// //                       disabled={!hasAttendanceAccess}
// //                       onChange={(e) => updateAttendance(student.studentId, e.target.value)}
// //                       className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
// //                     />
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {totalPages > 1 && (
// //               <div className="mt-6 flex items-center justify-center gap-2">
// //                 <button
// //                   type="button"
// //                   disabled={currentPage === 1}
// //                   onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
// //                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
// //                 >
// //                   Prev
// //                 </button>

// //                 <span className="text-sm text-gray-600">
// //                   {currentPage} / {totalPages}
// //                 </span>

// //                 <button
// //                   type="button"
// //                   disabled={currentPage === totalPages}
// //                   onClick={() =>
// //                     setCurrentPage((page) => Math.min(page + 1, totalPages))
// //                   }
// //                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
// //                 >
// //                   Next
// //                 </button>
// //               </div>
// //             )}

// //             <div className="sticky bottom-0 mt-6 bg-white pt-4">
// //               <button
// //                 type="button"
// //                 onClick={saveAttendance}
// //                 disabled={!hasAttendanceAccess || saving}
// //                 className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
// //               >
// //                 {saving ? "Saving Attendance..." : "Save Attendance"}
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ManageAttendance;

// // src/pages/admin/ManageAttendance.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import api from "../../api/axios";
// import { useAuth } from "../../hooks/useAuth";

// const PAGE_SIZE = 10;

// const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// // Helper: a field on the user doc might be a populated object ({ _id, name })
// // or a raw ObjectId string. Normalize to a plain id string either way.
// const idOf = (value) => {
//   if (!value) return "";
//   if (typeof value === "string") return value;
//   if (value.$oid) return value.$oid;
//   if (value._id) return String(value._id);
//   return String(value);
// };

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
//   const [loadingUnits, setLoadingUnits] = useState(false);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fallback: if the login/auth payload doesn't include academicUnitId on
//   // the user (backend trims it), resolve it by fetching the class teacher's
//   // assigned class directly and reading academicUnitId off that instead.
//   const [resolvedAcademicUnitId, setResolvedAcademicUnitId] = useState("");
//   const [resolvingAssignment, setResolvingAssignment] = useState(false);

//   /* ------------------------------------------------------------------ */
//   /* Access rules                                                       */
//   /* ------------------------------------------------------------------ */
//   // admin / super_admin / master_admin -> unrestricted, every dropdown open
//   const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
//     user?.role
//   );

//   // principal -> locked to the "secondary" academic unit
//   // head_teacher -> locked to the "primary" academic unit
//   const restrictedUnitName =
//     user?.role === "principal"
//       ? "secondary"
//       : user?.role === "head_teacher"
//       ? "primary"
//       : "";

//   // A class teacher is any user with role "teacher", isClassTeacher true,
//   // and a valid classTeacherOf.classId + armId (matches the sample user doc).
//   const isClassTeacherOnly =
//     user?.role === "teacher" &&
//     user?.isClassTeacher === true &&
//     !!idOf(user?.classTeacherOf?.classId) &&
//     !!idOf(user?.classTeacherOf?.armId);

//   // The user doc stores academicUnitId at the TOP level (not nested inside
//   // classTeacherOf), per the sample record. Fall back to a nested value
//   // in case some records do carry it there.
//   const assignedAcademicUnitId =
//     idOf(user?.academicUnitId) || idOf(user?.classTeacherOf?.academicUnitId);

//   const assignedClassId = idOf(user?.classTeacherOf?.classId);
//   const assignedArmId = idOf(user?.classTeacherOf?.armId);

//   // Use whichever we have: the value from the user payload, or the one
//   // resolved from the assigned class as a fallback (see effect below).
//   const effectiveAssignedAcademicUnitId =
//     assignedAcademicUnitId || resolvedAcademicUnitId;

//   // Does this role have any restriction at all on the page?
//   const isRestrictedRole =
//     !isFullAccess && (isClassTeacherOnly || !!restrictedUnitName);

//   // Academic unit dropdown is locked (pre-selected, disabled) for anyone
//   // who isn't full-access.
//   const isAcademicUnitLocked = !isFullAccess && isRestrictedRole;

//   const hasAttendanceAccess = isFullAccess || isRestrictedRole;

//   /* ------------------------------------------------------------------ */
//   /* Derived data                                                       */
//   /* ------------------------------------------------------------------ */
//   const visibleAcademicUnits = useMemo(() => {
//     if (isFullAccess) return academicUnits;

//     if (isClassTeacherOnly && effectiveAssignedAcademicUnitId) {
//       return academicUnits.filter(
//         (unit) => String(unit._id) === String(effectiveAssignedAcademicUnitId)
//       );
//     }

//     if (restrictedUnitName) {
//       return academicUnits.filter((unit) =>
//         unit.name?.toLowerCase().includes(restrictedUnitName)
//       );
//     }

//     return academicUnits;
//   }, [
//     academicUnits,
//     isFullAccess,
//     isClassTeacherOnly,
//     effectiveAssignedAcademicUnitId,
//     restrictedUnitName,
//   ]);

//   const selectedAcademicUnitObj = useMemo(
//     () =>
//       academicUnits.find(
//         (unit) => String(unit._id) === String(selectedAcademicUnit)
//       ),
//     [academicUnits, selectedAcademicUnit]
//   );

//   const selectedClassObj = useMemo(
//     () => classes.find((cls) => String(cls._id) === String(selectedClass)),
//     [classes, selectedClass]
//   );

//   /* ------------------------------------------------------------------ */
//   /* Fallback: resolve academicUnitId from the assigned class            */
//   /* ------------------------------------------------------------------ */
//   // Only runs when a class teacher's user payload doesn't already carry
//   // academicUnitId (e.g. login response trims it). Fetches the assigned
//   // class directly and reads academicUnitId off it instead, so this page
//   // works without needing a backend change.
//   useEffect(() => {
//     if (!isClassTeacherOnly || assignedAcademicUnitId || !assignedClassId) {
//       return;
//     }

//     const resolveAcademicUnitFromClass = async () => {
//       try {
//         setResolvingAssignment(true);
//         setError("");

//         const res = await api.get(`/classes/${assignedClassId}`);
//         const payload = getApiData(res);
//         const classDoc = payload?.class || payload;

//         const resolvedId = idOf(classDoc?.academicUnitId);

//         if (resolvedId) {
//           setResolvedAcademicUnitId(resolvedId);
//         } else {
//           setError(
//             "Could not resolve your academic unit from your assigned class."
//           );
//         }
//       } catch (err) {
//         console.error("Resolve academic unit error:", err);
//         setError(
//           err.response?.data?.message ||
//             "Failed to resolve your assigned academic unit."
//         );
//       } finally {
//         setResolvingAssignment(false);
//       }
//     };

//     resolveAcademicUnitFromClass();
//   }, [isClassTeacherOnly, assignedAcademicUnitId, assignedClassId]);

//   /* ------------------------------------------------------------------ */
//   /* Load active session / term                                         */
//   /* ------------------------------------------------------------------ */
//   useEffect(() => {
//     const fetchActiveSessionAndTerm = async () => {
//       try {
//         setError("");

//         const res = await api.get("/sessions/active");
//         const payload = getApiData(res);

//         setActiveSession(
//           payload?.session || res.data?.session || payload?.activeSession || null
//         );
//         setActiveTerm(
//           payload?.term || res.data?.term || payload?.activeTerm || null
//         );
//       } catch (err) {
//         console.error("Fetch active session error:", err);
//         setError(err.response?.data?.message || "Failed to load active session.");
//       }
//     };

//     fetchActiveSessionAndTerm();
//   }, []);

//   /* ------------------------------------------------------------------ */
//   /* Load academic units, then pre-select based on role                 */
//   /* ------------------------------------------------------------------ */
//   useEffect(() => {
//     const fetchAcademicUnits = async () => {
//       try {
//         setLoadingUnits(true);
//         setError("");

//         const res = await api.get("/academic-units");
//         const payload = getApiData(res);
//         const units = Array.isArray(payload) ? payload : [];

//         setAcademicUnits(units);
//       } catch (err) {
//         console.error("Fetch academic units error:", err);
//         setAcademicUnits([]);
//         setError(err.response?.data?.message || "Failed to fetch academic units.");
//       } finally {
//         setLoadingUnits(false);
//       }
//     };

//     fetchAcademicUnits();
//   }, []);

//   // Auto-select the academic unit once the list has loaded and (for class
//   // teachers) once the assigned unit id has been resolved, either from the
//   // user payload directly or via the class-fetch fallback above.
//   useEffect(() => {
//     if (academicUnits.length === 0) return;

//     if (isClassTeacherOnly) {
//       if (effectiveAssignedAcademicUnitId) {
//         setSelectedAcademicUnit(effectiveAssignedAcademicUnitId);
//       }
//       return;
//     }

//     if (!isFullAccess && restrictedUnitName) {
//       const allowedUnit = academicUnits.find((unit) =>
//         unit.name?.toLowerCase().includes(restrictedUnitName)
//       );

//       if (allowedUnit) {
//         setSelectedAcademicUnit(allowedUnit._id);
//       } else {
//         setError(
//           `No "${restrictedUnitName}" academic unit was found for your role.`
//         );
//       }
//     }
//   }, [
//     academicUnits,
//     isFullAccess,
//     isClassTeacherOnly,
//     effectiveAssignedAcademicUnitId,
//     restrictedUnitName,
//   ]);

//   /* ------------------------------------------------------------------ */
//   /* Load classes for the selected academic unit                        */
//   /* ------------------------------------------------------------------ */
//   useEffect(() => {
//     const fetchClasses = async () => {
//       if (!selectedAcademicUnit) {
//         setClasses([]);
//         setArms([]);
//         setSelectedClass("");
//         setSelectedArm("");
//         return;
//       }

//       try {
//         setLoadingClasses(true);
//         setError("");

//         const res = await api.get("/classes", {
//           params: { academicUnitId: selectedAcademicUnit },
//         });

//         const payload = getApiData(res);
//         const allClasses = Array.isArray(payload) ? payload : [];

//         if (isClassTeacherOnly) {
//           const assignedClass = allClasses.find(
//             (cls) => String(cls._id) === String(assignedClassId)
//           );

//           if (!assignedClass) {
//             setError("Your assigned class was not found in this academic unit.");
//             setClasses([]);
//             setArms([]);
//             return;
//           }

//           const classArms = assignedClass.arms || assignedClass.armsList || [];
//           const assignedArm = classArms.find(
//             (arm) => String(arm._id) === String(assignedArmId)
//           );

//           setClasses([assignedClass]);
//           setArms(Array.isArray(classArms) ? classArms : []);
//           setSelectedClass(assignedClass._id);

//           if (assignedArm) {
//             setSelectedArm(assignedArm._id);
//           } else {
//             setError("Your assigned arm was not found on your assigned class.");
//           }

//           return;
//         }

//         setClasses(allClasses);
//       } catch (err) {
//         console.error("Fetch classes error:", err);
//         setClasses([]);
//         setArms([]);
//         setSelectedClass("");
//         setSelectedArm("");
//         setError(err.response?.data?.message || "Failed to fetch classes.");
//       } finally {
//         setLoadingClasses(false);
//       }
//     };

//     fetchClasses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedAcademicUnit, isClassTeacherOnly, assignedClassId, assignedArmId]);

//   /* ------------------------------------------------------------------ */
//   /* Keep arms in sync when a non-class-teacher picks a class manually  */
//   /* ------------------------------------------------------------------ */
//   useEffect(() => {
//     if (!selectedClass) {
//       setArms([]);
//       setSelectedArm("");
//       return;
//     }

//     const classArms = selectedClassObj?.arms || selectedClassObj?.armsList || [];
//     setArms(Array.isArray(classArms) ? classArms : []);

//     if (!isClassTeacherOnly) {
//       setSelectedArm("");
//       setAttendance([]);
//       setTimesOpened(0);
//       setCurrentPage(1);
//     }
//   }, [selectedClass, selectedClassObj, isClassTeacherOnly]);

//   /* ------------------------------------------------------------------ */
//   /* Handlers                                                            */
//   /* ------------------------------------------------------------------ */
//   const resetAttendanceData = () => {
//     setAttendance([]);
//     setTimesOpened(0);
//     setSearch("");
//     setCurrentPage(1);
//     setSuccess("");
//   };

//   const handleAcademicUnitChange = (academicUnitId) => {
//     if (isAcademicUnitLocked) return;
//     setSelectedAcademicUnit(academicUnitId);
//     setSelectedClass("");
//     setSelectedArm("");
//     setClasses([]);
//     setArms([]);
//     resetAttendanceData();
//     setError("");
//   };

//   const handleClassChange = (classId) => {
//     if (isClassTeacherOnly) return;
//     setSelectedClass(classId);
//     setSelectedArm("");
//     setArms([]);
//     resetAttendanceData();
//     setError("");
//   };

//   const handleArmChange = (armId) => {
//     if (isClassTeacherOnly) return;
//     setSelectedArm(armId);
//     resetAttendanceData();
//     setError("");
//   };

//   const fetchAttendance = async () => {
//     if (!hasAttendanceAccess) {
//       setError("You do not have permission to manage attendance.");
//       return;
//     }

//     if (
//       !selectedAcademicUnit ||
//       !selectedClass ||
//       !selectedArm ||
//       !activeSession?._id ||
//       !activeTerm?._id
//     ) {
//       setError(
//         "Please select academic unit, class and arm. An active session and term are also required."
//       );
//       return;
//     }

//     try {
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

//       setAttendance(Array.isArray(payload?.records) ? payload.records : []);
//       setTimesOpened(Number(payload?.timesOpened || 0));
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Fetch attendance error:", err);
//       setAttendance([]);
//       setTimesOpened(0);
//       setError(err.response?.data?.message || "Failed to load attendance.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Class teachers land on a fixed class/arm automatically, so auto-load
//   // their attendance once everything required is resolved.
//   useEffect(() => {
//     if (
//       isClassTeacherOnly &&
//       selectedAcademicUnit &&
//       selectedClass &&
//       selectedArm &&
//       activeSession?._id &&
//       activeTerm?._id
//     ) {
//       fetchAttendance();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     isClassTeacherOnly,
//     selectedAcademicUnit,
//     selectedClass,
//     selectedArm,
//     activeSession,
//     activeTerm,
//   ]);

//   const updateAttendance = (studentId, value) => {
//     let numeric = Number(value);

//     if (Number.isNaN(numeric)) numeric = 0;
//     if (numeric < 0) numeric = 0;
//     if (numeric > timesOpened) numeric = timesOpened;

//     setAttendance((prev) =>
//       prev.map((student) =>
//         String(student.studentId) === String(studentId)
//           ? { ...student, timesPresent: numeric }
//           : student
//       )
//     );
//   };

//   const saveAttendance = async () => {
//     if (!hasAttendanceAccess) {
//       setError("You do not have permission to manage attendance.");
//       return;
//     }

//     if (
//       !selectedAcademicUnit ||
//       !selectedClass ||
//       !selectedArm ||
//       !activeSession?._id ||
//       !activeTerm?._id
//     ) {
//       setError(
//         "Please select academic unit, class and arm. An active session and term are also required."
//       );
//       return;
//     }

//     if (attendance.length === 0) {
//       setError("There are no attendance records to save.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setSuccess("");
//       setError("");

//       await api.post("/attendance/summary", {
//         academicUnitId: selectedAcademicUnit,
//         classId: selectedClass,
//         armId: selectedArm,
//         sessionId: activeSession._id,
//         termId: activeTerm._id,
//         timesOpened: Number(timesOpened || 0),
//         records: attendance.map((student) => ({
//           studentId: student.studentId,
//           timesPresent: Number(student.timesPresent || 0),
//         })),
//       });

//       setSuccess("Attendance saved successfully.");
//     } catch (err) {
//       console.error("Save attendance error:", err);
//       setError(err.response?.data?.message || "Failed to save attendance.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredAttendance = useMemo(() => {
//     const searchText = search.trim().toLowerCase();
//     if (!searchText) return attendance;

//     return attendance.filter((student) => {
//       const studentName = student.name?.toLowerCase() || "";
//       const admissionNumber = student.admissionNumber?.toLowerCase() || "";
//       return (
//         studentName.includes(searchText) || admissionNumber.includes(searchText)
//       );
//     });
//   }, [attendance, search]);

//   const totalPages = Math.max(1, Math.ceil(filteredAttendance.length / PAGE_SIZE));

//   const paginatedAttendance = useMemo(() => {
//     const start = (currentPage - 1) * PAGE_SIZE;
//     return filteredAttendance.slice(start, start + PAGE_SIZE);
//   }, [filteredAttendance, currentPage]);

//   const dropdownsDisabled = !hasAttendanceAccess;

//   /* ------------------------------------------------------------------ */
//   /* Render                                                              */
//   /* ------------------------------------------------------------------ */
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-6xl p-3 sm:p-5">
//         <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
//           <h1 className="text-lg font-bold text-green-700 sm:text-xl">
//             Attendance Recording
//           </h1>

//           {activeSession && activeTerm ? (
//             <p className="mt-1 text-xs text-gray-500 sm:text-sm">
//               Session: <b>{activeSession.name}</b> | Term: <b>{activeTerm.name}</b>
//             </p>
//           ) : (
//             <p className="mt-1 text-xs text-red-500 sm:text-sm">
//               No active session or term found.
//             </p>
//           )}

//           {selectedAcademicUnitObj && isAcademicUnitLocked && (
//             <p className="mt-2 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">
//               Restricted View: {selectedAcademicUnitObj.name}
//             </p>
//           )}

//           {isFullAccess && (
//             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
//               Full access enabled. You can select any academic unit, class and arm.
//             </p>
//           )}

//           {isClassTeacherOnly && (
//             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
//               You can only manage attendance for your assigned class and arm.
//             </p>
//           )}

//           {isClassTeacherOnly && resolvingAssignment && (
//             <p className="mt-2 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-600">
//               Resolving your assigned class...
//             </p>
//           )}

//           {!isFullAccess && restrictedUnitName && !isClassTeacherOnly && (
//             <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
//               You can manage attendance for classes within the{" "}
//               {restrictedUnitName} academic unit.
//             </p>
//           )}

//           {!hasAttendanceAccess && (
//             <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
//               Your account does not have permission to manage attendance.
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
//               onChange={(e) => handleAcademicUnitChange(e.target.value)}
//               disabled={
//                 dropdownsDisabled ||
//                 isAcademicUnitLocked ||
//                 loadingUnits ||
//                 resolvingAssignment ||
//                 saving
//               }
//               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
//             >
//               <option value="">
//                 {loadingUnits
//                   ? "Loading Academic Units..."
//                   : resolvingAssignment
//                   ? "Resolving your class..."
//                   : "Select Academic Unit"}
//               </option>

//               {visibleAcademicUnits.map((unit) => (
//                 <option key={unit._id} value={unit._id}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedClass}
//               onChange={(e) => handleClassChange(e.target.value)}
//               disabled={
//                 dropdownsDisabled ||
//                 isClassTeacherOnly ||
//                 !selectedAcademicUnit ||
//                 loadingClasses ||
//                 saving
//               }
//               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
//             >
//               <option value="">
//                 {loadingClasses ? "Loading Classes..." : "Select Class"}
//               </option>

//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedArm}
//               onChange={(e) => handleArmChange(e.target.value)}
//               disabled={
//                 dropdownsDisabled ||
//                 isClassTeacherOnly ||
//                 !selectedClass ||
//                 arms.length === 0 ||
//                 saving
//               }
//               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
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
//               disabled={!hasAttendanceAccess}
//               className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
//             />

//             <button
//               type="button"
//               onClick={fetchAttendance}
//               disabled={
//                 !hasAttendanceAccess ||
//                 !selectedAcademicUnit ||
//                 !selectedClass ||
//                 !selectedArm ||
//                 !activeSession?._id ||
//                 !activeTerm?._id ||
//                 resolvingAssignment ||
//                 loading
//               }
//               className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loading ? "Loading..." : isClassTeacherOnly ? "Reload" : "Load Attendance"}
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
//               disabled={!hasAttendanceAccess}
//               onChange={(e) => {
//                 const value = Math.max(0, Number(e.target.value) || 0);
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
//               className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100 sm:w-40"
//             />
//           </div>
//         )}

//         {loading && (
//           <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
//             Loading attendance...
//           </div>
//         )}

//         {!loading && hasAttendanceAccess && attendance.length === 0 && (
//           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
//             {isClassTeacherOnly
//               ? "No attendance records found for your assigned class."
//               : "Select academic unit, class and arm, then click Load Attendance."}
//           </div>
//         )}

//         {!loading && !hasAttendanceAccess && (
//           <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
//             Your account does not have permission to manage attendance.
//           </div>
//         )}

//         {!loading && attendance.length > 0 && (
//           <div className="rounded-xl bg-white p-4 shadow-sm">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="font-semibold text-green-700">Student Attendance</h2>
//               <span className="text-xs text-gray-500">
//                 {filteredAttendance.length} students
//               </span>
//             </div>

//             <div className="space-y-3">
//               {paginatedAttendance.map((student) => (
//                 <div key={student.studentId} className="rounded-xl border bg-gray-50 p-3">
//                   <div className="mb-3 flex items-center gap-3">
//                     <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
//                       {student.image && (
//                         <img
//                           src={student.image}
//                           alt={student.name}
//                           className="h-full w-full object-cover"
//                         />
//                       )}
//                     </div>

//                     <div>
//                       <p className="text-sm font-semibold">{student.name}</p>
//                       <p className="text-xs text-gray-500">{student.admissionNumber}</p>
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
//                       value={student.timesPresent ?? 0}
//                       disabled={!hasAttendanceAccess}
//                       onChange={(e) => updateAttendance(student.studentId, e.target.value)}
//                       className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-6 flex items-center justify-center gap-2">
//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
//                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
//                 >
//                   Prev
//                 </button>

//                 <span className="text-sm text-gray-600">
//                   {currentPage} / {totalPages}
//                 </span>

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setCurrentPage((page) => Math.min(page + 1, totalPages))
//                   }
//                   className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}

//             <div className="sticky bottom-0 mt-6 bg-white pt-4">
//               <button
//                 type="button"
//                 onClick={saveAttendance}
//                 disabled={!hasAttendanceAccess || saving}
//                 className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

// Helper: a field on the user doc might be a populated object ({ _id, name })
// or a raw ObjectId string. Normalize to a plain id string either way.
const idOf = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.$oid) return value.$oid;
  if (value._id) return String(value._id);
  return String(value);
};

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
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ------------------------------------------------------------------ */
  /* Access rules                                                       */
  /* ------------------------------------------------------------------ */
  // admin / super_admin / master_admin -> unrestricted, every dropdown open
  const isFullAccess = ["admin", "super_admin", "master_admin", "util_admin"].includes(
    user?.role
  );

  // principal -> locked to the "secondary" academic unit
  // head_teacher -> locked to the "primary" academic unit
  const restrictedUnitName =
    user?.role === "principal"
      ? "secondary"
      : user?.role === "head_teacher"
      ? "primary"
      : "";

  // A class teacher is any user with role "teacher", isClassTeacher true,
  // and a valid classTeacherOf.classId + armId (matches the sample user doc).
  const isClassTeacherOnly =
    user?.role === "teacher" &&
    user?.isClassTeacher === true &&
    !!idOf(user?.classTeacherOf?.classId) &&
    !!idOf(user?.classTeacherOf?.armId);

  // The user doc stores academicUnitId at the TOP level (not nested inside
  // classTeacherOf), per the sample record. Fall back to a nested value
  // in case some records do carry it there.
  const assignedAcademicUnitId =
    idOf(user?.academicUnitId) || idOf(user?.classTeacherOf?.academicUnitId);

  const assignedClassId = idOf(user?.classTeacherOf?.classId);
  const assignedArmId = idOf(user?.classTeacherOf?.armId);

  // Does this role have any restriction at all on the page?
  const isRestrictedRole =
    !isFullAccess && (isClassTeacherOnly || !!restrictedUnitName);

  // Academic unit dropdown is locked (pre-selected, disabled) for anyone
  // who isn't full-access.
  const isAcademicUnitLocked = !isFullAccess && isRestrictedRole;

  const hasAttendanceAccess = isFullAccess || isRestrictedRole;

  /* ------------------------------------------------------------------ */
  /* Derived data                                                       */
  /* ------------------------------------------------------------------ */
  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;

    if (isClassTeacherOnly && assignedAcademicUnitId) {
      return academicUnits.filter(
        (unit) => String(unit._id) === String(assignedAcademicUnitId)
      );
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

  const selectedAcademicUnitObj = useMemo(
    () =>
      academicUnits.find(
        (unit) => String(unit._id) === String(selectedAcademicUnit)
      ),
    [academicUnits, selectedAcademicUnit]
  );

  const selectedClassObj = useMemo(
    () => classes.find((cls) => String(cls._id) === String(selectedClass)),
    [classes, selectedClass]
  );

  /* ------------------------------------------------------------------ */
  /* Load active session / term                                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchActiveSessionAndTerm = async () => {
      try {
        setError("");

        const res = await api.get("/sessions/active");
        const payload = getApiData(res);

        setActiveSession(
          payload?.session || res.data?.session || payload?.activeSession || null
        );
        setActiveTerm(
          payload?.term || res.data?.term || payload?.activeTerm || null
        );
      } catch (err) {
        console.error("Fetch active session error:", err);
        setError(err.response?.data?.message || "Failed to load active session.");
      }
    };

    fetchActiveSessionAndTerm();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Load academic units, then pre-select based on role                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchAcademicUnits = async () => {
      try {
        setLoadingUnits(true);
        setError("");

        const res = await api.get("/academic-units");
        const payload = getApiData(res);
        const units = Array.isArray(payload) ? payload : [];

        setAcademicUnits(units);
      } catch (err) {
        console.error("Fetch academic units error:", err);
        setAcademicUnits([]);
        setError(err.response?.data?.message || "Failed to fetch academic units.");
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchAcademicUnits();
  }, []);

  // Auto-select the academic unit once the list has loaded and (for class
  // teachers) once the assigned unit id is available on the user payload.
  useEffect(() => {
    if (academicUnits.length === 0) return;

    if (isClassTeacherOnly) {
      if (assignedAcademicUnitId) {
        setSelectedAcademicUnit(assignedAcademicUnitId);
      }
      return;
    }

    if (!isFullAccess && restrictedUnitName) {
      const allowedUnit = academicUnits.find((unit) =>
        unit.name?.toLowerCase().includes(restrictedUnitName)
      );

      if (allowedUnit) {
        setSelectedAcademicUnit(allowedUnit._id);
      } else {
        setError(
          `No "${restrictedUnitName}" academic unit was found for your role.`
        );
      }
    }
  }, [
    academicUnits,
    isFullAccess,
    isClassTeacherOnly,
    assignedAcademicUnitId,
    restrictedUnitName,
  ]);

  /* ------------------------------------------------------------------ */
  /* Load classes for the selected academic unit                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedAcademicUnit) {
        setClasses([]);
        setArms([]);
        setSelectedClass("");
        setSelectedArm("");
        return;
      }

      try {
        setLoadingClasses(true);
        setError("");

        const res = await api.get("/classes", {
          params: { academicUnitId: selectedAcademicUnit },
        });

        const payload = getApiData(res);
        const allClasses = Array.isArray(payload) ? payload : [];

        if (isClassTeacherOnly) {
          const assignedClass = allClasses.find(
            (cls) => String(cls._id) === String(assignedClassId)
          );

          if (!assignedClass) {
            setError("Your assigned class was not found in this academic unit.");
            setClasses([]);
            setArms([]);
            return;
          }

          const classArms = assignedClass.arms || assignedClass.armsList || [];
          const assignedArm = classArms.find(
            (arm) => String(arm._id) === String(assignedArmId)
          );

          setClasses([assignedClass]);
          setArms(Array.isArray(classArms) ? classArms : []);
          setSelectedClass(assignedClass._id);

          if (assignedArm) {
            setSelectedArm(assignedArm._id);
          } else {
            setError("Your assigned arm was not found on your assigned class.");
          }

          return;
        }

        setClasses(allClasses);
      } catch (err) {
        console.error("Fetch classes error:", err);
        setClasses([]);
        setArms([]);
        setSelectedClass("");
        setSelectedArm("");
        setError(err.response?.data?.message || "Failed to fetch classes.");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit, isClassTeacherOnly, assignedClassId, assignedArmId]);

  /* ------------------------------------------------------------------ */
  /* Keep arms in sync when a non-class-teacher picks a class manually  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!selectedClass) {
      setArms([]);
      setSelectedArm("");
      return;
    }

    const classArms = selectedClassObj?.arms || selectedClassObj?.armsList || [];
    setArms(Array.isArray(classArms) ? classArms : []);

    if (!isClassTeacherOnly) {
      setSelectedArm("");
      setAttendance([]);
      setTimesOpened(0);
      setCurrentPage(1);
    }
  }, [selectedClass, selectedClassObj, isClassTeacherOnly]);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                            */
  /* ------------------------------------------------------------------ */
  const resetAttendanceData = () => {
    setAttendance([]);
    setTimesOpened(0);
    setSearch("");
    setCurrentPage(1);
    setSuccess("");
  };

  const handleAcademicUnitChange = (academicUnitId) => {
    if (isAcademicUnitLocked) return;
    setSelectedAcademicUnit(academicUnitId);
    setSelectedClass("");
    setSelectedArm("");
    setClasses([]);
    setArms([]);
    resetAttendanceData();
    setError("");
  };

  const handleClassChange = (classId) => {
    if (isClassTeacherOnly) return;
    setSelectedClass(classId);
    setSelectedArm("");
    setArms([]);
    resetAttendanceData();
    setError("");
  };

  const handleArmChange = (armId) => {
    if (isClassTeacherOnly) return;
    setSelectedArm(armId);
    resetAttendanceData();
    setError("");
  };

  const fetchAttendance = async () => {
    if (!hasAttendanceAccess) {
      setError("You do not have permission to manage attendance.");
      return;
    }

    if (
      !selectedAcademicUnit ||
      !selectedClass ||
      !selectedArm ||
      !activeSession?._id ||
      !activeTerm?._id
    ) {
      setError(
        "Please select academic unit, class and arm. An active session and term are also required."
      );
      return;
    }

    try {
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

      setAttendance(Array.isArray(payload?.records) ? payload.records : []);
      setTimesOpened(Number(payload?.timesOpened || 0));
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch attendance error:", err);
      setAttendance([]);
      setTimesOpened(0);
      setError(err.response?.data?.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  // Class teachers land on a fixed class/arm automatically, so auto-load
  // their attendance once everything required is resolved.
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

    if (Number.isNaN(numeric)) numeric = 0;
    if (numeric < 0) numeric = 0;
    if (numeric > timesOpened) numeric = timesOpened;

    setAttendance((prev) =>
      prev.map((student) =>
        String(student.studentId) === String(studentId)
          ? { ...student, timesPresent: numeric }
          : student
      )
    );
  };

  const saveAttendance = async () => {
    if (!hasAttendanceAccess) {
      setError("You do not have permission to manage attendance.");
      return;
    }

    if (
      !selectedAcademicUnit ||
      !selectedClass ||
      !selectedArm ||
      !activeSession?._id ||
      !activeTerm?._id
    ) {
      setError(
        "Please select academic unit, class and arm. An active session and term are also required."
      );
      return;
    }

    if (attendance.length === 0) {
      setError("There are no attendance records to save.");
      return;
    }

    try {
      setSaving(true);
      setSuccess("");
      setError("");

      await api.post("/attendance/summary", {
        academicUnitId: selectedAcademicUnit,
        classId: selectedClass,
        armId: selectedArm,
        sessionId: activeSession._id,
        termId: activeTerm._id,
        timesOpened: Number(timesOpened || 0),
        records: attendance.map((student) => ({
          studentId: student.studentId,
          timesPresent: Number(student.timesPresent || 0),
        })),
      });

      setSuccess("Attendance saved successfully.");
    } catch (err) {
      console.error("Save attendance error:", err);
      setError(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    if (!searchText) return attendance;

    return attendance.filter((student) => {
      const studentName = student.name?.toLowerCase() || "";
      const admissionNumber = student.admissionNumber?.toLowerCase() || "";
      return (
        studentName.includes(searchText) || admissionNumber.includes(searchText)
      );
    });
  }, [attendance, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAttendance.length / PAGE_SIZE));

  const paginatedAttendance = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAttendance.slice(start, start + PAGE_SIZE);
  }, [filteredAttendance, currentPage]);

  const dropdownsDisabled = !hasAttendanceAccess;

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-3 sm:p-5">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-lg font-bold text-green-700 sm:text-xl">
            Attendance Recording
          </h1>

          {activeSession && activeTerm ? (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Session: <b>{activeSession.name}</b> | Term: <b>{activeTerm.name}</b>
            </p>
          ) : (
            <p className="mt-1 text-xs text-red-500 sm:text-sm">
              No active session or term found.
            </p>
          )}

          {selectedAcademicUnitObj && isAcademicUnitLocked && (
            <p className="mt-2 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">
              Restricted View: {selectedAcademicUnitObj.name}
            </p>
          )}

          {isFullAccess && (
            <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
              Full access enabled. You can select any academic unit, class and arm.
            </p>
          )}

          {isClassTeacherOnly && (
            <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
              You can only manage attendance for your assigned class and arm.
            </p>
          )}

          {!isFullAccess && restrictedUnitName && !isClassTeacherOnly && (
            <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
              You can manage attendance for classes within the{" "}
              {restrictedUnitName} academic unit.
            </p>
          )}

          {!hasAttendanceAccess && (
            <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
              Your account does not have permission to manage attendance.
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
              onChange={(e) => handleAcademicUnitChange(e.target.value)}
              disabled={
                dropdownsDisabled ||
                isAcademicUnitLocked ||
                loadingUnits ||
                saving
              }
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {loadingUnits
                  ? "Loading Academic Units..."
                  : "Select Academic Unit"}
              </option>

              {visibleAcademicUnits.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              disabled={
                dropdownsDisabled ||
                isClassTeacherOnly ||
                !selectedAcademicUnit ||
                loadingClasses ||
                saving
              }
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {loadingClasses ? "Loading Classes..." : "Select Class"}
              </option>

              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <select
              value={selectedArm}
              onChange={(e) => handleArmChange(e.target.value)}
              disabled={
                dropdownsDisabled ||
                isClassTeacherOnly ||
                !selectedClass ||
                arms.length === 0 ||
                saving
              }
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
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
              disabled={!hasAttendanceAccess}
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={fetchAttendance}
              disabled={
                !hasAttendanceAccess ||
                !selectedAcademicUnit ||
                !selectedClass ||
                !selectedArm ||
                !activeSession?._id ||
                !activeTerm?._id ||
                loading
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading..." : isClassTeacherOnly ? "Reload" : "Load Attendance"}
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
              disabled={!hasAttendanceAccess}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value) || 0);
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
              className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100 sm:w-40"
            />
          </div>
        )}

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading attendance...
          </div>
        )}

        {!loading && hasAttendanceAccess && attendance.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
            {isClassTeacherOnly
              ? "No attendance records found for your assigned class."
              : "Select academic unit, class and arm, then click Load Attendance."}
          </div>
        )}

        {!loading && !hasAttendanceAccess && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
            Your account does not have permission to manage attendance.
          </div>
        )}

        {!loading && attendance.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-green-700">Student Attendance</h2>
              <span className="text-xs text-gray-500">
                {filteredAttendance.length} students
              </span>
            </div>

            <div className="space-y-3">
              {paginatedAttendance.map((student) => (
                <div key={student.studentId} className="rounded-xl border bg-gray-50 p-3">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                      {student.image && (
                        <img
                          src={student.image}
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.admissionNumber}</p>
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
                      value={student.timesPresent ?? 0}
                      disabled={!hasAttendanceAccess}
                      onChange={(e) => updateAttendance(student.studentId, e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(page + 1, totalPages))
                  }
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}

            <div className="sticky bottom-0 mt-6 bg-white pt-4">
              <button
                type="button"
                onClick={saveAttendance}
                disabled={!hasAttendanceAccess || saving}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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