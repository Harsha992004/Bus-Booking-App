const mongoose = require('mongoose');
const Bus = require('../models/Bus');
require('dotenv').config();

// Sample data for seeding - 50 South Indian buses
const sampleBuses = [
  // Karnataka routes
  {
    name: 'Karnataka Express',
    fromCity: 'Bangalore',
    toCity: 'Mysore',
    departTime: '06:00',
    arriveTime: '08:30',
    seatsTotal: 45,
    fare: 250.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Karnataka State Transport',
      contact: '1-800-KSRTC'
    }
  },
  {
    name: 'Royal Cruiser',
    fromCity: 'Bangalore',
    toCity: 'Hubli',
    departTime: '07:00',
    arriveTime: '12:00',
    seatsTotal: 40,
    fare: 450.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Royal Travels',
      contact: '1-800-ROYAL'
    }
  },
  {
    name: 'Mangalore Express',
    fromCity: 'Bangalore',
    toCity: 'Mangalore',
    departTime: '08:00',
    arriveTime: '13:00',
    seatsTotal: 42,
    fare: 380.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Coastal Lines',
      contact: '1-800-COASTAL'
    }
  },
  {
    name: 'Belgaum Shuttle',
    fromCity: 'Bangalore',
    toCity: 'Belgaum',
    departTime: '09:00',
    arriveTime: '14:30',
    seatsTotal: 38,
    fare: 420.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'North Karnataka Transit',
      contact: '1-800-NORTHKA'
    }
  },
  {
    name: 'Gulbarga Link',
    fromCity: 'Bangalore',
    toCity: 'Gulbarga',
    departTime: '10:00',
    arriveTime: '16:00',
    seatsTotal: 40,
    fare: 480.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Deccan Travels',
      contact: '1-800-DECCAN'
    }
  },
  {
    name: 'Mysore Royal',
    fromCity: 'Mysore',
    toCity: 'Bangalore',
    departTime: '11:00',
    arriveTime: '13:30',
    seatsTotal: 35,
    fare: 250.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports'],
    operator: {
      name: 'Royal Mysore',
      contact: '1-800-MYSORE'
    }
  },
  {
    name: 'Hubli Express',
    fromCity: 'Hubli',
    toCity: 'Bangalore',
    departTime: '12:00',
    arriveTime: '17:00',
    seatsTotal: 42,
    fare: 450.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'North Karnataka Transit',
      contact: '1-800-NORTHKA'
    }
  },
  {
    name: 'Coastal Voyager',
    fromCity: 'Mangalore',
    toCity: 'Bangalore',
    departTime: '13:00',
    arriveTime: '18:00',
    seatsTotal: 40,
    fare: 380.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'entertainment'],
    operator: {
      name: 'Coastal Lines',
      contact: '1-800-COASTAL'
    }
  },
  {
    name: 'Belgaum Bangalore',
    fromCity: 'Belgaum',
    toCity: 'Bangalore',
    departTime: '14:00',
    arriveTime: '19:30',
    seatsTotal: 38,
    fare: 420.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Royal Travels',
      contact: '1-800-ROYAL'
    }
  },
  {
    name: 'Gulbarga Express',
    fromCity: 'Gulbarga',
    toCity: 'Bangalore',
    departTime: '15:00',
    arriveTime: '21:00',
    seatsTotal: 40,
    fare: 480.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Deccan Travels',
      contact: '1-800-DECCAN'
    }
  },

  // Tamil Nadu routes
  {
    name: 'Chennai Express',
    fromCity: 'Chennai',
    toCity: 'Bangalore',
    departTime: '06:30',
    arriveTime: '11:00',
    seatsTotal: 45,
    fare: 550.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Tamil Nadu State Transport',
      contact: '1-800-TNSTC'
    }
  },
  {
    name: 'Coimbatore Link',
    fromCity: 'Chennai',
    toCity: 'Coimbatore',
    departTime: '07:00',
    arriveTime: '12:00',
    seatsTotal: 40,
    fare: 450.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Kongu Travels',
      contact: '1-800-KONGU'
    }
  },
  {
    name: 'Madurai Express',
    fromCity: 'Chennai',
    toCity: 'Madurai',
    departTime: '08:00',
    arriveTime: '13:30',
    seatsTotal: 42,
    fare: 380.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports'],
    operator: {
      name: 'Temple City Travels',
      contact: '1-800-TEMPLE'
    }
  },
  {
    name: 'Tiruchirappalli Shuttle',
    fromCity: 'Chennai',
    toCity: 'Tiruchirappalli',
    departTime: '09:00',
    arriveTime: '14:00',
    seatsTotal: 38,
    fare: 320.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Trichy Transit',
      contact: '1-800-TRICHY'
    }
  },
  {
    name: 'Salem Express',
    fromCity: 'Chennai',
    toCity: 'Salem',
    departTime: '10:00',
    arriveTime: '14:30',
    seatsTotal: 40,
    fare: 280.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Salem Lines',
      contact: '1-800-SALEM'
    }
  },
  {
    name: 'Bangalore Chennai',
    fromCity: 'Bangalore',
    toCity: 'Chennai',
    departTime: '11:00',
    arriveTime: '15:30',
    seatsTotal: 45,
    fare: 550.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Tamil Nadu State Transport',
      contact: '1-800-TNSTC'
    }
  },
  {
    name: 'Coimbatore Bangalore',
    fromCity: 'Coimbatore',
    toCity: 'Bangalore',
    departTime: '12:00',
    arriveTime: '17:00',
    seatsTotal: 40,
    fare: 450.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Kongu Travels',
      contact: '1-800-KONGU'
    }
  },
  {
    name: 'Madurai Chennai',
    fromCity: 'Madurai',
    toCity: 'Chennai',
    departTime: '13:00',
    arriveTime: '18:30',
    seatsTotal: 42,
    fare: 380.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'entertainment'],
    operator: {
      name: 'Temple City Travels',
      contact: '1-800-TEMPLE'
    }
  },
  {
    name: 'Tiruchirappalli Chennai',
    fromCity: 'Tiruchirappalli',
    toCity: 'Chennai',
    departTime: '14:00',
    arriveTime: '19:00',
    seatsTotal: 38,
    fare: 320.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Trichy Transit',
      contact: '1-800-TRICHY'
    }
  },
  {
    name: 'Salem Chennai',
    fromCity: 'Salem',
    toCity: 'Chennai',
    departTime: '15:00',
    arriveTime: '19:30',
    seatsTotal: 40,
    fare: 280.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Salem Lines',
      contact: '1-800-SALEM'
    }
  },

  // Kerala routes
  {
    name: 'Kerala Express',
    fromCity: 'Bangalore',
    toCity: 'Kochi',
    departTime: '06:00',
    arriveTime: '12:00',
    seatsTotal: 45,
    fare: 650.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Kerala State Transport',
      contact: '1-800-KSRTC'
    }
  },
  {
    name: 'Malabar Cruiser',
    fromCity: 'Bangalore',
    toCity: 'Kozhikode',
    departTime: '07:30',
    arriveTime: '14:00',
    seatsTotal: 40,
    fare: 580.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Malabar Travels',
      contact: '1-800-MALABAR'
    }
  },
  {
    name: 'Trivandrum Express',
    fromCity: 'Bangalore',
    toCity: 'Trivandrum',
    departTime: '08:00',
    arriveTime: '16:00',
    seatsTotal: 42,
    fare: 750.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Kerala State Transport',
      contact: '1-800-KSRTC'
    }
  },
  {
    name: 'Thrissur Link',
    fromCity: 'Bangalore',
    toCity: 'Thrissur',
    departTime: '09:00',
    arriveTime: '15:00',
    seatsTotal: 38,
    fare: 520.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Thrissur Transit',
      contact: '1-800-THRISHUR'
    }
  },
  {
    name: 'Kochi Bangalore',
    fromCity: 'Kochi',
    toCity: 'Bangalore',
    departTime: '10:00',
    arriveTime: '16:00',
    seatsTotal: 45,
    fare: 650.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Kerala State Transport',
      contact: '1-800-KSRTC'
    }
  },
  {
    name: 'Kozhikode Bangalore',
    fromCity: 'Kozhikode',
    toCity: 'Bangalore',
    departTime: '11:00',
    arriveTime: '17:30',
    seatsTotal: 40,
    fare: 580.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Malabar Travels',
      contact: '1-800-MALABAR'
    }
  },
  {
    name: 'Trivandrum Bangalore',
    fromCity: 'Trivandrum',
    toCity: 'Bangalore',
    departTime: '12:00',
    arriveTime: '20:00',
    seatsTotal: 42,
    fare: 750.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Kerala State Transport',
      contact: '1-800-KSRTC'
    }
  },
  {
    name: 'Thrissur Bangalore',
    fromCity: 'Thrissur',
    toCity: 'Bangalore',
    departTime: '13:00',
    arriveTime: '19:00',
    seatsTotal: 38,
    fare: 520.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Thrissur Transit',
      contact: '1-800-THRISHUR'
    }
  },

  // Andhra Pradesh & Telangana routes
  {
    name: 'Hyderabad Express',
    fromCity: 'Bangalore',
    toCity: 'Hyderabad',
    departTime: '06:30',
    arriveTime: '13:00',
    seatsTotal: 45,
    fare: 680.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Telangana State Transport',
      contact: '1-800-TSRTC'
    }
  },
  {
    name: 'Secunderabad Link',
    fromCity: 'Bangalore',
    toCity: 'Secunderabad',
    departTime: '07:00',
    arriveTime: '13:30',
    seatsTotal: 40,
    fare: 680.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Twin City Travels',
      contact: '1-800-TWIN'
    }
  },
  {
    name: 'Vijayawada Express',
    fromCity: 'Bangalore',
    toCity: 'Vijayawada',
    departTime: '08:00',
    arriveTime: '15:00',
    seatsTotal: 42,
    fare: 750.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Andhra Pradesh State Transport',
      contact: '1-800-APSRTC'
    }
  },
  {
    name: 'Visakhapatnam Link',
    fromCity: 'Bangalore',
    toCity: 'Visakhapatnam',
    departTime: '09:00',
    arriveTime: '20:00',
    seatsTotal: 38,
    fare: 950.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Coastal Andhra Travels',
      contact: '1-800-COASTAL'
    }
  },
  {
    name: 'Tirupati Express',
    fromCity: 'Bangalore',
    toCity: 'Tirupati',
    departTime: '10:00',
    arriveTime: '15:30',
    seatsTotal: 40,
    fare: 420.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Temple Travels',
      contact: '1-800-TEMPLE'
    }
  },
  {
    name: 'Hyderabad Bangalore',
    fromCity: 'Hyderabad',
    toCity: 'Bangalore',
    departTime: '11:00',
    arriveTime: '17:30',
    seatsTotal: 45,
    fare: 680.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Telangana State Transport',
      contact: '1-800-TSRTC'
    }
  },
  {
    name: 'Secunderabad Bangalore',
    fromCity: 'Secunderabad',
    toCity: 'Bangalore',
    departTime: '12:00',
    arriveTime: '18:30',
    seatsTotal: 40,
    fare: 680.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Twin City Travels',
      contact: '1-800-TWIN'
    }
  },
  {
    name: 'Vijayawada Bangalore',
    fromCity: 'Vijayawada',
    toCity: 'Bangalore',
    departTime: '13:00',
    arriveTime: '20:00',
    seatsTotal: 42,
    fare: 750.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Andhra Pradesh State Transport',
      contact: '1-800-APSRTC'
    }
  },
  {
    name: 'Visakhapatnam Bangalore',
    fromCity: 'Visakhapatnam',
    toCity: 'Bangalore',
    departTime: '14:00',
    arriveTime: '01:00',
    seatsTotal: 38,
    fare: 950.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Coastal Andhra Travels',
      contact: '1-800-COASTAL'
    }
  },
  {
    name: 'Tirupati Bangalore',
    fromCity: 'Tirupati',
    toCity: 'Bangalore',
    departTime: '15:00',
    arriveTime: '20:30',
    seatsTotal: 40,
    fare: 420.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Temple Travels',
      contact: '1-800-TEMPLE'
    }
  },

  // Inter-city South Indian routes
  {
    name: 'Chennai Coimbatore',
    fromCity: 'Chennai',
    toCity: 'Coimbatore',
    departTime: '16:00',
    arriveTime: '21:00',
    seatsTotal: 40,
    fare: 450.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Tamil Nadu Express',
      contact: '1-800-TNEXP'
    }
  },
  {
    name: 'Bangalore Mysore',
    fromCity: 'Bangalore',
    toCity: 'Mysore',
    departTime: '17:00',
    arriveTime: '19:30',
    seatsTotal: 35,
    fare: 250.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports'],
    operator: {
      name: 'Royal Mysore',
      contact: '1-800-MYSORE'
    }
  },
  {
    name: 'Hyderabad Vijayawada',
    fromCity: 'Hyderabad',
    toCity: 'Vijayawada',
    departTime: '18:00',
    arriveTime: '22:00',
    seatsTotal: 42,
    fare: 350.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Andhra Express',
      contact: '1-800-APEXPRESS'
    }
  },
  {
    name: 'Kochi Trivandrum',
    fromCity: 'Kochi',
    toCity: 'Trivandrum',
    departTime: '19:00',
    arriveTime: '23:00',
    seatsTotal: 38,
    fare: 280.00,
    busType: 'standard',
    amenities: ['ac', 'charging-ports'],
    operator: {
      name: 'Kerala Express',
      contact: '1-800-KERAEXP'
    }
  },
  {
    name: 'Chennai Madurai',
    fromCity: 'Chennai',
    toCity: 'Madurai',
    departTime: '20:00',
    arriveTime: '01:30',
    seatsTotal: 40,
    fare: 380.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports'],
    operator: {
      name: 'Temple City Travels',
      contact: '1-800-TEMPLE'
    }
  },
  {
    name: 'Bangalore Hubli',
    fromCity: 'Bangalore',
    toCity: 'Hubli',
    departTime: '21:00',
    arriveTime: '02:00',
    seatsTotal: 38,
    fare: 450.00,
    busType: 'semi-luxury',
    amenities: ['wifi', 'ac', 'refreshments'],
    operator: {
      name: 'Royal Travels',
      contact: '1-800-ROYAL'
    }
  },
  {
    name: 'Hyderabad Bangalore',
    fromCity: 'Hyderabad',
    toCity: 'Bangalore',
    departTime: '22:00',
    arriveTime: '04:30',
    seatsTotal: 45,
    fare: 680.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Telangana State Transport',
      contact: '1-800-TSRTC'
    }
  },
  {
    name: 'Chennai Bangalore',
    fromCity: 'Chennai',
    toCity: 'Bangalore',
    departTime: '23:00',
    arriveTime: '04:30',
    seatsTotal: 42,
    fare: 550.00,
    busType: 'luxury',
    amenities: ['wifi', 'ac', 'charging-ports', 'entertainment'],
    operator: {
      name: 'Tamil Nadu State Transport',
      contact: '1-800-TNSTC'
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing buses
    await Bus.deleteMany({});
    console.log('Cleared existing buses');

    // Insert sample buses
    const insertedBuses = await Bus.insertMany(sampleBuses);
    console.log(`Inserted ${insertedBuses.length} buses`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
