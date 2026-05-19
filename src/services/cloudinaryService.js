const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const hasCloudinaryConfig = Boolean(cloudName && uploadPreset);

export async function uploadProofImages(files = []) {
  const selectedFiles = Array.from(files).slice(0, 3);
  if (!selectedFiles.length) return [];

  if (!hasCloudinaryConfig) {
    throw new Error("Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.");
  }

  const uploads = selectedFiles.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "moneytracker/proofs");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Cloudinary upload failed.");
    }

    return {
      name: file.name,
      path: data.public_id,
      url: data.secure_url,
      provider: "cloudinary"
    };
  });

  return Promise.all(uploads);
}
