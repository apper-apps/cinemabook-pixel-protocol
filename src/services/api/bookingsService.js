import bookingsData from "@/services/mockData/bookings.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingsService = {
  async getAll() {
    await delay(300);
    return [...bookingsData];
  },

  async getById(id) {
    await delay(200);
    const booking = bookingsData.find(b => b.Id === id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return { ...booking };
  },

async create(booking) {
  await delay(500);
  const newBooking = {
    ...booking,
    Id: Math.max(...bookingsData.map(b => b.Id), 0) + 1,
    bookingDate: new Date().toISOString(),
    seats: booking.seats || [],
    totalAmount: booking.totalAmount || 0
  };
  bookingsData.push(newBooking);
  return { ...newBooking };
  },

  async update(id, updates) {
    await delay(300);
    const index = bookingsData.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Booking not found");
    }
    bookingsData[index] = { ...bookingsData[index], ...updates };
    return { ...bookingsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = bookingsData.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Booking not found");
    }
    const deleted = bookingsData.splice(index, 1)[0];
    return { ...deleted };
  }
};