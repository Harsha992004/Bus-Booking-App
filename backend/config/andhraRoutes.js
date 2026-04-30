// Andhra Pradesh Cities and Popular Routes Configuration

const ANDHRA_CITIES = [
  'Visakhapatnam',      // Major port city
  'Vijayawada',         // Commercial hub
  'Guntur',             // Educational hub
  'Nellore',            // Coastal city
  'Kurnool',            // Historical city
  'Rajahmundry',        // Cultural capital
  'Tirupati',           // Pilgrimage center
  'Kakinada',           // Port city
  'Kadapa',             // Historical city
  'Anantapur',          // Educational hub
  'Vizianagaram',       // Northern Andhra
  'Eluru',              // Central Andhra
  'Ongole',             // Prakasam district
  'Nandyal',            // Kurnool district
  'Machilipatnam',      // Krishna district
  'Adoni',              // Kurnool district
  'Tenali',             // Guntur district
  'Chittoor',           // Temple city
  'Hindupur',           // Anantapur district
  'Proddatur',          // Kadapa district
  'Bhimavaram',         // West Godavari
  'Madanapalle',        // Chittoor district
  'Guntakal',           // Anantapur district
  'Dharmavaram',        // Anantapur district
  'Srikakulam',         // Northern coastal
  'Tadepalligudem',     // West Godavari
  'Narasaraopet',       // Guntur district
  'Palakollu',          // West Godavari
  'Tadipatri',          // Anantapur district
  'Chirala'             // Prakasam district
];

// Popular routes with distances and durations
const POPULAR_ROUTES = [
  {
    source: 'Visakhapatnam',
    destination: 'Vijayawada',
    distance: 350,
    duration: '6h 30m',
    stops: ['Rajahmundry', 'Eluru']
  },
  {
    source: 'Vijayawada',
    destination: 'Visakhapatnam',
    distance: 350,
    duration: '6h 30m',
    stops: ['Eluru', 'Rajahmundry']
  },
  {
    source: 'Visakhapatnam',
    destination: 'Tirupati',
    distance: 760,
    duration: '13h 00m',
    stops: ['Rajahmundry', 'Vijayawada', 'Guntur', 'Nellore']
  },
  {
    source: 'Tirupati',
    destination: 'Visakhapatnam',
    distance: 760,
    duration: '13h 00m',
    stops: ['Nellore', 'Guntur', 'Vijayawada', 'Rajahmundry']
  },
  {
    source: 'Vijayawada',
    destination: 'Tirupati',
    distance: 380,
    duration: '7h 00m',
    stops: ['Guntur', 'Nellore']
  },
  {
    source: 'Tirupati',
    destination: 'Vijayawada',
    distance: 380,
    duration: '7h 00m',
    stops: ['Nellore', 'Guntur']
  },
  {
    source: 'Guntur',
    destination: 'Visakhapatnam',
    distance: 280,
    duration: '5h 30m',
    stops: ['Vijayawada', 'Rajahmundry']
  },
  {
    source: 'Visakhapatnam',
    destination: 'Guntur',
    distance: 280,
    duration: '5h 30m',
    stops: ['Rajahmundry', 'Vijayawada']
  },
  {
    source: 'Kurnool',
    destination: 'Hyderabad', // Note: Hyderabad is in Telangana but commonly traveled
    distance: 215,
    duration: '4h 00m',
    stops: []
  },
  {
    source: 'Vijayawada',
    destination: 'Kurnool',
    distance: 320,
    duration: '6h 00m',
    stops: ['Nandyal']
  },
  {
    source: 'Tirupati',
    destination: 'Kurnool',
    distance: 360,
    duration: '7h 00m',
    stops: ['Kadapa']
  },
  {
    source: 'Rajahmundry',
    destination: 'Visakhapatnam',
    distance: 200,
    duration: '3h 30m',
    stops: ['Vizianagaram']
  },
  {
    source: 'Visakhapatnam',
    destination: 'Rajahmundry',
    distance: 200,
    duration: '3h 30m',
    stops: ['Vizianagaram']
  },
  {
    source: 'Kakinada',
    destination: 'Visakhapatnam',
    distance: 165,
    duration: '3h 00m',
    stops: ['Rajahmundry']
  },
  {
    source: 'Visakhapatnam',
    destination: 'Kakinada',
    distance: 165,
    duration: '3h 00m',
    stops: ['Rajahmundry']
  },
  {
    source: 'Vijayawada',
    destination: 'Rajahmundry',
    distance: 180,
    duration: '3h 30m',
    stops: ['Eluru']
  },
  {
    source: 'Rajahmundry',
    destination: 'Vijayawada',
    distance: 180,
    duration: '3h 30m',
    stops: ['Eluru']
  },
  {
    source: 'Nellore',
    destination: 'Tirupati',
    distance: 140,
    duration: '2h 30m',
    stops: []
  },
  {
    source: 'Tirupati',
    destination: 'Nellore',
    distance: 140,
    duration: '2h 30m',
    stops: []
  },
  {
    source: 'Guntur',
    destination: 'Tirupati',
    distance: 290,
    duration: '5h 30m',
    stops: ['Nellore']
  },
  {
    source: 'Tirupati',
    destination: 'Guntur',
    distance: 290,
    duration: '5h 30m',
    stops: ['Nellore']
  },
  {
    source: 'Anantapur',
    destination: 'Tirupati',
    distance: 200,
    duration: '4h 00m',
    stops: ['Hindupur']
  },
  {
    source: 'Tirupati',
    destination: 'Anantapur',
    distance: 200,
    duration: '4h 00m',
    stops: ['Hindupur']
  }
];

// Sample bus operators in Andhra Pradesh
const BUS_OPERATORS = [
  {
    name: 'APSRTC (Book My Seat)',
    contact: '0866-2570000',
    email: 'support@bookmyseat.ap.gov.in',
    logo: '/logos/apsrtc.png'
  },
  {
    name: 'Orange Travels',
    contact: '040-23456789',
    email: 'bookings@orangetravels.com',
    logo: '/logos/orange.png'
  },
  {
    name: 'Morning Star Travels',
    contact: '0866-2456789',
    email: 'info@morningstartravels.com',
    logo: '/logos/morningstar.png'
  },
  {
    name: 'SVR Tours & Travels',
    contact: '0891-2700000',
    email: 'svr@svrtours.com',
    logo: '/logos/svr.png'
  },
  {
    name: 'Diwakar Travels',
    contact: '0877-2288999',
    email: 'diwakar@diwakartravels.com',
    logo: '/logos/diwakar.png'
  }
];

// Bus types with configurations
const BUS_TYPES = {
  'standard': {
    name: 'Standard Non-AC',
    amenities: ['water-bottle'],
    seatLayout: '2x2',
    seatCategories: [
      { category: 'seater', seats: 40, fareMultiplier: 1.0 }
    ]
  },
  'deluxe': {
    name: 'Deluxe AC',
    amenities: ['ac', 'water-bottle', 'charging-ports'],
    seatLayout: '2x2',
    seatCategories: [
      { category: 'seater', seats: 40, fareMultiplier: 1.3 }
    ]
  },
  'luxury': {
    name: 'Luxury AC Sleeper',
    amenities: ['ac', 'wifi', 'charging-ports', 'blanket', 'pillow', 'water-bottle', 'entertainment'],
    seatLayout: '2x1',
    seatCategories: [
      { category: 'sleeper', seats: 24, fareMultiplier: 1.8 }
    ]
  },
  'semi-luxury': {
    name: 'Semi-Sleeper AC',
    amenities: ['ac', 'charging-ports', 'water-bottle'],
    seatLayout: '2x2',
    seatCategories: [
      { category: 'semi-sleeper', seats: 36, fareMultiplier: 1.5 }
    ]
  },
  'sleeper': {
    name: 'Non-AC Sleeper',
    amenities: ['water-bottle', 'blanket'],
    seatLayout: '2x1',
    seatCategories: [
      { category: 'sleeper', seats: 24, fareMultiplier: 1.4 }
    ]
  },
  'ac-sleeper': {
    name: 'Multi-Axle AC Sleeper',
    amenities: ['ac', 'wifi', 'charging-ports', 'blanket', 'pillow', 'water-bottle', 'entertainment', 'reading-light', 'emergency-exit'],
    seatLayout: '2x1',
    seatCategories: [
      { category: 'sleeper', seats: 20, fareMultiplier: 2.0 }
    ]
  }
};

// Calculate fare based on distance and bus type
const calculateFare = (distance, busType, seatCategory = 'seater') => {
  const baseRate = 0.75; // Base rate per km
  const typeConfig = BUS_TYPES[busType];
  if (!typeConfig) return distance * baseRate;
  
  const category = typeConfig.seatCategories.find(c => c.category === seatCategory);
  const multiplier = category ? category.fareMultiplier : 1.0;
  
  return Math.round(distance * baseRate * multiplier);
};

// Get available routes between two cities
const getRoutes = (from, to) => {
  return POPULAR_ROUTES.filter(route => 
    route.source === from && route.destination === to
  );
};

// Get all cities
const getAllCities = () => {
  return [...ANDHRA_CITIES];
};

module.exports = {
  ANDHRA_CITIES,
  POPULAR_ROUTES,
  BUS_OPERATORS,
  BUS_TYPES,
  calculateFare,
  getRoutes,
  getAllCities
};
