// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { toast } from "react-hot-toast";

// export default function ClassesPage() {
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [newClass, setNewClass] = useState({
//     name: "",
//     arms: "",
//     isGraduatingClass: false,
//   });

//   const fetchClasses = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/classes");

//       const payload = data?.data ?? data ?? [];

//       const withEditing = payload.map((cls) => ({
//         ...cls,
//         isEditing: false,
//         editName: cls.name,
//         editIsGraduatingClass: !!cls.isGraduatingClass,
//       }));

//       setClasses(withEditing);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch classes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setNewClass((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddClass = async () => {
//     if (!newClass.name.trim()) {
//       toast.error("Class name is required");
//       return;
//     }

//     try {
//       const armsArray = newClass.arms
//         ? newClass.arms
//             .split(",")
//             .map((a) => a.trim())
//             .filter(Boolean)
//         : [];

//       await api.post("/classes", {
//         name: newClass.name.trim(),
//         arms: armsArray,
//         isGraduatingClass: newClass.isGraduatingClass,
//       });

//       toast.success("Class created!");
//       setNewClass({
//         name: "",
//         arms: "",
//         isGraduatingClass: false,
//       });

//       fetchClasses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to create class");
//     }
//   };

//   const handleDeleteClass = async (id) => {
//     if (!confirm("Are you sure you want to delete this class?")) return;

//     try {
//       await api.delete(`/classes/${id}`);
//       toast.success("Class deleted");
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete class");
//     }
//   };

//   const toggleEdit = (id, editing) => {
//     setClasses((prev) =>
//       prev.map((cls) =>
//         cls._id === id
//           ? {
//               ...cls,
//               isEditing: editing,
//               editName: cls.name,
//               editIsGraduatingClass: !!cls.isGraduatingClass,
//             }
//           : cls
//       )
//     );
//   };

//   const updateClassField = (id, field, value) => {
//     setClasses((prev) =>
//       prev.map((cls) =>
//         cls._id === id
//           ? {
//               ...cls,
//               [field]: value,
//             }
//           : cls
//       )
//     );
//   };

//   const handleUpdateClass = async (cls) => {
//     if (!cls.editName.trim()) {
//       toast.error("Class name is required");
//       return;
//     }

//     try {
//       await api.put(`/classes/${cls._id}`, {
//         name: cls.editName.trim(),
//         isGraduatingClass: !!cls.editIsGraduatingClass,
//       });

//       toast.success("Class updated");
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update class");
//     }
//   };

//   const handleAddArm = async (classId, armName) => {
//     try {
//       await api.post(`/classes/${classId}/arms`, { name: armName });
//       toast.success("Arm added");
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add arm");
//     }
//   };

//   const handleUpdateArm = async (armId, name) => {
//     try {
//       await api.put(`/classes/arms/${armId}`, { name });
//       toast.success("Arm updated");
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update arm");
//     }
//   };

//   const handleDeleteArm = async (armId) => {
//     if (!confirm("Are you sure you want to delete this arm?")) return;

//     try {
//       await api.delete(`/classes/arms/${armId}`);
//       toast.success("Arm deleted");
//       fetchClasses();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete arm");
//     }
//   };

//   if (loading) return <p className="p-4">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
//       <h1 className="mb-4 text-2xl font-bold text-gray-800">
//         Class Management
//       </h1>

//       <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
//         <h2 className="mb-3 font-semibold text-gray-800">Add New Class</h2>

//         <div className="grid gap-3 md:grid-cols-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Class Name e.g. SS3"
//             value={newClass.name}
//             onChange={handleChange}
//             className="rounded-lg border px-3 py-2 text-sm"
//           />

//           <input
//             type="text"
//             name="arms"
//             placeholder="Arms e.g. A, B, C"
//             value={newClass.arms}
//             onChange={handleChange}
//             className="rounded-lg border px-3 py-2 text-sm md:col-span-2"
//           />

//           <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700">
//             <input
//               type="checkbox"
//               name="isGraduatingClass"
//               checked={newClass.isGraduatingClass}
//               onChange={handleChange}
//             />
//             Graduating Class
//           </label>
//         </div>

//         <button
//           onClick={handleAddClass}
//           className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
//         >
//           Add Class
//         </button>
//       </div>

//       <div className="rounded-xl bg-white p-4 shadow-sm">
//         <h2 className="mb-3 font-semibold text-gray-800">Existing Classes</h2>

//         {classes.length === 0 ? (
//           <p className="text-sm text-gray-500">No classes found.</p>
//         ) : (
//           <div className="space-y-4">
//             {classes.map((cls) => (
//               <div
//                 key={cls._id}
//                 className="rounded-xl border bg-gray-50 p-4"
//               >
//                 <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
//                   <div className="flex-1">
//                     {cls.isEditing ? (
//                       <div className="space-y-3">
//                         <div className="grid gap-3 md:grid-cols-3">
//                           <input
//                             type="text"
//                             value={cls.editName}
//                             onChange={(e) =>
//                               updateClassField(
//                                 cls._id,
//                                 "editName",
//                                 e.target.value
//                               )
//                             }
//                             className="rounded-lg border px-3 py-2 text-sm"
//                           />

//                           <label className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
//                             <input
//                               type="checkbox"
//                               checked={!!cls.editIsGraduatingClass}
//                               onChange={(e) =>
//                                 updateClassField(
//                                   cls._id,
//                                   "editIsGraduatingClass",
//                                   e.target.checked
//                                 )
//                               }
//                             />
//                             Graduating Class
//                           </label>
//                         </div>

//                         <div className="flex flex-wrap gap-2">
//                           <button
//                             onClick={() => handleUpdateClass(cls)}
//                             className="rounded bg-green-600 px-3 py-2 text-sm text-white"
//                           >
//                             Save
//                           </button>

//                           <button
//                             onClick={() => toggleEdit(cls._id, false)}
//                             className="rounded bg-gray-300 px-3 py-2 text-sm text-gray-700"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex flex-wrap items-center gap-2">
//                         <p className="font-semibold text-gray-800">
//                           {cls.name}
//                         </p>

//                         {cls.isGraduatingClass && (
//                           <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
//                             🎓 Graduating Class
//                           </span>
//                         )}

//                         <button
//                           onClick={() => toggleEdit(cls._id, true)}
//                           className="text-sm text-blue-600 hover:underline"
//                         >
//                           Edit
//                         </button>
//                       </div>
//                     )}

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {(cls.arms || []).map((arm) => (
//                         <ArmItem
//                           key={arm._id}
//                           arm={arm}
//                           onDelete={handleDeleteArm}
//                           onUpdate={handleUpdateArm}
//                         />
//                       ))}

//                       <AddArmInput classId={cls._id} onAdd={handleAddArm} />
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => handleDeleteClass(cls._id)}
//                     className="self-start rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function AddArmInput({ classId, onAdd }) {
//   const [armName, setArmName] = useState("");

//   return (
//     <div className="flex items-center gap-1">
//       <input
//         type="text"
//         value={armName}
//         onChange={(e) => setArmName(e.target.value)}
//         placeholder="Add Arm"
//         className="w-24 rounded border px-2 py-1 text-sm"
//       />

//       <button
//         onClick={() => {
//           if (!armName.trim()) return;
//           onAdd(classId, armName.trim());
//           setArmName("");
//         }}
//         className="rounded bg-green-600 px-2 py-1 text-white"
//       >
//         +
//       </button>
//     </div>
//   );
// }

// function ArmItem({ arm, onDelete, onUpdate }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(arm.name);

//   return (
//     <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
//       {isEditing ? (
//         <>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-16 rounded border px-1 py-0.5 text-sm"
//           />

//           <button
//             onClick={() => {
//               if (!name.trim()) return;
//               onUpdate(arm._id, name.trim());
//               setIsEditing(false);
//             }}
//             className="text-green-700"
//           >
//             ✓
//           </button>

//           <button
//             onClick={() => {
//               setIsEditing(false);
//               setName(arm.name);
//             }}
//             className="text-gray-500"
//           >
//             ✕
//           </button>
//         </>
//       ) : (
//         <>
//           {arm.name}

//           <button
//             onClick={() => setIsEditing(true)}
//             className="text-blue-600"
//           >
//             ✎
//           </button>

//           <button
//             onClick={() => onDelete(arm._id)}
//             className="text-red-500"
//           >
//             ×
//           </button>
//         </>
//       )}
//     </span>
//   );
// }


import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [academicUnits, setAcademicUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newClass, setNewClass] = useState({
    academicUnitId: "",
    name: "",
    arms: "",
    isGraduatingClass: false,
  });

  const fetchAcademicUnits = async () => {
    const { data } = await api.get("/academic-units");
    setAcademicUnits(data?.data ?? data ?? []);
  };

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/classes");
      const payload = data?.data ?? data ?? [];

      const withEditing = payload.map((cls) => ({
        ...cls,
        isEditing: false,
        editAcademicUnitId: cls.academicUnitId?._id || cls.academicUnitId || "",
        editName: cls.name,
        editIsGraduatingClass: !!cls.isGraduatingClass,
      }));

      setClasses(withEditing);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchAcademicUnits(), fetchClasses()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewClass((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddClass = async () => {
    if (!newClass.academicUnitId) {
      toast.error("Please select an academic unit");
      return;
    }

    if (!newClass.name.trim()) {
      toast.error("Class name is required");
      return;
    }

    try {
      const armsArray = newClass.arms
        ? newClass.arms
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      await api.post("/classes", {
        academicUnitId: newClass.academicUnitId,
        name: newClass.name.trim(),
        arms: armsArray,
        isGraduatingClass: newClass.isGraduatingClass,
      });

      toast.success("Class created!");

      setNewClass({
        academicUnitId: "",
        name: "",
        arms: "",
        isGraduatingClass: false,
      });

      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create class");
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted");
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete class");
    }
  };

  const toggleEdit = (id, editing) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls._id === id
          ? {
              ...cls,
              isEditing: editing,
              editAcademicUnitId:
                cls.academicUnitId?._id || cls.academicUnitId || "",
              editName: cls.name,
              editIsGraduatingClass: !!cls.isGraduatingClass,
            }
          : cls
      )
    );
  };

  const updateClassField = (id, field, value) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls._id === id
          ? {
              ...cls,
              [field]: value,
            }
          : cls
      )
    );
  };

  const handleUpdateClass = async (cls) => {
    if (!cls.editAcademicUnitId) {
      toast.error("Please select an academic unit");
      return;
    }

    if (!cls.editName.trim()) {
      toast.error("Class name is required");
      return;
    }

    try {
      await api.put(`/classes/${cls._id}`, {
        academicUnitId: cls.editAcademicUnitId,
        name: cls.editName.trim(),
        isGraduatingClass: !!cls.editIsGraduatingClass,
      });

      toast.success("Class updated");
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update class");
    }
  };

  const handleAddArm = async (classId, armName) => {
    try {
      await api.post(`/classes/${classId}/arms`, { name: armName });
      toast.success("Arm added");
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add arm");
    }
  };

  const handleUpdateArm = async (armId, name) => {
    try {
      await api.put(`/classes/arms/${armId}`, { name });
      toast.success("Arm updated");
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update arm");
    }
  };

  const handleDeleteArm = async (armId) => {
    if (!confirm("Are you sure you want to delete this arm?")) return;

    try {
      await api.delete(`/classes/arms/${armId}`);
      toast.success("Arm deleted");
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete arm");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Class Management
      </h1>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800">Add New Class</h2>

        <div className="grid gap-3 md:grid-cols-4">
          <select
            name="academicUnitId"
            value={newClass.academicUnitId}
            onChange={handleChange}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select Academic Unit</option>
            {academicUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Class Name e.g. Primary 1, JSS 1"
            value={newClass.name}
            onChange={handleChange}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="arms"
            placeholder="Arms e.g. A, B, C"
            value={newClass.arms}
            onChange={handleChange}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isGraduatingClass"
              checked={newClass.isGraduatingClass}
              onChange={handleChange}
            />
            Graduating Class
          </label>
        </div>

        <button
          onClick={handleAddClass}
          className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Add Class
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800">Existing Classes</h2>

        {classes.length === 0 ? (
          <p className="text-sm text-gray-500">No classes found.</p>
        ) : (
          <div className="space-y-4">
            {classes.map((cls) => (
              <div key={cls._id} className="rounded-xl border bg-gray-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {cls.isEditing ? (
                      <div className="space-y-3">
                        <div className="grid gap-3 md:grid-cols-3">
                          <select
                            value={cls.editAcademicUnitId}
                            onChange={(e) =>
                              updateClassField(
                                cls._id,
                                "editAcademicUnitId",
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >
                            <option value="">Select Academic Unit</option>
                            {academicUnits.map((unit) => (
                              <option key={unit._id} value={unit._id}>
                                {unit.name}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={cls.editName}
                            onChange={(e) =>
                              updateClassField(
                                cls._id,
                                "editName",
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          />

                          <label className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              checked={!!cls.editIsGraduatingClass}
                              onChange={(e) =>
                                updateClassField(
                                  cls._id,
                                  "editIsGraduatingClass",
                                  e.target.checked
                                )
                              }
                            />
                            Graduating Class
                          </label>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleUpdateClass(cls)}
                            className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => toggleEdit(cls._id, false)}
                            className="rounded bg-gray-300 px-3 py-2 text-sm text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-800">
                            {cls.name}
                          </p>

                          <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700">
                            {cls.academicUnitId?.name || "No Academic Unit"}
                          </span>

                          {cls.isGraduatingClass && (
                            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                              🎓 Graduating Class
                            </span>
                          )}

                          <button
                            onClick={() => toggleEdit(cls._id, true)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(cls.arms || []).map((arm) => (
                        <ArmItem
                          key={arm._id}
                          arm={arm}
                          onDelete={handleDeleteArm}
                          onUpdate={handleUpdateArm}
                        />
                      ))}

                      <AddArmInput classId={cls._id} onAdd={handleAddArm} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteClass(cls._id)}
                    className="self-start rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
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

function AddArmInput({ classId, onAdd }) {
  const [armName, setArmName] = useState("");

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        value={armName}
        onChange={(e) => setArmName(e.target.value)}
        placeholder="Add Arm"
        className="w-24 rounded border px-2 py-1 text-sm"
      />

      <button
        onClick={() => {
          if (!armName.trim()) return;
          onAdd(classId, armName.trim());
          setArmName("");
        }}
        className="rounded bg-green-600 px-2 py-1 text-white"
      >
        +
      </button>
    </div>
  );
}

function ArmItem({ arm, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(arm.name);

  return (
    <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
      {isEditing ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-16 rounded border px-1 py-0.5 text-sm"
          />

          <button
            onClick={() => {
              if (!name.trim()) return;
              onUpdate(arm._id, name.trim());
              setIsEditing(false);
            }}
            className="text-green-700"
          >
            ✓
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setName(arm.name);
            }}
            className="text-gray-500"
          >
            ✕
          </button>
        </>
      ) : (
        <>
          {arm.name}

          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600"
          >
            ✎
          </button>

          <button
            onClick={() => onDelete(arm._id)}
            className="text-red-500"
          >
            ×
          </button>
        </>
      )}
    </span>
  );
}