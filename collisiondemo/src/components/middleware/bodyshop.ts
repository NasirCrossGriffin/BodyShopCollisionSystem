// bodyShop.middleware.ts
// Same style as your previous middleware example

const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : "";

export type BodyShop = {
  name: string;
  logo?: string;
};

export type BodyShopUpdate = Partial<BodyShop>;

export async function createBodyShop(protoBodyShop: BodyShop) {
  try {
    const response = await fetch(`${BASE_URL}/api/bodyshop`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoBodyShop),
    });

    if (response.ok) {
      const newBodyShop = await response.json();
      return newBodyShop;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getBodyShops() {
  try {
    const response = await fetch(`${BASE_URL}/api/bodyshop`, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const bodyShops = await response.json();
      return bodyShops;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getBodyShopById(bodyShopId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/bodyshop/${encodeURIComponent(bodyShopId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const bodyShop = await response.json();
      return bodyShop;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateBodyShop(
  bodyShopId: string,
  updates: BodyShopUpdate
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/bodyshop/${encodeURIComponent(bodyShopId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    if (response.ok) {
      const updatedBodyShop = await response.json();
      return updatedBodyShop;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteBodyShop(bodyShopId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/bodyshop/${encodeURIComponent(bodyShopId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "DELETE",
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result; // { deleted: true, id: ... }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getBodyShopByName(name: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/bodyshop/name/${encodeURIComponent(name)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const bodyShop = await response.json();
      return bodyShop;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

