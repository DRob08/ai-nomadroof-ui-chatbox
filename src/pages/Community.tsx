import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ContactForm from "../components/ContactForm"

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
    { name: "Lucía (Argentina)", quote: "The trips and new friends made my exchange unforgettable!", imgId: 32 },
    { name: "Jonas (Germany)", quote: "I felt supported the entire time. It felt like home.", imgId: 45 },
    { name: "Aya (Japan)", quote: "The events helped me connect even when I didn’t know the language.", imgId: 12 },
  ];

  const events = [
    {
      date: "June 15, 2025",
      title: "Language Exchange Night",
      desc: "Practice Spanish, English, Portuguese, and more with fellow students over snacks and games.",
      image: "/images/community/event-language-exchange.png",
    },
    {
      date: "June 22, 2025",
      title: "Beach BBQ in Miraflores",
      desc: "Join us for a sunset BBQ with music and games by the Pacific Ocean.",
      image: "/images/community/event-bbq.png",
    },
    {
      date: "July 1, 2025",
      title: "Hiking Trip to Machu Picchu",
      desc: "An unforgettable 2-day hiking adventure to one of the world's wonders.",
      image: "/images/community/event-hiking.png",
    },
  ];

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
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-[#f5694b]">What Our Members Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl shadow-md p-6 text-center border border-gray-200">
              <img
                src={`https://i.pravatar.cc/150?img=${member.imgId}`}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-[#f5694b]"
              />
              <h4 className="text-lg font-semibold">{member.name}</h4>
              <p className="text-gray-600 italic mt-2">"{member.quote}"</p>
            </div>
          ))}
        </div>
      </section>

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
