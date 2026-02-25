// estimateQuery.middleware.ts
// Same style as your previous middleware examples

const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : "";

export type EstimateQuery = {
  bodyShop: string;
  user: string;
  vehicleYear?: number;
  make: string;
  model: string;
  insurerName?: string;
  policyNumber?: string;
  damageDescription: string;
  appointmentDateTime : string;
  status?: "new" | "reviewing" | "quoted" | "closed";
};

export type EstimateQueryUpdate = Partial<EstimateQuery>;

export async function createEstimateQuery(protoEstimateQuery: EstimateQuery) {
  try {
    const response = await fetch(`${BASE_URL}/api/estimatequery`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoEstimateQuery),
    });

    if (response.ok) {
      const newEstimateQuery = await response.json();
      return newEstimateQuery;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimateQueries(
  filters?: { bodyShop?: string; user?: string; status?: string }
) {
  try {
    const params = new URLSearchParams();
    if (filters?.bodyShop) params.append("bodyShop", filters.bodyShop);
    if (filters?.user) params.append("user", filters.user);
    if (filters?.status) params.append("status", filters.status);

    const url = `${BASE_URL}/api/estimatequery${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const estimateQueries = await response.json();
      return estimateQueries;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimateQueriesByBodyshop(bodyShop : string) {
  try {
    const response = await fetch(`${BASE_URL}/api/estimatequery/${bodyShop}`, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const estimateQueries = await response.json();
      return estimateQueries;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimateQueryById(estimateQueryId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimatequery/${encodeURIComponent(estimateQueryId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const estimateQuery = await response.json();
      return estimateQuery;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateEstimateQuery(
  estimateQueryId: string,
  updates: EstimateQueryUpdate
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimatequery/${encodeURIComponent(estimateQueryId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    if (response.ok) {
      const updatedEstimateQuery = await response.json();
      return updatedEstimateQuery;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteEstimateQuery(estimateQueryId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimatequery/${encodeURIComponent(estimateQueryId)}`,
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
