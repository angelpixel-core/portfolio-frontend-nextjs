import { fetchData } from '@/lib/apiService';

const all = async () => {
  return await fetchData('features');
};

async function fetchBy({ enabled }) {
  try {
    const items = await all();
    return items.filter((i) => i.enabled === enabled);
  } catch (error) {
    // fetchData already logs errors, but you might want specific handling here
    console.error("Error in Feature.fetchBy:", error.message);
    return [];
  }
}

export const Feature = {
  fetchBy,
};
