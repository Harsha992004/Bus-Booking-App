const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const { POPULAR_ROUTES, BUS_OPERATORS, BUS_TYPES } = require('../config/andhraRoutes');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Generate seat numbers based on layout and category
const generateSeatNumbers = (layout, categories) => {
  const seats = [];
  
  categories.forEach(cat => {
    const prefix = cat.category === 'sleeper' ? 'SL' : 
                   cat.category === 'semi-sleeper' ? 'SS' : 'ST';
    
    if (layout === '2x1') {
      // For 2x1 layout (sleeper): Lower and Upper
      const lower = Math.ceil(cat.seats / 2);
      const upper = cat.seats - lower;
      
      for (let i = 1; i <= lower; i++) {
        seats.push(`${prefix}-L${i}`);
      }
      for (let i = 1; i <= upper; i++) {
        seats.push(`${prefix}-U${i}`);
      }
    } else if (layout === '2x2') {
      // For 2x2 layout: A and B sides
      const half = Math.ceil(cat.seats / 2);
      for (let i = 1; i <= half; i++) {
        seats.push(`${prefix}-A${i}`);
        if (i <= cat.seats - half) {
          seats.push(`${prefix}-B${i}`);
        }
      }
    } else {
      // 3x2 layout
      const third = Math.ceil(cat.seats / 3);
      for (let i = 1; i <= cat.seats; i++) {
        const row = Math.ceil(i / 3);
        const col = ((i - 1) % 3) + 1;
        seats.push(`${prefix}-${row}${col}`);
      }
    }
  });
  
  return seats;
};

// Calculate arrival time based on departure time and duration
const calculateArrivalTime = (departTime, duration) => {
  const [hours, minutes] = departTime.split(':').map(Number);
  const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);
  const durationHours = parseInt(durationMatch[1]);
  const durationMinutes = parseInt(durationMatch[2]);
  
  let arrivalHours = hours + durationHours;
  let arrivalMinutes = minutes + durationMinutes;
  
  if (arrivalMinutes >= 60) {
    arrivalHours += 1;
    arrivalMinutes -= 60;
  }
  
  arrivalHours = arrivalHours % 24;
  
  return `${String(arrivalHours).padStart(2, '0')}:${String(arrivalMinutes).padStart(2, '0')}`;
};

// Generate intermediate stops with times
const generateIntermediateStops = (route, departTime, arriveTime) => {
  const stops = [];
  const [depHours, depMinutes] = departTime.split(':').map(Number);
  const [arrHours, arrMinutes] = arriveTime.split(':').map(Number);
  
  let totalMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Next day arrival
  
  const numStops = route.stops ? route.stops.length : 0;
  
  if (numStops > 0 && route.distance) {
    route.stops.forEach((stop, index) => {
      const stopProgress = (index + 1) / (numStops + 1);
      const stopMinutes = Math.floor(totalMinutes * stopProgress);
      
      let stopHour = depHours + Math.floor(stopMinutes / 60);
      let stopMin = depMinutes + (stopMinutes % 60);
      
      if (stopMin >= 60) {
        stopHour += 1;
        stopMin -= 60;
      }
      stopHour = stopHour % 24;
      
      const arrivalTime = `${String(stopHour).padStart(2, '0')}:${String(stopMin).padStart(2, '0')}`;
      
      // Departure after 15-30 mins stop
      let depHour = stopHour;
      let depMin = stopMin + 20;
      if (depMin >= 60) {
        depHour += 1;
        depMin -= 60;
      }
      depHour = depHour % 24;
      const departureTime = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
      
      stops.push({
        city: stop,
        arrivalTime,
        departureTime,
        distanceFromSource: Math.floor(route.distance * stopProgress),
        fareFromSource: Math.floor(route.distance * stopProgress * 0.75)
      });
    });
  }
  
  return stops;
};

// Generate buses for a route
const generateBusesForRoute = (route, busesPerRoute = 4) => {
  const buses = [];
  const busTypes = Object.keys(BUS_TYPES);
  const operators = BUS_OPERATORS;
  
  // Generate multiple departures throughout the day
  const departureTimes = ['06:00', '10:00', '14:00', '18:00', '21:00', '23:00'];
  
  for (let i = 0; i < busesPerRoute; i++) {
    const busTypeKey = busTypes[i % busTypes.length];
    const busTypeConfig = BUS_TYPES[busTypeKey];
    const operator = operators[i % operators.length];
    const departTime = departureTimes[i % departureTimes.length];
    const arriveTime = calculateArrivalTime(departTime, route.duration);
    
    // Generate seat categories with seat numbers
    const seatCategories = busTypeConfig.seatCategories.map(cat => {
      const seatNumbers = generateSeatNumbers(busTypeConfig.seatLayout, [cat]);
      return {
        category: cat.category,
        seats: cat.seats,
        fare: Math.floor(route.distance * 0.75 * cat.fareMultiplier),
        seatNumbers: seatNumbers.slice(0, cat.seats)
      };
    });
    
    const totalSeats = seatCategories.reduce((sum, cat) => sum + cat.seats, 0);
    const baseFare = seatCategories[0]?.fare || Math.floor(route.distance * 0.75);
    
    // Generate bus number
    const busNumber = `AP${String(Math.floor(Math.random() * 99)).padStart(2, '0')}${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 3) % 26))}${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    
    const bus = {
      name: `${operator.name} - ${busTypeConfig.name}`,
      busNumber: busNumber,
      fromCity: route.source,
      toCity: route.destination,
      intermediateRoutes: generateIntermediateStops(route, departTime, arriveTime),
      departTime: departTime,
      arriveTime: arriveTime,
      totalDistance: route.distance,
      duration: route.duration,
      seatsTotal: totalSeats,
      seatLayout: busTypeConfig.seatLayout,
      seatCategories: seatCategories,
      baseFare: baseFare,
      busType: busTypeKey,
      amenities: busTypeConfig.amenities,
      rating: {
        average: 3.5 + Math.random() * 1.5, // Random rating between 3.5 and 5
        totalReviews: Math.floor(Math.random() * 500) + 50
      },
      isActive: true,
      schedule: {
        daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      operator: {
        name: operator.name,
        contact: operator.contact,
        email: operator.email,
        logo: operator.logo
      },
      driverInfo: {
        name: `Driver ${i + 1}`,
        contact: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        licenseNumber: `DL${String(Math.floor(Math.random() * 999999999999)).padStart(12, '0')}`
      }
    };
    
    buses.push(bus);
  }
  
  return buses;
};

// Seed database
const seedBuses = async () => {
  try {
    await connectDB();
    
    // Clear existing buses
    console.log('Clearing existing buses...');
    await Bus.deleteMany({});
    
    console.log('Generating buses for routes...');
    const allBuses = [];
    
    // Generate buses for each popular route
    for (const route of POPULAR_ROUTES) {
      console.log(`Creating buses for ${route.source} → ${route.destination}`);
      const buses = generateBusesForRoute(route, 4); // 4 buses per route
      allBuses.push(...buses);
    }
    
    // Insert all buses
    console.log(`Inserting ${allBuses.length} buses into database...`);
    const createdBuses = await Bus.insertMany(allBuses);
    
    console.log(`\n✅ Successfully created ${createdBuses.length} buses!`);
    
    // Summary by route
    const routeSummary = {};
    for (const bus of createdBuses) {
      const routeKey = `${bus.fromCity} → ${bus.toCity}`;
      if (!routeSummary[routeKey]) {
        routeSummary[routeKey] = { count: 0, types: new Set() };
      }
      routeSummary[routeKey].count++;
      routeSummary[routeKey].types.add(bus.busType);
    }
    
    console.log('\n📊 Route Summary:');
    for (const [route, data] of Object.entries(routeSummary)) {
      console.log(`  ${route}: ${data.count} buses (${Array.from(data.types).join(', ')})`);
    }
    
    console.log('\n🚌 Bus Types Distribution:');
    const typeCount = {};
    for (const bus of createdBuses) {
      typeCount[bus.busType] = (typeCount[bus.busType] || 0) + 1;
    }
    for (const [type, count] of Object.entries(typeCount)) {
      console.log(`  ${type}: ${count} buses`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding buses: ${error.message}`);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === '-d') {
  // Delete only mode
  connectDB().then(async () => {
    await Bus.deleteMany({});
    console.log('All buses deleted');
    process.exit(0);
  });
} else {
  seedBuses();
}
