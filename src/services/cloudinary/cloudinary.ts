export const uploadToCloudinary = async (file: File) => {
    const cloudName = "dw7zmklhz";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload_preset");
    formData.append("folder", "team-member");

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            {
                method: "POST",
                body: formData,
            }
        );
        const result = await response.json();
        if (!response.ok) {
            console.error("Cloudinary error details:", result);
            throw new Error(`Cloudinary upload failed: ${result.error?.message || response.statusText}`);
        }
        console.log("Cloudinary Response:", result);
        return result.secure_url || result.url;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};