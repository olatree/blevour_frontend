// src/pages/admin/AcademicUnitsPage.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function AcademicUnitsPage() {
  const [units, setUnits] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [schools, setSchools] = useState([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    organizationId: "",
    schoolId: "",
    name: "",
    isActive: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [unitsRes, orgRes, schoolRes] = await Promise.allSettled([
        api.get("/academic-units"),
        api.get("/organizations"),
        api.get("/schools"),
      ]);

      if (unitsRes.status === "fulfilled") {
        setUnits(unitsRes.value.data?.data ?? unitsRes.value.data ?? []);
      }

      if (orgRes.status === "fulfilled") {
        setOrganizations(orgRes.value.data?.data ?? orgRes.value.data ?? []);
      }

      if (schoolRes.status === "fulfilled") {
        setSchools(schoolRes.value.data?.data ?? schoolRes.value.data ?? []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load academic units");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSchools = form.organizationId
    ? schools.filter(
        (school) =>
          String(school.organizationId?._id || school.organizationId) ===
          String(form.organizationId)
      )
    : schools;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "organizationId" ? { schoolId: "" } : {}),
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Academic unit name is required");
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        isActive: form.isActive,
      };

      if (form.organizationId) payload.organizationId = form.organizationId;
      if (form.schoolId) payload.schoolId = form.schoolId;

      await api.post("/academic-units", payload);

      toast.success("Academic unit created");

      setForm({
        organizationId: "",
        schoolId: "",
        name: "",
        isActive: true,
      });

      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create academic unit"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this academic unit?")) return;

    try {
      await api.delete(`/academic-units/${id}`);
      toast.success("Academic unit deleted");
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete academic unit"
      );
    }
  };

  const handleToggleActive = async (unit) => {
    try {
      await api.put(`/academic-units/${unit._id}`, {
        isActive: !unit.isActive,
      });

      toast.success("Academic unit updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update academic unit");
    }
  };

  if (loading) {
    return <p className="p-4 text-sm text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800">
          Academic Unit Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage units like Nursery, Primary, Junior Secondary, Senior Secondary,
          or College.
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800">
          Add Academic Unit
        </h2>

        <div className="grid gap-3 md:grid-cols-4">
          <select
            name="organizationId"
            value={form.organizationId}
            onChange={handleChange}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select Organization optional</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>

          <select
            name="schoolId"
            value={form.schoolId}
            onChange={handleChange}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select School optional</option>
            {filteredSchools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="e.g. Primary, Secondary"
            value={form.name}
            onChange={handleChange}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <button
          onClick={handleCreate}
          className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Add Academic Unit
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800">
          Existing Academic Units
        </h2>

        {units.length === 0 ? (
          <p className="text-sm text-gray-500">No academic units found.</p>
        ) : (
          <div className="space-y-3">
            {units.map((unit) => (
              <div
                key={unit._id}
                className="flex flex-col gap-3 rounded-xl border bg-gray-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-gray-800">{unit.name}</p>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        unit.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {unit.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Organization: {unit.organizationId?.name || "Not assigned"}
                  </p>

                  <p className="text-xs text-gray-500">
                    School: {unit.schoolId?.name || "Not assigned"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleActive(unit)}
                    className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    {unit.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(unit._id)}
                    className="rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}