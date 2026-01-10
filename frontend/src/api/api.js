export const API_URL = import.meta.env.VITE_API_URL || 'http://13.216.200.51.nip.io:5000';

// Helper function to get full image URL
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL (http/https) or a blob URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // For MongoDB stored images (profilePicture with data & mimeType)
  // Don't prepend URL - use as-is since it's now stored in MongoDB
  // The image will be served via /chat/picture/:chatbotId endpoint
  if (imagePath === '/uploads/' || imagePath?.includes('/uploads/')) {
    // Legacy support for old /uploads/ path (if migrating from filesystem)
    return `${API_URL}${imagePath}`;
  }
  
  // Otherwise return as-is
  return imagePath;
}