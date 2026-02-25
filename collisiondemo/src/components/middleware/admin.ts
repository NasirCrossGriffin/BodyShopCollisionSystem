// admin.middleware.ts
// Middleware method for POST /api/admin/autheticate (spelled as in your route)

const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : "";

export type AdminAuthRequest = {
  username: string;
  password: string;
  autobody: string; // bodyShop id (or whatever you're passing)
};

export type AdminAuthResponse = {
  _id: string;
  username: string;
  bodyshop: string;
};

export async function authenticateAdmin(
  creds: AdminAuthRequest
): Promise<AdminAuthResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/autheticate`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(creds),
      credentials: "include", // important if you're using sessions/cookies
    });

    if (response.ok) {
      const admin = await response.json();
      return admin;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const check : any = async (bodyShopId : string) => {
    const response = await fetch(`${BASE_URL}/api/admin/check`, {
            method: 'POST',
            body : JSON.stringify({bodyShopId : bodyShopId}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: 'include',
    });

    if (response.ok) {
        console.log("Verification successful")
        return await response.json();
    } else {
        console.log(await response.status);
        throw new Error("Verification failed");
    }
}