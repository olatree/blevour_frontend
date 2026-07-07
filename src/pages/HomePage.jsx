import Navbar from "../components/Navbar";
import HeroSlider from "./HeroSlider";


export default function HomePage() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />

      <HeroSlider />

      {/* About Us */}
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-cyan-600">About Us</h2>

        <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Our mission is to provide a safe, inclusive, and stimulating learning
          environment where every child is empowered through quality education,
          character development, creativity, and the effective use of modern
          teaching methods, preparing them for lifelong success.
        </p>

        {/* Divider */}
        <div className="my-8 flex justify-center">
          <div className="w-50 h-1 bg-cyan-600 rounded-full"></div>
        </div>

        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Our vision is to be a leading institution committed to nurturing
          confident, innovative, morally upright, and globally competitive learners
          through excellence in education.
        </p>
      </div>
    </section>


    <section
      id="team"
      className="relative min-h-[460px] md:py-20 overflow-hidden"
    >
      {/* Background Image */}
      <img
        src="teachers.jpeg" // Replace with your image
        alt="Our Team"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/60 via-slate-600/60 to-cyan-600/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* Section Badge */}
        <span className="inline-block px-5 py-2 rounded-full bg-cyan-600 text-sm font-semibold uppercase tracking-wider">
          Our Team
        </span>

        {/* Heading */}
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">
          Meet Our Team
        </h2>

        {/* Decorative Line */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="w-16 h-1 rounded-full bg-cyan-400"></div>
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <div className="w-16 h-1 rounded-full bg-cyan-400"></div>
        </div>

        {/* Description */}
        <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-200">
          Behind every successful student is a dedicated teacher. At
          <span className="font-semibold text-cyan-300"> Blevour Schools</span>,
          our team of resilient, highly skilled, and passionate educators is
          committed to nurturing excellence, inspiring curiosity, and building
          confident future leaders. Through unwavering dedication, innovative
          teaching, and genuine care, we create an environment where every learner
          is encouraged to discover their potential and thrive academically,
          socially, and morally.
        </p>

        {/* CTA */}
        <div className="mt-6">
          <a
            href="#contact"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold transition duration-300 shadow-xl"
          >
            Meet Our Staff
          </a>
        </div>
      </div>
    </section>

      {/* Facilities */}
      {/* <section id="facilities" className="py-16">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center text-cyan-600">
      Our Facilities
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

      {/* Facility 1 */}
      {/* <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition">
        <img
          src="/building.jpg"
          alt="Building"
          className="h-40 w-full object-cover rounded-xl mb-4"
        />
        <h3 className="text-xl font-semibold text-cyan-600">Serene Learning Environment</h3>
        <p className="text-gray-600 mt-2">
          A clean, calm, and well-maintained environment that promotes effective
          learning and student well-being.
        </p>
      </div> */}



      {/* Contact Us */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-cyan-600">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Get in Touch
              </h3>
              <p className="mt-4 text-gray-600">
                Address: 1b, Olorunishola Street, Awodi-Ora, Ajegunle, Lagos.
              </p>
              <p className="text-gray-600">Phone: +234 803 352 5269, +243 912 374 4861</p>
              {/* <p className="text-gray-600">Email: moonlightschool02@gmail.com</p> */}
            </div>
            <form className="bg-white shadow-md rounded-xl p-6 space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
              />
              <textarea
                placeholder="Your Message"
                rows="4"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
              ></textarea>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyan-600 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Grayweb Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
