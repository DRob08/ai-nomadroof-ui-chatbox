import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ContactForm from "../components/ContactForm"
import { event as trackEvent } from '../utils/ga';
import events, { EventItem } from "../data/events";

const Community = () => {
    const [showModal, setShowModal] = useState(false);
  const galleryImages = [
    { src: "/images/community/nomadroof-events-1.png" },
    { src: "/images/community/nomadroof-events-2.png" },
    { src: "/images/community/nomadroof-events-3.png" },
    { src: "/images/community/nomadroof-events-4.png" },
    { src: "/images/community/nomadroof-events-5.png" },
    { src: "/images/community/nomadroof-events-6.png" },
    { src: "/images/community/nomadroof-events-7.png" },
    { src: "/images/community/nomadroof-events-8.png" },
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const highlights = [
    {
      title: "Latam Trips & Adventures",
      desc: "From hiking volcanoes to exploring ancient ruins, we organize unforgettable trips across Latin America.",
      image: "/images/community/nomadroof-events-8.png",
    },
    {
      title: "Events & Socials",
      desc: "Weekly events, BBQs, language exchanges, and game nights to help students bond and make lifelong friends.",
      image: "/images/community/nomadroof-events-2.png",
    },
    {
      title: "Student Support",
      desc: "Arrival tips, legal help, cultural guidance — we’re with you from check-in to farewell.",
      image: "/images/community/nomadroof-events-7.png",
    },
  ];

  const members = [
    {
      name: "Angelo (Germany)",
      quote:
        "Meine WG in Miraflores über Nomadroof war die beste Entscheidung für mein Auslandssemester in Lima",
      image: "https://www.nomadroof.com/wp-content/uploads/2018/12/angelo-eder.jpg",
    },
    {
      name: "Cornelia (France)",
      quote: "I highly recommend using Nomadroof, thankful for all the support received during the process and during the whole stay in Lima. Couldn’t wish for a better placement and safeness.",
      image: "https://www.nomadroof.com/wp-content/uploads/2023/04/cornelia-review-image.jpeg",
    },
    {
      name: "Gabriele (Italy)",
      quote:
        "Sono stato in un appartamento Nomadroof durante il mio exchange a Lima e mi sono trovato benissimo. Lo staff è accogliente e disponibile e l’ambiente è ottimo. Lo consiglio vivamente!",
      image: "https://www.nomadroof.com/wp-content/uploads/2023/04/gabriele_review_image.jpeg",
    },
  ];
  

//  const events = [
//   {
//     date: "August 11, 2025",
//     title: "Meet-up Night and Fiesta TM",
//     desc: "Because some students will already be in Lima, we're kicking off Semester 2025-02 with our first meet-up in one of our houses. More info in our WhatsApp group!",
//     image: "/images/community/nomadroof-events-language-exchange.jpg",
//   },
//   {
//     date: "August 19, 2025",
//     title: "Welcome Party Semester 2025-02",
//     desc: "Get ready for the biggest Welcome Party of the year in Miraflores! Live DJs, activities, games, beer pong, food, open bar, and much more with students from all our houses and apartments.",
//     image: "/images/community/nomadroof-events-beach-bbq-miraflores.JPG",
//   },
//   {
//     date: "August 27-31, 2025",
//     title: "Huaraz Integration Trip",
//     desc: "Trek through big mountains, turquoise lagoons, and beautiful landscapes in Huaraz. Discover its culture and connect with fellow exchange students in nature!",
//     image: "/images/community/nomadroof-events-hiking-trip.JPG",
//   },
// ];


  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
          Welcome to Our Student Community
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We host exchange students across Latin America, creating a vibrant network of nomadic learners who share experiences, make memories, and support each other every step of the way.
        </p>
      </section>

      {/* Highlights */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-[#f5694b]">Community Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border-t-4 border-[#f5694b]">
              <img src={item.image} alt={item.title} className="h-40 w-full object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-[#f5694b]">What Our Members Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl shadow-md p-6 text-center border border-gray-200">
              <img
  src={member.image}
  alt={member.name}
  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-[#f5694b]"
/>
              <h4 className="text-lg font-semibold">{member.name}</h4>
              <p className="text-gray-600 italic mt-2">"{member.quote}"</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Events */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-[#f5694b]">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 border-l-4 border-[#f5694b]">
              <img
                src={event.image}
                alt={event.title}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <p className="text-sm text-[#f5694b] font-semibold uppercase tracking-wide">{event.date}</p>
              <h4 className="text-xl font-bold text-gray-800 mt-1">{event.title}</h4>
              <p className="text-gray-700 mt-2">{event.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-[#f5694b]">Community Gallery</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt={`Gallery ${index}`}
              className="rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer object-cover h-48 w-full"
              onClick={() => {
                setCurrentIndex(index);
                setLightboxOpen(true);
              }}
            />
          ))}
        </div>
        {lightboxOpen && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={currentIndex}
            slides={galleryImages}
            plugins={[Thumbnails]}
          />
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#f5694b] text-white py-12 px-8 rounded-2xl text-center shadow-md">
  <h3 className="text-3xl font-bold mb-4">Ready to Join the Adventure?</h3>
  
  <p className="text-lg mb-6 italic">
    Booking with us is just the beginning — the real journey starts when you become part of our community.
  </p>
  <button
  onClick={() => setShowModal(true)}
  className="inline-block bg-white text-[#f5694b] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
>
  Join Our Community
</button>
</section>

<section className="flex flex-col md:flex-row items-center justify-center bg-white rounded-xl overflow-hidden shadow-md my-12">
  {/* Left side - Full Image */}
  <div className="w-full md:w-1/2 h-64 md:h-auto">
    <img
      src="/images/community/nomadroof-events-group-pic.JPG"
      alt="Nomadroof Community Event"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Right side - WhatsApp CTA */}
  <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-8">
    <h3 className="text-2xl font-bold mb-3 text-gray-800">Need Help?</h3>
    <p className="text-lg text-gray-600 mb-5">
      Reach us directly on WhatsApp.
    </p>
    <a
  href="https://wa.me/51924634308"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => {
    trackEvent({
      action: 'click_whatsapp',
      category: 'Engagement',
      label: 'Community page - WhatsApp',
    });
  }}
  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.52 3.48a11.78 11.78 0 0 0-16.7 0A11.8 11.8 0 0 0 2.4 16.96L.9 22.35a1 1 0 0 0 1.25 1.25l5.39-1.49a11.8 11.8 0 0 0 13.98-13.98 11.79 11.79 0 0 0-1.99-3.65zM12 21.2a9.2 9.2 0 0 1-4.74-1.3l-.34-.2-3.2.89.89-3.2-.2-.34a9.2 9.2 0 1 1 7.59 4.15zm5.3-6.8c-.29-.14-1.74-.86-2.01-.96-.27-.1-.47-.14-.67.15s-.77.96-.95 1.15-.35.21-.64.07a7.5 7.5 0 0 1-2.21-1.36 8.3 8.3 0 0 1-1.54-1.91c-.16-.28-.02-.43.12-.58.13-.13.29-.35.43-.52.14-.17.18-.29.28-.48.1-.2.05-.38-.02-.52-.07-.14-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.79.38s-1.04 1.02-1.04 2.48c0 1.46 1.07 2.87 1.22 3.07.14.2 2.1 3.21 5.1 4.5.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.13.57-.08 1.74-.71 1.99-1.39.25-.68.25-1.27.18-1.39-.08-.12-.27-.19-.56-.33z" />
      </svg>
      Message Us
    </a>
  </div>
</section>




 {/* Modal */}
 {showModal && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
  <div className="bg-white rounded-xl w-full max-w-md p-6">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ContactForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Community;
