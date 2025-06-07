import { fetchData } from '@/lib/apiService';

async function getAllSocials() {
  return await fetchData('socials');
}

export const Social = {
  all: async () => {
    try {
      const items = await getAllSocials();
      return items.filter((i) => i.enabled);
    } catch (error) {
      // fetchData already logs errors
      console.error("Error in Social.all:", error.message);
      return [];
    }
  }
};
