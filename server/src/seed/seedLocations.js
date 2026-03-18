import { connectToMongo } from "../db/connect.js";
import { Location } from "../models/Location.js";

const seedLocations = [
  {
    name: "Main Gate",
    category: "Entrance",
    latitude: 10.829168259980836,
    longitude: 77.06096154232867,
    image: "/maingate.png",
    description:
      "Primary entrance to the campus. Visitor entry, security check, and the main access point for students, staff, and guests.",
  },
  {
    name: "Main Block (Office)",
    category: "Administration",
    latitude: 10.828025181553457,
    longitude: 77.06049227434434,
    image: "/college.jpg",
    description:
      "Administrative block for principal office, student services, accounts, and general campus administration support.",
  },
  {
    name: "Amenity",
    category: "Food",
    latitude: 10.82731285303355,
    longitude: 77.06129828617287,
    image: "/amenity.jpg",
    description:
      "Campus food court offering snacks and meals with indoor seating—ideal for quick breaks between classes.",
  },
  {
    name: "Medical Center",
    category: "Health",
    latitude: 10.827882302582347,
    longitude: 77.06125855717835,
    image: "/medical.jpg",
    description:
      "On-campus medical center for first aid and primary health support.",
  },
  {
    name: "AIDS Block",
    category: "Academic",
    latitude: 10.827378950044254,
    longitude: 77.06051227116436,
    image: "/aids.jpeg",
    description:
      "Academic block for Artificial Intelligence & Data Science—classrooms, labs, and faculty areas for the department.",
  },
  {
    name: "Boys Hostel",
    category: "Residence",
    latitude: 10.826846515273989,
    longitude: 77.06065644667969,
    image: "/boys.jpg",
    description:
      "Residential hostel for boys with rooms, common areas, and essential facilities for student accommodation.",
  },
  {
    name: "Girls Hostel",
    category: "Residence",
    latitude: 10.82676340485521,
    longitude: 77.05949127116433,
    image: "/girls.jpg",
    description:
      "Residential hostel for girls with rooms, common areas, and essential facilities for student accommodation.",
  },
];

async function main() {
  await connectToMongo();

  const docs = seedLocations.map((l) => ({
    name: l.name,
    category: l.category,
    description: l.description ?? "",
    image: l.image ?? "",
    facilities: l.facilities ?? [],
    geo: { type: "Point", coordinates: [l.longitude, l.latitude] },
  }));

  await Location.deleteMany({});
  await Location.insertMany(docs);

  console.log(`Seeded ${docs.length} locations.`);
  process.exitCode = 0;
}

main().catch((err) => {
  console.error("Seed failed", err);
  process.exitCode = 1;
});