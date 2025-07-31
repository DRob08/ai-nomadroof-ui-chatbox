export interface EventItem {
  date: string;
  title: string;
  desc: string;
  image: string;
}

const events: EventItem[] = [
  {
    date: "August 12, 2025",
    title: "Meet-up Night and Salsa Night",
    desc: "Because some students will already be in Lima, we're kicking off Semester 2025-02 with our first meet-up in one of our houses. More info in our WhatsApp group!",
    image: "/images/community/nomadroof-events-language-exchange.jpg",
  },
  {
    date: "August 19, 2025",
    title: "Welcome Party Semester 2025-02",
    desc: "Get ready for the biggest Welcome Party of the year in Miraflores! Live DJs, activities, games, beer pong, food, open bar, and much more with students from all our houses and apartments.",
    image: "/images/community/nomadroof-events-beach-bbq-miraflores.JPG",
  },
  {
    date: "August 27-31, 2025",
    title: "Huaraz Integration Trip",
    desc: "Trek through big mountains, turquoise lagoons, and beautiful landscapes in Huaraz. Discover its culture and connect with fellow exchange students in nature!",
    image: "/images/community/nomadroof-events-hiking-trip.JPG",
  },
];

export default events;
