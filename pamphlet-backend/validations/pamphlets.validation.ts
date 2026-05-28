import z from 'zod';

// Bug Fix A: The old transform re-stringified the parsed location object back to a
// JSON string, so insertLocation received a string instead of { city, latitude, longitude }
// and stored undefined for every field. Now we always return the parsed object.
const locationSchema = z
  .union([
    // Sent as JSON string (multipart form body before normalizePamphletMultipartBody,
    // or directly as a string value)
    z
      .string()
      .trim()
      .min(1, 'Location is required')
      .transform((value) => {
        try {
          return JSON.parse(value) as {
            city: string;
            latitude?: number;
            longitude?: number;
          };
        } catch {
          // Plain string city name — wrap it
          return { city: value, latitude: 0, longitude: 0 };
        }
      }),
    // Already an object (after normalizePamphletMultipartBody)
    z.object({
      city: z.string().trim().min(1, 'Location city is required'),
      latitude: z.coerce.number().optional().default(0),
      longitude: z.coerce.number().optional().default(0),
    }),
  ])
  // Normalise both branches into the same shape
  .transform((value) => ({
    city: (value as { city: string }).city,
    latitude: Number((value as { latitude?: number }).latitude ?? 0),
    longitude: Number((value as { longitude?: number }).longitude ?? 0),
  }));

export const pamphletSchema = z.object({
  title: z.string().nonempty('Title is required'),
  short_description: z.string().optional(),
  category: z.string().nonempty('Category is required'),
  location: locationSchema,
  thumbnail_image: z.string().optional(),
  url_key: z.string().nonempty('URL Key is required'),
});
