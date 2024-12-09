export const getToken = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/token`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error fetching token on the server:", error);
      throw error;
    }
  };
  