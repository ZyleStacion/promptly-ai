export const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get full image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL (http/https) or a blob URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // If it starts with /uploads/, prepend the API URL
  if (imagePath.startsWith('/uploads/')) {
    return `${API_URL}${imagePath}`;
  }
  
  // Otherwise, assume it needs /uploads/ prefix
  return `${API_URL}/uploads/${imagePath}`;
}