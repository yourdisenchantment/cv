// Resolves the CV photo path (about.photo, e.g. "/images/my-face.jpg") to
// the asset module in src/assets/ so astro:assets can optimize it (resize,
// webp, hashed URL under base). The JSON keeps a plain string path - the
// glob maps it to the imported image at build time.
import type { ImageMetadata } from "astro";

const photos = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/images/*",
    { eager: true },
);

/**
 * Returns the image metadata for a CV photo path.
 *
 * Args:
 *   path: photo path from the CV JSON, e.g. "/images/my-face.jpg".
 *
 * Returns:
 *   ImageMetadata of the matching asset under src/assets.
 *
 * Raises:
 *   Error: when the path does not match any file in src/assets/images.
 */
export function photoMeta(path: string): ImageMetadata {
    const mod = photos[`../assets${path}`];
    if (!mod) {
        throw new Error(`Photo not found in src/assets: ${path}`);
    }
    return mod.default;
}
