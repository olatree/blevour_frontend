// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../api/axios";

// export default function ViewClassTeachers() {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);

//     // const api = axios.create({
//     //   baseURL: "http://localhost:8000/api",
//     //   withCredentials: true,
//     // });

//   // Fetch all class-teacher assignments
//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const res = await api.get("/class-teachers");
//         setAssignments(res.data);
//       } catch (err) {
//         console.error("Error fetching assignments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAssignments();
//   }, []);

//   // Handle Unassign Teacher
//   const handleUnassign = async (id) => {
//     if (!window.confirm("Are you sure you want to unassign this class teacher?")) return;

//     try {
//       await api.delete(`/class-teachers/${id}`);
//       setAssignments(assignments.filter((a) => a._id !== id));
//     } catch (err) {
//       console.error("Error unassigning teacher:", err);
//       alert(err.response?.data?.message || "Failed to unassign teacher");
//     }
//   };

//   if (loading) {
//     return <div className="p-6">Loading class teachers...</div>;
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">View Class Teachers</h1>
//         <Link
//           to="/assign-class-teacher"
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Assign Class Teacher
//         </Link>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
//           <thead className="bg-gray-100 border-b">
//             <tr>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Class</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Arm</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Teacher</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y">
//             {assignments.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
//                   No class teachers assigned yet.
//                 </td>
//               </tr>
//             ) : (
//               assignments.map((a) => (
//                 <tr key={a._id}>
//                   <td className="px-4 py-3 text-sm text-gray-800">{a.classId?.name || "—"}</td>
//                   <td className="px-4 py-3 text-sm text-gray-800">{a.armId?.name || "—"}</td>
//                   <td className="px-4 py-3 text-sm text-gray-800">{a.teacher?.name || "—"}</td>
//                   <td className="px-4 py-3 text-sm text-gray-600">{a.teacher?.email || "—"}</td>
//                   <td className="px-4 py-3 text-sm text-gray-600">{a.teacher?.phone || "—"}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <button
//                       onClick={() => handleUnassign(a._id)}
//                       className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                     >
//                       Unassign
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Cards */}
//       <div className="md:hidden space-y-4">
//         {assignments.length === 0 ? (
//           <div className="text-center text-gray-500">No class teachers assigned yet.</div>
//         ) : (
//           assignments.map((a) => (
//             <div key={a._id} className="bg-white p-4 rounded-lg shadow border">
//               <p className="text-sm">
//                 <span className="font-semibold">Class:</span> {a.classId?.name || "—"}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">Arm:</span> {a.armId?.name || "—"}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">Teacher:</span> {a.teacher?.name || "—"}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">Email:</span> {a.teacher?.email || "—"}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">Phone:</span> {a.teacher?.phone || "—"}
//               </p>
//               <div className="mt-3">
//                 <button
//                   onClick={() => handleUnassign(a._id)}
//                   className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 w-full"
//                 >
//                   Unassign
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

export default function ViewClassTeachers() {
  const { user } = useAuth();

  const [academicUnits, setAcademicUnits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchAcademicUnits = async () => {
    try {
      const res = await api.get("/academic-units");
      const units = res.data?.data ?? res.data ?? [];

      setAcademicUnits(units);

      if (!isFullAccess && restrictedUnitName) {
        const allowedUnit = units.find((unit) =>
          unit.name?.toLowerCase().includes(restrictedUnitName)
        );

        if (allowedUnit) {
          setSelectedAcademicUnit(allowedUnit._id);
        }
      }
    } catch (err) {
      console.error("Error fetching academic units:", err);
    }
  };

  const fetchAssignments = async (academicUnitId = selectedAcademicUnit) => {
    try {
      setLoading(true);

      const params = {};
      if (academicUnitId) params.academicUnitId = academicUnitId;

      const res = await api.get("/class-teachers", { params });
      setAssignments(res.data?.data ?? res.data ?? []);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    fetchAssignments(selectedAcademicUnit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit]);

  const handleUnassign = async (id) => {
    if (!window.confirm("Are you sure you want to unassign this class teacher?")) {
      return;
    }

    try {
      await api.delete(`/class-teachers/${id}`);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error unassigning teacher:", err);
      alert(err.response?.data?.message || "Failed to unassign teacher");
    }
  };

  if (loading) {
    return <div className="p-6">Loading class teachers...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              View Class Teachers
            </h1>

            {!isFullAccess && visibleAcademicUnits[0] && (
              <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                Restricted View: {visibleAcademicUnits[0].name}
              </p>
            )}
          </div>

          <Link
            to="/assign-class-teacher"
            className="rounded bg-green-600 px-4 py-2 text-center text-white hover:bg-green-700"
          >
            Assign Class Teacher
          </Link>
        </div>

        <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Academic Unit
          </label>

          <select
            value={selectedAcademicUnit}
            disabled={!isFullAccess}
            onChange={(e) => setSelectedAcademicUnit(e.target.value)}
            className="w-full rounded-lg border p-2 text-sm disabled:bg-gray-100 sm:max-w-xs"
          >
            <option value="">All Academic Units</option>
            {visibleAcademicUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
          <table className="min-w-full border border-gray-200">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Academic Unit
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Class
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Arm
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Teacher
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y bg-white">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No class teachers assigned yet.
                  </td>
                </tr>
              ) : (
                assignments.map((a) => (
                  <tr key={a._id}>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {a.academicUnitId?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {a.classId?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {a.armId?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {a.teacher?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {a.teacher?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {a.teacher?.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleUnassign(a._id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {assignments.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
              No class teachers assigned yet.
            </div>
          ) : (
            assignments.map((a) => (
              <div key={a._id} className="rounded-lg border bg-white p-4 shadow">
                <p className="text-sm">
                  <span className="font-semibold">Academic Unit:</span>{" "}
                  {a.academicUnitId?.name || "—"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Class:</span>{" "}
                  {a.classId?.name || "—"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Arm:</span>{" "}
                  {a.armId?.name || "—"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Teacher:</span>{" "}
                  {a.teacher?.name || "—"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span>{" "}
                  {a.teacher?.email || "—"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Phone:</span>{" "}
                  {a.teacher?.phone || "—"}
                </p>

                <button
                  onClick={() => handleUnassign(a._id)}
                  className="mt-3 w-full rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                >
                  Unassign
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}