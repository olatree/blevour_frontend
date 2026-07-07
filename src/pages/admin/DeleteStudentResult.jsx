// import React, { useState, useEffect, useRef } from 'react';
// import api from "../../api/axios";

// export default function DeleteResultsByStudent() {
//   const [classes, setClasses] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);

//   const [selectedClass, setSelectedClass] = useState(null);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedSession, setSelectedSession] = useState(null);
//   const [selectedTerm, setSelectedTerm] = useState(null);

//   const [results, setResults] = useState([]); // flat list of individual result records
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Fetch Classes
//   useEffect(() => {
//     api.get("/classes").then(res => setClasses(res.data || [])).catch(console.error);
//   }, []);

//   // Fetch Sessions
//   useEffect(() => {
//     api.get("/sessions").then(res => setSessions(res.data || [])).catch(console.error);
//   }, []);

//   // Fetch All Students (with class reference for filtering)
//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await api.get("/students");
//         let data = res.data || [];

//         // If API returns enrollments instead of plain students
//         if (data.length > 0 && data[0].studentId) {
//           const unique = [];
//           const seen = new Set();
//           data.forEach(en => {
//             const sid = en.studentId;
//             if (!seen.has(sid._id)) {
//               seen.add(sid._id);
//               unique.push({
//                 _id: sid._id,
//                 name: sid.name,
//                 admissionNumber: sid.admissionNumber || 'N/A',
//                 classId: en.classId?._id || en.classId,
//               });
//             }
//           });
//           unique.sort((a, b) => a.name.localeCompare(b.name));
//           data = unique;
//         }

//         setStudents(data);
//         setFilteredStudents(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchStudents();
//   }, []);

//   // Filter students when class changes
//   useEffect(() => {
//     if (selectedClass) {
//       const filtered = students.filter(s => s.classId === selectedClass._id);
//       setFilteredStudents(filtered);
//     } else {
//       setFilteredStudents(students);
//     }
//     // Reset downstream selections
//     setSelectedStudent(null);
//     setResults([]);
//   }, [selectedClass, students]);

//   // Fetch results when student or filters change
//   const fetchResults = async () => {
//     if (!selectedStudent) {
//       setError('Please select a student');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const params = {
//         studentId: selectedStudent._id,
//         ...(selectedSession && { sessionId: selectedSession._id }),
//         ...(selectedTerm && { termId: selectedTerm._id }),
//       };

//       const res = await api.get('/results/by-student', { params });

//       if (!res.data.results || res.data.results.length === 0) {
//         setResults([]);
//         setError('No results found for the selected filters.');
//         return;
//       }

//       // Flatten the grouped structure into individual result rows
//       const flatResults = [];
//       res.data.results.forEach(termGroup => {
//         termGroup.subjects.forEach(sub => {
//           flatResults.push({
//             ...sub,
//             session: termGroup.session,
//             term: termGroup.term,
//             class: termGroup.class,
//             arm: termGroup.arm,
//             average: termGroup.average,
//           });
//         });
//       });

//       setResults(flatResults);
//     } catch (err) {
//       setError('Failed to load results: ' + err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete a single result (we need the result _id – add it to the model or use the existing delete endpoints)
//   // NOTE: Your current backend has `deleteSingleResult` that takes resultId in params
//   const deleteSingleResult = async (resultId) => {
//     if (!window.confirm("Are you sure you want to delete this result?")) return;

//     try {
//       await api.delete(`/results/${resultId}`); // assuming route is DELETE /results/:resultId
//       setSuccess('Result deleted successfully.');
//       // Refresh list
//       fetchResults();
//     } catch (err) {
//       setError('Failed to delete: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   // Delete ALL displayed results (safer than bulk class delete)
//   const deleteAllDisplayed = async () => {
//     if (!window.confirm(`Delete ALL ${results.length} results shown? This cannot be undone.`)) return;

//     setLoading(true);
//     try {
//       const deletePromises = results
//         .filter(r => r._id) // only if you have _id (see note below)
//         .map(r => api.delete(`/results/${r._id}`));

//       await Promise.all(deletePromises);
//       setSuccess('All displayed results deleted.');
//       setResults([]);
//     } catch (err) {
//       setError('Some deletions failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 max-w-7xl mx-auto">
//       <h2 className="text-xl font-bold text-red-700 mb-6 text-center">
//         🗑️ Delete Results by Student
//       </h2>

//       {/* Filter Bar */}
//       <div className="bg-white shadow-sm rounded-lg p-4 mb-6 border border-red-100">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

//           <select
//             value={selectedClass?._id || ""}
//             onChange={(e) => {
//               const cls = classes.find(c => c._id === e.target.value);
//               setSelectedClass(cls || null);
//             }}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">All Classes</option>
//             {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//           </select>

//           <select
//             value={selectedStudent?._id || ""}
//             onChange={(e) => {
//               const stu = filteredStudents.find(s => s._id === e.target.value);
//               setSelectedStudent(stu || null);
//               setResults([]);
//             }}
//             disabled={filteredStudents.length === 0}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">Select Student</option>
//             {filteredStudents.map(s => (
//               <option key={s._id} value={s._id}>
//                 {s.name} ({s.admissionNumber})
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedSession?._id || ""}
//             onChange={(e) => {
//               const ses = sessions.find(s => s._id === e.target.value);
//               setSelectedSession(ses || null);
//               setSelectedTerm(null);
//             }}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">All Sessions</option>
//             {sessions.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//           </select>

//           <select
//             value={selectedTerm?._id || ""}
//             onChange={(e) => {
//               const term = selectedSession?.terms?.find(t => t._id === e.target.value);
//               setSelectedTerm(term || null);
//             }}
//             disabled={!selectedSession}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">All Terms</option>
//             {selectedSession?.terms?.map(t => (
//               <option key={t._id} value={t._id}>{t.name}</option>
//             ))}
//           </select>

//           <button
//             onClick={fetchResults}
//             disabled={loading || !selectedStudent}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
//           >
//             {loading ? "Loading..." : "Load Results"}
//           </button>
//         </div>
//       </div>

//       {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 border border-red-200">{error}</div>}
//       {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 border border-green-200">{success}</div>}

//       {/* Results Table */}
//       {results.length > 0 && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h3 className="font-semibold">
//               Results for {selectedStudent?.name} ({results.length} records)
//             </h3>
//             <button
//               onClick={deleteAllDisplayed}
//               className="bg-red-700 text-white px-4 py-2 rounded text-sm hover:bg-red-800"
//             >
//               Delete All Shown
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Session</th>
//                   <th className="px-4 py-2 text-left">Term</th>
//                   <th className="px-4 py-2 text-left">Subject</th>
//                   <th className="px-2 py-2">CA1</th>
//                   <th className="px-2 py-2">CA2</th>
//                   <th className="px-2 py-2">Exam</th>
//                   <th className="px-2 py-2">Total</th>
//                   <th className="px-2 py-2">Grade</th>
//                   <th className="px-4 py-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {results.map((r, idx) => (
//                   <tr key={idx} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-2">{r.session}</td>
//                     <td className="px-4 py-2">{r.term}</td>
//                     <td className="px-4 py-2 font-medium">{r.subject}</td>
//                     <td className="px-2 py-2 text-center">{r.ca1 ?? '-'}</td>
//                     <td className="px-2 py-2 text-center">{r.ca2 ?? '-'}</td>
//                     <td className="px-2 py-2 text-center">{r.exam ?? '-'}</td>
//                     <td className="px-2 py-2 font-bold text-center">{r.total ?? '-'}</td>
//                     <td className="px-2 py-2 text-center">
//                       <span className={`px-2 py-1 rounded text-xs font-bold ${
//                         r.grade === 'A' ? 'bg-green-100 text-green-800' :
//                         r.grade === 'B' ? 'bg-blue-100 text-blue-800' :
//                         r.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
//                         r.grade === 'D' ? 'bg-orange-100 text-orange-800' :
//                         r.grade === 'F' ? 'bg-red-200 text-red-900' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {r.grade ?? '-'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2 text-center">
//                       <button
//                         onClick={() => {
//                           // You need the actual Result document _id here.
//                           // If your /results/by-student returns the _id on each subject row, use r._id
//                           // Otherwise you may need to adjust the backend to return it.
//                           if (r._id) deleteSingleResult(r._id);
//                           else alert("Result ID missing – cannot delete.");
//                         }}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {!loading && results.length === 0 && selectedStudent && (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <p className="text-gray-500">No results found for the selected filters.</p>
//         </div>
//       )}

//       {!selectedStudent && (
//         <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
//           <p className="text-gray-400">Select a class and student to load results for deletion.</p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "object") return value._id || value.id || "";
  return value;
};

export default function DeleteResultsByStudent() {
  const [academicUnits, setAcademicUnits] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [unitRes, sessionRes] = await Promise.all([
          api.get("/academic-units"),
          api.get("/sessions"),
        ]);

        setAcademicUnits(getApiData(unitRes));
        setSessions(getApiData(sessionRes));
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const params = {};
        if (selectedAcademicUnit?._id) {
          params.academicUnitId = selectedAcademicUnit._id;
        }

        const res = await api.get("/classes", { params });
        setClasses(getApiData(res));
      } catch (err) {
        console.error(err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedAcademicUnit) {
        setStudents([]);
        setFilteredStudents([]);
        return;
      }

      try {
        setLoadingStudents(true);

        const res = await api.get("/students", {
          params: {
            academicUnitId: selectedAcademicUnit._id,
          },
        });

        let data = getApiData(res);
        data = Array.isArray(data) ? data : [];

        if (data.length > 0 && data[0].studentId) {
          const unique = [];
          const seen = new Set();

          data.forEach((enrollment) => {
            const student = enrollment.studentId;
            if (!student || seen.has(student._id)) return;

            seen.add(student._id);

            unique.push({
              _id: student._id,
              name: student.name,
              admissionNumber: student.admissionNumber || "N/A",
              academicUnitId: getId(enrollment.academicUnitId),
              classId: getId(enrollment.classId),
            });
          });

          unique.sort((a, b) => a.name.localeCompare(b.name));
          data = unique;
        }

        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.error(err);
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedAcademicUnit]);

  useEffect(() => {
    let filtered = students;

    if (selectedClass) {
      filtered = filtered.filter(
        (student) => getId(student.classId) === selectedClass._id
      );
    }

    setFilteredStudents(filtered);
    setSelectedStudent(null);
    setResults([]);
  }, [selectedClass, students]);

  const resetOutput = () => {
    setResults([]);
    setError("");
    setSuccess("");
  };

  const fetchResults = async () => {
    if (!selectedAcademicUnit || !selectedStudent) {
      setError("Please select academic unit and student");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const params = {
        academicUnitId: selectedAcademicUnit._id,
        studentId: selectedStudent._id,
      };

      if (selectedSession) params.sessionId = selectedSession._id;
      if (selectedTerm) params.termId = selectedTerm._id;

      const res = await api.get("/results/by-student", { params });
      const payload = getApiData(res);

      const groupedResults = payload?.results || [];

      if (!Array.isArray(groupedResults) || groupedResults.length === 0) {
        setResults([]);
        setError("No results found for the selected filters.");
        return;
      }

      const flatResults = [];

      groupedResults.forEach((termGroup) => {
        (termGroup.subjects || []).forEach((subject) => {
          flatResults.push({
            ...subject,
            session: termGroup.session,
            term: termGroup.term,
            class: termGroup.class,
            arm: termGroup.arm,
            average: termGroup.average,
          });
        });
      });

      setResults(flatResults);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const deleteSingleResult = async (resultId) => {
    if (!resultId) {
      alert("Result ID missing – backend must return _id in by-student results.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      await api.delete(`/results/${resultId}`);
      setSuccess("Result deleted successfully.");
      fetchResults();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete result.");
    }
  };

  const deleteAllDisplayed = async () => {
    if (!window.confirm(`Delete ALL ${results.length} results shown? This cannot be undone.`)) {
      return;
    }

    setLoading(true);

    try {
      const deletePromises = results
        .filter((result) => result._id)
        .map((result) => api.delete(`/results/${result._id}`));

      await Promise.all(deletePromises);

      setSuccess("All displayed results deleted.");
      setResults([]);
    } catch (err) {
      setError("Some deletions failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <h2 className="mb-6 text-center text-xl font-bold text-red-700">
        🗑️ Delete Results by Student
      </h2>

      <div className="mb-6 rounded-lg border border-red-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <select
            value={selectedAcademicUnit?._id || ""}
            onChange={(e) => {
              const unit = academicUnits.find((u) => u._id === e.target.value);
              setSelectedAcademicUnit(unit || null);
              setSelectedClass(null);
              setSelectedStudent(null);
              resetOutput();
            }}
            className="rounded border px-3 py-2"
          >
            <option value="">Academic Unit</option>
            {academicUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>

          <select
            value={selectedClass?._id || ""}
            disabled={!selectedAcademicUnit}
            onChange={(e) => {
              const cls = classes.find((c) => c._id === e.target.value);
              setSelectedClass(cls || null);
              resetOutput();
            }}
            className="rounded border px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStudent?._id || ""}
            disabled={!selectedAcademicUnit || loadingStudents || filteredStudents.length === 0}
            onChange={(e) => {
              const student = filteredStudents.find((s) => s._id === e.target.value);
              setSelectedStudent(student || null);
              setResults([]);
            }}
            className="rounded border px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">
              {loadingStudents ? "Loading students..." : "Select Student"}
            </option>

            {filteredStudents.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.admissionNumber})
              </option>
            ))}
          </select>

          <select
            value={selectedSession?._id || ""}
            onChange={(e) => {
              const session = sessions.find((s) => s._id === e.target.value);
              setSelectedSession(session || null);
              setSelectedTerm(null);
              resetOutput();
            }}
            className="rounded border px-3 py-2"
          >
            <option value="">All Sessions</option>
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTerm?._id || ""}
            disabled={!selectedSession}
            onChange={(e) => {
              const term = selectedSession?.terms?.find(
                (t) => t._id === e.target.value
              );
              setSelectedTerm(term || null);
              resetOutput();
            }}
            className="rounded border px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">All Terms</option>
            {(selectedSession?.terms || []).map((term) => (
              <option key={term._id} value={term._id}>
                {term.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchResults}
            disabled={loading || !selectedAcademicUnit || !selectedStudent}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Load Results"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-green-700">
          {success}
        </div>
      )}

      {results.length > 0 && (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">
              Results for {selectedStudent?.name} ({results.length} records)
            </h3>

            <button
              onClick={deleteAllDisplayed}
              className="rounded bg-red-700 px-4 py-2 text-sm text-white hover:bg-red-800"
            >
              Delete All Shown
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Session</th>
                  <th className="px-4 py-2 text-left">Term</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-2 py-2">CA1</th>
                  <th className="px-2 py-2">CA2</th>
                  <th className="px-2 py-2">CA3</th>
                  <th className="px-2 py-2">CA4</th>
                  <th className="px-2 py-2">Exam</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Grade</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result, idx) => (
                  <tr key={result._id || idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{result.session}</td>
                    <td className="px-4 py-2">{result.term}</td>
                    <td className="px-4 py-2 font-medium">{result.subject}</td>
                    <td className="px-2 py-2 text-center">{result.ca1 ?? "-"}</td>
                    <td className="px-2 py-2 text-center">{result.ca2 ?? "-"}</td>
                    <td className="px-2 py-2 text-center">{result.ca3 ?? "-"}</td>
                    <td className="px-2 py-2 text-center">{result.ca4 ?? "-"}</td>
                    <td className="px-2 py-2 text-center">{result.exam ?? "-"}</td>
                    <td className="px-2 py-2 text-center font-bold">
                      {result.total ?? "-"}
                    </td>
                    <td className="px-2 py-2 text-center">{result.grade ?? "-"}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => deleteSingleResult(result._id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && selectedStudent && (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <p className="text-gray-500">No results found for the selected filters.</p>
        </div>
      )}

      {!selectedStudent && (
        <div className="rounded-xl border-2 border-dashed bg-gray-50 py-20 text-center">
          <p className="text-gray-400">
            Select academic unit and student to load results for deletion.
          </p>
        </div>
      )}
    </div>
  );
}