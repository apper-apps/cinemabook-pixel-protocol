import theatersData from "@/services/mockData/theaters.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate seat layout for a theater
const generateTheaterSeats = (theaterId) => {
  const theater = theatersData.find(t => t.Id === theaterId);
  if (!theater || !theater.seatLayout) return [];

  const seats = [];
  const { rows, seatsPerRow, categories } = theater.seatLayout;

  rows.forEach(rowLetter => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      // Determine category based on row and position
      let category = "Silver"; // default
      
      // Premium seats (first 2 rows, center seats)
      if (["A", "B"].includes(rowLetter) && seatNum >= 4 && seatNum <= seatsPerRow - 3) {
        category = "Premium";
      }
      // Gold seats (rows C-F, center area)
      else if (["C", "D", "E", "F"].includes(rowLetter) && seatNum >= 3 && seatNum <= seatsPerRow - 2) {
        category = "Gold";
      }

      // Randomly book some seats (about 30%)
      const isBooked = Math.random() < 0.3;

      seats.push({
        Id: `${theaterId}-${rowLetter}-${seatNum}`,
        theaterId,
        row: rowLetter,
        number: seatNum,
        category,
        isBooked,
        isAvailable: !isBooked
      });
    }
  });

  return seats;
};

export const seatService = {
  async getSeatsForTheater(theaterId) {
    await delay(300);
    return generateTheaterSeats(theaterId);
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