

import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

export default function ClassTeacherAssignment() {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [loading, setLoading] = useState(false);

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
      fetchClasses(selectedAcademicUnit);
      fetchTeachers(selectedAcademicUnit);
      fetchAssignments(selectedAcademicUnit);
    } else {
      setClasses([]);
      setTeachers([]);
      setAssignments([]);
    }

    setSelectedClass("");
    setSelectedArm("");
    setSelectedTeacher("");
  }, [selectedAcademicUnit]);

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
      console.error(err);
      toast.error("Failed to load academic units");
    }
  };

  const fetchTeachers = async (academicUnitId) => {
    try {
      const { data } = await api.get("/teachers", {
        params: { academicUnitId },
      });

      setTeachers(data?.data ?? data?.users ?? data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teachers");
      setTeachers([]);
    }
  };

  const fetchClasses = async (academicUnitId) => {
    try {
      const { data } = await api.get("/classes", {
        params: { academicUnitId },
      });

      setClasses(data?.data ?? data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes");
    }
  };

  const fetchAssignments = async (academicUnitId) => {
    try {
      const { data } = await api.get("/class-teachers", {
        params: { academicUnitId },
      });

      setAssignments(data?.data ?? data ?? []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    }
  };

  const selectedClassObj = useMemo(
    () => classes.find((cls) => cls._id === selectedClass),
    [classes, selectedClass]
  );

  const handleAssign = async () => {
    if (
      !selectedAcademicUnit ||
      !selectedClass ||
      !selectedArm ||
      !selectedTeacher
    ) {
      toast.error("Please select academic unit, class, arm and teacher");
      return;
    }

    try {
      setLoading(true);

      await api.post("/class-teachers", {
        academicUnitId: selectedAcademicUnit,
        classId: selectedClass,
        armId: selectedArm,
        teacherId: selectedTeacher,
      });

      toast.success("Class teacher assigned successfully");

      setSelectedClass("");
      setSelectedArm("");
      setSelectedTeacher("");

      fetchAssignments(selectedAcademicUnit);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error assigning teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!confirm("Remove this class teacher?")) return;

    try {
      await api.delete(`/class-teachers/${assignmentId}`);
      toast.success("Class teacher removed");
      fetchAssignments(selectedAcademicUnit);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove teacher");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Assign Class Teacher
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
              onChange={(e) => setSelectedAcademicUnit(e.target.value)}
            >
              <option value="">-- Select Academic Unit --</option>
              {visibleAcademicUnits.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Select Class
            </label>
            <select
              className="w-full rounded border p-2 text-sm disabled:bg-gray-100"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedArm("");
              }}
              disabled={!selectedAcademicUnit}
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Select Arm
              </label>
              <select
                className="w-full rounded border p-2 text-sm"
                value={selectedArm}
                onChange={(e) => setSelectedArm(e.target.value)}
              >
                <option value="">-- Select Arm --</option>
                {(selectedClassObj?.arms || []).map((arm) => (
                  <option key={arm._id} value={arm._id}>
                    {arm.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedArm && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Select Teacher
              </label>
              <select
                className="w-full rounded border p-2 text-sm"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleAssign}
          disabled={loading}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Assigning..." : "Assign Teacher"}
        </button>

        <div className="mt-8">
          <h3 className="mb-3 font-semibold text-gray-800">
            Current Class Teachers
          </h3>

          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No class teacher assigned yet.
            </p>
          ) : (
            <div className="space-y-3">
              {assignments.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.teacher?.name || "Teacher"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.academicUnitId?.name || "Academic Unit"} /{" "}
                      {item.classId?.name || "Class"} /{" "}
                      {item.armId?.name || "Arm"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}