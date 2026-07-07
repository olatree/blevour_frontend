
// src/pages/student/StudentViewResult.jsx
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import api from "../../api/axios";
import PrintableResult from "../../components/student-results/printableResult";
import { getApiData } from "../../utils/resultUtils";

export default function StudentViewResult() {
  const printRef = useRef(null);

  const [studentInfo, setStudentInfo] = useState(null);
  const studentId = studentInfo?.studentId?._id || "";

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const [classSize, setClassSize] = useState(0);
  const [classTeacher, setClassTeacher] = useState(null);
  const [principal, setPrincipal] = useState(null);

  const [feeInfo, setFeeInfo] = useState({
    currentBalance: 0,
    nextTermFee: 0,
  });

  const [reportData, setReportData] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState("");

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${studentInfo?.studentId?.name || "Student"} Result`,
  });

  const isThirdTerm = (term) => {
    const name = term?.name?.toLowerCase() || "";
    return name.includes("third") || name.includes("3");
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        setLoadingStudent(true);
        setError("");

        const res = await api.get("/students/me");
        const payload = getApiData(res);

        if (!payload?.enrollment?._id || !payload?.enrollment?.studentId) {
          throw new Error("Student enrollment record not found.");
        }
        console.log("Fetched student info:", payload.enrollment);

        setStudentInfo(payload.enrollment);
      } catch (err) {
        console.error("Error fetching student info:", err);
        setStudentInfo(null);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Could not load student information. Please contact admin."
        );
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchStudentInfo();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        const payload = getApiData(res);
        setSessions(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Could not load academic sessions.");
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    const fetchClassTeacher = async () => {
      if (!studentInfo?.classId?._id || !studentInfo?.armId?._id) return;

      try {
        const res = await api.get(
          `/class-teachers/${studentInfo.classId._id}/${studentInfo.armId._id}`,
          {
            params: {
              academicUnitId: studentInfo.academicUnitId?._id || "",
            },
          }
        );

        const payload = getApiData(res);
        setClassTeacher(payload?.teacher || res.data?.teacher || payload || null);
      } catch (err) {
        console.error("Error fetching class teacher:", err);
        setClassTeacher({ name: "N/A" });
      }
    };

    fetchClassTeacher();
  }, [studentInfo]);

  useEffect(() => {
    const fetchPrincipal = async () => {
      if (!studentInfo?.academicUnitId?._id) return;

      try {
        const res = await api.get("/principals", {
          params: {
            academicUnitId: studentInfo.academicUnitId._id,
          },
        });

        const payload = getApiData(res);
        const principalData = Array.isArray(payload) ? payload[0] : payload;

        setPrincipal(principalData || { name: "N/A" });
      } catch (err) {
        console.error("Error fetching principal:", err);
        setPrincipal({ name: "N/A" });
      }
    };

    fetchPrincipal();
  }, [studentInfo]);

  useEffect(() => {
    const fetchClassSize = async () => {
      if (
        !studentInfo?.academicUnitId?._id ||
        !studentInfo?.classId?._id ||
        !studentInfo?.armId?._id ||
        !selectedSession?._id
      ) {
        setClassSize(0);
        return;
      }

      try {
        const res = await api.get("/students", {
          params: {
            academicUnitId: studentInfo.academicUnitId._id,
            classId: studentInfo.classId._id,
            armId: studentInfo.armId._id,
            sessionId: selectedSession._id,
          },
        });

        const payload = getApiData(res);
        setClassSize(Array.isArray(payload) ? payload.length : 0);
      } catch (err) {
        console.error("Error fetching class size:", err);
        setClassSize(0);
      }
    };

    fetchClassSize();
  }, [studentInfo, selectedSession]);

  const handleSessionChange = (e) => {
    const session = sessions.find((item) => item._id === e.target.value);

    setSelectedSession(session || null);
    setSelectedTerm(null);
    setReportData(null);
    setError("");
  };

  const handleTermChange = (e) => {
    const term = selectedSession?.terms?.find(
      (item) => item._id === e.target.value
    );

    setSelectedTerm(term || null);
    setReportData(null);
    setError("");
  };

  const fetchAllTermResults = async () => {
    if (!selectedSession || !studentId) return {};

    const terms = selectedSession.terms || [];

    const requests = terms.map((term) =>
      api
        .get("/results/student-term", {
          params: {
            sessionId: selectedSession._id,
            termId: term._id,
          },
        })
        .then((res) => ({ term, res }))
        .catch(() => null)
    );

    const responses = await Promise.all(requests);
    const resultsByTerm = {};

    responses.forEach((item) => {
      if (!item) return;

      const payload = getApiData(item.res) || item.res?.data;

      if (payload?.success || payload?.results) {
        resultsByTerm[item.term._id] = {
          termName: item.term.name,
          results: payload.results || [],
          termAverage: payload.termAverage || 0,
          comments: payload.comments || {},
        };
      }
    });

    return resultsByTerm;
  };

  const getNextTermContext = () => {
    if (!selectedSession || !selectedTerm) return null;

    const terms = selectedSession.terms || [];
    const currentIndex = terms.findIndex((t) => t._id === selectedTerm._id);

    if (currentIndex === -1) return null;

    const nextTerm = terms[currentIndex + 1];

    if (nextTerm) {
      return {
        sessionId: selectedSession._id,
        termId: nextTerm._id,
      };
    }

    const currentSessionIndex = sessions.findIndex(
      (s) => s._id === selectedSession._id
    );

    const nextSession = sessions[currentSessionIndex + 1];

    if (!nextSession) return null;

    const firstTerm = nextSession.terms?.find(
      (t) => t.name === "1st Term" || t.name?.toLowerCase().includes("1")
    );

    if (!firstTerm) return null;

    return {
      sessionId: nextSession._id,
      termId: firstTerm._id,
    };
  };

  const fetchFeeInfo = async () => {
  try {
    if (
      !studentInfo?.studentId?._id ||
      !selectedSession?._id ||
      !selectedTerm?._id
    ) {
      return {
        currentBalance: 0,
        nextTermFee: 0,
      };
    }

    const nextContext = getNextTermContext();

    const feeRes = await api.get("/fees/accounts/report-fee-info", {
      params: {
        studentId: studentInfo.studentId._id,
        sessionId: selectedSession._id,
        termId: selectedTerm._id,

        nextSessionId: nextContext?.sessionId || "",
        nextTermId: nextContext?.termId || "",
      },
    });

    return {
      currentBalance: Number(feeRes.data?.data?.currentBalance || 0),
      nextTermFee: Number(feeRes.data?.data?.nextTermFee || 0),
    };
  } catch (err) {
    console.error("Fee info error:", err);

    return {
      currentBalance: 0,
      nextTermFee: 0,
    };
  }
};

  const fetchResult = async () => {
    if (!selectedSession || !selectedTerm) {
      setError("Please select both session and term.");
      return;
    }

    if (!studentInfo || !studentId) {
      setError("Student information not loaded.");
      return;
    }

    try {
      setLoadingReport(true);
      setError("");
      setReportData(null);

      const shouldFetchAllTerms = isThirdTerm(selectedTerm);

      const allTermResults = shouldFetchAllTerms
        ? await fetchAllTermResults()
        : {};

      const [resultRes, attendanceRes] = await Promise.all([
        api.get("/results/student-term", {
          params: {
            sessionId: selectedSession._id,
            termId: selectedTerm._id,
          },
        }),
        api.get("/attendance/student/me", {
          params: {
            sessionId: selectedSession._id,
            termId: selectedTerm._id,
          },
        }),
      ]);

      const resultPayload = getApiData(resultRes) || resultRes.data;
      const attendancePayload = getApiData(attendanceRes) || attendanceRes.data;

      if (!resultPayload?.success && !resultPayload?.results) {
        setError(
          resultPayload?.message ||
            "No results found for selected session and term."
        );
        return;
      }

      const results = resultPayload.results || [];

      const calculatedAverage =
        results.length > 0
          ? results.reduce((sum, r) => sum + Number(r.total || 0), 0) /
            results.length
          : 0;

      const feeDetails = await fetchFeeInfo();
      setFeeInfo(feeDetails);

      setReportData({
        student: studentInfo,
        results,
        termAverage: resultPayload.termAverage || calculatedAverage,
        session: selectedSession.name,
        term: selectedTerm.name,
        comments: {
          classTeacher: resultPayload.comments?.classTeacher || "N/A",
          principal: resultPayload.comments?.principal || "N/A",
          headTeacher: resultPayload.comments?.headTeacher || "N/A",
        },
        attendance: attendancePayload?.records || [],
        classTeacher: classTeacher || { name: "N/A" },
        principal: principal || { name: "N/A" },
        classSize,
        allTermResults,
        isThirdTerm: shouldFetchAllTerms,
        feeInfo: feeDetails,
      });
    } catch (err) {
      console.error("Error fetching result:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch result. Please try again."
      );
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-4 shadow-lg sm:p-6">
        <h2 className="mb-4 text-center text-xl font-bold text-cyan-700 sm:text-2xl">
          View Term Result
        </h2>

        {loadingStudent ? (
          <p className="text-center text-gray-500">Loading student info...</p>
        ) : studentInfo ? (
          <>
            <div className="mb-4 rounded-xl bg-cyan-100 p-3 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {studentInfo.studentId?.name || "N/A"}
              </p>

              <p>
                <strong>Academic Unit:</strong>{" "}
                {studentInfo.academicUnitId?.name || "N/A"}
              </p>

              <p>
                <strong>Class:</strong> {studentInfo.classId?.name || "N/A"} -{" "}
                {studentInfo.armId?.name || "N/A"}
              </p>

              <p>
                <strong>Admission No:</strong>{" "}
                {studentInfo.studentId?.admissionNumber || "N/A"}
              </p>

              {classTeacher && (
                <p>
                  <strong>Class Teacher:</strong> {classTeacher.name || "N/A"}
                </p>
              )}
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Session
                </label>
                <select
                  onChange={handleSessionChange}
                  value={selectedSession?._id || ""}
                  className="w-full rounded-lg border p-2 bg-cyan-100" 
                >
                  <option value="">Select Session</option>
                  {sessions.map((session) => (
                    <option key={session._id} value={session._id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Term</label>
                <select
                  onChange={handleTermChange}
                  value={selectedTerm?._id || ""}
                  disabled={!selectedSession}
                  className="w-full rounded-lg border p-2 bg-cyan-200 disabled:bg-cyan-100"
                >
                  <option value="">Select Term</option>
                  {(selectedSession?.terms || []).map((term) => (
                    <option key={term._id} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={fetchResult}
              disabled={loadingReport || !selectedSession || !selectedTerm}
              className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-700"
            >
              {loadingReport ? "Loading Result..." : "Fetch Result"}
            </button>

            {reportData && (
              <button
                onClick={handlePrint}
                className="mt-3 w-full rounded-lg bg-gray-600 py-2 font-semibold text-white hover:bg-gray-700"
              >
                Print Result
              </button>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">
            Student enrollment record not found.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 py-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {reportData && (
        <div className="mt-6 overflow-x-auto">
          <div ref={printRef}>
            <PrintableResult {...reportData} />
          </div>
        </div>
      )}
    </div>
  );
}
