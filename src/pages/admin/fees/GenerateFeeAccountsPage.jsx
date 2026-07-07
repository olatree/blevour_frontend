

import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";

const formatMoney = (value) =>
  `₦${Number(value || 0).toLocaleString()}`;

const formatCategory = (value) =>
  (value || "")
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const structureTotal = (structure) =>
  (structure.templateMappings || []).reduce(
    (sum, mapping) => sum + Number(mapping.totalAmount || 0),
    0
  );

const GenerateFeeAccountsPage = () => {
  const [structures, setStructures] = useState([]);
  const [academicUnits, setAcademicUnits] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [previewStructure, setPreviewStructure] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getData = (res) => res.data?.data ?? res.data ?? [];

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [unitsRes, sessionsRes, structuresRes] = await Promise.all([
        api.get("/academic-units"),
        api.get("/sessions"),
        api.get("/fee-structures", {
          params: {
            isActive: true,
            isPublished: true,
          },
        }),
      ]);

      setAcademicUnits(getData(unitsRes));
      setSessions(getData(sessionsRes));
      setStructures(getData(structuresRes));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  const fetchStructures = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        isActive: true,
        isPublished: true,
      };

      if (selectedAcademicUnit) params.academicUnitId = selectedAcademicUnit;
      if (selectedSession) params.sessionId = selectedSession;
      if (selectedTerm) params.termId = selectedTerm;

      const res = await api.get("/fee-structures", { params });
      setStructures(getData(res));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStructures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit, selectedSession, selectedTerm]);

  const selectedSessionObj = sessions.find((s) => s._id === selectedSession);
  const terms = selectedSessionObj?.terms || selectedSessionObj?.termIds || [];

  const dashboardSummary = useMemo(() => {
    const totalStructures = structures.length;
    const totalEstimated = structures.reduce(
      (sum, item) => sum + structureTotal(item),
      0
    );

    return {
      totalStructures,
      totalEstimated,
    };
  }, [structures]);

  const handleGenerate = async (structure) => {
    setMessage("");
    setError("");

    const mappings = structure.templateMappings || [];

    const summary = mappings
      .map(
        (m) =>
          `${formatCategory(m.studentCategory)}: ${formatMoney(
            m.totalAmount
          )}`
      )
      .join("\n");

    const ok = window.confirm(
      `Generate fee accounts for:\n\n${structure.academicUnitId?.name || ""} / ${
        structure.classId?.name || "Class"
      } ${structure.armId?.name || "All Arms"}\n${
        structure.sessionId?.name || ""
      } • ${structure.termId?.name || ""}\n\n${summary}\n\nContinue?`
    );

    if (!ok) return;

    try {
      setGeneratingId(structure._id);

      const res = await api.post("/fees/accounts/generate", {
        feeStructureId: structure._id,
      });

      setMessage(
        `Generated successfully. Created: ${res.data.created || 0}, Skipped: ${
          res.data.skipped || 0
        }, Carried Over: ${res.data.carriedOver || 0}, Total students: ${
          res.data.totalStudents || 0
        }`
      );

      await fetchStructures();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate accounts");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleSync = async (structure) => {
  setMessage("");
  setError("");

  const ok = window.confirm(
    `Sync existing fee accounts for:\n\n${
      structure.academicUnitId?.name || ""
    } / ${structure.classId?.name || "Class"} ${
      structure.armId?.name || "All Arms"
    }\n${structure.sessionId?.name || ""} • ${
      structure.termId?.name || ""
    }\n\nThis will add new fee items and update unpaid items only.\nPaid items will not be changed.\n\nContinue?`
  );

  if (!ok) return;

  try {
    setGeneratingId(structure._id);

    const res = await api.patch("/fees/accounts/sync", {
      feeStructureId: structure._id,
    });

    setMessage(
      `Sync completed. Updated accounts: ${
        res.data.accountsUpdated || 0
      }, Unchanged: ${res.data.accountsUnchanged || 0}, Missing accounts: ${
        res.data.accountsMissing || 0
      }, New items added: ${
        res.data.totalAddedItems || 0
      }, Unpaid items updated: ${res.data.totalUpdatedItems || 0}`
    );

    await fetchStructures();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to sync fee accounts");
  } finally {
    setGeneratingId(null);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Fee Account Generation
        </h1>

        <p className="text-sm text-gray-500">
          Generate student fee accounts from multi-template fee structures.
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Structures</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {dashboardSummary.totalStructures}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">
            Category Templates
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {structures.reduce(
              (sum, s) => sum + Number(s.templateMappings?.length || 0),
              0
            )}
          </p>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">
            Combined Template Totals
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {formatMoney(dashboardSummary.totalEstimated)}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-semibold">How generation works:</p>
        <p className="mt-1">
          The system checks each student&apos;s billing category, then applies
          the matching template inside the fee structure: Returning, New Intake,
          or Transfer.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={selectedAcademicUnit}
            onChange={(e) => setSelectedAcademicUnit(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Academic Units</option>
            {academicUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSession}
            onChange={(e) => {
              setSelectedSession(e.target.value);
              setSelectedTerm("");
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">All Sessions</option>
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            disabled={!selectedSession}
            className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">All Terms</option>
            {terms.map((term) => (
              <option key={term._id} value={term._id}>
                {term.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchStructures}
            disabled={loading}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-gray-700">
            Available Fee Structures
          </h2>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : structures.length === 0 ? (
          <p className="text-sm text-gray-500">No fee structures found.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {structures.map((structure) => (
              <div
                key={structure._id}
                className="rounded-xl border bg-gray-50 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {structure.academicUnitId?.name || "Academic Unit"} /{" "}
                      {structure.classId?.name || "Class"} /{" "}
                      {structure.armId?.name || "All Arms"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {structure.sessionId?.name || "Session"} •{" "}
                      {structure.termId?.name || "Term"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        structure.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {structure.isActive ? "Active" : "Inactive"}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        structure.isPublished
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {structure.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {(structure.templateMappings || []).map((mapping) => (
                    <div
                      key={mapping._id || mapping.studentCategory}
                      className="rounded-lg bg-white p-3 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-gray-500">
                        {formatCategory(mapping.studentCategory)}
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                        {mapping.feeTemplateId?.name || "Template"}
                      </p>

                      <p className="mt-2 text-lg font-bold text-gray-900">
                        {formatMoney(mapping.totalAmount)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {(mapping.fees || []).length} fee item(s)
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Combined category total
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatMoney(structureTotal(structure))}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => setPreviewStructure(structure)}
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Preview Templates
                  </button>

                  <button
                    disabled={
                      !structure.isActive ||
                      !structure.isPublished ||
                      generatingId === structure._id
                    }
                    onClick={() => handleGenerate(structure)}
                    className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {generatingId === structure._id
                      ? "Generating..."
                      : "Generate Accounts"}
                  </button>

                  <button
                    disabled={
                      !structure.isActive ||
                      !structure.isPublished ||
                      generatingId === structure._id
                    }
                    onClick={() => handleSync(structure)}
                    className="flex-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sync Existing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewStructure && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3"
          onClick={() => setPreviewStructure(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Fee Structure Preview
                </h2>
                <p className="text-sm text-gray-500">
                  {previewStructure.academicUnitId?.name || "Unit"} /{" "}
                  {previewStructure.classId?.name || "Class"} /{" "}
                  {previewStructure.armId?.name || "All Arms"}
                </p>
              </div>

              <button
                onClick={() => setPreviewStructure(null)}
                className="rounded bg-gray-200 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {(previewStructure.templateMappings || []).map((mapping) => (
                <div
                  key={mapping._id || mapping.studentCategory}
                  className="rounded-xl border bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {formatCategory(mapping.studentCategory)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Template: {mapping.feeTemplateId?.name || "N/A"}
                      </p>
                    </div>

                    <p className="text-lg font-bold">
                      {formatMoney(mapping.totalAmount)}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-white text-left">
                        <tr>
                          <th className="border px-3 py-2">Fee</th>
                          <th className="border px-3 py-2">Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(mapping.fees || []).map((fee) => (
                          <tr key={fee._id || fee.feeType}>
                            <td className="border px-3 py-2">
                              {fee.feeType}
                            </td>
                            <td className="border px-3 py-2">
                              {formatMoney(fee.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateFeeAccountsPage;