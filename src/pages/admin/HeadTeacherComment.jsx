// src/pages/admin/HeadTeacherReportEntry.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const PAGE_SIZE = 10;
const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

const HeadTeacherReportEntry = () => {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedArm, setSelectedArm] = useState(null);

  const [activeSession, setActiveSession] = useState(null);
  const [activeTerm, setActiveTerm] = useState(null);

  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isFullAccess = ["admin", "super_admin", "master_admin"].includes(user?.role);
  const isHeadTeacher = user?.role === "head_teacher";
  const isAcademicUnitLocked = isHeadTeacher;

  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;

    if (isHeadTeacher) {
      return academicUnits.filter((unit) =>
        unit.name?.toLowerCase().includes("primary")
      );
    }

    return academicUnits;
  }, [academicUnits, isFullAccess, isHeadTeacher]);

  const selectedUnit = useMemo(
    () => academicUnits.find((unit) => unit._id === selectedAcademicUnit),
    [academicUnits, selectedAcademicUnit]
  );

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [activeRes, unitRes] = await Promise.all([
          api.get("/sessions/active"),
          api.get("/academic-units"),
        ]);

        setActiveSession(activeRes.data?.session || null);
        setActiveTerm(activeRes.data?.term || null);

        const unitsPayload = getApiData(unitRes);
        const units = Array.isArray(unitsPayload) ? unitsPayload : [];

        setAcademicUnits(units);

        if (isHeadTeacher) {
          const primaryUnit = units.find((unit) =>
            unit.name?.toLowerCase().includes("primary")
          );

          if (primaryUnit) {
            setSelectedAcademicUnit(primaryUnit._id);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch active session, term, or academic units.");
      }
    };

    fetchInitial();
  }, [isHeadTeacher]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedAcademicUnit) {
        setClasses([]);
        return;
      }

      try {
        const res = await api.get("/classes", {
          params: { academicUnitId: selectedAcademicUnit },
        });

        const payload = getApiData(res);
        setClasses(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch classes.");
      }
    };

    fetchClasses();
  }, [selectedAcademicUnit]);

  const handleAcademicUnitSelect = (academicUnitId) => {
    setSelectedAcademicUnit(academicUnitId);
    setSelectedClass(null);
    setSelectedArm(null);
    setStudents([]);
    setComments({});
    setCurrentPage(1);
    setSuccess("");
    setError("");
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls || null);
    setSelectedArm(null);
    setStudents([]);
    setComments({});
    setCurrentPage(1);
    setSuccess("");
    setError("");
  };

  const handleArmSelect = async (arm) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      setSelectedArm(arm || null);
      setStudents([]);
      setComments({});
      setCurrentPage(1);

      const classId = selectedClass?._id;
      const armId = arm?._id;

      if (!selectedAcademicUnit || !classId || !armId || !activeSession || !activeTerm) {
        setError("Please select academic unit, class and arm.");
        return;
      }

      const [studentRes, reportRes] = await Promise.all([
        api.get("/students", {
          params: {
            academicUnitId: selectedAcademicUnit,
            classId,
            armId,
            sessionId: activeSession._id,
          },
        }),
        api.get("/term-reports", {
          params: {
            academicUnitId: selectedAcademicUnit,
            classId,
            armId,
            sessionId: activeSession._id,
            termId: activeTerm._id,
          },
        }),
      ]);

      const studentList = Array.isArray(getApiData(studentRes))
        ? getApiData(studentRes)
        : [];

      const reports = Array.isArray(getApiData(reportRes))
        ? getApiData(reportRes)
        : [];

      const existingComments = {};

      reports.forEach((report) => {
        const sid = report.enrollmentId?.studentId?._id;
        if (sid) existingComments[sid] = report.headTeacherComment || "";
      });

      setStudents(studentList);
      setComments(existingComments);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load students or reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (studentId, value) => {
    setComments((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return students.slice(start, start + PAGE_SIZE);
  }, [students, currentPage]);

  const totalPages = Math.ceil(students.length / PAGE_SIZE);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      if (!selectedAcademicUnit || !selectedClass || !selectedArm) {
        setError("Please select academic unit, class and arm.");
        return;
      }

      const payload = Object.entries(comments).map(([studentId, comment]) => ({
        studentId,
        academicUnitId: selectedAcademicUnit,
        sessionId: activeSession?._id,
        termId: activeTerm?._id,
        headTeacherComment: comment,
      }));

      await api.post("/term-reports/head-teacher", {
        reports: payload,
      });

      setSuccess("Head teacher comments saved successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save comments.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-3 sm:p-5">
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-lg font-bold text-green-700 sm:text-xl">
            Head Teacher Report Entry
          </h1>

          {activeSession && activeTerm && (
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Session: <b>{activeSession.name}</b> | Term:{" "}
              <b>{activeTerm.name}</b>
            </p>
          )}

          {isAcademicUnitLocked && selectedUnit && (
            <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
              Restricted View: {selectedUnit.name}
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={selectedAcademicUnit}
              disabled={isAcademicUnitLocked}
              onChange={(e) => handleAcademicUnitSelect(e.target.value)}
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
              value={selectedClass?._id || ""}
              disabled={!selectedAcademicUnit}
              onChange={(e) => {
                const cls = classes.find((c) => c._id === e.target.value);
                handleClassSelect(cls);
              }}
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
              value={selectedArm?._id || ""}
              disabled={!selectedClass}
              onChange={(e) => {
                const arm = selectedClass?.arms?.find(
                  (a) => a._id === e.target.value
                );
                handleArmSelect(arm);
              }}
              className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">Select Arm</option>
              {(selectedClass?.arms || []).map((arm) => (
                <option key={arm._id} value={arm._id}>
                  {arm.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading students...
          </div>
        )}

        {!loading && selectedArm && students.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center text-gray-400 shadow-sm">
            No students found for this academic unit, class and arm.
          </div>
        )}

        {!loading && students.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-green-700">
                Head Teacher Comments
              </h2>

              <span className="text-xs text-gray-500">
                {students.length} students
              </span>
            </div>

            <div className="space-y-3">
              {paginatedStudents.map((enrollment) => {
                const student = enrollment.studentId;
                const sid = student?._id || enrollment._id;

                return (
                  <div key={sid} className="rounded-xl border bg-gray-50 p-3">
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {student?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {student?.admissionNumber}
                      </p>
                    </div>

                    <textarea
                      value={comments[sid] || ""}
                      onChange={(e) => handleCommentChange(sid, e.target.value)}
                      placeholder="Enter head teacher comment..."
                      rows={3}
                      className="w-full rounded-lg border p-2 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                );
              })}
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}

            <div className="sticky bottom-0 mt-6 bg-white pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving Comments..." : "Save Comments"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadTeacherReportEntry;