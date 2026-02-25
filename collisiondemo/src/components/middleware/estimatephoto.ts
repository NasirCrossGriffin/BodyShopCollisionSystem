// estimatePhoto.middleware.ts
// Same style as your previous middleware functions

const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : "";

export type EstimatePhoto = {
  estimateQuery: string;
  url: string;
};

export type EstimatePhotoUpdate = Partial<EstimatePhoto>;

export async function createEstimatePhoto(protoEstimatePhoto: EstimatePhoto) {
  try {
    const response = await fetch(`${BASE_URL}/api/estimatephoto`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoEstimatePhoto),
    });

    if (response.ok) {
      const newEstimatePhoto = await response.json();
      return newEstimatePhoto;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimatePhotos(estimateQueryId?: string) {
  try {
    const url = estimateQueryId
      ? `${BASE_URL}/api/estimatephoto?estimateQuery=${encodeURIComponent(
          estimateQueryId
        )}`
      : `${BASE_URL}/api/estimatephoto`;

    const response = await fetch(url, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const photos = await response.json();
      return photos;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getEstimatePhotoById(photoId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimatephoto/${encodeURIComponent(photoId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const photo = await response.json();
      return photo;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateEstimatePhoto(
  photoId: string,
  updates: EstimatePhotoUpdate
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimatephoto/${encodeURIComponent(photoId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    if (response.ok) {
      const updatedPhoto = await response.json();
      return updatedPhoto;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteEstimatePhoto(photoId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/estimatephoto/${encodeURIComponent(photoId)}`,
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
