// Product photos are catalog shots of a model roughly centered in frame,
// head-to-waist. For grid/listing thumbnails we don't want a model's face
// on display — only the garment. Rather than re-shooting or hand-cropping
// every photo, we lean on Cloudinary's URL-based transformations (these
// images are all hosted there) to crop it server-side on the fly:
//   1) cut the top ~55% of the frame (head + face) away entirely
//   2) re-fit what's left to a clean 4:5 portrait crop centered on the torso
// This is a heuristic percentage, tuned against the current catalog's
// "posed, chest-up" photo style — not real face detection, so a very
// different framing style could need the percentage revisited.
const LISTING_CROP = 'c_crop,g_north,x_0,y_0.55,w_1.0,h_0.45/c_fill,ar_4:5,g_center';

export function listingImage(url) {
    if (!url || typeof url !== 'string' || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/${LISTING_CROP}/`);
}
