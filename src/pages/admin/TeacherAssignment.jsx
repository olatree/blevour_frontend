// import { useEffect, useMemo, useState } from "react";
// import api from "../../api/axios";
// import { Trash2 } from "lucide-react";
// import { toast } from "react-hot-toast";

// const API = {
//   teachers: "/teachers",
//   classes: "/classes",
//   subjects: "/subjects",
//   academicUnits: "/academic-units",
//   teacherAssignments: "/teacher-assignments",
// };

// export default function TeacherAssignment() {
//   const [academicUnits, setAcademicUnits] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedArm, setSelectedArm] = useState("");
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [assignments, setAssignments] = useState([]);

//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     if (selectedAcademicUnit) {
//       loadAcademicUnitData(selectedAcademicUnit);
//     } else {
//       setClasses([]);
//       setSubjects([]);
//     }

//     setSelectedClass("");
//     setSelectedArm("");
//     setSelectedSubjects([]);
//     setAssignments([]);
//   }, [selectedAcademicUnit]);

//   useEffect(() => {
//     fetchAssignments();
//   }, [selectedAcademicUnit, selectedTeacher, selectedClass, selectedArm]);

//   const loadInitialData = async () => {
//     try {
//       const [unitsRes, teachersRes] = await Promise.all([
//         api.get(API.academicUnits),
//         api.get(API.teachers),
//       ]);

//       setAcademicUnits(unitsRes.data?.data ?? unitsRes.data ?? []);
//       setTeachers(teachersRes.data?.data ?? teachersRes.data ?? []);
//     } catch (err) {
//       console.error("Failed to load initial data:", err);
//       toast.error("Failed to load page data");
//     }
//   };

//   const loadAcademicUnitData = async (academicUnitId) => {
//     try {
//       const [classesRes, subjectsRes] = await Promise.all([
//         api.get(`${API.classes}?academicUnitId=${academicUnitId}`),
//         api.get(`${API.subjects}?academicUnitId=${academicUnitId}`),
//       ]);

//       setClasses(classesRes.data?.data ?? classesRes.data ?? []);
//       setSubjects(subjectsRes.data?.data ?? subjectsRes.data ?? []);
//     } catch (err) {
//       console.error("Failed to load academic unit data:", err);
//       toast.error("Failed to load classes/subjects");
//     }
//   };

//   const fetchAssignments = async () => {
//     if (
//       !selectedAcademicUnit ||
//       !selectedTeacher ||
//       !selectedClass ||
//       !selectedArm
//     ) {
//       setAssignments([]);
//       return;
//     }

//     try {
//       const { data } = await api.get(
//         `${API.teacherAssignments}/${selectedTeacher}/${selectedClass}/${selectedArm}?academicUnitId=${selectedAcademicUnit}`
//       );

//       setAssignments(data?.data ?? data ?? []);
//     } catch (err) {
//       console.error("Failed to fetch assignments:", err);
//       setAssignments([]);
//     }
//   };

//   const assignedSubjectIds = useMemo(
//     () => new Set(assignments.map((a) => a.subject?._id || a.subject)),
//     [assignments]
//   );

//   const availableSubjects = useMemo(
//     () => subjects.filter((subject) => !assignedSubjectIds.has(subject._id)),
//     [subjects, assignedSubjectIds]
//   );

//   const armsForSelectedClass =
//     classes.find((cls) => cls._id === selectedClass)?.arms || [];

//   const toggleSubject = (subjectId) => {
//     setSelectedSubjects((prev) =>
//       prev.includes(subjectId)
//         ? prev.filter((id) => id !== subjectId)
//         : [...prev, subjectId]
//     );
//   };

//   const handleAssign = async () => {
//     if (
//       !selectedAcademicUnit ||
//       !selectedTeacher ||
//       !selectedClass ||
//       !selectedArm ||
//       selectedSubjects.length === 0
//     ) {
//       toast.error("Select academic unit, teacher, class, arm and subjects");
//       return;
//     }

//     try {
//       await api.post(API.teacherAssignments, {
//         academicUnitId: selectedAcademicUnit,
//         teacherId: selectedTeacher,
//         classId: selectedClass,
//         armId: selectedArm,
//         subjectIds: selectedSubjects,
//       });

//       toast.success("Subjects assigned to teacher");
//       await fetchAssignments();
//       setSelectedSubjects([]);
//     } catch (err) {
//       console.error("Error assigning subjects:", err);
//       toast.error(err.response?.data?.message || "Failed to assign subjects");
//     }
//   };

//   const handleDelete = async (assignmentId) => {
//     if (!window.confirm("Remove this assignment?")) return;

//     try {
//       await api.delete(`${API.teacherAssignments}/${assignmentId}`);
//       toast.success("Assignment removed");
//       setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
//     } catch (err) {
//       console.error("Error deleting assignment:", err);
//       toast.error(err.response?.data?.message || "Failed to delete assignment");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
//       <div className="rounded-xl bg-white p-4 shadow-sm">
//         <h2 className="mb-4 text-xl font-bold text-gray-800">
//           Assign Subjects to Teacher
//         </h2>

//         <div className="grid gap-3 md:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-sm font-medium">
//               Academic Unit
//             </label>
//             <select
//               className="w-full rounded border p-2 text-sm"
//               value={selectedAcademicUnit}
//               onChange={(e) => {
//                 setSelectedAcademicUnit(e.target.value);
//                 setSelectedTeacher("");
//               }}
//             >
//               <option value="">Select Academic Unit</option>
//               {academicUnits.map((unit) => (
//                 <option key={unit._id} value={unit._id}>
//                   {unit.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium">Teacher</label>
//             <select
//               className="w-full rounded border p-2 text-sm"
//               value={selectedTeacher}
//               onChange={(e) => {
//                 setSelectedTeacher(e.target.value);
//                 setSelectedClass("");
//                 setSelectedArm("");
//                 setAssignments([]);
//                 setSelectedSubjects([]);
//               }}
//               disabled={!selectedAcademicUnit}
//             >
//               <option value="">Select Teacher</option>
//               {teachers.map((t) => (
//                 <option key={t._id} value={t._id}>
//                   {t.name} {t.email ? `(${t.email})` : ""}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium">Class</label>
//             <select
//               className="w-full rounded border p-2 text-sm"
//               value={selectedClass}
//               onChange={(e) => {
//                 setSelectedClass(e.target.value);
//                 setSelectedArm("");
//                 setAssignments([]);
//                 setSelectedSubjects([]);
//               }}
//               disabled={!selectedTeacher}
//             >
//               <option value="">Select Class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedClass && (
//             <div>
//               <label className="mb-1 block text-sm font-medium">Arm</label>
//               <select
//                 className="w-full rounded border p-2 text-sm"
//                 value={selectedArm}
//                 onChange={(e) => {
//                   setSelectedArm(e.target.value);
//                   setSelectedSubjects([]);
//                 }}
//                 disabled={!selectedTeacher || !selectedClass}
//               >
//                 <option value="">Select Arm</option>
//                 {armsForSelectedClass.map((arm) => (
//                   <option key={arm._id} value={arm._id}>
//                     {arm.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>

//         {selectedArm && (
//           <div className="mt-5">
//             <h3 className="mb-2 font-semibold text-gray-800">
//               Select Subjects
//             </h3>

//             {availableSubjects.length === 0 ? (
//               <p className="text-sm text-gray-500">
//                 No available subjects for this academic unit, or all subjects
//                 have already been assigned to this teacher for this class/arm.
//               </p>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {availableSubjects.map((subj) => {
//                   const isSelected = selectedSubjects.includes(subj._id);

//                   return (
//                     <button
//                       key={subj._id}
//                       type="button"
//                       onClick={() => toggleSubject(subj._id)}
//                       className={`rounded-full border px-3 py-1 text-sm ${
//                         isSelected
//                           ? "bg-green-600 text-white"
//                           : "bg-gray-100 hover:bg-gray-200"
//                       }`}
//                     >
//                       {subj.name}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             <button
//               onClick={handleAssign}
//               className="mt-3 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
//               disabled={selectedSubjects.length === 0}
//             >
//               Assign Selected
//             </button>
//           </div>
//         )}

//         {selectedArm && (
//           <div className="mt-6">
//             <h3 className="mb-2 font-semibold text-gray-800">
//               Current Assignments
//             </h3>

//             <div className="flex flex-wrap gap-2">
//               {assignments.length > 0 ? (
//                 assignments.map((a) => (
//                   <div
//                     key={a._id}
//                     className="flex items-center rounded-full bg-gray-200 px-3 py-1"
//                   >
//                     <span className="text-sm">
//                       {a.subject?.name || "Subject"}
//                     </span>

//                     <button
//                       onClick={() => handleDelete(a._id)}
//                       className="ml-2 text-red-600 hover:text-red-800"
//                       title="Remove"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500">
//                   No subjects assigned yet.
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const API = {
  teachers: "/teachers",
  classes: "/classes",
  subjects: "/subjects",
  academicUnits: "/academic-units",
  teacherAssignments: "/teacher-assignments",
};

export default function TeacherAssignment() {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
    user?.role
  );

  const restrictedUnitName =
    user?.role === "principal"
      ? "secondary"
      : user?.role === "head_teacher"
      ? "primary"
      : "";

  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;
    if (!restrictedUnitName) return academicUnits;

    return academicUnits.filter((unit) =>
      unit.name?.toLowerCase().includes(restrictedUnitName)
    );
  }, [academicUnits, isFullAccess, restrictedUnitName]);

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    if (selectedAcademicUnit) {
      loadAcademicUnitData(selectedAcademicUnit);
    } else {
      setTeachers([]);
      setClasses([]);
      setSubjects([]);
    }

    setSelectedTeacher("");
    setSelectedClass("");
    setSelectedArm("");
    setSelectedSubjects([]);
    setAssignments([]);
  }, [selectedAcademicUnit]);

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit, selectedTeacher, selectedClass, selectedArm]);

  const loadInitialData = async () => {
    try {
      const unitsRes = await api.get(API.academicUnits);
      const units = unitsRes.data?.data ?? unitsRes.data ?? [];

      setAcademicUnits(units);

      if (!isFullAccess && restrictedUnitName) {
        const allowedUnit = units.find((unit) =>
          unit.name?.toLowerCase().includes(restrictedUnitName)
        );

        if (allowedUnit) {
          setSelectedAcademicUnit(allowedUnit._id);
        } else {
          toast.error(`No ${restrictedUnitName} academic unit found`);
        }
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
      toast.error("Failed to load page data");
    }
  };

  const loadAcademicUnitData = async (academicUnitId) => {
    try {
      const [teachersRes, classesRes, subjectsRes] = await Promise.all([
        api.get(API.teachers, { params: { academicUnitId } }),
        api.get(API.classes, { params: { academicUnitId } }),
        api.get(API.subjects, { params: { academicUnitId } }),
      ]);

      setTeachers(teachersRes.data?.data ?? teachersRes.data ?? []);
      setClasses(classesRes.data?.data ?? classesRes.data ?? []);
      setSubjects(subjectsRes.data?.data ?? subjectsRes.data ?? []);
    } catch (err) {
      console.error("Failed to load academic unit data:", err);
      toast.error("Failed to load teachers/classes/subjects");
    }
  };

  const fetchAssignments = async () => {
    if (
      !selectedAcademicUnit ||
      !selectedTeacher ||
      !selectedClass ||
      !selectedArm
    ) {
      setAssignments([]);
      return;
    }

    try {
      const { data } = await api.get(
        `${API.teacherAssignments}/${selectedTeacher}/${selectedClass}/${selectedArm}`,
        {
          params: {
            academicUnitId: selectedAcademicUnit,
          },
        }
      );

      setAssignments(data?.data ?? data ?? []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      setAssignments([]);
    }
  };

  const assignedSubjectIds = useMemo(
    () => new Set(assignments.map((a) => a.subject?._id || a.subject)),
    [assignments]
  );

  const availableSubjects = useMemo(
    () => subjects.filter((subject) => !assignedSubjectIds.has(subject._id)),
    [subjects, assignedSubjectIds]
  );

  const armsForSelectedClass =
    classes.find((cls) => cls._id === selectedClass)?.arms || [];

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleAssign = async () => {
    if (
      !selectedAcademicUnit ||
      !selectedTeacher ||
      !selectedClass ||
      !selectedArm ||
      selectedSubjects.length === 0
    ) {
      toast.error("Select academic unit, teacher, class, arm and subjects");
      return;
    }

    try {
      await api.post(API.teacherAssignments, {
        academicUnitId: selectedAcademicUnit,
        teacherId: selectedTeacher,
        classId: selectedClass,
        armId: selectedArm,
        subjectIds: selectedSubjects,
      });

      toast.success("Subjects assigned to teacher");

      await fetchAssignments();
      setSelectedSubjects([]);
    } catch (err) {
      console.error("Error assigning subjects:", err);
      toast.error(err.response?.data?.message || "Failed to assign subjects");
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Remove this assignment?")) return;

    try {
      await api.delete(`${API.teacherAssignments}/${assignmentId}`);
      toast.success("Assignment removed");
      setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error(err.response?.data?.message || "Failed to delete assignment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          Assign Subjects to Teacher
        </h2>

        {!isFullAccess && visibleAcademicUnits[0] && (
          <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            Restricted View: {visibleAcademicUnits[0].name}
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Academic Unit
            </label>
            <select
              className="w-full rounded border p-2 text-sm disabled:bg-gray-100"
              value={selectedAcademicUnit}
              disabled={!isFullAccess}
              onChange={(e) => {
                setSelectedAcademicUnit(e.target.value);
                setSelectedTeacher("");
              }}
            >
              <option value="">Select Academic Unit</option>
              {visibleAcademicUnits.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Teacher</label>
            <select
              className="w-full rounded border p-2 text-sm disabled:bg-gray-100"
              value={selectedTeacher}
              onChange={(e) => {
                setSelectedTeacher(e.target.value);
                setSelectedClass("");
                setSelectedArm("");
                setAssignments([]);
                setSelectedSubjects([]);
              }}
              disabled={!selectedAcademicUnit}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.email ? `(${t.email})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Class</label>
            <select
              className="w-full rounded border p-2 text-sm disabled:bg-gray-100"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedArm("");
                setAssignments([]);
                setSelectedSubjects([]);
              }}
              disabled={!selectedTeacher}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div>
              <label className="mb-1 block text-sm font-medium">Arm</label>
              <select
                className="w-full rounded border p-2 text-sm disabled:bg-gray-100"
                value={selectedArm}
                onChange={(e) => {
                  setSelectedArm(e.target.value);
                  setSelectedSubjects([]);
                }}
                disabled={!selectedTeacher || !selectedClass}
              >
                <option value="">Select Arm</option>
                {armsForSelectedClass.map((arm) => (
                  <option key={arm._id} value={arm._id}>
                    {arm.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {selectedArm && (
          <div className="mt-5">
            <h3 className="mb-2 font-semibold text-gray-800">
              Select Subjects
            </h3>

            {availableSubjects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No available subjects for this academic unit, or all subjects
                have already been assigned to this teacher for this class/arm.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj._id);

                  return (
                    <button
                      key={subj._id}
                      type="button"
                      onClick={() => toggleSubject(subj._id)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {subj.name}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleAssign}
              className="mt-3 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              disabled={selectedSubjects.length === 0}
            >
              Assign Selected
            </button>
          </div>
        )}

        {selectedArm && (
          <div className="mt-6">
            <h3 className="mb-2 font-semibold text-gray-800">
              Current Assignments
            </h3>

            <div className="flex flex-wrap gap-2">
              {assignments.length > 0 ? (
                assignments.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center rounded-full bg-gray-200 px-3 py-1"
                  >
                    <span className="text-sm">
                      {a.subject?.name || "Subject"}
                    </span>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="ml-2 text-red-600 hover:text-red-800"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No subjects assigned yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}