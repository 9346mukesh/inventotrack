export const uploadImagesToCloudinary = async (files) => {
  const urls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");

    urls.push(data.secure_url);
  }

  return urls;
};