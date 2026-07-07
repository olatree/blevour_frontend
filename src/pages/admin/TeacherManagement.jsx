// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// export default function TeacherManagement() {
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [showForm, setShowForm] = useState(false);
//   const [editingTeacher, setEditingTeacher] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     isClassTeacher: false,
//     isActive: true,
//     picture: null,        // New: profile picture file
//     signature: null,      // New: signature file
//     picturePreview: "",   // For showing current/existing picture
//     signaturePreview: "", // For showing current/existing signature
//   });

//   const fetchTeachers = async () => {
//     try {
//       const res = await api.get("/teachers");
//       setTeachers(res.data);
//     } catch (err) {
//       console.log("Fetch Teachers error:", err);
//       setError("Failed to fetch teachers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   // Handle text, checkbox, and file inputs
//   const handleInputChange = (e) => {
//     const { name, value, type, checked, files } = e.target;

//     if (type === "file") {
//       const file = files[0];
//       if (file) {
//         setFormData({
//           ...formData,
//           [name]: file,
//           [name + "Preview"]: URL.createObjectURL(file), // Preview new upload
//         });
//       }
//     } else if (type === "checkbox") {
//       setFormData({ ...formData, [name]: checked });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSaveTeacher = async (e) => {
//     e.preventDefault();

//     // Prepare FormData for multipart upload
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("email", formData.email);
//     data.append("phone", formData.phone || "");
//     data.append("isClassTeacher", formData.isClassTeacher);
//     data.append("isActive", formData.isActive);

//     // Only append password if provided (important for edits!)
//     if (formData.password) {
//       data.append("password", formData.password);
//     }

//     // Append images if selected
//     if (formData.picture) data.append("picture", formData.picture);
//     if (formData.signature) data.append("signature", formData.signature);

//     try {
//       if (editingTeacher) {
//         await api.put(`/teachers/${editingTeacher._id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" }
//         });
//       } else {
//         await api.post("/teachers", data, {
//           headers: { "Content-Type": "multipart/form-data" }
//         });
//       }

//       // Reset form
//       setShowForm(false);
//       setEditingTeacher(null);
//       resetForm();
//       fetchTeachers();
//     } catch (err) {
//       console.error("Error saving teacher:", err.response?.data || err);
//       alert("Failed to save teacher: " + (err.response?.data?.message || err.message));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       phone: "",
//       isClassTeacher: false,
//       isActive: true,
//       picture: null,
//       signature: null,
//       picturePreview: "",
//       signaturePreview: "",
//     });
//   };

//   const handleEditTeacher = (teacher) => {
//     setEditingTeacher(teacher);
//     setFormData({
//       name: teacher.name || "",
//       email: teacher.email || "",
//       phone: teacher.phone || "",
//       password: "", // Never pre-fill password
//       isClassTeacher: teacher.isClassTeacher || false,
//       isActive: teacher.isActive ?? true,
//       picture: null,
//       signature: null,
//       picturePreview: teacher.picture || "", // Assuming backend sends URL
//       signaturePreview: teacher.signature || "", // Assuming backend sends URL
//     });
//     setShowForm(true);
//   };

//   const handleDeleteTeacher = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this teacher?")) return;
//     try {
//       await api.delete(`/teachers/${id}`);
//       fetchTeachers();
//     } catch (err) {
//       console.error("Error deleting teacher:", err);
//     }
//   };

//   const filteredTeachers = teachers.filter((t) => {
//     const matchesSearch =
//       t.name?.toLowerCase().includes(search.toLowerCase()) ||
//       t.email?.toLowerCase().includes(search.toLowerCase());
//     const matchesFilter =
//       filter === "all" ||
//       (filter === "class" && t.isClassTeacher) ||
//       (filter === "active" && t.isActive) ||
//       (filter === "inactive" && !t.isActive);
//     return matchesSearch && matchesFilter;
//   });

//   if (loading) return <p>Loading teachers...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Teacher Management</h1>

//       {/* Search, Filter, Add Button */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           className="border rounded-lg px-4 py-2 w-full sm:w-96"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <select
//           className="border rounded-lg px-4 py-2"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="all">All Teachers</option>
//           <option value="class">Class Teachers</option>
//           {/* <option value="active">Active Only</option>
//           <option value="inactive">Inactive Only</option> */}
//         </select>
//         <button
//           onClick={() => {
//             resetForm();
//             setEditingTeacher(null);
//             setShowForm(true);
//           }}
//           className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
//         >
//           + Add Teacher
//         </button>
//       </div>

//       {/* Desktop Table & Mobile Cards (unchanged except image display) */}
//       <div className="hidden sm:block overflow-x-auto shadow-md rounded-lg">
//         <table className="w-full border-collapse bg-white">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="border border-gray-300 px-6 py-3 text-left">Photo</th>
//               <th className="border border-gray-300 px-6 py-3 text-left">ID</th>
//               <th className="border border-gray-300 px-6 py-3 text-left">Name</th>
//               <th className="border border-gray-300 px-6 py-3 text-left">Email</th>
//               <th className="border border-gray-300 px-6 py-3 text-left">Phone</th>
//               <th className="border border-gray-300 px-6 py-3 text-left">Class Teacher</th>
//               {/* <th className="border border-gray-300 px-6 py-3 text-left">Status</th> */}
//               <th className="border border-gray-300 px-6 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTeachers.map((teacher) => (
//               <tr key={teacher._id} className="hover:bg-gray-50">
//                 <td className="border border-gray-300 px-6 py-4">
//                   {teacher.picture ? (
//                     <img src={teacher.picture} alt="pic" className="w-12 h-12 rounded-full object-cover" />
//                   ) : (
//                     <div className="bg-gray-200 border-2 border-dashed rounded-full w-12 h-12" />
//                   )}
//                 </td>
//                 <td className="border border-gray-300 px-6 py-4 font-medium">{teacher.userId}</td>
//                 <td className="border border-gray-300 px-6 py-4 font-medium">{teacher.name}</td>
//                 <td className="border border-gray-300 px-6 py-4">{teacher.email}</td>
//                 <td className="border border-gray-300 px-6 py-4">{teacher.phone || "-"}</td>
//                 <td className="border border-gray-300 px-6 py-4 text-center">
//                   {teacher.isClassTeacher ? "Yes" : "No"}
//                 </td>
//                 {/* <td className="border border-gray-300 px-6 py-4">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${teacher.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                     {teacher.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td> */}
//                 <td className="border border-gray-300 px-6 py-4 text-center space-x-2">
//                   <button
//                     onClick={() => handleEditTeacher(teacher)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteTeacher(teacher._id)}
//                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile View */}
//       <div className="sm:hidden space-y-4">
//         {filteredTeachers.map((teacher) => (
//           <div key={teacher._id} className="bg-white p-5 rounded-lg shadow border">
//             <div className="flex items-center gap-4 mb-3">
//               {teacher.picture ? (
//                 <img src={teacher.picture} alt="profile" className="w-16 h-16 rounded-full object-cover" />
//               ) : (
//                 <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16" />
//               )}
//               <div>
//                 <h3 className="font-bold text-lg">{teacher.name}</h3>
//                 <p className="text-sm text-gray-600">{teacher.email}</p>
//               </div>
//             </div>
//             <div className="text-sm space-y-1">
//               <p><strong>Phone:</strong> {teacher.phone || "-"}</p>
//               <p><strong>Class Teacher:</strong> {teacher.isClassTeacher ? "Yes" : "No"}</p>
//               <p><strong>Status:</strong> {teacher.isActive ? "Active" : "Inactive"}</p>
//             </div>
//             <div className="flex gap-3 mt-4">
//               <button onClick={() => handleEditTeacher(teacher)} className="flex-1 bg-blue-600 text-white py-2 rounded">
//                 Edit
//               </button>
//               <button onClick={() => handleDeleteTeacher(teacher._id)} className="flex-1 bg-red-600 text-white py-2 rounded">
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add/Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
//             <div className="p-6">
//               <h2 className="text-2xl font-bold mb-6">
//                 {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
//               </h2>

//               <form onSubmit={handleSaveTeacher} className="space-y-5">
//                 <div>
//                   <label className="block font-medium mb-1">Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-medium mb-1">Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     className="w-full border rounded-lg px-4 py-2"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     disabled={!!editingTeacher} // Usually email shouldn't change
//                   />
//                 </div>

//                 {!editingTeacher && (
//                   <div>
//                     <label className="block font-medium mb-1">Password *</label>
//                     <input
//                       type="password"
//                       name="password"
//                       required={!editingTeacher}
//                       className="w-full border rounded-lg px-4 py-2"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label className="block font-medium mb-1">Phone</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     className="w-full border rounded-lg px-4 py-2"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 {/* Teacher Picture */}
//                 <div>
//                   <label className="block font-medium mb-2">Teacher Photo</label>
//                   <input
//                     type="file"
//                     name="picture"
//                     accept="image/*"
//                     onChange={handleInputChange}
//                     className="w-full text-sm"
//                   />
//                   {(formData.picturePreview) && (
//                     <img
//                       src={formData.picturePreview}
//                       alt="Teacher preview"
//                       className="mt-3 w-32 h-32 object-cover rounded-lg border shadow"
//                     />
//                   )}
//                 </div>

//                 {/* Teacher Signature */}
//                 <div>
//                   <label className="block font-medium mb-2">Teacher Signature</label>
//                   <input
//                     type="file"
//                     name="signature"
//                     accept="image/*"
//                     onChange={handleInputChange}
//                     className="w-full text-sm"
//                   />
//                   {formData.signaturePreview && (
//                     <img
//                       src={formData.signaturePreview}
//                       alt="Signature preview"
//                       className="mt-3 max-w-full h-24 object-contain border rounded bg-gray-50 p-2"
//                     />
//                   )}
//                 </div>

//                 <div className="flex gap-6">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="isClassTeacher"
//                       checked={formData.isClassTeacher}
//                       onChange={handleInputChange}
//                     />
//                     <span>Class Teacher</span>
//                   </label>

//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       name="isActive"
//                       checked={formData.isActive}
//                       onChange={handleInputChange}
//                     />
//                     <span>Active Status</span>
//                   </label>
//                 </div>

//                 <div className="flex justify-end gap-4 mt-8">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       resetForm();
//                     }}
//                     className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                   >
//                     {editingTeacher ? "Update" : "Add"} Teacher
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function TeacherManagement() {
  const { user } = useAuth();

  const [teachers, setTeachers] = useState([]);
  const [academicUnits, setAcademicUnits] = useState([]);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    academicUnitId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    isClassTeacher: false,
    isActive: true,
    picture: null,
    signature: null,
    picturePreview: "",
    signaturePreview: "",
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

  const getApiData = (res) => res?.data?.data ?? res?.data ?? [];

  const fetchAcademicUnits = async () => {
    try {
      const res = await api.get("/academic-units");
      const units = getApiData(res);

      setAcademicUnits(Array.isArray(units) ? units : []);

      if (!isFullAccess && restrictedUnitName) {
        const allowedUnit = units.find((unit) =>
          unit.name?.toLowerCase().includes(restrictedUnitName)
        );

        if (allowedUnit) {
          setSelectedAcademicUnit(allowedUnit._id);
          setFormData((prev) => ({
            ...prev,
            academicUnitId: allowedUnit._id,
          }));
        }
      }
    } catch (err) {
      console.error("Fetch academic units error:", err);
    }
  };

  const fetchTeachers = async (academicUnitId = selectedAcademicUnit) => {
    try {
      setLoading(true);

      const params = {};
      if (academicUnitId) params.academicUnitId = academicUnitId;

      const res = await api.get("/teachers", { params });
      const payload = getApiData(res);

      setTeachers(Array.isArray(payload) ? payload : []);
      setError("");
    } catch (err) {
      console.log("Fetch Teachers error:", err);
      setError("Failed to fetch teachers");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    fetchTeachers(selectedAcademicUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit]);

  const resetForm = () => {
    setFormData({
      academicUnitId:
        !isFullAccess && visibleAcademicUnits[0]?._id
          ? visibleAcademicUnits[0]._id
          : selectedAcademicUnit || "",
      name: "",
      email: "",
      password: "",
      phone: "",
      isClassTeacher: false,
      isActive: true,
      picture: null,
      signature: null,
      picturePreview: "",
      signaturePreview: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
          [name + "Preview"]: URL.createObjectURL(file),
        }));
      }

      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTeacher = async (e) => {
    e.preventDefault();

    if (!formData.academicUnitId) {
      alert("Please select academic unit");
      return;
    }

    const data = new FormData();

    data.append("academicUnitId", formData.academicUnitId);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone || "");
    data.append("isClassTeacher", formData.isClassTeacher);
    data.append("isActive", formData.isActive);

    if (formData.password) {
      data.append("password", formData.password);
    }

    if (formData.picture) data.append("picture", formData.picture);
    if (formData.signature) data.append("signature", formData.signature);

    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/teachers", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowForm(false);
      setEditingTeacher(null);
      resetForm();
      fetchTeachers();
    } catch (err) {
      console.error("Error saving teacher:", err.response?.data || err);
      alert(
        "Failed to save teacher: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      academicUnitId: teacher.academicUnitId?._id || teacher.academicUnitId || "",
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      password: "",
      isClassTeacher: teacher.isClassTeacher || false,
      isActive: teacher.isActive ?? true,
      picture: null,
      signature: null,
      picturePreview: teacher.picture || "",
      signaturePreview: teacher.signature || "",
    });

    setShowForm(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.userId?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "class" && teacher.isClassTeacher) ||
      (filter === "active" && teacher.isActive) ||
      (filter === "inactive" && !teacher.isActive);

    return matchesSearch && matchesFilter;
  });

  if (loading) return <p className="p-6">Loading teachers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Management
          </h1>

          {!isFullAccess && visibleAcademicUnits[0] && (
            <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
              Restricted View: {visibleAcademicUnits[0].name}
            </p>
          )}
        </div>

        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <select
              value={selectedAcademicUnit}
              disabled={!isFullAccess}
              onChange={(e) => {
                setSelectedAcademicUnit(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  academicUnitId: e.target.value,
                }));
              }}
              className="rounded-lg border px-4 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="">All Academic Units</option>
              {visibleAcademicUnits.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by name, email or ID..."
              className="rounded-lg border px-4 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="rounded-lg border px-4 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Teachers</option>
              <option value="class">Class Teachers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <button
              onClick={() => {
                resetForm();
                setEditingTeacher(null);
                setShowForm(true);
              }}
              className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition hover:bg-green-700"
            >
              + Add Teacher
            </button>
          </div>
        </div>

        <div className="hidden overflow-x-auto rounded-lg bg-white shadow-md sm:block">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-3 text-left">Photo</th>
                <th className="border px-4 py-3 text-left">ID</th>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3 text-left">Academic Unit</th>
                <th className="border px-4 py-3 text-left">Email</th>
                <th className="border px-4 py-3 text-left">Phone</th>
                <th className="border px-4 py-3 text-center">
                  Class Teacher
                </th>
                <th className="border px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3">
                    {teacher.picture ? (
                      <img
                        src={teacher.picture}
                        alt="pic"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full border-2 border-dashed bg-gray-200" />
                    )}
                  </td>

                  <td className="border px-4 py-3 font-medium">
                    {teacher.userId || "-"}
                  </td>

                  <td className="border px-4 py-3 font-medium">
                    {teacher.name}
                  </td>

                  <td className="border px-4 py-3">
                    {teacher.academicUnitId?.name || "—"}
                  </td>

                  <td className="border px-4 py-3">{teacher.email}</td>

                  <td className="border px-4 py-3">{teacher.phone || "-"}</td>

                  <td className="border px-4 py-3 text-center">
                    {teacher.isClassTeacher ? "Yes" : "No"}
                  </td>

                  <td className="space-x-2 border px-4 py-3 text-center">
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="rounded bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 sm:hidden">
          {filteredTeachers.map((teacher) => (
            <div key={teacher._id} className="rounded-lg border bg-white p-5 shadow">
              <div className="mb-3 flex items-center gap-4">
                {teacher.picture ? (
                  <img
                    src={teacher.picture}
                    alt="profile"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full border-2 border-dashed bg-gray-200" />
                )}

                <div>
                  <h3 className="text-lg font-bold">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.email}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <strong>ID:</strong> {teacher.userId || "-"}
                </p>
                <p>
                  <strong>Academic Unit:</strong>{" "}
                  {teacher.academicUnitId?.name || "—"}
                </p>
                <p>
                  <strong>Phone:</strong> {teacher.phone || "-"}
                </p>
                <p>
                  <strong>Class Teacher:</strong>{" "}
                  {teacher.isClassTeacher ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {teacher.isActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEditTeacher(teacher)}
                  className="flex-1 rounded bg-blue-600 py-2 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteTeacher(teacher._id)}
                  className="flex-1 rounded bg-red-600 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredTeachers.length === 0 && (
            <div className="rounded bg-white p-6 text-center text-gray-500">
              No teachers found.
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="max-h-screen w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold">
                  {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                </h2>

                <form onSubmit={handleSaveTeacher} className="space-y-5">
                  <div>
                    <label className="mb-1 block font-medium">
                      Academic Unit *
                    </label>
                    <select
                      name="academicUnitId"
                      required
                      value={formData.academicUnitId}
                      onChange={handleInputChange}
                      disabled={!isFullAccess}
                      className="w-full rounded-lg border px-4 py-2 disabled:bg-gray-100"
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
                    <label className="mb-1 block font-medium">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full rounded-lg border px-4 py-2"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-medium">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-lg border px-4 py-2"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!!editingTeacher}
                    />
                  </div>

                  {!editingTeacher && (
                    <div>
                      <label className="mb-1 block font-medium">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full rounded-lg border px-4 py-2"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  {editingTeacher && (
                    <div>
                      <label className="mb-1 block font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Leave blank to keep old password"
                        className="w-full rounded-lg border px-4 py-2"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block font-medium">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full rounded-lg border px-4 py-2"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium">
                      Teacher Photo
                    </label>
                    <input
                      type="file"
                      name="picture"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full text-sm"
                    />

                    {formData.picturePreview && (
                      <img
                        src={formData.picturePreview}
                        alt="Teacher preview"
                        className="mt-3 h-32 w-32 rounded-lg border object-cover shadow"
                      />
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block font-medium">
                      Teacher Signature
                    </label>
                    <input
                      type="file"
                      name="signature"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full text-sm"
                    />

                    {formData.signaturePreview && (
                      <img
                        src={formData.signaturePreview}
                        alt="Signature preview"
                        className="mt-3 h-24 max-w-full rounded border bg-gray-50 object-contain p-2"
                      />
                    )}
                  </div>

                  <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        name="isClassTeacher"
                        checked={formData.isClassTeacher}
                        onChange={handleInputChange}
                      />
                      <span>Class Teacher</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <span>Active Status</span>
                    </label>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
                    >
                      {editingTeacher ? "Update" : "Add"} Teacher
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}