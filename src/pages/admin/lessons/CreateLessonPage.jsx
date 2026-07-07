// // src/pages/admin/lessons/CreateLessonPage.jsx
// import React, { useEffect, useState } from "react";
// import api from "../../../api/axios";

// const CreateLessonPage = () => {
//   const [activeSessionTerm, setActiveSessionTerm] = useState(null);
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [arms, setArms] = useState([]);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     week: 1,
//     classId: "",
//     armId: "",
//     subjectId: "",
//     status: "published",
//   });

//   const [textResources, setTextResources] = useState([
//     { title: "", description: "", content: "" },
//   ]);

//   const [videoResources, setVideoResources] = useState([
//     { title: "", description: "", videoUrl: "" },
//   ]);

//   const [files, setFiles] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const getData = (res) => res.data?.data ?? res.data;

//   const fetchData = async () => {
//     try {
//       const [activeRes, classesRes, subjectsRes] = await Promise.all([
//         api.get("/sessions/active"),
//         api.get("/classes"),
//         api.get("/subjects"),
//       ]);

//       setActiveSessionTerm(getData(activeRes));
//       setClasses(getData(classesRes) || []);
//       setSubjects(getData(subjectsRes) || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load form data");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const selectedClass = classes.find((cls) => cls._id === form.classId);
//     setArms(selectedClass?.arms || []);
//     setForm((prev) => ({ ...prev, armId: "" }));
//   }, [form.classId, classes]);

//   const updateForm = (name, value) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const updateTextResource = (index, name, value) => {
//     const updated = [...textResources];
//     updated[index][name] = value;
//     setTextResources(updated);
//   };

//   const addTextResource = () => {
//     setTextResources([
//       ...textResources,
//       { title: "", description: "", content: "" },
//     ]);
//   };

//   const removeTextResource = (index) => {
//     setTextResources(textResources.filter((_, i) => i !== index));
//   };

//   const updateVideoResource = (index, name, value) => {
//     const updated = [...videoResources];
//     updated[index][name] = value;
//     setVideoResources(updated);
//   };

//   const addVideoResource = () => {
//     setVideoResources([
//       ...videoResources,
//       { title: "", description: "", videoUrl: "" },
//     ]);
//   };

//   const removeVideoResource = (index) => {
//     setVideoResources(videoResources.filter((_, i) => i !== index));
//   };

//   const handleFilesChange = (e) => {
//     setFiles(Array.from(e.target.files || []));
//   };

//   const resetForm = () => {
//     setForm({
//       title: "",
//       description: "",
//       week: 1,
//       classId: "",
//       armId: "",
//       subjectId: "",
//       status: "published",
//     });

//     setTextResources([{ title: "", description: "", content: "" }]);
//     setVideoResources([{ title: "", description: "", videoUrl: "" }]);
//     setFiles([]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setMessage("");
//     setError("");

//     const sessionId = activeSessionTerm?.session?._id;
//     const termId = activeSessionTerm?.term?._id;

//     if (!sessionId || !termId) {
//       setError("No active session/term found.");
//       return;
//     }

//     if (!form.title || !form.classId || !form.subjectId) {
//       setError("Title, class and subject are required.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();

//       formData.append("title", form.title.trim());
//       formData.append("description", form.description.trim());
//       formData.append("week", form.week);
//       formData.append("sessionId", sessionId);
//       formData.append("termId", termId);
//       formData.append("classId", form.classId);
//       formData.append("subjectId", form.subjectId);
//       formData.append("status", form.status);

//       if (form.armId) {
//         formData.append("armId", form.armId);
//       }

//       const validTextResources = textResources.filter(
//         (item) => item.title.trim() && item.content.trim()
//       );

//       const validVideoResources = videoResources.filter(
//         (item) => item.title.trim() && item.videoUrl.trim()
//       );

//       formData.append("textResources", JSON.stringify(validTextResources));
//       formData.append("videoResources", JSON.stringify(validVideoResources));

//       files.forEach((file) => {
//         formData.append("files", file);
//       });

//       await api.post("/lessons", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("Lesson created successfully.");
//       resetForm();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create lesson");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
//       <div className="mb-5">
//         <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
//           Create Lesson
//         </h1>
//         <p className="text-sm text-gray-500">
//           Add lesson notes, documents and video links for students.
//         </p>
//       </div>

//       {activeSessionTerm?.session && (
//         <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
//           Active Session: <b>{activeSessionTerm.session.name}</b>
//           {activeSessionTerm.term && (
//             <>
//               {" "}
//               | Active Term: <b>{activeSessionTerm.term.name}</b>
//             </>
//           )}
//         </div>
//       )}

//       {message && (
//         <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <section className="rounded-xl bg-white p-4 shadow-sm">
//           <h2 className="mb-4 text-base font-semibold text-gray-700">
//             Lesson Information
//           </h2>

//           <div className="grid gap-4 md:grid-cols-2">
//             <Input
//               label="Lesson Title"
//               value={form.title}
//               onChange={(value) => updateForm("title", value)}
//               placeholder="e.g. Nouns and Pronouns"
//               required
//             />

//             <Input
//               label="Week"
//               type="number"
//               value={form.week}
//               onChange={(value) => updateForm("week", value)}
//               min="1"
//             />

//             <Select
//               label="Class"
//               value={form.classId}
//               onChange={(value) => updateForm("classId", value)}
//               options={classes}
//               placeholder="Select Class"
//               required
//             />

//             <Select
//               label="Arm"
//               value={form.armId}
//               onChange={(value) => updateForm("armId", value)}
//               options={arms}
//               placeholder="All Arms"
//               disabled={!form.classId}
//             />

//             <Select
//               label="Subject"
//               value={form.subjectId}
//               onChange={(value) => updateForm("subjectId", value)}
//               options={subjects}
//               placeholder="Select Subject"
//               required
//             />

//             <div>
//               <label className="mb-1 block text-sm font-medium text-gray-600">
//                 Status
//               </label>
//               <select
//                 value={form.status}
//                 onChange={(e) => updateForm("status", e.target.value)}
//                 className="w-full rounded-lg border px-3 py-3 text-sm"
//               >
//                 <option value="published">Published</option>
//                 <option value="draft">Draft</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="mb-1 block text-sm font-medium text-gray-600">
//               Description
//             </label>
//             <textarea
//               value={form.description}
//               onChange={(e) => updateForm("description", e.target.value)}
//               rows="3"
//               className="w-full rounded-lg border px-3 py-3 text-sm"
//               placeholder="Brief description of the lesson"
//             />
//           </div>
//         </section>

//         <section className="rounded-xl bg-white p-4 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-base font-semibold text-gray-700">
//               Typed Notes
//             </h2>

//             <button
//               type="button"
//               onClick={addTextResource}
//               className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
//             >
//               Add Note
//             </button>
//           </div>

//           <div className="space-y-4">
//             {textResources.map((item, index) => (
//               <div key={index} className="rounded-lg border p-3">
//                 <div className="mb-3 flex items-center justify-between">
//                   <p className="text-sm font-semibold text-gray-700">
//                     Text Note {index + 1}
//                   </p>

//                   {textResources.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeTextResource(index)}
//                       className="text-xs text-red-600"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>

//                 <div className="grid gap-3 md:grid-cols-2">
//                   <input
//                     value={item.title}
//                     onChange={(e) =>
//                       updateTextResource(index, "title", e.target.value)
//                     }
//                     className="rounded-lg border px-3 py-3 text-sm"
//                     placeholder="Note title"
//                   />

//                   <input
//                     value={item.description}
//                     onChange={(e) =>
//                       updateTextResource(index, "description", e.target.value)
//                     }
//                     className="rounded-lg border px-3 py-3 text-sm"
//                     placeholder="Optional description"
//                   />
//                 </div>

//                 <textarea
//                   value={item.content}
//                   onChange={(e) =>
//                     updateTextResource(index, "content", e.target.value)
//                   }
//                   rows="5"
//                   className="mt-3 w-full rounded-lg border px-3 py-3 text-sm"
//                   placeholder="Type lesson note here..."
//                 />
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="rounded-xl bg-white p-4 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-base font-semibold text-gray-700">
//               Video Links
//             </h2>

//             <button
//               type="button"
//               onClick={addVideoResource}
//               className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white"
//             >
//               Add Video
//             </button>
//           </div>

//           <div className="space-y-4">
//             {videoResources.map((item, index) => (
//               <div key={index} className="rounded-lg border p-3">
//                 <div className="mb-3 flex items-center justify-between">
//                   <p className="text-sm font-semibold text-gray-700">
//                     Video {index + 1}
//                   </p>

//                   {videoResources.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeVideoResource(index)}
//                       className="text-xs text-red-600"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>

//                 <div className="grid gap-3 md:grid-cols-3">
//                   <input
//                     value={item.title}
//                     onChange={(e) =>
//                       updateVideoResource(index, "title", e.target.value)
//                     }
//                     className="rounded-lg border px-3 py-3 text-sm"
//                     placeholder="Video title"
//                   />

//                   <input
//                     value={item.videoUrl}
//                     onChange={(e) =>
//                       updateVideoResource(index, "videoUrl", e.target.value)
//                     }
//                     className="rounded-lg border px-3 py-3 text-sm"
//                     placeholder="YouTube video link"
//                   />

//                   <input
//                     value={item.description}
//                     onChange={(e) =>
//                       updateVideoResource(index, "description", e.target.value)
//                     }
//                     className="rounded-lg border px-3 py-3 text-sm"
//                     placeholder="Optional description"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="rounded-xl bg-white p-4 shadow-sm">
//           <h2 className="mb-4 text-base font-semibold text-gray-700">
//             Document Uploads
//           </h2>

//           <input
//             type="file"
//             multiple
//             onChange={handleFilesChange}
//             accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
//             className="w-full text-sm"
//           />

//           {files.length > 0 && (
//             <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
//               {files.map((file, index) => (
//                 <p key={index}>{file.name}</p>
//               ))}
//             </div>
//           )}
//         </section>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
//         >
//           {loading ? "Creating Lesson..." : "Create Lesson"}
//         </button>
//       </form>
//     </div>
//   );
// };

// const Input = ({ label, value, onChange, type = "text", ...props }) => (
//   <div>
//     <label className="mb-1 block text-sm font-medium text-gray-600">
//       {label}
//     </label>
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full rounded-lg border px-3 py-3 text-sm"
//       {...props}
//     />
//   </div>
// );

// const Select = ({
//   label,
//   value,
//   onChange,
//   options,
//   placeholder,
//   disabled,
//   required,
// }) => (
//   <div>
//     <label className="mb-1 block text-sm font-medium text-gray-600">
//       {label}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//       required={required}
//       className="w-full rounded-lg border px-3 py-3 text-sm disabled:bg-gray-100"
//     >
//       <option value="">{placeholder}</option>
//       {options.map((item) => (
//         <option key={item._id} value={item._id}>
//           {item.name}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// export default CreateLessonPage;



// src/pages/admin/lessons/CreateLessonPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";

const CreateLessonPage = () => {
  const { user } = useAuth();

  const [activeSessionTerm, setActiveSessionTerm] = useState(null);
  const [academicUnits, setAcademicUnits] = useState([]);
  const [selectedAcademicUnit, setSelectedAcademicUnit] = useState("");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [arms, setArms] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    week: 1,
    classId: "",
    armId: "",
    subjectId: "",
    status: "published",
  });

  const [textResources, setTextResources] = useState([
    { title: "", description: "", content: "" },
  ]);

  const [videoResources, setVideoResources] = useState([
    { title: "", description: "", videoUrl: "" },
  ]);

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getData = (res) => res.data?.data ?? res.data;

  const isFullAccess = ["admin", "super_admin", "master_admin"].includes(
    user?.role
  );

  const restrictedUnitName =
    user?.role === "principal"
      ? "secondary"
      : user?.role === "head_teacher"
      ? "primary"
      : "";

  const isAcademicUnitLocked = !isFullAccess && !!restrictedUnitName;

  const visibleAcademicUnits = useMemo(() => {
    if (isFullAccess) return academicUnits;

    if (restrictedUnitName) {
      return academicUnits.filter((unit) =>
        unit.name?.toLowerCase().includes(restrictedUnitName)
      );
    }

    return academicUnits;
  }, [academicUnits, isFullAccess, restrictedUnitName]);

  const selectedAcademicUnitObj = useMemo(
    () => academicUnits.find((unit) => unit._id === selectedAcademicUnit),
    [academicUnits, selectedAcademicUnit]
  );

  const fetchInitialData = async () => {
    try {
      setPageLoading(true);
      setError("");

      const [activeRes, unitRes] = await Promise.all([
        api.get("/sessions/active"),
        api.get("/academic-units"),
      ]);

      setActiveSessionTerm(getData(activeRes));

      const unitsPayload = getData(unitRes);
      const units = Array.isArray(unitsPayload) ? unitsPayload : [];

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
      setError(err.response?.data?.message || "Failed to load form data");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchClassesAndSubjects = async (academicUnitId) => {
    if (!academicUnitId) {
      setClasses([]);
      setSubjects([]);
      return;
    }

    try {
      setError("");

      const [classesRes, subjectsRes] = await Promise.all([
        api.get("/classes", {
          params: { academicUnitId },
        }),
        api.get("/subjects", {
          params: { academicUnitId },
        }),
      ]);

      const classesPayload = getData(classesRes);
      const subjectsPayload = getData(subjectsRes);

      setClasses(Array.isArray(classesPayload) ? classesPayload : []);
      setSubjects(Array.isArray(subjectsPayload) ? subjectsPayload : []);
    } catch (err) {
      setClasses([]);
      setSubjects([]);
      setError(
        err.response?.data?.message ||
          "Failed to load classes and subjects for selected academic unit"
      );
    }
  };

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  useEffect(() => {
    fetchClassesAndSubjects(selectedAcademicUnit);

    setForm((prev) => ({
      ...prev,
      classId: "",
      armId: "",
      subjectId: "",
    }));

    setArms([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAcademicUnit]);

  useEffect(() => {
    const selectedClass = classes.find((cls) => cls._id === form.classId);

    setArms(selectedClass?.arms || []);
    setForm((prev) => ({ ...prev, armId: "" }));
  }, [form.classId, classes]);

  const updateForm = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateTextResource = (index, name, value) => {
    const updated = [...textResources];
    updated[index][name] = value;
    setTextResources(updated);
  };

  const addTextResource = () => {
    setTextResources([
      ...textResources,
      { title: "", description: "", content: "" },
    ]);
  };

  const removeTextResource = (index) => {
    setTextResources(textResources.filter((_, i) => i !== index));
  };

  const updateVideoResource = (index, name, value) => {
    const updated = [...videoResources];
    updated[index][name] = value;
    setVideoResources(updated);
  };

  const addVideoResource = () => {
    setVideoResources([
      ...videoResources,
      { title: "", description: "", videoUrl: "" },
    ]);
  };

  const removeVideoResource = (index) => {
    setVideoResources(videoResources.filter((_, i) => i !== index));
  };

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      week: 1,
      classId: "",
      armId: "",
      subjectId: "",
      status: "published",
    });

    setTextResources([{ title: "", description: "", content: "" }]);
    setVideoResources([{ title: "", description: "", videoUrl: "" }]);
    setFiles([]);
    setArms([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const sessionId = activeSessionTerm?.session?._id;
    const termId = activeSessionTerm?.term?._id;

    if (!sessionId || !termId) {
      setError("No active session/term found.");
      return;
    }

    if (!selectedAcademicUnit) {
      setError("Academic unit is required.");
      return;
    }

    if (!form.title || !form.classId || !form.subjectId) {
      setError("Title, class and subject are required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("academicUnitId", selectedAcademicUnit);
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("week", form.week);
      formData.append("sessionId", sessionId);
      formData.append("termId", termId);
      formData.append("classId", form.classId);
      formData.append("subjectId", form.subjectId);
      formData.append("status", form.status);

      if (form.armId) {
        formData.append("armId", form.armId);
      }

      const validTextResources = textResources.filter(
        (item) => item.title.trim() && item.content.trim()
      );

      const validVideoResources = videoResources.filter(
        (item) => item.title.trim() && item.videoUrl.trim()
      );

      formData.append("textResources", JSON.stringify(validTextResources));
      formData.append("videoResources", JSON.stringify(validVideoResources));

      files.forEach((file) => {
        formData.append("files", file);
      });

      await api.post("/lessons", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Lesson created successfully.");
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-sm text-gray-500">
        Loading lesson form...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Create Lesson
        </h1>
        <p className="text-sm text-gray-500">
          Add lesson notes, documents and video links for students.
        </p>
      </div>

      {activeSessionTerm?.session && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Active Session: <b>{activeSessionTerm.session.name}</b>
          {activeSessionTerm.term && (
            <>
              {" "}
              | Active Term: <b>{activeSessionTerm.term.name}</b>
            </>
          )}
        </div>
      )}

      {isAcademicUnitLocked && selectedAcademicUnitObj && (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-700">
          Restricted View: {selectedAcademicUnitObj.name}
        </div>
      )}

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-700">
            Lesson Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Academic Unit
              </label>
              <select
                value={selectedAcademicUnit}
                onChange={(e) => setSelectedAcademicUnit(e.target.value)}
                disabled={isAcademicUnitLocked}
                className="w-full rounded-lg border px-3 py-3 text-sm disabled:bg-gray-100"
                required
              >
                <option value="">Select Academic Unit</option>
                {visibleAcademicUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Lesson Title"
              value={form.title}
              onChange={(value) => updateForm("title", value)}
              placeholder="e.g. Nouns and Pronouns"
              required
            />

            <Input
              label="Week"
              type="number"
              value={form.week}
              onChange={(value) => updateForm("week", value)}
              min="1"
            />

            <Select
              label="Class"
              value={form.classId}
              onChange={(value) => updateForm("classId", value)}
              options={classes}
              placeholder="Select Class"
              disabled={!selectedAcademicUnit}
              required
            />

            <Select
              label="Arm"
              value={form.armId}
              onChange={(value) => updateForm("armId", value)}
              options={arms}
              placeholder="All Arms"
              disabled={!form.classId}
            />

            <Select
              label="Subject"
              value={form.subjectId}
              onChange={(value) => updateForm("subjectId", value)}
              options={subjects}
              placeholder="Select Subject"
              disabled={!selectedAcademicUnit}
              required
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value)}
                className="w-full rounded-lg border px-3 py-3 text-sm"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows="3"
              className="w-full rounded-lg border px-3 py-3 text-sm"
              placeholder="Brief description of the lesson"
            />
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700">
              Typed Notes
            </h2>

            <button
              type="button"
              onClick={addTextResource}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {textResources.map((item, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Text Note {index + 1}
                  </p>

                  {textResources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTextResource(index)}
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={item.title}
                    onChange={(e) =>
                      updateTextResource(index, "title", e.target.value)
                    }
                    className="rounded-lg border px-3 py-3 text-sm"
                    placeholder="Note title"
                  />

                  <input
                    value={item.description}
                    onChange={(e) =>
                      updateTextResource(index, "description", e.target.value)
                    }
                    className="rounded-lg border px-3 py-3 text-sm"
                    placeholder="Optional description"
                  />
                </div>

                <textarea
                  value={item.content}
                  onChange={(e) =>
                    updateTextResource(index, "content", e.target.value)
                  }
                  rows="5"
                  className="mt-3 w-full rounded-lg border px-3 py-3 text-sm"
                  placeholder="Type lesson note here..."
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700">
              Video Links
            </h2>

            <button
              type="button"
              onClick={addVideoResource}
              className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white"
            >
              Add Video
            </button>
          </div>

          <div className="space-y-4">
            {videoResources.map((item, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Video {index + 1}
                  </p>

                  {videoResources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVideoResource(index)}
                      className="text-xs text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    value={item.title}
                    onChange={(e) =>
                      updateVideoResource(index, "title", e.target.value)
                    }
                    className="rounded-lg border px-3 py-3 text-sm"
                    placeholder="Video title"
                  />

                  <input
                    value={item.videoUrl}
                    onChange={(e) =>
                      updateVideoResource(index, "videoUrl", e.target.value)
                    }
                    className="rounded-lg border px-3 py-3 text-sm"
                    placeholder="YouTube video link"
                  />

                  <input
                    value={item.description}
                    onChange={(e) =>
                      updateVideoResource(index, "description", e.target.value)
                    }
                    className="rounded-lg border px-3 py-3 text-sm"
                    placeholder="Optional description"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-700">
            Document Uploads
          </h2>

          <input
            type="file"
            multiple
            onChange={handleFilesChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
            className="w-full text-sm"
          />

          {files.length > 0 && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              {files.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating Lesson..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", ...props }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border px-3 py-3 text-sm"
      {...props}
    />
  </div>
);

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-600">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      className="w-full rounded-lg border px-3 py-3 text-sm disabled:bg-gray-100"
    >
      <option value="">{placeholder}</option>
      {options.map((item) => (
        <option key={item._id} value={item._id}>
          {item.name}
        </option>
      ))}
    </select>
  </div>
);

export default CreateLessonPage;