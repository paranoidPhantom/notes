/**
 * Extract YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export const extractYouTubeId = (url: string): string => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\?\/\s]+)/,
        /(?:youtu\.be\/)([^&\?\/\s]+)/,
        /(?:youtube\.com\/embed\/)([^&\?\/\s]+)/,
        /(?:youtube\.com\/v\/)([^&\?\/\s]+)/,
        /youtube\.com\/.*[?&]v=([^&\?\/\s]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            // YouTube video IDs are 11 characters long
            const id = match[1];
            if (id.length === 11) {
                return id;
            }
        }
    }
    return "";
};

/**
 * Extract VK video ID from various URL formats
 * Supports:
 * - https://vk.com/video-OWNER_ID_VIDEO_ID
 * - https://vk.com/video?z=video-OWNER_ID_VIDEO_ID
 * - https://vk.com/videoOWNER_ID_VIDEO_ID
 */
export const extractVkVideoId = (url: string): string[] => {
    const patterns = [
        /vk\.com\/video(-?\d+)_(\d+)/,
        /vk\.com\/.*[?&]z=video(-?\d+)_(\d+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match;
        }
    }

    return [];
};
