
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import api from "../../api/axios";

// const DeleteResultPage = () => {
//   const { user } = useAuth();

//   // Data states
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [arms, setArms] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [results, setResults] = useState([]);

//   // Selected items
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedArm, setSelectedArm] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   // View mode: 'by-selection' or 'by-student'
//   const [viewMode, setViewMode] = useState("by-selection");

//   // Active session and term
//   const [activeSession, setActiveSession] = useState(null);
//   const [activeTerm, setActiveTerm] = useState(null);

//   // Loading states
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [loadingClasses, setLoadingClasses] = useState(false);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [loadingResults, setLoadingResults] = useState(false);
//   const [deletingResults, setDeletingResults] = useState(false);
//   const [deletingSingle, setDeletingSingle] = useState(null);

//   // -------------------------
//   // Fetch Active Session & Term
//   // -------------------------
//   useEffect(() => {
//     const fetchActiveSessionTerm = async () => {
//       try {
//         const res = await api.get("/sessions/active");
//         setActiveSession(res.data.session);
//         setActiveTerm(res.data.term);
//       } catch (err) {
//         console.error("Error fetching active session/term:", err);
//         alert("Please set active session and term first.");
//       }
//     };
//     fetchActiveSessionTerm();
//   }, []);

//   // -------------------------
//   // Fetch Subjects
//   // -------------------------
//   useEffect(() => {
//     if (!user) return;
//     const fetchSubjects = async () => {
//       try {
//         setLoadingSubjects(true);
//         let res;
//         if (["admin", "super_admin", "principal", "master_admin"].includes(user.role)) {
//           res = await api.get("/subjects");
//         } else if (user.role === "teacher") {
//           res = await api.get(`/teacher-assignments/${user._id}/subjects`);
//         }
//         setSubjects(res?.data || []);
//       } catch (err) {
//         console.error("Error fetching subjects:", err);
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };
//     fetchSubjects();
//   }, [user]);

//   // -------------------------
//   // Reset everything when view mode changes
//   // -------------------------
//   useEffect(() => {
//     setSelectedSubject(null);
//     setSelectedClass(null);
//     setSelectedArm(null);
//     setSelectedStudent(null);
//     setClasses([]);
//     setArms([]);
//     setStudents([]);
//     setResults([]);
//   }, [viewMode]);

//   // -------------------------
//   // Handlers for BY SELECTION mode
//   // -------------------------
//   const handleSubjectSelect = async (subject) => {
//     setSelectedSubject(subject);
//     setSelectedClass(null);
//     setSelectedArm(null);
//     setSelectedStudent(null);
//     setClasses([]);
//     setArms([]);
//     setStudents([]);
//     setResults([]);

//     // Fetch classes for both modes
//     try {
//       setLoadingClasses(true);
//       const subjectId = subject._id ?? subject.id ?? subject.subjectId;
//       const res = await api.get(`/subjects/${subjectId}/classes`);
//       setClasses(res.data || []);
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//     } finally {
//       setLoadingClasses(false);
//     }
//   };

//   const handleClassSelect = async (cls) => {
//     setSelectedClass(cls);
//     setSelectedArm(null);
//     setResults([]);

//     if (viewMode === "by-selection") {
//       setArms(cls.arms ?? cls.armsList ?? []);
//     } else if (viewMode === "by-student") {
//       // Fetch students for this class
//       try {
//         setLoadingStudents(true);
//         const classId = cls._id ?? cls.id ?? cls.classId;
//         const res = await api.get(`/students?classId=${classId}&sessionId=${activeSession._id}`);
//         setStudents(res.data || []);
//       } catch (err) {
//         console.error("Error fetching students:", err);
//       } finally {
//         setLoadingStudents(false);
//       }
//     }
//   };

//   const handleArmSelect = async (arm) => {
//     setSelectedArm(arm);
//     setResults([]);

//     if (!selectedClass || !selectedSubject || !activeSession || !activeTerm) {
//       console.error("Missing IDs, cannot fetch results");
//       return;
//     }

//     try {
//       setLoadingResults(true);

//       const classId = selectedClass?._id ?? selectedClass?.id ?? selectedClass?.classId;
//       const armId = arm?._id ?? arm?.id ?? arm?.armId;
//       const subjectId = selectedSubject?._id ?? selectedSubject?.id ?? selectedSubject?.subjectId;
//       const sessionId = activeSession?._id;
//       const termId = activeTerm?._id;

//       // Fetch existing results
//       const resultRes = await api.get("/results/by-subject", {
//         params: { classId, armId, subjectId, sessionId, termId },
//       });
      
//       setResults(resultRes.data || []);
//     } catch (err) {
//       console.error("Error fetching results:", err);
//     } finally {
//       setLoadingResults(false);
//     }
//   };

//   // -------------------------
//   // Handlers for BY STUDENT mode
//   // -------------------------
//   const handleStudentSelect = async (student) => {
//     setSelectedStudent(student);
//     setResults([]);

//     if (!selectedSubject || !activeSession || !activeTerm) {
//       console.error("Missing IDs, cannot fetch student results");
//       return;
//     }

//     try {
//       setLoadingResults(true);

//       const studentId = student.studentId?._id ?? student.studentId?.id ?? student.studentId;
//       const subjectId = selectedSubject?._id ?? selectedSubject?.id ?? selectedSubject?.subjectId;
//       const sessionId = activeSession?._id;
//       const termId = activeTerm?._id;

//       // Fetch results for this specific student and subject
//       const resultRes = await api.get("/results/by-student", {
//         params: { studentId, subjectId, sessionId, termId },
//       });
      
//       setResults(resultRes.data || []);
//     } catch (err) {
//       console.error("Error fetching student results:", err);
//     } finally {
//       setLoadingResults(false);
//     }
//   };

//   // -------------------------
//   // Delete Handlers
//   // -------------------------
//   const handleDeleteAll = async () => {
//     if (!activeSession || !activeTerm || !selectedSubject || !selectedClass || !selectedArm) {
//       alert("Please select all filters first!");
//       return;
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to delete ALL results for:\n\n` +
//       `Subject: ${selectedSubject.name ?? selectedSubject.title}\n` +
//       `Class: ${selectedClass.name ?? selectedClass.className}\n` +
//       `Arm: ${selectedArm.name ?? selectedArm.armName}\n` +
//       `Session: ${activeSession.name}\n` +
//       `Term: ${activeTerm.name}\n\n` +
//       `This action cannot be undone!`
//     );

//     if (!confirmed) return;

//     try {
//       setDeletingResults(true);

//       const subjectId = selectedSubject?._id ?? selectedSubject?.id ?? selectedSubject?.subjectId;
//       const classId = selectedClass?._id ?? selectedClass?.id ?? selectedClass?.classId;
//       const armId = selectedArm?._id ?? selectedArm?.id ?? selectedArm?.armId;

//       const res = await api.delete("/results/by-selection", {
//         data: {
//           subjectId,
//           classId,
//           armId,
//           sessionId: activeSession._id,
//           termId: activeTerm._id,
//         },
//       });

//       alert(res.data.message || "Results deleted successfully!");
      
//       // Refresh the results list
//       handleArmSelect(selectedArm);
//     } catch (err) {
//       console.error("Error deleting results:", err);
//       alert(err.response?.data?.message || "Failed to delete results.");
//     } finally {
//       setDeletingResults(false);
//     }
//   };

//   const handleDeleteSingle = async (resultId, studentName) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete the result for ${studentName}?\n\n` +
//       `This action cannot be undone!`
//     );

//     if (!confirmed) return;

//     try {
//       setDeletingSingle(resultId);

//       await api.delete(`/results/${resultId}`);

//       alert("Result deleted successfully!");
      
//       // Remove from local state
//       setResults(prev => prev.filter(r => (r._id ?? r.id) !== resultId));
//     } catch (err) {
//       console.error("Error deleting single result:", err);
//       alert(err.response?.data?.message || "Failed to delete result.");
//     } finally {
//       setDeletingSingle(null);
//     }
//   };

//   // -------------------------
//   // Calculate total score
//   // -------------------------
//   const calculateTotal = (result) => {
//     const ca1 = result.ca1 || 0;
//     const ca2 = result.ca2 || 0;
//     const ca3 = result.ca3 || 0;
//     const ca4 = result.ca4 || 0;
//     const exam = result.exam || 0;
//     return ca1 + ca2 + ca3 + ca4 + exam;
//   };

//   // -------------------------
//   // Render
//   // -------------------------
//   return (
//     <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
//       <h2 className="text-2xl font-bold text-center text-red-700 mb-3">
//         Delete Results
//       </h2>

//       {activeSession && activeTerm && (
//         <p className="text-center text-gray-600 mb-4">
//           Active Session: <b>{activeSession.name}</b> | Term: <b>{activeTerm.name}</b>
//         </p>
//       )}

//       {/* VIEW MODE SELECTOR */}
//       <div className="mb-6 flex justify-center gap-3">
//         <button
//           onClick={() => setViewMode("by-selection")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             viewMode === "by-selection"
//               ? "bg-blue-600 text-white"
//               : "bg-white border border-gray-300 text-gray-700"
//           }`}
//         >
//           View by Class/Arm
//         </button>
//         <button
//           onClick={() => setViewMode("by-student")}
//           className={`px-4 py-2 rounded-lg font-semibold ${
//             viewMode === "by-student"
//               ? "bg-blue-600 text-white"
//               : "bg-white border border-gray-300 text-gray-700"
//           }`}
//         >
//           View by Student
//         </button>
//       </div>

//       {/* SUBJECTS */}
//       <div className="mb-4">
//         <h3 className="font-semibold text-green-700 mb-2">Select Subject</h3>
//         <div className="flex gap-2 flex-wrap">
//           {loadingSubjects ? (
//             <span>Loading subjects...</span>
//           ) : subjects.length === 0 ? (
//             <span>No subjects found</span>
//           ) : (
//             subjects.map((subj, idx) => (
//               <button
//                 key={subj._id ?? subj.id ?? subj.subjectId ?? `subject-${idx}`}
//                 onClick={() => handleSubjectSelect(subj)}
//                 disabled={loadingClasses || loadingResults || deletingResults || loadingStudents}
//                 className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                   (selectedSubject?._id ?? selectedSubject?.id ?? selectedSubject?.subjectId) ===
//                   (subj._id ?? subj.id ?? subj.subjectId)
//                     ? "bg-green-600 text-white"
//                     : "bg-white border border-gray-300 text-gray-700"
//                 }`}
//               >
//                 {subj.name ?? subj.title}
//               </button>
//             ))
//           )}
//         </div>
//       </div>

//       {/* BY SELECTION MODE */}
//       {viewMode === "by-selection" && selectedSubject && (
//         <>
//           {/* CLASSES */}
//           <div className="mb-4">
//             <h3 className="font-semibold text-purple-700 mb-2">Select Class</h3>
//             <div className="flex gap-2 flex-wrap">
//               {loadingClasses ? (
//                 <span>Loading classes...</span>
//               ) : classes.length === 0 ? (
//                 <span>No classes found</span>
//               ) : (
//                 classes.map((cls, idx) => (
//                   <button
//                     key={cls._id ?? cls.id ?? cls.classId ?? `class-${idx}`}
//                     onClick={() => handleClassSelect(cls)}
//                     disabled={loadingResults || deletingResults}
//                     className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                       (selectedClass?._id ?? selectedClass?.id ?? selectedClass?.classId) ===
//                       (cls._id ?? cls.id ?? cls.classId)
//                         ? "bg-purple-600 text-white"
//                         : "bg-white border border-gray-300 text-gray-700"
//                     }`}
//                   >
//                     {cls.name ?? cls.className}
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* ARMS */}
//           {selectedClass && (
//             <div className="mb-4">
//               <h3 className="font-semibold text-blue-700 mb-2">Select Arm</h3>
//               <div className="flex gap-2 flex-wrap">
//                 {loadingResults ? (
//                   <span>Loading arms...</span>
//                 ) : arms.length === 0 ? (
//                   <span>No arms found for this class</span>
//                 ) : (
//                   arms.map((arm, idx) => (
//                     <button
//                       key={arm._id ?? arm.id ?? arm.armId ?? `arm-${idx}`}
//                       onClick={() => handleArmSelect(arm)}
//                       disabled={deletingResults}
//                       className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                         (selectedArm?._id ?? selectedArm?.id ?? selectedArm?.armId) ===
//                         (arm._id ?? arm.id ?? arm.armId)
//                           ? "bg-blue-600 text-white"
//                           : "bg-white border border-gray-300 text-gray-700"
//                       }`}
//                     >
//                       {arm.name ?? arm.armName}
//                     </button>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* BY STUDENT MODE */}
//       {viewMode === "by-student" && selectedSubject && (
//         <>
//           {/* CLASSES - for student filtering */}
//           <div className="mb-4">
//             <h3 className="font-semibold text-purple-700 mb-2">Select Class</h3>
//             <div className="flex gap-2 flex-wrap">
//               {loadingClasses ? (
//                 <span>Loading classes...</span>
//               ) : classes.length === 0 ? (
//                 <span>No classes found</span>
//               ) : (
//                 classes.map((cls, idx) => (
//                   <button
//                     key={cls._id ?? cls.id ?? cls.classId ?? `class-${idx}`}
//                     onClick={() => handleClassSelect(cls)}
//                     disabled={loadingStudents || loadingResults || deletingResults}
//                     className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                       (selectedClass?._id ?? selectedClass?.id ?? selectedClass?.classId) ===
//                       (cls._id ?? cls.id ?? cls.classId)
//                         ? "bg-purple-600 text-white"
//                         : "bg-white border border-gray-300 text-gray-700"
//                     }`}
//                   >
//                     {cls.name ?? cls.className}
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* STUDENTS */}
//           {selectedClass && (
//             <div className="mb-4">
//               <h3 className="font-semibold text-orange-700 mb-2">Select Student</h3>
//               <div className="flex gap-2 flex-wrap max-h-60 overflow-y-auto">
//                 {loadingStudents ? (
//                   <span>Loading students...</span>
//                 ) : students.length === 0 ? (
//                   <span>No students found</span>
//                 ) : (
//                   students.map((student, idx) => {
//                     const studentId = student.studentId?._id ?? student.studentId?.id ?? student.studentId;
//                     const studentName = student.studentId?.name ?? student.name ?? "Unknown";
//                     return (
//                       <button
//                         key={studentId ?? `student-${idx}`}
//                         onClick={() => handleStudentSelect(student)}
//                         disabled={loadingResults || deletingResults}
//                         className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
//                           (selectedStudent?.studentId?._id ?? selectedStudent?.studentId?.id ?? selectedStudent?.studentId) === studentId
//                             ? "bg-orange-600 text-white"
//                             : "bg-white border border-gray-300 text-gray-700"
//                         }`}
//                       >
//                         {studentName}
//                       </button>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* RESULTS TABLE */}
//       {((viewMode === "by-selection" && selectedArm) || (viewMode === "by-student" && selectedStudent)) && (
//         <div className="mt-4 bg-white shadow-md rounded-lg p-4">
//           {loadingResults ? (
//             <p className="text-center text-blue-600">Loading results...</p>
//           ) : results.length === 0 ? (
//             <p className="text-center text-gray-600 py-6">
//               No results found for this selection.
//             </p>
//           ) : (
//             <>
//               <div className="mb-4 flex justify-between items-center">
//                 <p className="text-gray-700 font-semibold">
//                   Found {results.length} result(s)
//                 </p>
//                 {viewMode === "by-selection" && (
//                   <button
//                     onClick={handleDeleteAll}
//                     disabled={deletingResults}
//                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 font-semibold"
//                   >
//                     {deletingResults ? "Deleting..." : "Delete All Results"}
//                   </button>
//                 )}
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse border text-sm">
//                   <thead>
//                     <tr className="bg-red-600 text-white text-center">
//                       <th className="border p-2 text-left">Student</th>
//                       <th className="border p-2">CA1</th>
//                       <th className="border p-2">CA2</th>
//                       <th className="border p-2">CA3</th>
//                       <th className="border p-2">CA4</th>
//                       <th className="border p-2">Exam</th>
//                       <th className="border p-2">Total</th>
//                       <th className="border p-2">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {results.map((result) => {
//                       // Handle different response structures
//                       const student = result.student ?? result.enrollmentId?.studentId;
//                       const studentName = student?.name ?? "Unknown";
//                       const total = result.total ?? calculateTotal(result);
//                       const resultId = result._id ?? result.id;

//                       return (
//                         <tr key={resultId} className="odd:bg-gray-50 text-center">
//                           <td className="border p-2 text-left">{studentName}</td>
//                           <td className="border p-2">{result.ca1 ?? "-"}</td>
//                           <td className="border p-2">{result.ca2 ?? "-"}</td>
//                           <td className="border p-2">{result.ca3 ?? "-"}</td>
//                           <td className="border p-2">{result.ca4 ?? "-"}</td>
//                           <td className="border p-2">{result.exam ?? "-"}</td>
//                           <td className="border p-2 font-semibold">{total}</td>
//                           <td className="border p-2">
//                             <button
//                               onClick={() => handleDeleteSingle(resultId, studentName)}
//                               disabled={deletingSingle === resultId}
//                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
//                             >
//                               {deletingSingle === resultId ? "Deleting..." : "Delete"}
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeleteResultPage;

import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

const getId = (item) =>
  item?._id ?? item?.id ?? item?.subjectId ?? item?.classId ?? item?.armId ?? "";

const DeleteResultPage = () => {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [arms, setArms] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewMode, setViewMode] = useState("by-selection");

  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [deletingResults, setDeletingResults] = useState(false);
  const [deletingSingle, setDeletingSingle] = useState(null);

  useEffect(() => {
    const fetchActiveSessionTerm = async () => {
      try {
        const res = await api.get("/sessions/active");
        setActiveSession(res.data.session);
        setActiveTerm(res.data.term);
      } catch (err) {
        console.error("Error fetching active session/term:", err);
        alert("Please set active session and term first.");
      }
    };

    fetchActiveSessionTerm();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        const res = await api.get("/academic-units");
        const payload = getApiData(res);
        setAcademicUnits(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching academic units:", err);
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchUnits();
  }, []);

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
            params: { academicUnitId: getId(selectedAcademicUnit) },
          });
        } else {
          res = await api.get("/subjects", {
            params: { academicUnitId: getId(selectedAcademicUnit) },
          });
        }

        const payload = getApiData(res);
        setSubjects(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
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
          params: { academicUnitId: getId(selectedAcademicUnit) },
        });

        const payload = getApiData(res);
        setClasses(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit]);

  useEffect(() => {
    setSelectedSubject(null);
    setSelectedClass(null);
    setSelectedArm(null);
    setSelectedStudent(null);
    setArms([]);
    setStudents([]);
    setResults([]);
  }, [viewMode]);

  const resetBelowUnit = () => {
    setSelectedSubject(null);
    setSelectedClass(null);
    setSelectedArm(null);
    setSelectedStudent(null);
    setArms([]);
    setStudents([]);
    setResults([]);
  };

  const handleAcademicUnitSelect = (unit) => {
    setSelectedAcademicUnit(unit);
    resetBelowUnit();
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedClass(null);
    setSelectedArm(null);
    setSelectedStudent(null);
    setArms([]);
    setStudents([]);
    setResults([]);
  };

  const handleClassSelect = async (cls) => {
    setSelectedClass(cls);
    setSelectedArm(null);
    setSelectedStudent(null);
    setResults([]);

    if (viewMode === "by-selection") {
      setArms(cls?.arms ?? cls?.armsList ?? []);
      return;
    }

    if (viewMode === "by-student") {
      try {
        setLoadingStudents(true);

        const res = await api.get("/students", {
          params: {
            academicUnitId: getId(selectedAcademicUnit),
            classId: getId(cls),
            sessionId: activeSession?._id,
          },
        });

        const payload = getApiData(res);
        setStudents(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    }
  };

  const handleArmSelect = async (arm) => {
    setSelectedArm(arm);
    setResults([]);

    if (
      !selectedAcademicUnit ||
      !selectedClass ||
      !selectedSubject ||
      !activeSession ||
      !activeTerm
    ) {
      return;
    }

    try {
      setLoadingResults(true);

      const res = await api.get("/results/by-subject", {
        params: {
          academicUnitId: getId(selectedAcademicUnit),
          classId: getId(selectedClass),
          armId: getId(arm),
          subjectId: getId(selectedSubject),
          sessionId: activeSession._id,
          termId: activeTerm._id,
        },
      });

      const payload = getApiData(res);
      setResults(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    setResults([]);

    if (!selectedAcademicUnit || !selectedSubject || !activeSession || !activeTerm) {
      return;
    }

    try {
      setLoadingResults(true);

      const studentId =
        student.studentId?._id ?? student.studentId?.id ?? student.studentId?._id ?? student._id;

      const res = await api.get("/results/by-student", {
        params: {
          academicUnitId: getId(selectedAcademicUnit),
          studentId,
          subjectId: getId(selectedSubject),
          sessionId: activeSession._id,
          termId: activeTerm._id,
        },
      });

      const payload = getApiData(res);

      const flatResults = [];

      if (Array.isArray(payload?.results)) {
        payload.results.forEach((termGroup) => {
          (termGroup.subjects || []).forEach((sub) => {
            if (
              sub.subjectId === getId(selectedSubject) ||
              sub.subject === selectedSubject?.name
            ) {
              flatResults.push({
                ...sub,
                student: student.studentId || student,
                session: termGroup.session,
                term: termGroup.term,
                class: termGroup.class,
                arm: termGroup.arm,
              });
            }
          });
        });
      } else if (Array.isArray(payload)) {
        flatResults.push(...payload);
      }

      setResults(flatResults);
    } catch (err) {
      console.error("Error fetching student results:", err);
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !selectedAcademicUnit ||
      !activeSession ||
      !activeTerm ||
      !selectedSubject ||
      !selectedClass ||
      !selectedArm
    ) {
      alert("Please select all filters first!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ALL results for:\n\n` +
        `Academic Unit: ${selectedAcademicUnit.name}\n` +
        `Subject: ${selectedSubject.name ?? selectedSubject.title}\n` +
        `Class: ${selectedClass.name ?? selectedClass.className}\n` +
        `Arm: ${selectedArm.name ?? selectedArm.armName}\n` +
        `Session: ${activeSession.name}\n` +
        `Term: ${activeTerm.name}\n\n` +
        `This action cannot be undone!`
    );

    if (!confirmed) return;

    try {
      setDeletingResults(true);

      const res = await api.delete("/results/by-selection", {
        data: {
          academicUnitId: getId(selectedAcademicUnit),
          subjectId: getId(selectedSubject),
          classId: getId(selectedClass),
          armId: getId(selectedArm),
          sessionId: activeSession._id,
          termId: activeTerm._id,
        },
      });

      alert(res.data.message || "Results deleted successfully!");
      handleArmSelect(selectedArm);
    } catch (err) {
      console.error("Error deleting results:", err);
      alert(err.response?.data?.message || "Failed to delete results.");
    } finally {
      setDeletingResults(false);
    }
  };

  const handleDeleteSingle = async (resultId, studentName) => {
    if (!resultId) {
      alert("Result ID missing. Backend must return _id for each result row.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the result for ${studentName}?\n\nThis action cannot be undone!`
    );

    if (!confirmed) return;

    try {
      setDeletingSingle(resultId);

      await api.delete(`/results/${resultId}`);

      alert("Result deleted successfully!");
      setResults((prev) => prev.filter((r) => (r._id ?? r.id) !== resultId));
    } catch (err) {
      console.error("Error deleting single result:", err);
      alert(err.response?.data?.message || "Failed to delete result.");
    } finally {
      setDeletingSingle(null);
    }
  };

  const calculateTotal = (result) => {
    return (
      Number(result.ca1 || 0) +
      Number(result.ca2 || 0) +
      Number(result.ca3 || 0) +
      Number(result.ca4 || 0) +
      Number(result.exam || 0)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h2 className="mb-3 text-center text-2xl font-bold text-red-700">
        Delete Results
      </h2>

      {activeSession && activeTerm && (
        <p className="mb-4 text-center text-gray-600">
          Active Session: <b>{activeSession.name}</b> | Term:{" "}
          <b>{activeTerm.name}</b>
        </p>
      )}

      <div className="mb-6 flex justify-center gap-3">
        <button
          onClick={() => setViewMode("by-selection")}
          className={`rounded-lg px-4 py-2 font-semibold ${
            viewMode === "by-selection"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700"
          }`}
        >
          View by Class/Arm
        </button>

        <button
          onClick={() => setViewMode("by-student")}
          className={`rounded-lg px-4 py-2 font-semibold ${
            viewMode === "by-student"
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700"
          }`}
        >
          View by Student
        </button>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 font-semibold text-gray-700">
          Select Academic Unit
        </h3>

        <div className="flex flex-wrap gap-2">
          {loadingUnits ? (
            <span>Loading academic units...</span>
          ) : academicUnits.length === 0 ? (
            <span>No academic units found</span>
          ) : (
            academicUnits.map((unit) => (
              <button
                key={unit._id}
                onClick={() => handleAcademicUnitSelect(unit)}
                className={`rounded px-3 py-1 text-sm ${
                  selectedAcademicUnit?._id === unit._id
                    ? "bg-gray-800 text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {unit.name}
              </button>
            ))
          )}
        </div>
      </div>

      {selectedAcademicUnit && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-green-700">Select Subject</h3>

          <div className="flex flex-wrap gap-2">
            {loadingSubjects ? (
              <span>Loading subjects...</span>
            ) : subjects.length === 0 ? (
              <span>No subjects found</span>
            ) : (
              subjects.map((subj, idx) => (
                <button
                  key={getId(subj) || `subject-${idx}`}
                  onClick={() => handleSubjectSelect(subj)}
                  disabled={
                    loadingClasses ||
                    loadingResults ||
                    deletingResults ||
                    loadingStudents
                  }
                  className={`rounded px-3 py-1 text-sm whitespace-nowrap ${
                    getId(selectedSubject) === getId(subj)
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {subj.name ?? subj.title}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {selectedSubject && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-purple-700">Select Class</h3>

          <div className="flex flex-wrap gap-2">
            {loadingClasses ? (
              <span>Loading classes...</span>
            ) : classes.length === 0 ? (
              <span>No classes found</span>
            ) : (
              classes.map((cls, idx) => (
                <button
                  key={getId(cls) || `class-${idx}`}
                  onClick={() => handleClassSelect(cls)}
                  disabled={loadingStudents || loadingResults || deletingResults}
                  className={`rounded px-3 py-1 text-sm whitespace-nowrap ${
                    getId(selectedClass) === getId(cls)
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {cls.name ?? cls.className}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {viewMode === "by-selection" && selectedClass && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-blue-700">Select Arm</h3>

          <div className="flex flex-wrap gap-2">
            {arms.length === 0 ? (
              <span>No arms found for this class</span>
            ) : (
              arms.map((arm, idx) => (
                <button
                  key={getId(arm) || `arm-${idx}`}
                  onClick={() => handleArmSelect(arm)}
                  disabled={deletingResults}
                  className={`rounded px-3 py-1 text-sm whitespace-nowrap ${
                    getId(selectedArm) === getId(arm)
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {arm.name ?? arm.armName}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {viewMode === "by-student" && selectedClass && (
        <div className="mb-4">
          <h3 className="mb-2 font-semibold text-orange-700">Select Student</h3>

          <div className="flex max-h-60 flex-wrap gap-2 overflow-y-auto">
            {loadingStudents ? (
              <span>Loading students...</span>
            ) : students.length === 0 ? (
              <span>No students found</span>
            ) : (
              students.map((student, idx) => {
                const studentId =
                  student.studentId?._id ??
                  student.studentId?.id ??
                  student.studentId ??
                  student._id;

                const studentName =
                  student.studentId?.name ?? student.name ?? "Unknown";

                const selectedStudentId =
                  selectedStudent?.studentId?._id ??
                  selectedStudent?.studentId?.id ??
                  selectedStudent?.studentId ??
                  selectedStudent?._id;

                return (
                  <button
                    key={studentId || `student-${idx}`}
                    onClick={() => handleStudentSelect(student)}
                    disabled={loadingResults || deletingResults}
                    className={`rounded px-3 py-1 text-sm whitespace-nowrap ${
                      selectedStudentId === studentId
                        ? "bg-orange-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {studentName}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {((viewMode === "by-selection" && selectedArm) ||
        (viewMode === "by-student" && selectedStudent)) && (
        <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
          {loadingResults ? (
            <p className="text-center text-blue-600">Loading results...</p>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-gray-600">
              No results found for this selection.
            </p>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-gray-700">
                  Found {results.length} result(s)
                </p>

                {viewMode === "by-selection" && (
                  <button
                    onClick={handleDeleteAll}
                    disabled={deletingResults}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingResults ? "Deleting..." : "Delete All Results"}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                  <thead>
                    <tr className="bg-red-600 text-center text-white">
                      <th className="border p-2 text-left">Student</th>
                      <th className="border p-2">CA1</th>
                      <th className="border p-2">CA2</th>
                      <th className="border p-2">CA3</th>
                      <th className="border p-2">CA4</th>
                      <th className="border p-2">Exam</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result, index) => {
                      const student = result.student ?? result.enrollmentId?.studentId;
                      const studentName = student?.name ?? "Unknown";
                      const total = result.total ?? calculateTotal(result);
                      const resultId = result._id ?? result.id;

                      return (
                        <tr key={resultId || index} className="text-center odd:bg-gray-50">
                          <td className="border p-2 text-left">{studentName}</td>
                          <td className="border p-2">{result.ca1 ?? "-"}</td>
                          <td className="border p-2">{result.ca2 ?? "-"}</td>
                          <td className="border p-2">{result.ca3 ?? "-"}</td>
                          <td className="border p-2">{result.ca4 ?? "-"}</td>
                          <td className="border p-2">{result.exam ?? "-"}</td>
                          <td className="border p-2 font-semibold">{total}</td>
                          <td className="border p-2">
                            <button
                              onClick={() => handleDeleteSingle(resultId, studentName)}
                              disabled={deletingSingle === resultId}
                              className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
                            >
                              {deletingSingle === resultId ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeleteResultPage;