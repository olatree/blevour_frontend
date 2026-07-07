// import React, { useState, useEffect } from "react";

// const heroImages = [
//   // "/img1.jpg",
//   // "/img2.jpg",
//   // "/img3.jpg",
//   // "/img4.jpg",
//   // "/img5.jpg",
//   "blevour_building.png",
// ];

// const HeroSlider = () => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % heroImages.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section id="hero" className="relative h-[80vh] overflow-hidden">
//       {/* SLIDES WITH DARK OVERLAY */}
//       {heroImages.map((img, i) => (
//         <div
//           key={i}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out 
//             ${i === index ? "opacity-100" : "opacity-0"}`}
//         >
//           <img
//             src={img}
//             alt={`Hero slide ${i + 1}`}
//             className="w-full h-full object-cover"
//           />
//           {/* Beautiful subtle dark overlay - adjust opacity as needed */}
//           <div className="absolute inset-0 bg-black/40"></div>
//         </div>
//       ))}

//       {/* Optional: Keep your blue tint (looks premium) */}
//       <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

//       {/* TEXT CONTENT */}
//       <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
//         <div className="px-6">
//           <h1 className="text-4xl md:text-6xl font-bold leading-tight">
//             Welcome to Blevour Schools
//           </h1>
//           <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto opacity-95">
//             Our Core Values:
//             Excellence
//             Integrity
//             Discipline
//             Respect
//             Innovation
//             Responsibility
//             Teamwork
//             Compassion
//             Leadership
//             Service
//           </p>

//           <a
//             href="#about"
//             className="mt-8 inline-block px-8 py-4 bg-cyan-600 rounded-xl text-white font-semibold hover:bg-cyan-500 transition shadow-lg"
//           >
//             Learn More
//           </a>
//         </div>
//       </div>

//       {/* DOT INDICATORS */}
//       <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
//         {heroImages.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setIndex(i)}
//             className={`w-3 h-3 rounded-full transition-all duration-300 
//               ${index === i ? "bg-white w-8" : "bg-white/60 hover:bg-white/80"}`}
//             aria-label={`Go to slide ${i + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default HeroSlider;

// import React from "react";
// import { FaCheckCircle } from "react-icons/fa";

// const coreValues = [
//   "Excellence",
//   "Integrity",
//   "Discipline",
//   "Respect",
//   "Innovation",
//   "Responsibility",
//   "Teamwork",
//   "Compassion",
//   "Leadership",
//   "Service",
// ];

// const HeroSlider = () => {
//   return (
//     <section
//       id="hero"
//       className="relative h-[60vh] min-h-[550px] flex items-center justify-center overflow-hidden"
//     >
//       {/* Background Image */}
//       <img
//         src="blevour_building.png"
//         alt="Blevour Schools"
//         className="absolute inset-0 w-full h-full object-cover"
//       />

//       {/* Premium Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>

//       {/* Hero Content */}
//       <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
//         {/* <div className="max-w-3xl backdrop-blur-sm bg-black/5 rounded-3xl p-6 md:p-8">  */}
//         <div className="max-w-3xl backdrop-blur-[1px] bg-black/5 rounded-3xl p-6 md:p-8">       
//           <span className="inline-block px-4 py-2 rounded-full bg-cyan-600/90 text-sm font-semibold tracking-wide uppercase mb-6">
//             Welcome to Blevour Schools
//           </span>

//           <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
//             Shaping Tomorrow's
//             <span className="block text-cyan-400">
//               Leaders Today
//             </span>
//           </h1>

//           <p className="mt-4 text-lg md:text-xl text-gray-200 leading-relaxed">
//             We provide an inspiring learning environment where academic
//             excellence, character development, and innovation come together to
//             prepare every child for a successful future.
//           </p>

//           {/* Core Values */}
//           <div className="mt-6">
//             <h3 className="text-xl font-bold mb-4 text-cyan-300">
//               Our Core Values
//             </h3>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {coreValues.map((value) => (
//                 <div
//                   key={value}
//                   className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm"
//                 >
//                   <FaCheckCircle className="text-cyan-400 text-lg flex-shrink-0" />
//                   <span className="font-medium">{value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* CTA Buttons */}
//           <div className="mt-8 flex flex-wrap gap-4">
//             <a
//               href="#about"
//               className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 transition duration-300 font-semibold shadow-xl"
//             >
//               Learn More
//             </a>

//             <a
//               href="#contact"
//               className="px-8 py-4 rounded-xl border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition duration-300 font-semibold"
//             >
//               Contact Us
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Fade */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
//     </section>
//   );
// };

// export default HeroSlider;


import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const coreValues = [
  "Excellence",
  "Integrity",
  "Discipline",
  "Respect",
  "Innovation",
  "Responsibility",
  "Teamwork",
  "Compassion",
  "Leadership",
  "Service",
];

const HeroSlider = () => {
  return (
    <section
      id="hero"
      className="relative h-[70vh] min-h-[520px] flex items-start justify-center overflow-hidden pt-16 md:pt-20"
    >
      {/* Background Image */}
      <img
        src="blev_build.jpeg"
        alt="Blevour Schools"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70"></div>

      {/* Hero Content */}
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 text-white">
        <div className="max-w-2xl backdrop-blur-[1px] bg-black/5 rounded-2xl p-3 md:p-4">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-600/90 text-[10px] md:text-xs font-semibold tracking-wide uppercase mb-2">
            Welcome to Blevour Schools
          </span>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05]">
            Shaping Tomorrow's
            <span className="block text-cyan-400">Leaders Today</span>
          </h1>

          <p className="mt-2 text-sm md:text-base text-gray-200 leading-snug">
            We provide an inspiring learning environment where academic excellence,
            character development, and innovation come together to prepare every
            child for a successful future.
          </p>

          {/* Core Values */}
          <div className="mt-3">
            <h3 className="text-base md:text-lg font-bold mb-2 text-cyan-300">
              Our Core Values
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {coreValues.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-2 bg-white/10 rounded-md px-2 py-1"
                >
                  <FaCheckCircle className="text-cyan-400 text-[11px] flex-shrink-0" />
                  <span className="text-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="#about"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition text-sm font-semibold shadow-lg"
            >
              Learn More
            </a>

            <a
              href="#contact"
              className="px-5 py-2 rounded-lg border border-white/40 bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSlider;