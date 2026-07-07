

import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const SubjectAssignment = () => {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [assignedSubjects, setAssignedSubjects] = useState([]);

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
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    if (selectedAcademicUnit) {
      fetchSubjectsAndClasses(selectedAcademicUnit);
    } else {
      setSubjects([]);
      setClasses([]);
    }

    setSelectedClass("");
    setSelectedArm("");
    setSelectedSubjects([]);
    setAssignedSubjects([]);
  }, [selectedAcademicUnit]);

  useEffect(() => {
    if (selectedAcademicUnit && selectedClass && selectedArm) {
      fetchAssignments();
    } else {
      setAssignedSubjects([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit, selectedClass, selectedArm]);

  const fetchInitialData = async () => {
    try {
      const { data } = await api.get("/academic-units");
      const units = data?.data ?? data ?? [];

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
      toast.error("Failed to load academic units");
    }
  };

  const fetchSubjectsAndClasses = async (academicUnitId) => {
    try {
      const [subjectsRes, classesRes] = await Promise.all([
        api.get("/subjects", { params: { academicUnitId } }),
        api.get("/classes", { params: { academicUnitId } }),
      ]);

      setSubjects(subjectsRes.data?.data ?? subjectsRes.data ?? []);
      setClasses(classesRes.data?.data ?? classesRes.data ?? []);
    } catch (err) {
      toast.error("Failed to load subjects/classes");
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get(
        `/subject-assignments/${selectedClass}/${selectedArm}`,
        {
          params: {
            academicUnitId: selectedAcademicUnit,
          },
        }
      );

      setAssignedSubjects(data?.data ?? data ?? []);
    } catch (err) {
      setAssignedSubjects([]);
    }
  };

  const selectedClassObj = useMemo(
    () => classes.find((cls) => cls._id === selectedClass),
    [classes, selectedClass]
  );

  const assignedSubjectIds = assignedSubjects
    .map((a) => a.subject?._id || a.subject)
    .filter(Boolean);

  const availableSubjects = subjects.filter(
    (subject) => !assignedSubjectIds.includes(subject._id)
  );

  const handleAssign = async () => {
    if (!selectedAcademicUnit || !selectedClass || !selectedArm) {
      toast.error("Select academic unit, class and arm");
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error("Select at least one subject");
      return;
    }

    try {
      await api.post("/subject-assignments", {
        academicUnitId: selectedAcademicUnit,
        classId: selectedClass,
        armId: selectedArm,
        subjectIds: selectedSubjects,
      });

      toast.success("Subjects assigned");

      await fetchAssignments();
      setSelectedSubjects([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error assigning subjects");
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!confirm("Remove this subject from this class/arm?")) return;

    try {
      await api.delete(`/subject-assignments/${assignmentId}`);
      toast.success("Subject removed");
      setAssignedSubjects((prev) => prev.filter((a) => a._id !== assignmentId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove subject");
    }
  };

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          Assign Subjects to Class/Arm
        </h2>

        {!isFullAccess && visibleAcademicUnits[0] && (
          <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            Restricted View: {visibleAcademicUnits[0].name}
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            value={selectedAcademicUnit}
            disabled={!isFullAccess}
            onChange={(e) => setSelectedAcademicUnit(e.target.value)}
          >
            <option value="">Select Academic Unit</option>
            {visibleAcademicUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedArm("");
              setSelectedSubjects([]);
              setAssignedSubjects([]);
            }}
            disabled={!selectedAcademicUnit}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border p-2 text-sm disabled:bg-gray-100"
            value={selectedArm}
            onChange={(e) => {
              setSelectedArm(e.target.value);
              setSelectedSubjects([]);
            }}
            disabled={!selectedClass}
          >
            <option value="">Select Arm</option>
            {(selectedClassObj?.arms || []).map((arm) => (
              <option key={arm._id} value={arm._id}>
                {arm.name}
              </option>
            ))}
          </select>
        </div>

        {selectedArm && (
          <div className="mt-5">
            <h3 className="mb-2 font-semibold text-gray-800">
              Select Subjects
            </h3>

            {availableSubjects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No available subjects for this academic unit, or all have already
                been assigned.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map((subj) => (
                  <button
                    type="button"
                    key={subj._id}
                    onClick={() => toggleSubject(subj._id)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      selectedSubjects.includes(subj._id)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {subj.name}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleAssign}
              disabled={selectedSubjects.length === 0}
              className="mt-3 rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              Assign Selected
            </button>
          </div>
        )}

        {selectedArm && (
          <div className="mt-6">
            <h3 className="mb-2 font-semibold text-gray-800">
              Assigned Subjects
            </h3>

            <div className="flex flex-wrap gap-2">
              {assignedSubjects.length > 0 ? (
                assignedSubjects.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm"
                  >
                    <span>{a.subject?.name}</span>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="ml-2 text-red-600 hover:text-red-800"
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
};

export default SubjectAssignment;