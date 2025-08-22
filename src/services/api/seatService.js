import theatersData from "@/services/mockData/theaters.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate seat layout for a theater
const generateTheaterSeats = (theaterId) => {
  const theater = theatersData.find(t => t.Id === theaterId);
  if (!theater || !theater.seatLayout) {
    console.warn(`Theater ${theaterId} not found or missing seat layout`);
    return [];
  }

  const seats = [];
  const { rows, seatsPerRow, categories } = theater.seatLayout;

  rows.forEach((rowLetter, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      // Determine category based on row and position with more sophisticated logic
      let category = "Silver"; // default
      
      const centerStart = Math.ceil(seatsPerRow * 0.25);
      const centerEnd = Math.ceil(seatsPerRow * 0.75);
      const isCenter = seatNum >= centerStart && seatNum <= centerEnd;
      const frontRows = rowIndex < 2;
      const middleRows = rowIndex >= 2 && rowIndex < rows.length * 0.6;
      
      // Premium seats (first 2 rows, center seats)
      if (frontRows && isCenter) {
        category = "Premium";
      }
      // Gold seats (middle rows, center area)
      else if (middleRows && isCenter) {
        category = "Gold";
      }
      // Some random gold seats in good positions
      else if (!frontRows && isCenter && Math.random() < 0.3) {
        category = "Gold";
      }

      // More realistic booking pattern (25% booked with clusters)
      let isBooked = false;
      const bookingProbability = 0.25;
      
      // Create some booking clusters for realism
      if (Math.random() < bookingProbability) {
        isBooked = true;
        // Sometimes book adjacent seats
        if (Math.random() < 0.4 && seatNum < seatsPerRow) {
          // This will be handled in the next iteration
        }
      }

      // Occasionally mark some seats as unavailable (maintenance, etc.)
      const isUnavailable = Math.random() < 0.05; // 5% unavailable

      seats.push({
        Id: `${theaterId}-${rowLetter}-${seatNum}`,
        theaterId: parseInt(theaterId),
        row: rowLetter,
        number: seatNum,
        category,
        isBooked,
        isAvailable: !isBooked && !isUnavailable
      });
    }
  });

  return seats;
};

export const seatService = {
  async getSeatsForTheater(theaterId) {
    try {
      await delay(500); // Realistic loading time
      const seats = generateTheaterSeats(theaterId);
      
      if (!seats || seats.length === 0) {
        throw new Error(`No seats available for theater ${theaterId}`);
      }
      
      return seats;
    } catch (error) {
      console.error("Error generating theater seats:", error);
      throw new Error(`Failed to load seats for theater ${theaterId}: ${error.message}`);
    }
  },

  async updateSeatStatus(theaterId, seatId, isBooked) {
    await delay(200);
    // In a real app, this would update the seat status in the database
    return { success: true };
  },

  async bookSeats(theaterId, seatIds) {
    await delay(500);
    // In a real app, this would mark seats as booked
    return { success: true, bookedSeats: seatIds };
  }
};