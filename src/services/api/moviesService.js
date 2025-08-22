import moviesData from "@/services/mockData/movies.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const moviesService = {
  async getAll() {
    await delay(300);
    return [...moviesData];
  },

  async getById(id) {
    await delay(200);
    const movie = moviesData.find(m => m.Id === id);
    if (!movie) {
      throw new Error("Movie not found");
    }
    return { ...movie };
  },

  async create(movie) {
    await delay(400);
    const newMovie = {
      ...movie,
      Id: Math.max(...moviesData.map(m => m.Id), 0) + 1
    };
    moviesData.push(newMovie);
    return { ...newMovie };
  },

  async update(id, updates) {
    await delay(300);
    const index = moviesData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Movie not found");
    }
    moviesData[index] = { ...moviesData[index], ...updates };
    return { ...moviesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = moviesData.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Movie not found");
    }
    const deleted = moviesData.splice(index, 1)[0];
    return { ...deleted };
  }
};