

// import React, { useEffect, useState, useRef } from "react";
// import api from "../../api/axios";

// const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

// export default function ViewResultsByClass() {
//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [results, setResults] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState(null);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [selectedTerm, setSelectedTerm] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedArm, setSelectedArm] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchInitial = async () => {
//       try {
//         const [unitRes, sessionRes] = await Promise.all([
//           api.get("/academic-units"),
//           api.get("/sessions"),
//         ]);

//         setAcademicUnits(getApiData(unitRes));
//         setSessions(getApiData(sessionRes));
//       } catch (err) {
//         console.error("Error fetching initial data:", err);
//       }
//     };

//     fetchInitial();
//   }, []);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const params = {};
//         if (selectedAcademicUnit?._id) {
//           params.academicUnitId = selectedAcademicUnit._id;
//         }

//         const res = await api.get("/classes", { params });
//         setClasses(getApiData(res));
//       } catch (err) {
//         console.error("Error fetching classes:", err);
//         setClasses([]);
//       }
//     };

//     fetchClasses();
//   }, [selectedAcademicUnit]);

//   const resetBelowUnit = () => {
//     setSelectedClass(null);
//     setSelectedArm(null);
//     setResults([]);
//     setSubjects([]);
//   };

//   const fetchResults = async () => {
//     if (
//       !selectedAcademicUnit ||
//       !selectedSession ||
//       !selectedTerm ||
//       !selectedClass ||
//       !selectedArm
//     ) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await api.get("/results/class/all-subjects", {
//         params: {
//           academicUnitId: selectedAcademicUnit._id,
//           classId: selectedClass._id,
//           armId: selectedArm._id,
//           sessionId: selectedSession._id,
//           termId: selectedTerm._id,
//         },
//       });

//       const payload = getApiData(res);
//       const data = Array.isArray(payload) ? payload : [];

//       const uniqueSubjects = [
//         ...new Set(data.flatMap((s) => s.subjects.map((sub) => sub.subject))),
//       ];

//       setSubjects(uniqueSubjects);
//       setResults(data);
//     } catch (err) {
//       console.error("Error fetching results:", err);
//       setResults([]);
//       setSubjects([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getGrade = (score) => {
//     if (score === "-" || isNaN(score)) return "-";
//     if (score >= 70) return "A";
//     if (score >= 60) return "B";
//     if (score >= 50) return "C";
//     if (score >= 45) return "D";
//     return "F";
//   };

//   const getGradeColor = (score) => {
//     if (score !== "-" && Number(score) <= 45) {
//       return "text-red-500 font-semibold";
//     }

//     return "";
//   };

//   const handlePrint = () => {
//     const printContents = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "width=1200,height=800");

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Class Results - ${selectedClass?.name}</title>
//           <style>
//             @page {
//               size: A4 landscape;
//               margin: 20px;
//             }

//             body {
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//               background: white;
//               padding: 10px;
//               font-family: Arial, sans-serif;
//             }

//             table {
//               width: 100%;
//               border-collapse: collapse;
//             }

//             th, td {
//               border: 1px solid #ddd;
//               padding: 4px;
//               font-size: 10px;
//             }

//             th.subject-header {
//               transform: rotate(-90deg);
//               white-space: nowrap;
//               text-align: center;
//               vertical-align: middle;
//             }
//           </style>
//         </head>
//         <body>${printContents}</body>
//       </html>
//     `);

//     const styles = Array.from(
//       document.querySelectorAll("style, link[rel='stylesheet']")
//     );

//     styles.forEach((styleEl) => {
//       printWindow.document.head.appendChild(styleEl.cloneNode(true));
//     });

//     printWindow.document.close();

//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//     };
//   };

//   return (
//     <div className="mx-auto max-w-6xl p-4 md:p-6">
//       <h2 className="mb-4 text-center text-lg font-bold text-purple-700 md:text-xl">
//         📘 View Results by Class
//       </h2>

//       <div className="mb-5 flex flex-wrap gap-2 overflow-x-auto rounded-lg bg-white p-3 shadow-sm">
//         <select
//           onChange={(e) => {
//             const unit = academicUnits.find((u) => u._id === e.target.value);
//             setSelectedAcademicUnit(unit || null);
//             resetBelowUnit();
//           }}
//           value={selectedAcademicUnit?._id || ""}
//           className="min-w-[160px] rounded border px-2 py-2 text-sm"
//         >
//           <option value="">Academic Unit</option>
//           {academicUnits.map((unit) => (
//             <option key={unit._id} value={unit._id}>
//               {unit.name}
//             </option>
//           ))}
//         </select>

//         <select
//           onChange={(e) => {
//             const session = sessions.find((s) => s._id === e.target.value);
//             setSelectedSession(session || null);
//             setSelectedTerm(null);
//             setResults([]);
//             setSubjects([]);
//           }}
//           value={selectedSession?._id || ""}
//           className="min-w-[130px] rounded border px-2 py-2 text-sm"
//         >
//           <option value="">Session</option>
//           {sessions.map((session) => (
//             <option key={session._id} value={session._id}>
//               {session.name}
//             </option>
//           ))}
//         </select>

//         <select
//           onChange={(e) => {
//             const term = selectedSession?.terms?.find(
//               (t) => t._id === e.target.value
//             );

//             setSelectedTerm(term || null);
//             setResults([]);
//             setSubjects([]);
//           }}
//           value={selectedTerm?._id || ""}
//           disabled={!selectedSession}
//           className="min-w-[110px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
//         >
//           <option value="">Term</option>
//           {(selectedSession?.terms || []).map((term) => (
//             <option key={term._id} value={term._id}>
//               {term.name}
//             </option>
//           ))}
//         </select>

//         <select
//           onChange={(e) => {
//             const cls = classes.find((c) => c._id === e.target.value);
//             setSelectedClass(cls || null);
//             setSelectedArm(null);
//             setResults([]);
//             setSubjects([]);
//           }}
//           value={selectedClass?._id || ""}
//           disabled={!selectedAcademicUnit || !selectedTerm}
//           className="min-w-[120px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
//         >
//           <option value="">Class</option>
//           {classes.map((cls) => (
//             <option key={cls._id} value={cls._id}>
//               {cls.name}
//             </option>
//           ))}
//         </select>

//         <select
//           onChange={(e) => {
//             const arm = selectedClass?.arms?.find(
//               (a) => a._id === e.target.value
//             );

//             setSelectedArm(arm || null);
//             setResults([]);
//             setSubjects([]);
//           }}
//           value={selectedArm?._id || ""}
//           disabled={!selectedClass}
//           className="min-w-[120px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
//         >
//           <option value="">Arm</option>
//           {(selectedClass?.arms || []).map((arm) => (
//             <option key={arm._id} value={arm._id}>
//               {arm.name}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={fetchResults}
//           disabled={
//             loading ||
//             !selectedAcademicUnit ||
//             !selectedSession ||
//             !selectedTerm ||
//             !selectedClass ||
//             !selectedArm
//           }
//           className={`whitespace-nowrap rounded px-4 py-2 text-sm ${
//             loading ||
//             !selectedAcademicUnit ||
//             !selectedSession ||
//             !selectedTerm ||
//             !selectedClass ||
//             !selectedArm
//               ? "cursor-not-allowed bg-gray-300 text-gray-600"
//               : "bg-purple-700 text-white hover:bg-purple-800"
//           }`}
//         >
//           {loading ? "Loading..." : "View"}
//         </button>

//         {results.length > 0 && (
//           <button
//             onClick={handlePrint}
//             className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
//           >
//             🖨️ Print
//           </button>
//         )}
//       </div>

//       <div className="mt-4" ref={printRef}>
//         {loading ? (
//           <p className="text-center text-gray-500">Fetching results...</p>
//         ) : results.length > 0 ? (
//           <>
//             <div className="mb-4 text-center">
//               <h3 className="text-lg font-semibold text-purple-700">
//                 {selectedAcademicUnit?.name} - {selectedClass?.name} (
//                 {selectedArm?.name})
//               </h3>
//               <p className="text-sm text-gray-500">
//                 Term: {selectedTerm?.name} | Session: {selectedSession?.name}
//               </p>
//             </div>

//             <div className="overflow-x-auto rounded bg-white shadow-sm">
//               <table className="w-full table-fixed border border-gray-200 text-xs">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="h-[100px] w-[5px] border">#</th>
//                     <th className="h-[100px] w-[30px] border text-left">
//                       Student
//                     </th>

//                     {subjects.map((subj, i) => (
//                       <th
//                         key={i}
//                         className="subject-header h-[100px] w-[10px] border text-[10px] leading-tight"
//                         style={{
//                           transform: "rotate(-90deg)",
//                           whiteSpace: "nowrap",
//                           textAlign: "center",
//                           verticalAlign: "middle",
//                         }}
//                       >
//                         {subj}
//                       </th>
//                     ))}

//                     <th
//                       className="h-[100px] w-[10px] border text-center font-semibold"
//                       style={{
//                         transform: "rotate(-90deg)",
//                         whiteSpace: "nowrap",
//                         textAlign: "center",
//                         verticalAlign: "middle",
//                       }}
//                     >
//                       Average
//                     </th>

//                     <th
//                       className="h-[100px] w-[10px] border text-center font-semibold"
//                       style={{
//                         transform: "rotate(-90deg)",
//                         whiteSpace: "nowrap",
//                         textAlign: "center",
//                         verticalAlign: "middle",
//                       }}
//                     >
//                       Grade
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {results.map((r, i) => {
//                     const subjectScores = subjects.map((subj) => {
//                       const s = r.subjects.find((ss) => ss.subject === subj);
//                       return s ? s.total : "-";
//                     });

//                     const numericScores = subjectScores.filter(
//                       (v) => !isNaN(v)
//                     );

//                     const avg =
//                       numericScores.length > 0
//                         ? (
//                             numericScores.reduce(
//                               (a, b) => Number(a) + Number(b),
//                               0
//                             ) / numericScores.length
//                           ).toFixed(1)
//                         : "-";

//                     const grade = getGrade(avg);

//                     return (
//                       <tr
//                         key={r.student._id || i}
//                         className="odd:bg-white even:bg-gray-50 hover:bg-purple-50"
//                       >
//                         <td className="border py-1 text-center">{i + 1}</td>
//                         <td className="truncate border px-2 py-1 text-left">
//                           {r.student.name}
//                         </td>

//                         {subjectScores.map((score, j) => (
//                           <td
//                             key={j}
//                             className={`border py-1 text-center ${getGradeColor(
//                               score
//                             )}`}
//                           >
//                             {score}
//                           </td>
//                         ))}

//                         <td className="border text-center font-semibold">
//                           {avg}
//                         </td>
//                         <td className="border text-center font-semibold">
//                           {grade}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         ) : (
//           <p className="mt-4 text-center italic text-gray-500">
//             No results available for this class and term.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

export default function ViewResultsByClass() {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);

  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [unitRes, sessionRes] = await Promise.all([
          api.get("/academic-units"),
          api.get("/sessions"),
        ]);

        const units = getApiData(unitRes);
        const sessionList = getApiData(sessionRes);

        setAcademicUnits(Array.isArray(units) ? units : []);
        setSessions(Array.isArray(sessionList) ? sessionList : []);

        if (!isFullAccess && restrictedUnitName) {
          const allowedUnit = units.find((unit) =>
            unit.name?.toLowerCase().includes(restrictedUnitName)
          );

          if (allowedUnit) {
            setSelectedAcademicUnit(allowedUnit);
          }
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitial();
  }, [isFullAccess, restrictedUnitName]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedAcademicUnit?._id) {
        setClasses([]);
        return;
      }

      try {
        const res = await api.get("/classes", {
          params: {
            academicUnitId: selectedAcademicUnit._id,
          },
        });

        const payload = getApiData(res);
        setClasses(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit]);

  const resetBelowUnit = () => {
    setSelectedClass(null);
    setSelectedArm(null);
    setResults([]);
    setSubjects([]);
  };

  const fetchResults = async () => {
    if (
      !selectedAcademicUnit ||
      !selectedSession ||
      !selectedTerm ||
      !selectedClass ||
      !selectedArm
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/results/class/all-subjects", {
        params: {
          academicUnitId: selectedAcademicUnit._id,
          classId: selectedClass._id,
          armId: selectedArm._id,
          sessionId: selectedSession._id,
          termId: selectedTerm._id,
        },
      });

      const payload = getApiData(res);
      const data = Array.isArray(payload) ? payload : [];

      const uniqueSubjects = [
        ...new Set(data.flatMap((s) => s.subjects.map((sub) => sub.subject))),
      ];

      setSubjects(uniqueSubjects);
      setResults(data);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (score) => {
    if (score === "-" || isNaN(score)) return "-";
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    return "F";
  };

  const getGradeColor = (score) => {
    if (score !== "-" && Number(score) <= 45) {
      return "text-red-500 font-semibold";
    }

    return "";
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>Class Results - ${selectedClass?.name}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 20px;
            }

            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white;
              padding: 10px;
              font-family: Arial, sans-serif;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 4px;
              font-size: 10px;
            }

            th.subject-header {
              transform: rotate(-90deg);
              white-space: nowrap;
              text-align: center;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);

    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    );

    styles.forEach((styleEl) => {
      printWindow.document.head.appendChild(styleEl.cloneNode(true));
    });

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <h2 className="mb-4 text-center text-lg font-bold text-purple-700 md:text-xl">
        📘 View Results by Class
      </h2>

      {isAcademicUnitLocked && selectedAcademicUnit && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="font-semibold text-green-700">Restricted View</p>
          <p className="text-sm text-green-600">
            You can only view results for{" "}
            <strong>{selectedAcademicUnit.name}</strong>.
          </p>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2 overflow-x-auto rounded-lg bg-white p-3 shadow-sm">
        <select
          onChange={(e) => {
            const unit = academicUnits.find((u) => u._id === e.target.value);
            setSelectedAcademicUnit(unit || null);
            resetBelowUnit();
          }}
          value={selectedAcademicUnit?._id || ""}
          disabled={isAcademicUnitLocked}
          className="min-w-[160px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">Academic Unit</option>
          {visibleAcademicUnits.map((unit) => (
            <option key={unit._id} value={unit._id}>
              {unit.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const session = sessions.find((s) => s._id === e.target.value);
            setSelectedSession(session || null);
            setSelectedTerm(null);
            setResults([]);
            setSubjects([]);
          }}
          value={selectedSession?._id || ""}
          className="min-w-[130px] rounded border px-2 py-2 text-sm"
        >
          <option value="">Session</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const term = selectedSession?.terms?.find(
              (t) => t._id === e.target.value
            );

            setSelectedTerm(term || null);
            setResults([]);
            setSubjects([]);
          }}
          value={selectedTerm?._id || ""}
          disabled={!selectedSession}
          className="min-w-[110px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">Term</option>
          {(selectedSession?.terms || []).map((term) => (
            <option key={term._id} value={term._id}>
              {term.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const cls = classes.find((c) => c._id === e.target.value);
            setSelectedClass(cls || null);
            setSelectedArm(null);
            setResults([]);
            setSubjects([]);
          }}
          value={selectedClass?._id || ""}
          disabled={!selectedAcademicUnit || !selectedTerm}
          className="min-w-[120px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const arm = selectedClass?.arms?.find(
              (a) => a._id === e.target.value
            );

            setSelectedArm(arm || null);
            setResults([]);
            setSubjects([]);
          }}
          value={selectedArm?._id || ""}
          disabled={!selectedClass}
          className="min-w-[120px] rounded border px-2 py-2 text-sm disabled:bg-gray-100"
        >
          <option value="">Arm</option>
          {(selectedClass?.arms || []).map((arm) => (
            <option key={arm._id} value={arm._id}>
              {arm.name}
            </option>
          ))}
        </select>

        <button
          onClick={fetchResults}
          disabled={
            loading ||
            !selectedAcademicUnit ||
            !selectedSession ||
            !selectedTerm ||
            !selectedClass ||
            !selectedArm
          }
          className={`whitespace-nowrap rounded px-4 py-2 text-sm ${
            loading ||
            !selectedAcademicUnit ||
            !selectedSession ||
            !selectedTerm ||
            !selectedClass ||
            !selectedArm
              ? "cursor-not-allowed bg-gray-300 text-gray-600"
              : "bg-purple-700 text-white hover:bg-purple-800"
          }`}
        >
          {loading ? "Loading..." : "View"}
        </button>

        {results.length > 0 && (
          <button
            onClick={handlePrint}
            className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            🖨️ Print
          </button>
        )}
      </div>

      <div className="mt-4" ref={printRef}>
        {loading ? (
          <p className="text-center text-gray-500">Fetching results...</p>
        ) : results.length > 0 ? (
          <>
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-purple-700">
                {selectedAcademicUnit?.name} - {selectedClass?.name} (
                {selectedArm?.name})
              </h3>
              <p className="text-sm text-gray-500">
                Term: {selectedTerm?.name} | Session: {selectedSession?.name}
              </p>
            </div>

            <div className="overflow-x-auto rounded bg-white shadow-sm">
              <table className="w-full table-fixed border border-gray-200 text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="h-[100px] w-[5px] border">#</th>
                    <th className="h-[100px] w-[30px] border text-left">
                      Student
                    </th>

                    {subjects.map((subj, i) => (
                      <th
                        key={i}
                        className="subject-header h-[100px] w-[10px] border text-[10px] leading-tight"
                        style={{
                          transform: "rotate(-90deg)",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        {subj}
                      </th>
                    ))}

                    <th
                      className="h-[100px] w-[10px] border text-center font-semibold"
                      style={{
                        transform: "rotate(-90deg)",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Average
                    </th>

                    <th
                      className="h-[100px] w-[10px] border text-center font-semibold"
                      style={{
                        transform: "rotate(-90deg)",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Grade
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, i) => {
                    const subjectScores = subjects.map((subj) => {
                      const s = r.subjects.find((ss) => ss.subject === subj);
                      return s ? s.total : "-";
                    });

                    const numericScores = subjectScores.filter(
                      (v) => !isNaN(v)
                    );

                    const avg =
                      numericScores.length > 0
                        ? (
                            numericScores.reduce(
                              (a, b) => Number(a) + Number(b),
                              0
                            ) / numericScores.length
                          ).toFixed(1)
                        : "-";

                    const grade = getGrade(avg);

                    return (
                      <tr
                        key={r.student._id || i}
                        className="odd:bg-white even:bg-gray-50 hover:bg-purple-50"
                      >
                        <td className="border py-1 text-center">{i + 1}</td>
                        <td className="truncate border px-2 py-1 text-left">
                          {r.student.name}
                        </td>

                        {subjectScores.map((score, j) => (
                          <td
                            key={j}
                            className={`border py-1 text-center ${getGradeColor(
                              score
                            )}`}
                          >
                            {score}
                          </td>
                        ))}

                        <td className="border text-center font-semibold">
                          {avg}
                        </td>
                        <td className="border text-center font-semibold">
                          {grade}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-4 text-center italic text-gray-500">
            No results available for this class and term.
          </p>
        )}
      </div>
    </div>
  );
}