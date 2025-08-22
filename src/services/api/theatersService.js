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