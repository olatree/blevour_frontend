import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, X, Search } from "lucide-react";

const emptyFee = {
  feeType: "",
  amount: "",
  isCompulsory: true,
  appliesOnce: false,
  description: "",
};

const emptyForm = {
  academicUnitId: "",
  name: "",
  studentCategory: "returning",
  isActive: true,
  fees: [{ ...emptyFee }],
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatCategory = (value) =>
  (value || "all")
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function FeeTemplateManagement() {
  const [academicUnits, setAcademicUnits] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const getResponseData = (res) => res.data?.data ?? res.data;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [unitsRes, templatesRes] = await Promise.all([
        api.get("/academic-units"),
        api.get("/fee-templates"),
      ]);

      const unitsPayload = getResponseData(unitsRes);
      const templatesPayload = getResponseData(templatesRes);

      setAcademicUnits(Array.isArray(unitsPayload) ? unitsPayload : []);
      setTemplates(Array.isArray(templatesPayload) ? templatesPayload : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fee templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalAmount = useMemo(
    () =>
      form.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0),
    [form.fees]
  );

  const filteredTemplates = useMemo(() => {
    let list = templates;

    if (search.trim()) {
      const q = search.trim().toLowerCase();

      list = list.filter(
        (template) =>
          template.name?.toLowerCase().includes(q) ||
          template.academicUnitId?.name?.toLowerCase().includes(q)
      );
    }

    if (filterUnit) {
      list = list.filter(
        (template) =>
          String(template.academicUnitId?._id || template.academicUnitId) ===
          String(filterUnit)
      );
    }

    if (filterCategory) {
      list = list.filter(
        (template) => template.studentCategory === filterCategory
      );
    }

    if (filterStatus) {
      list = list.filter((template) =>
        filterStatus === "active" ? template.isActive : !template.isActive
      );
    }

    return list;
  }, [templates, search, filterUnit, filterCategory, filterStatus]);

  const openCreateDrawer = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (template) => {
    setEditingId(template._id);

    setForm({
      academicUnitId:
        template.academicUnitId?._id || template.academicUnitId || "",
      name: template.name || "",
      studentCategory: template.studentCategory || "returning",
      isActive: template.isActive !== false,
      fees:
        Array.isArray(template.fees) && template.fees.length > 0
          ? template.fees.map((fee) => ({
              feeType: fee.feeType || "",
              amount: fee.amount || "",
              isCompulsory: fee.isCompulsory !== false,
              appliesOnce: !!fee.appliesOnce,
              description: fee.description || "",
            }))
          : [{ ...emptyFee }],
    });

    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFee = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      fees: prev.fees.map((fee, i) =>
        i === index ? { ...fee, [field]: value } : fee
      ),
    }));
  };

  const addFeeRow = () => {
    setForm((prev) => ({
      ...prev,
      fees: [...prev.fees, { ...emptyFee }],
    }));
  };

  const removeFeeRow = (index) => {
    setForm((prev) => ({
      ...prev,
      fees:
        prev.fees.length === 1
          ? [{ ...emptyFee }]
          : prev.fees.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!form.academicUnitId) {
      toast.error("Please select academic unit");
      return false;
    }

    if (!form.name.trim()) {
      toast.error("Template name is required");
      return false;
    }

    const cleanedFees = form.fees
      .map((fee) => ({
        ...fee,
        feeType: fee.feeType.trim(),
        amount: Number(fee.amount || 0),
      }))
      .filter((fee) => fee.feeType || fee.amount);

    if (cleanedFees.length === 0) {
      toast.error("Add at least one fee");
      return false;
    }

    for (const fee of cleanedFees) {
      if (!fee.feeType) {
        toast.error("Every fee must have a name");
        return false;
      }

      if (Number(fee.amount) < 0 || Number.isNaN(Number(fee.amount))) {
        toast.error("Fee amount must be valid");
        return false;
      }
    }

    const feeNames = cleanedFees.map((fee) => fee.feeType.toLowerCase());
    const hasDuplicate = feeNames.some(
      (name, index) => feeNames.indexOf(name) !== index
    );

    if (hasDuplicate) {
      toast.error("Duplicate fee names are not allowed");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        academicUnitId: form.academicUnitId,
        name: form.name.trim(),
        studentCategory: form.studentCategory,
        isActive: form.isActive,
        fees: form.fees
          .map((fee) => ({
            feeType: fee.feeType.trim(),
            amount: Number(fee.amount || 0),
            isCompulsory: !!fee.isCompulsory,
            appliesOnce: !!fee.appliesOnce,
            description: fee.description?.trim() || "",
          }))
          .filter((fee) => fee.feeType),
      };

      if (editingId) {
        await api.put(`/fee-templates/${editingId}`, payload);
        toast.success("Fee template updated");
      } else {
        await api.post("/fee-templates", payload);
        toast.success("Fee template created");
      }

      await fetchData();
      closeDrawer();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to save fee template"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm("Delete this fee template?")) return;

    try {
      await api.delete(`/fee-templates/${templateId}`);
      toast.success("Fee template deleted");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to delete fee template"
      );
    }
  };

  const templateTotal = (template) =>
    (template.fees || []).reduce(
      (sum, fee) => sum + Number(fee.amount || 0),
      0
    );

  if (loading) {
    return <p className="p-6 text-sm text-gray-600">Loading fee templates...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Fee Templates
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create reusable fee groups for academic units and student categories.
            </p>
          </div>

          <button
            onClick={openCreateDrawer}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            <Plus size={16} />
            New Template
          </button>
        </div>

        <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm"
              />
            </div>

            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              <option value="all">All</option>
              <option value="returning">Returning</option>
              <option value="new_intake">New Intake</option>
              <option value="transfer">Transfer</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
            No fee templates found.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div
                key={template._id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {template.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {template.academicUnitId?.name || "Academic Unit"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      template.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {template.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {formatCategory(template.studentCategory)}
                  </span>

                  <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                    {(template.fees || []).length} fee(s)
                  </span>
                </div>

                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">
                    Template Total
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formatMoney(templateTotal(template))}
                  </p>
                </div>

                <div className="mb-4 max-h-36 space-y-2 overflow-y-auto">
                  {(template.fees || []).map((fee) => (
                    <div
                      key={fee._id || fee.feeType}
                      className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {fee.feeType}
                      </span>
                      <span className="text-gray-600">
                        {formatMoney(fee.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditDrawer(template)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(template._id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Fee Template" : "Create Fee Template"}
                </h2>
                <p className="text-sm text-gray-500">
                  Add reusable fees for a category.
                </p>
              </div>

              <button
                onClick={closeDrawer}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Academic Unit
                  </label>
                  <select
                    value={form.academicUnitId}
                    onChange={(e) =>
                      updateForm("academicUnitId", e.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="">Select Academic Unit</option>
                    {academicUnits.map((unit) => (
                      <option key={unit._id} value={unit._id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Student Category
                  </label>
                  <select
                    value={form.studentCategory}
                    onChange={(e) =>
                      updateForm("studentCategory", e.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="returning">Returning</option>
                    <option value="new_intake">New Intake</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Template Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g. Primary Returning"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateForm("isActive", e.target.checked)}
                />
                Active template
              </label>

              <div className="rounded-xl border bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Fees</h3>

                  <button
                    type="button"
                    onClick={addFeeRow}
                    className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    <Plus size={14} />
                    Add Fee
                  </button>
                </div>

                <div className="space-y-3">
                  {form.fees.map((fee, index) => (
                    <div
                      key={index}
                      className="rounded-xl border bg-white p-3"
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={fee.feeType}
                          onChange={(e) =>
                            updateFee(index, "feeType", e.target.value)
                          }
                          placeholder="Fee name e.g. Tuition"
                          className="rounded-lg border px-3 py-2 text-sm"
                        />

                        <input
                          type="number"
                          min="0"
                          value={fee.amount}
                          onChange={(e) =>
                            updateFee(index, "amount", e.target.value)
                          }
                          placeholder="Amount"
                          className="rounded-lg border px-3 py-2 text-sm"
                        />
                      </div>

                      <textarea
                        value={fee.description}
                        onChange={(e) =>
                          updateFee(index, "description", e.target.value)
                        }
                        placeholder="Description optional"
                        className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
                        rows={2}
                      />

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={fee.isCompulsory}
                              onChange={(e) =>
                                updateFee(
                                  index,
                                  "isCompulsory",
                                  e.target.checked
                                )
                              }
                            />
                            Compulsory
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={fee.appliesOnce}
                              onChange={(e) =>
                                updateFee(
                                  index,
                                  "appliesOnce",
                                  e.target.checked
                                )
                              }
                            />
                            Applies once
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFeeRow(index)}
                          className="inline-flex items-center gap-1 rounded bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 -mx-4 border-t bg-white p-4">
                <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white">
                  <span className="text-sm">Total</span>
                  <span className="text-xl font-bold">
                    {formatMoney(totalAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Save Template"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}