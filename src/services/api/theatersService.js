import theatersData from "@/services/mockData/theaters.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const theatersService = {
  async getAll() {
    await delay(250);
    return [...theatersData];
  },

  async getById(id) {
    await delay(200);
    const theater = theatersData.find(t => t.Id === id);
    if (!theater) {
      throw new Error("Theater not found");
    }
    return { ...theater };
  },

  async getByMovieId(movieId) {
    await delay(300);
    // For demo purposes, return all theaters with enhanced showtime data including pricing
    const enhancedTheaters = theatersData.map(theater => ({
      ...theater,
      showtimes: theater.showtimes.map(time => {
        const hour = parseInt(time.split(':')[0]);
        const isPM = time.includes('PM');
        const actualHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
        
        // Different pricing based on time of day and theater amenities
        let basePrice = 12;
        if (actualHour >= 18) basePrice = 16; // Evening shows
        else if (actualHour >= 12) basePrice = 14; // Afternoon shows
        
        // Premium for amenities
        if (theater.amenities.includes('IMAX')) basePrice += 5;
        if (theater.amenities.includes('4DX')) basePrice += 8;
        if (theater.amenities.includes('Dolby Atmos')) basePrice += 2;
        
        return {
          time,
          price: basePrice,
          availableSeats: Math.floor(Math.random() * 80) + 20
        };
      })
    }));
    
    return enhancedTheaters;
  },

  async create(theater) {
    await delay(400);
    const newTheater = {
      ...theater,
      Id: Math.max(...theatersData.map(t => t.Id), 0) + 1
    };
    theatersData.push(newTheater);
    return { ...newTheater };
  },

  async update(id, updates) {
    await delay(300);
    const index = theatersData.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Theater not found");
    }
    theatersData[index] = { ...theatersData[index], ...updates };
    return { ...theatersData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = theatersData.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Theater not found");
    }
    const deleted = theatersData.splice(index, 1)[0];
    return { ...deleted };
  }
};