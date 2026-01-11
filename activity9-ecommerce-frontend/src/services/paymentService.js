const API_BASE_URL = "http://localhost:3000";

export const createPaymentLink = async ({ amount, description, successUrl, failedUrl }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, description, successUrl, failedUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create payment link");
    }

    return await response.json();
  } catch (error) {
    console.error("Create payment link error:", error);
    throw error;
  }
};
