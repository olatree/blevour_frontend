

// import React, { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { FaTrash, FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";

// const SubjectManagement = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [academicUnits, setAcademicUnits] = useState([]);

//   const [form, setForm] = useState({
//     academicUnitId: "",
//     name: "",
//     category: "general",
//     isCompulsory: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [editingId, setEditingId] = useState(null);
//   const [editing, setEditing] = useState({
//     academicUnitId: "",
//     name: "",
//     category: "general",
//     isCompulsory: false,
//   });

//   useEffect(() => {
//     fetchPageData();
//   }, []);

//   const fetchPageData = async () => {
//     try {
//       setPageLoading(true);
//       setError("");

//       const [subjectsRes, unitsRes] = await Promise.all([
//         api.get("/subjects"),
//         api.get("/academic-units"),
//       ]);

//       setSubjects(subjectsRes.data?.data ?? subjectsRes.data ?? []);
//       setAcademicUnits(unitsRes.data?.data ?? unitsRes.data ?? []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load subject management data");
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleEditingChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setEditing((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddSubject = async (e) => {
//     e.preventDefault();

//     if (!form.academicUnitId) {
//       setError("Please select an academic unit");
//       return;
//     }

//     if (!form.name.trim()) {
//       setError("Subject name is required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const res = await api.post("/subjects", {
//         academicUnitId: form.academicUnitId,
//         name: form.name.trim(),
//         category: form.category,
//         isCompulsory: form.isCompulsory,
//       });

//       setSubjects((prev) => [...prev, res.data]);

//       setForm({
//         academicUnitId: "",
//         name: "",
//         category: "general",
//         isCompulsory: false,
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to add subject");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSubject = async (id) => {
//     if (!confirm("Are you sure you want to delete this subject?")) return;

//     try {
//       setError("");
//       await api.delete(`/subjects/${id}`);
//       setSubjects((prev) => prev.filter((s) => s._id !== id));
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to delete subject");
//     }
//   };

//   const startEditing = (subject) => {
//     setEditingId(subject._id);
//     setEditing({
//       academicUnitId: subject.academicUnitId?._id || subject.academicUnitId || "",
//       name: subject.name || "",
//       category: subject.category || "general",
//       isCompulsory: !!subject.isCompulsory,
//     });
//   };

//   const handleUpdateSubject = async (id) => {
//     if (!editing.academicUnitId) {
//       setError("Please select an academic unit");
//       return;
//     }

//     if (!editing.name.trim()) {
//       setError("Subject name is required");
//       return;
//     }

//     try {
//       setError("");

//       const res = await api.put(`/subjects/${id}`, {
//         academicUnitId: editing.academicUnitId,
//         name: editing.name.trim(),
//         category: editing.category,
//         isCompulsory: editing.isCompulsory,
//       });

//       setSubjects((prev) =>
//         prev.map((s) => (s._id === id ? res.data : s))
//       );

//       setEditingId(null);
//       setEditing({
//         academicUnitId: "",
//         name: "",
//         category: "general",
//         isCompulsory: false,
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update subject");
//     }
//   };

//   if (pageLoading) {
//     return <p className="p-6 text-sm text-gray-600">Loading...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
//       <h1 className="mb-6 text-2xl font-bold text-gray-800">
//         Subject Management
//       </h1>

//       <form
//         onSubmit={handleAddSubject}
//         className="mb-6 rounded-xl bg-white p-4 shadow-sm"
//       >
//         <h2 className="mb-3 font-semibold text-gray-800">Add Subject</h2>

//         <div className="grid gap-3 md:grid-cols-5">
//           <select
//             name="academicUnitId"
//             value={form.academicUnitId}
//             onChange={handleFormChange}
//             className="rounded-lg border px-3 py-2 text-sm"
//           >
//             <option value="">Select Academic Unit</option>
//             {academicUnits.map((unit) => (
//               <option key={unit._id} value={unit._id}>
//                 {unit.name}
//               </option>
//             ))}
//           </select>

//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleFormChange}
//             placeholder="Subject name"
//             className="rounded-lg border px-3 py-2 text-sm"
//           />

//           <select
//             name="category"
//             value={form.category}
//             onChange={handleFormChange}
//             className="rounded-lg border px-3 py-2 text-sm"
//           >
//             <option value="general">General</option>
//             <option value="science">Science</option>
//             <option value="arts">Arts</option>
//             <option value="commercial">Commercial</option>
//           </select>

//           <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700">
//             <input
//               type="checkbox"
//               name="isCompulsory"
//               checked={form.isCompulsory}
//               onChange={handleFormChange}
//             />
//             Compulsory
//           </label>

//           <button
//             type="submit"
//             className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
//             disabled={loading}
//           >
//             {loading ? "Adding..." : "Add Subject"}
//           </button>
//         </div>
//       </form>

//       {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

//       {subjects.length === 0 ? (
//         <p className="text-sm text-gray-500">No subjects added yet.</p>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {subjects.map((subject) => (
//             <div
//               key={subject._id}
//               className="rounded-xl border bg-white p-4 shadow-sm"
//             >
//               {editingId === subject._id ? (
//                 <div className="space-y-3">
//                   <select
//                     name="academicUnitId"
//                     value={editing.academicUnitId}
//                     onChange={handleEditingChange}
//                     className="w-full rounded-lg border px-3 py-2 text-sm"
//                   >
//                     <option value="">Select Academic Unit</option>
//                     {academicUnits.map((unit) => (
//                       <option key={unit._id} value={unit._id}>
//                         {unit.name}
//                       </option>
//                     ))}
//                   </select>

//                   <input
//                     type="text"
//                     name="name"
//                     value={editing.name}
//                     onChange={handleEditingChange}
//                     className="w-full rounded-lg border px-3 py-2 text-sm"
//                   />

//                   <select
//                     name="category"
//                     value={editing.category}
//                     onChange={handleEditingChange}
//                     className="w-full rounded-lg border px-3 py-2 text-sm"
//                   >
//                     <option value="general">General</option>
//                     <option value="science">Science</option>
//                     <option value="arts">Arts</option>
//                     <option value="commercial">Commercial</option>
//                   </select>

//                   <label className="flex items-center gap-2 text-sm text-gray-700">
//                     <input
//                       type="checkbox"
//                       name="isCompulsory"
//                       checked={editing.isCompulsory}
//                       onChange={handleEditingChange}
//                     />
//                     Compulsory
//                   </label>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleUpdateSubject(subject._id)}
//                       className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
//                     >
//                       <FaSave />
//                     </button>

//                     <button
//                       onClick={() => setEditingId(null)}
//                       className="rounded bg-gray-400 px-3 py-2 text-white hover:bg-gray-500"
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="font-semibold text-gray-800">
//                       {subject.name}
//                     </p>

//                     <p className="mt-1 text-xs text-gray-500">
//                       Academic Unit:{" "}
//                       {subject.academicUnitId?.name || "No Academic Unit"}
//                     </p>

//                     <div className="mt-2 flex flex-wrap gap-2">
//                       <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold capitalize text-blue-700">
//                         {subject.category || "general"}
//                       </span>

//                       {subject.isCompulsory && (
//                         <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
//                           Compulsory
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => startEditing(subject)}
//                       className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
//                     >
//                       <FaPencilAlt />
//                     </button>

//                     <button
//                       onClick={() => handleDeleteSubject(subject._id)}
//                       className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubjectManagement;


import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { FaTrash, FaPencilAlt, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

const SubjectManagement = () => {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [academicUnits, setAcademicUnits] = useState([]);

  const [form, setForm] = useState({
    academicUnitId: "",
    name: "",
    category: "general",
    isCompulsory: false,
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({
    academicUnitId: "",
    name: "",
    category: "general",
    isCompulsory: false,
  });

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

  const fetchSubjects = async (academicUnitId = "") => {
    try {
      const params = {};
      if (academicUnitId) params.academicUnitId = academicUnitId;

      const res = await api.get("/subjects", { params });
      const payload = getApiData(res);

      setSubjects(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      setSubjects([]);
      setError("Failed to load subjects");
    }
  };

  const fetchPageData = async () => {
    try {
      setPageLoading(true);
      setError("");

      const unitsRes = await api.get("/academic-units");
      const unitsPayload = getApiData(unitsRes);
      const units = Array.isArray(unitsPayload) ? unitsPayload : [];

      setAcademicUnits(units);

      if (!isFullAccess && restrictedUnitName) {
        const allowedUnit = units.find((unit) =>
          unit.name?.toLowerCase().includes(restrictedUnitName)
        );

        if (allowedUnit) {
          setForm((prev) => ({
            ...prev,
            academicUnitId: allowedUnit._id,
          }));

          await fetchSubjects(allowedUnit._id);
        } else {
          setSubjects([]);
          setError(`No ${restrictedUnitName} academic unit found.`);
        }
      } else {
        await fetchSubjects("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load subject management data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditingChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditing((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();

    if (!form.academicUnitId) {
      setError("Please select an academic unit");
      return;
    }

    if (!form.name.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/subjects", {
        academicUnitId: form.academicUnitId,
        name: form.name.trim(),
        category: form.category,
        isCompulsory: form.isCompulsory,
      });

      const created = getApiData(res);

      setSubjects((prev) => [...prev, created]);

      setForm({
        academicUnitId:
          !isFullAccess && visibleAcademicUnits[0]?._id
            ? visibleAcademicUnits[0]._id
            : "",
        name: "",
        category: "general",
        isCompulsory: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;

    try {
      setError("");
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subject");
    }
  };

  const startEditing = (subject) => {
    setEditingId(subject._id);
    setEditing({
      academicUnitId: subject.academicUnitId?._id || subject.academicUnitId || "",
      name: subject.name || "",
      category: subject.category || "general",
      isCompulsory: !!subject.isCompulsory,
    });
  };

  const handleUpdateSubject = async (id) => {
    if (!editing.academicUnitId) {
      setError("Please select an academic unit");
      return;
    }

    if (!editing.name.trim()) {
      setError("Subject name is required");
      return;
    }

    try {
      setError("");

      const res = await api.put(`/subjects/${id}`, {
        academicUnitId: editing.academicUnitId,
        name: editing.name.trim(),
        category: editing.category,
        isCompulsory: editing.isCompulsory,
      });

      const updated = getApiData(res);

      setSubjects((prev) => prev.map((s) => (s._id === id ? updated : s)));

      setEditingId(null);
      setEditing({
        academicUnitId: "",
        name: "",
        category: "general",
        isCompulsory: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subject");
    }
  };

  if (pageLoading) {
    return <p className="p-6 text-sm text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-800">
        Subject Management
      </h1>

      {!isFullAccess && visibleAcademicUnits[0] && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
          Restricted View: {visibleAcademicUnits[0].name}
        </p>
      )}

      <form
        onSubmit={handleAddSubject}
        className="mb-6 rounded-xl bg-white p-4 shadow-sm"
      >
        <h2 className="mb-3 font-semibold text-gray-800">Add Subject</h2>

        <div className="grid gap-3 md:grid-cols-5">
          <select
            name="academicUnitId"
            value={form.academicUnitId}
            onChange={handleFormChange}
            disabled={!isFullAccess}
            className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">Select Academic Unit</option>
            {visibleAcademicUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Subject name"
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleFormChange}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="general">General</option>
            <option value="science">Science</option>
            <option value="arts">Arts</option>
            <option value="commercial">Commercial</option>
          </select>

          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isCompulsory"
              checked={form.isCompulsory}
              onChange={handleFormChange}
            />
            Compulsory
          </label>

          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </div>
      </form>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {subjects.length === 0 ? (
        <p className="text-sm text-gray-500">No subjects added yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              {editingId === subject._id ? (
                <div className="space-y-3">
                  <select
                    name="academicUnitId"
                    value={editing.academicUnitId}
                    onChange={handleEditingChange}
                    disabled={!isFullAccess}
                    className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
                  >
                    <option value="">Select Academic Unit</option>
                    {visibleAcademicUnits.map((unit) => (
                      <option key={unit._id} value={unit._id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="name"
                    value={editing.name}
                    onChange={handleEditingChange}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />

                  <select
                    name="category"
                    value={editing.category}
                    onChange={handleEditingChange}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="general">General</option>
                    <option value="science">Science</option>
                    <option value="arts">Arts</option>
                    <option value="commercial">Commercial</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="isCompulsory"
                      checked={editing.isCompulsory}
                      onChange={handleEditingChange}
                    />
                    Compulsory
                  </label>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateSubject(subject._id)}
                      className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                    >
                      <FaSave />
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded bg-gray-400 px-3 py-2 text-white hover:bg-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{subject.name}</p>

                    <p className="mt-1 text-xs text-gray-500">
                      Academic Unit:{" "}
                      {subject.academicUnitId?.name || "No Academic Unit"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold capitalize text-blue-700">
                        {subject.category || "general"}
                      </span>

                      {subject.isCompulsory && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          Compulsory
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(subject)}
                      className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                    >
                      <FaPencilAlt />
                    </button>

                    <button
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;