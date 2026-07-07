// // src/pages/admin/AddStudent.jsx
// import { useState, useEffect } from "react";
// import api from "../../api/axios";

// export default function AddStudent() {
//   const [classes, setClasses] = useState([]);
//   const [activeSessionTerm, setActiveSessionTerm] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedArm, setSelectedArm] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     dateOfBirth: "",
//     gender: "",
//     parentContact: "",
//     studentCategory: "returning",
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState(null);

//   const getResponseData = (res) => {
//     return res.data?.data ?? res.data;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [classesRes, sessionRes] = await Promise.all([
//           api.get("/classes"),
//           api.get("/sessions/active"),
//         ]);

//         const classesPayload = getResponseData(classesRes);
//         const sessionPayload = getResponseData(sessionRes);

//         setClasses(Array.isArray(classesPayload) ? classesPayload : []);
//         setActiveSessionTerm(sessionPayload || null);
//       } catch (err) {
//         console.error("Failed to load required data:", err);
//         alert("Failed to load required data. Please refresh.");
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "image" && files?.[0]) {
//       const file = files[0];

//       setForm((prev) => ({
//         ...prev,
//         image: file,
//       }));

//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);

//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const resetForm = (formElement) => {
//     setForm({
//       name: "",
//       dateOfBirth: "",
//       gender: "",
//       parentContact: "",
//       studentCategory: "returning",
//       image: null,
//     });

//     setSelectedClass("");
//     setSelectedArm("");
//     setImagePreview(null);

//     if (formElement?.image) {
//       formElement.image.value = "";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!activeSessionTerm?.session?._id) {
//       alert("No active session found. Please set one in admin panel.");
//       return;
//     }

//     if (!selectedClass || !selectedArm) {
//       alert("Please select both Class and Arm.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();

//       formData.append("name", form.name.trim());
//       formData.append("dateOfBirth", form.dateOfBirth);
//       formData.append("gender", form.gender);
//       formData.append("parentContact", form.parentContact.trim());
//       formData.append("studentCategory", form.studentCategory);
//       formData.append("classId", selectedClass);
//       formData.append("armId", selectedArm);
//       formData.append("sessionId", activeSessionTerm.session._id);

//       if (activeSessionTerm.term?._id) {
//         formData.append("termId", activeSessionTerm.term._id);
//       }

//       if (form.image) {
//         formData.append("picture", form.image);
//       }

//       const res = await api.post("/students", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const payload = getResponseData(res);
//       const loginCredentials = payload?.loginCredentials;

//       alert(
//         `Student registered successfully!\nAdmission No: ${
//           loginCredentials?.admissionNumber || "N/A"
//         }\nPassword: ${loginCredentials?.password || "N/A"}`
//       );

//       resetForm(e.target);
//     } catch (err) {
//       console.error("Registration error:", err);
//       const msg =
//         err.response?.data?.message ||
//         err.response?.data?.error ||
//         "Failed to register student";

//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectedClassObj = classes.find((c) => c._id === selectedClass);
//   const arms = Array.isArray(selectedClassObj?.arms)
//     ? selectedClassObj.arms
//     : [];

//   return (
//     <div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-lg sm:p-6 md:p-8">
//       <h2 className="mb-6 text-xl font-bold text-gray-800 sm:text-2xl">
//         Add New Student
//       </h2>

//       {activeSessionTerm?.session && (
//         <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//           Active Session: <strong>{activeSessionTerm.session.name}</strong>
//           {activeSessionTerm.term && (
//             <>
//               {" "}
//               | Active Term: <strong>{activeSessionTerm.term.name}</strong>
//             </>
//           )}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Full Name *
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="e.g. John Doe"
//             className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Date of Birth *
//             </label>
//             <input
//               type="date"
//               name="dateOfBirth"
//               value={form.dateOfBirth}
//               onChange={handleChange}
//               className="w-full rounded-lg border px-4 py-3 text-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Gender *
//             </label>
//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//               className="w-full rounded-lg border px-4 py-3 text-sm"
//               required
//             >
//               <option value="">-- Select Gender --</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Parent Phone/Email *
//           </label>
//           <input
//             type="text"
//             name="parentContact"
//             value={form.parentContact}
//             onChange={handleChange}
//             placeholder="e.g. 08012345678 or parent@email.com"
//             className="w-full rounded-lg border px-4 py-3 text-sm"
//             required
//           />
//         </div>

//         <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Student Category *
//           </label>

//           <select
//             name="studentCategory"
//             value={form.studentCategory}
//             onChange={handleChange}
//             className="w-full rounded-lg border px-4 py-3 text-sm"
//             required
//           >
//             <option value="returning">Returning Student</option>
//             <option value="new_intake">New Intake</option>
//             <option value="transfer">Transfer Student</option>
//           </select>

//           <p className="mt-2 text-xs text-gray-600">
//             This controls which special fee types apply when fee accounts are
//             generated.
//           </p>
//         </div>

//         <div>
//           <label className="mb-1 block text-sm font-medium text-gray-700">
//             Student Photo Optional
//           </label>
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-green-700 hover:file:bg-green-100"
//           />

//           {imagePreview && (
//             <div className="mt-3">
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="h-32 w-32 rounded-lg border object-cover shadow"
//               />
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-sm font-medium text-gray-700">
//               Class *
//             </label>
//             <select
//               value={selectedClass}
//               onChange={(e) => {
//                 setSelectedClass(e.target.value);
//                 setSelectedArm("");
//               }}
//               className="w-full rounded-lg border px-4 py-3 text-sm"
//               required
//             >
//               <option value="">-- Select Class --</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedClass && arms.length > 0 && (
//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 Arm *
//               </label>
//               <select
//                 value={selectedArm}
//                 onChange={(e) => setSelectedArm(e.target.value)}
//                 className="w-full rounded-lg border px-4 py-3 text-sm"
//                 required
//               >
//                 <option value="">-- Select Arm --</option>
//                 {arms.map((arm) => (
//                   <option key={arm._id} value={arm._id}>
//                     {arm.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>

//         {selectedClass && arms.length === 0 && (
//           <p className="text-sm text-red-600">
//             This class has no arms assigned.
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={loading || !activeSessionTerm?.session?._id}
//           className={`w-full rounded-lg py-3 font-medium text-white transition ${
//             loading || !activeSessionTerm?.session?._id
//               ? "cursor-not-allowed bg-gray-400"
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "Registering Student..." : "Register Student"}
//         </button>
//       </form>

//       {!activeSessionTerm?.session && (
//         <p className="mt-6 text-center text-sm text-red-600">
//           No active session/term. Contact admin.
//         </p>
//       )}
//     </div>
//   );
// }

// src/pages/admin/AddStudent.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AddStudent() {
  const [academicUnits, setAcademicUnits] = useState([]);
  const [classes, setClasses] = useState([]);
  const [activeSessionTerm, setActiveSessionTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedArm, setSelectedArm] = useState("");

  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    parentContact: "",
    studentCategory: "returning",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const getResponseData = (res) => res.data?.data ?? res.data;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedAcademicUnit) {
      fetchClasses(selectedAcademicUnit);
    } else {
      setClasses([]);
    }

    setSelectedClass("");
    setSelectedArm("");
  }, [selectedAcademicUnit]);

  const fetchInitialData = async () => {
    try {
      setPageLoading(true);

      const [unitsRes, sessionRes] = await Promise.all([
        api.get("/academic-units"),
        api.get("/sessions/active"),
      ]);

      const unitsPayload = getResponseData(unitsRes);
      const sessionPayload = getResponseData(sessionRes);

      setAcademicUnits(Array.isArray(unitsPayload) ? unitsPayload : []);
      setActiveSessionTerm(sessionPayload || null);
    } catch (err) {
      console.error("Failed to load required data:", err);
      toast.error("Failed to load required data. Please refresh.");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchClasses = async (academicUnitId) => {
    try {
      const { data } = await api.get("/classes", {
        params: { academicUnitId },
      });

      const payload = data?.data ?? data ?? [];
      setClasses(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      toast.error("Failed to load classes");
      setClasses([]);
    }
  };

  const selectedAcademicUnitObj = useMemo(
    () => academicUnits.find((unit) => unit._id === selectedAcademicUnit),
    [academicUnits, selectedAcademicUnit]
  );

  const selectedClassObj = useMemo(
    () => classes.find((c) => c._id === selectedClass),
    [classes, selectedClass]
  );

  const arms = Array.isArray(selectedClassObj?.arms)
    ? selectedClassObj.arms
    : [];

  const selectedArmObj = useMemo(
    () => arms.find((arm) => arm._id === selectedArm),
    [arms, selectedArm]
  );

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];

      setForm((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (formElement) => {
    setForm({
      name: "",
      dateOfBirth: "",
      gender: "",
      parentContact: "",
      studentCategory: "returning",
      image: null,
    });

    setSelectedAcademicUnit("");
    setSelectedClass("");
    setSelectedArm("");
    setImagePreview(null);
    setStep(1);

    if (formElement?.image) {
      formElement.image.value = "";
    }
  };

  const validateStepOne = () => {
    if (!form.name.trim()) {
      toast.error("Student name is required");
      return false;
    }

    if (!form.dateOfBirth) {
      toast.error("Date of birth is required");
      return false;
    }

    if (!form.gender) {
      toast.error("Gender is required");
      return false;
    }

    if (!form.parentContact.trim()) {
      toast.error("Parent contact is required");
      return false;
    }

    return true;
  };

  const validateStepTwo = () => {
    if (!selectedAcademicUnit) {
      toast.error("Please select academic unit");
      return false;
    }

    if (!selectedClass) {
      toast.error("Please select class");
      return false;
    }

    if (!selectedArm) {
      toast.error("Please select arm");
      return false;
    }

    if (!form.studentCategory) {
      toast.error("Please select student category");
      return false;
    }

    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step === 2 && !validateStepTwo()) return;

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStepOne() || !validateStepTwo()) return;

    if (!activeSessionTerm?.session?._id) {
      toast.error("No active session found. Please set one in admin panel.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("gender", form.gender);
      formData.append("parentContact", form.parentContact.trim());
      formData.append("studentCategory", form.studentCategory);

      formData.append("academicUnitId", selectedAcademicUnit);
      formData.append("classId", selectedClass);
      formData.append("armId", selectedArm);
      formData.append("sessionId", activeSessionTerm.session._id);

      if (activeSessionTerm.term?._id) {
        formData.append("termId", activeSessionTerm.term._id);
      }

      if (form.image) {
        formData.append("picture", form.image);
      }

      const res = await api.post("/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const payload = getResponseData(res);
      const loginCredentials = payload?.loginCredentials;

      toast.success("Student registered successfully");

      alert(
        `Student registered successfully!\nAdmission No: ${
          loginCredentials?.admissionNumber || "N/A"
        }\nPassword: ${loginCredentials?.password || "N/A"}`
      );

      resetForm(e.target);
    } catch (err) {
      console.error("Registration error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to register student";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <p className="p-6 text-sm text-gray-600">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-4 shadow-lg sm:p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Add New Student
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Register a student into an academic unit, class, and arm.
        </p>
      </div>

      {activeSessionTerm?.session ? (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Active Session: <strong>{activeSessionTerm.session.name}</strong>
          {activeSessionTerm.term && (
            <>
              {" "}
              | Active Term: <strong>{activeSessionTerm.term.name}</strong>
            </>
          )}
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          No active session/term. Please set active session and term before
          registering students.
        </div>
      )}

      <div className="mb-6 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={`rounded-lg p-3 text-center text-xs font-semibold sm:text-sm ${
              step === item
                ? "bg-green-600 text-white"
                : step > item
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {item === 1 && "Student Info"}
            {item === 2 && "Academic Info"}
            {item === 3 && "Review"}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                  required
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Parent Phone/Email *
              </label>
              <input
                type="text"
                name="parentContact"
                value={form.parentContact}
                onChange={handleChange}
                placeholder="e.g. 08012345678 or parent@email.com"
                className="w-full rounded-lg border px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Student Photo Optional
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-green-700 hover:file:bg-green-100"
              />

              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg border object-cover shadow"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Student Category *
              </label>

              <select
                name="studentCategory"
                value={form.studentCategory}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 text-sm"
                required
              >
                <option value="returning">Returning Student</option>
                <option value="new_intake">New Intake</option>
                <option value="transfer">Transfer Student</option>
              </select>

              <p className="mt-2 text-xs text-gray-600">
                This controls which special fee types apply when fee accounts
                are generated.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Academic Unit *
              </label>
              <select
                value={selectedAcademicUnit}
                onChange={(e) => setSelectedAcademicUnit(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm"
                required
              >
                <option value="">-- Select Academic Unit --</option>
                {academicUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedArm("");
                  }}
                  disabled={!selectedAcademicUnit}
                  className="w-full rounded-lg border px-4 py-3 text-sm disabled:bg-gray-100"
                  required
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedClass && arms.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Arm *
                  </label>
                  <select
                    value={selectedArm}
                    onChange={(e) => setSelectedArm(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 text-sm"
                    required
                  >
                    <option value="">-- Select Arm --</option>
                    {arms.map((arm) => (
                      <option key={arm._id} value={arm._id}>
                        {arm.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedClass && arms.length === 0 && (
              <p className="text-sm text-red-600">
                This class has no arms assigned.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-800">
                Review Student Details
              </h3>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <strong>Name:</strong> {form.name || "—"}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {form.dateOfBirth || "—"}
                </p>
                <p>
                  <strong>Gender:</strong> {form.gender || "—"}
                </p>
                <p>
                  <strong>Parent Contact:</strong>{" "}
                  {form.parentContact || "—"}
                </p>
                <p>
                  <strong>Category:</strong> {form.studentCategory}
                </p>
                <p>
                  <strong>Academic Unit:</strong>{" "}
                  {selectedAcademicUnitObj?.name || "—"}
                </p>
                <p>
                  <strong>Class:</strong> {selectedClassObj?.name || "—"}
                </p>
                <p>
                  <strong>Arm:</strong> {selectedArmObj?.name || "—"}
                </p>
                <p>
                  <strong>Session:</strong>{" "}
                  {activeSessionTerm?.session?.name || "—"}
                </p>
                <p>
                  <strong>Term:</strong> {activeSessionTerm?.term?.name || "—"}
                </p>
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Photo Preview</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-24 rounded-lg border object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || loading}
            className="rounded-lg bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || !activeSessionTerm?.session?._id}
              className={`rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
                loading || !activeSessionTerm?.session?._id
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Registering Student..." : "Register Student"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}