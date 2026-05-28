import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import db from './db/index.js';
import {
  categories,
  pamphletContacts,
  pamphletImages,
  pamphlets,
  pamphletsLocations,
  users,
} from './db/schema.js';

const seed = async (): Promise<void> => {
  // Clear all tables in dependency order
  await db.delete(pamphletContacts);
  await db.delete(pamphletImages);
  await db.delete(pamphlets);
  await db.delete(pamphletsLocations);
  await db.delete(categories);
  await db.delete(users);

  // ─── Users ────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  await db.insert(users).values([
    {
      name: 'Admin User',
      email: 'admin@pamphlet.test',
      password: hashedPassword,
    },
    {
      name: 'Jane Creator',
      email: 'jane@pamphlet.test',
      password: hashedPassword,
    },
    {
      name: 'Ram Sharma',
      email: 'ram@pamphlet.test',
      password: hashedPassword,
    },
  ]);

  // ─── Categories ───────────────────────────────────────────────────────────
  await db.insert(categories).values([
    { name: 'Business / Promotion', slug: 'business-promotion' },
    { name: 'Education', slug: 'education' },
    { name: 'Events', slug: 'events' },
    { name: 'Food', slug: 'food' },
    { name: 'Health', slug: 'health' },
    { name: 'Travel', slug: 'travel' },
  ]);

  // ─── Locations ────────────────────────────────────────────────────────────
  await db.insert(pamphletsLocations).values([
    { city: 'Kathmandu', latitude: 27.7172, longitude: 85.324 },
    { city: 'Pokhara', latitude: 28.2096, longitude: 83.9856 },
    { city: 'Lalitpur', latitude: 27.6644, longitude: 85.3188 },
    { city: 'Bhaktapur', latitude: 27.671, longitude: 85.4298 },
    { city: 'Butwal', latitude: 27.7006, longitude: 83.4532 },
    { city: 'Biratnagar', latitude: 26.4525, longitude: 87.2718 },
    { city: 'Chitwan', latitude: 27.5291, longitude: 84.3542 },
  ]);

  // ─── Resolve IDs ──────────────────────────────────────────────────────────
  const [adminUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, 'admin@pamphlet.test'));
  const [janeUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, 'jane@pamphlet.test'));
  const [ramUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, 'ram@pamphlet.test'));

  const [kathmandu] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Kathmandu'));
  const [pokhara] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Pokhara'));
  const [lalitpur] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Lalitpur'));
  const [bhaktapur] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Bhaktapur'));
  const [butwal] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Butwal'));
  const [biratnagar] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Biratnagar'));
  const [chitwan] = await db
    .select({ id: pamphletsLocations.id })
    .from(pamphletsLocations)
    .where(eq(pamphletsLocations.city, 'Chitwan'));

  const kId = kathmandu?.id ?? null;
  const pkId = pokhara?.id ?? null;
  const lId = lalitpur?.id ?? null;
  const bkId = bhaktapur?.id ?? null;
  const btId = butwal?.id ?? null;
  const bnId = biratnagar?.id ?? null;
  const ctId = chitwan?.id ?? null;

  const uAdmin = adminUser?.id ?? null;
  const uJane = janeUser?.id ?? null;
  const uRam = ramUser?.id ?? null;

  // ─── Pamphlets (6 categories × 5 each = 30) ───────────────────────────────
  await db.insert(pamphlets).values([
    // ── Business / Promotion ───────────────────────────────────────────────
    {
      title: 'Sunrise Digital Marketing Agency',
      short_description:
        'Full-service digital marketing — SEO, social media, and paid ads for Nepali businesses.',
      content:
        '<p>We help local businesses grow online with data-driven strategies. Services include Google Ads, Facebook marketing, SEO audits, and monthly analytics reports. Free consultation available.</p>',
      thumbnail_image:
        'https://images.jdmagicbox.com/v2/comp/chandigarh/t4/0172px172.x172.231212174538.n9t4/catalogue/sunrise-technologies-chandigarh-sector-41-chandigarh-digital-marketing-services-wohzw2xcsf.jpg',
      category: 'Business / Promotion',
      location_id: kId,
      user_id: uAdmin,
      url_key: 'sunrise-digital-marketing-agency',
    },
    {
      title: 'Himalayan Print Solutions',
      short_description:
        'High-quality business cards, banners, brochures, and packaging — printed and delivered fast.',
      content:
        '<p>Same-day printing available for urgent orders. Bulk discounts on orders over 500 units. Custom sizes and finishes including matte, gloss, and UV coating. Visit our Lalitpur studio.</p>',
      thumbnail_image:
        'https://www.himalayansolution.com/uploads/slideshows/2024/07/11/largeSlideshow-largeSlideshow-Delivery%20(1).png',
      category: 'Business / Promotion',
      location_id: lId,
      user_id: uJane,
      url_key: 'himalayan-print-solutions',
    },
    {
      title: 'BizBoost Consulting',
      short_description:
        'Business strategy, brand identity, and market entry consulting for startups and SMEs.',
      content:
        '<p>Our consultants have 10+ years of experience helping businesses launch and scale in Nepal. Packages include market research, go-to-market planning, and brand development. First session free.</p>',
      thumbnail_image:
        'https://s3.amazonaws.com/thumbnails.venngage.com/template/14a1b8c6-10f6-43b0-b737-b80fb60a125d.png',
      category: 'Business / Promotion',
      location_id: pkId,
      user_id: uRam,
      url_key: 'bizboost-consulting',
    },
    {
      title: 'ShopLocal Nepal Campaign',
      short_description:
        'Join the movement to support Nepali small businesses — get listed and reach 50,000+ customers.',
      content:
        '<p>Register your small business for free on our directory platform. Gain visibility through our weekly newsletter, social media shoutouts, and featured pamphlet slots. Open to all categories.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOCqi1c_XF6ESZvC9hke6pHmkef9VFQFnpqA&s',
      category: 'Business / Promotion',
      location_id: bkId,
      user_id: uAdmin,
      url_key: 'shoplocal-nepal-campaign',
    },
    {
      title: 'Promo Nepal — Influencer Marketing',
      short_description:
        'Connect your brand with 200+ Nepali content creators across Instagram, YouTube, and TikTok.',
      content:
        '<p>We manage end-to-end influencer campaigns: creator matching, brief creation, content approval, and performance tracking. Packages start at NPR 15,000. Contact us for a free strategy call.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsfl7VFWdJTuFaZo9IcaJjXLdER23b3NPGog&s',
      category: 'Business / Promotion',
      location_id: kId,
      user_id: uJane,
      url_key: 'promo-nepal-influencer-marketing',
    },

    // ── Education ──────────────────────────────────────────────────────────
    {
      title: 'Code Nepal Academy',
      short_description:
        'Learn web development, Python, and data science with live online and in-person classes.',
      content:
        '<p>Beginner to advanced courses taught by industry professionals. Flexible schedules — morning, evening, and weekend batches. Job placement support included. Enrol now for the next batch starting the 1st of next month.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTpVdY_x9T1oIFS2f7llKvEAR4gQd0LXJptw&s',
      category: 'Education',
      location_id: kId,
      user_id: uAdmin,
      url_key: 'code-nepal-academy',
    },
    {
      title: 'Bright Minds Tuition Centre',
      short_description:
        'Grade 8–12 tuition for Science, Mathematics, and English in Lalitpur.',
      content:
        '<p>Small class sizes (max 12 students) ensure individual attention. Regular mock tests, notes provided, and parent progress reports every month. Morning and evening batches available.</p>',
      thumbnail_image:
        'https://content.jdmagicbox.com/comp/meerut/t6/9999px121.x121.230222115959.b7t6/catalogue/bright-minds-tuition-hub-sushant-city-meerut-home-tutors-mr4mytkpwe.jpg',
      category: 'Education',
      location_id: lId,
      user_id: uJane,
      url_key: 'bright-minds-tuition-centre',
    },
    {
      title: 'Pokhara Language School',
      short_description:
        'English, Mandarin, and Japanese language courses for all levels — in-person and online.',
      content:
        '<p>Certified teachers with international experience. Group and private lessons. Conversational courses, exam preparation (IELTS, JLPT), and business English available. Trial class: NPR 500.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5AtqwbZ_3DPrNG61ujVLAIYqtosLc-r5ybw&s',
      category: 'Education',
      location_id: pkId,
      user_id: uRam,
      url_key: 'pokhara-language-school',
    },
    {
      title: 'EduSkill Vocational Training',
      short_description:
        'Government-certified vocational courses in electrical work, plumbing, and tailoring.',
      content:
        '<p>3-month and 6-month certificate programmes with hands-on workshops. Scholarships available for students from low-income households. Placement assistance after course completion.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9yDSvU7fEr9ZKR5UlAmsgsPLQT6EuR3uEkA&s',
      category: 'Education',
      location_id: btId,
      user_id: uAdmin,
      url_key: 'eduskill-vocational-training',
    },
    {
      title: 'Future Leaders Scholarship Programme',
      short_description:
        'Annual scholarship for undergraduate students pursuing STEM fields at Nepali universities.',
      content:
        '<p>Up to NPR 1,20,000 per year awarded to 20 students based on merit and financial need. Application open January–March. Required documents: transcripts, income proof, and a personal essay.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSarWwB5fR-XLs0Gq_6NUVVBumJZOXBHsnFuw&s',
      category: 'Education',
      location_id: bnId,
      user_id: uJane,
      url_key: 'future-leaders-scholarship-programme',
    },

    // ── Events ─────────────────────────────────────────────────────────────
    {
      title: 'Kathmandu International Film Festival',
      short_description:
        'A 5-day showcase of Nepali and international independent films with Q&A sessions.',
      content:
        '<p>Screenings held at Kumari Cinema and QFX Labim Mall. Passes: NPR 1,500 (all-access) or NPR 300 per film. Filmmaker discussions and workshops on Day 3 and Day 4. Free for students with valid ID.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOpE2kqTKDe1Ie7qevboFWjK1rd2tISKwBQ&s',
      category: 'Events',
      location_id: kId,
      user_id: uAdmin,
      url_key: 'kathmandu-international-film-festival',
    },
    {
      title: 'Pokhara Trail Running Race',
      short_description:
        'Annual 21 km trail run through Pokhara hills — open to all fitness levels.',
      content:
        '<p>Categories: 5 km fun run, 10 km challenge, and 21 km half-mountain. Registration fee: NPR 800–1,500. Medal and certificate for all finishers. Breakfast and hydration stations included. Register online before spots fill.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBRuFz35e0ldzvDqOW5RNOf-Buf7fBosm8cA&s',
      category: 'Events',
      location_id: pkId,
      user_id: uJane,
      url_key: 'pokhara-trail-running-race',
    },
    {
      title: 'Newari Cultural Night',
      short_description:
        'A celebration of Newari heritage — traditional music, dance, and cuisine in Bhaktapur.',
      content:
        '<p>Hosted at Bhaktapur Durbar Square every full moon evening. Features Dhime and Naumati Baja performances, Lakhe dance, and a traditional Newari dinner. Entry: NPR 400 including dinner.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHfydsz9cO6El9PGgcYlBD9d7JIdoeQDtSAQ&s',
      category: 'Events',
      location_id: bkId,
      user_id: uRam,
      url_key: 'newari-cultural-night',
    },
    {
      title: 'Startup Nepal Summit',
      short_description:
        "Nepal's biggest startup conference — 2 days of talks, pitches, and networking.",
      content:
        '<p>50+ speakers from tech, impact, and investor communities. Startup pitch competition with NPR 5,00,000 in prizes. Exhibition zone for early-stage companies. Tickets: NPR 1,000 (standard) / NPR 500 (students).</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR14QIy33Mz9_Q1QaHkRG1ss3aj12V1uvPbLA&s',
      category: 'Events',
      location_id: kId,
      user_id: uAdmin,
      url_key: 'startup-nepal-summit',
    },
    {
      title: 'Chitwan Nature Festival',
      short_description:
        'Three-day eco-tourism festival with jungle walks, bird watching, and conservation talks.',
      content:
        '<p>Organised in partnership with Chitwan National Park. Activities: elephant safari, canoe rides, tharu cultural show, and wildlife photography workshop. Packages start at NPR 3,500 per person including accommodation.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1wbZLMYS55CFclk5dAAUGTRu-h4Nd8GgKA&s',
      category: 'Events',
      location_id: ctId,
      user_id: uJane,
      url_key: 'chitwan-nature-festival',
    },

    // ── Food ───────────────────────────────────────────────────────────────
    {
      title: 'Momo House Kathmandu',
      short_description:
        "Kathmandu's most-loved momo restaurant — 15 varieties, dine-in and takeaway.",
      content:
        '<p>From classic buff and veg momos to pan-fried and jhol momo, we have them all. Party orders and corporate catering available. Open daily 10 AM – 9 PM. Free delivery within 3 km on orders above NPR 500.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA1OddeULpb7s9fB3G0wzVdGpkl3MCAzQGnw&s',
      category: 'Food',
      location_id: kId,
      user_id: uRam,
      url_key: 'momo-house-kathmandu',
    },
    {
      title: 'The Lakeside Kitchen',
      short_description:
        'Continental and Nepali fusion dining with a view of Phewa Lake — Pokhara.',
      content:
        '<p>Romantic waterfront setting ideal for dinner dates and family meals. Specialties: wood-fired pizza, Nepali tapas, and fresh fish platters. Happy hour 4–6 PM daily. Reservations recommended on weekends.</p>',
      thumbnail_image:
        'https://static.wixstatic.com/media/a3b990_3993be2ff26d47c9b189c70f1cf63220~mv2.png',
      category: 'Food',
      location_id: pkId,
      user_id: uAdmin,
      url_key: 'the-lakeside-kitchen',
    },
    {
      title: 'Organic Farmers Market',
      short_description:
        'Fresh organic produce, honey, dairy, and homemade pickles — every Sunday in Lalitpur.',
      content:
        '<p>Over 30 local farmers and producers every week at Patan Dhoka. No pesticides, no middlemen. Seasonal vegetables, free-range eggs, artisan cheeses, and herbal teas. 7 AM – 1 PM. Bring your own bag!</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx3mRb_tQyPwLE5bbDk86gi-szPOymGVAl5w&s',
      category: 'Food',
      location_id: lId,
      user_id: uJane,
      url_key: 'organic-farmers-market',
    },
    {
      title: 'Bhaktapur Juju Dhau Dairy',
      short_description:
        'Authentic Bhaktapur king yogurt — made fresh daily using the original clay pot method.',
      content:
        "<p>Juju Dhau (King Curd) is Bhaktapur's century-old specialty. Available in original, saffron, and cardamom flavours. Buy direct from the dairy or order for events and weddings. Minimum order: 10 pots for delivery.</p>",
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUh6rGdr9IE6RS_aH7kxQK-9wRHdI21PxtPQ&s',
      category: 'Food',
      location_id: bkId,
      user_id: uRam,
      url_key: 'bhaktapur-juju-dhau-dairy',
    },
    {
      title: 'Spice Route — Indian & Nepali Tiffin',
      short_description:
        'Healthy home-style tiffin delivery for offices and students in Biratnagar.',
      content:
        '<p>Fresh dal, sabji, rice, roti, and a sweet — delivered to your desk by 12:30 PM. Weekly and monthly tiffin subscriptions available. Veg, non-veg, and diabetic-friendly meal plans. Order before 9 AM.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQWitGKsX1JyZsNBli62UAzWgu8naFwr6G0g&s',
      category: 'Food',
      location_id: bnId,
      user_id: uAdmin,
      url_key: 'spice-route-tiffin',
    },

    // ── Health ─────────────────────────────────────────────────────────────
    {
      title: 'NepalCare Dental Clinic',
      short_description:
        'Affordable dental care — check-ups, fillings, braces, and implants in Kathmandu.',
      content:
        '<p>Modern clinic with painless treatment techniques. Consultation fee: NPR 500 (waived if treatment is booked). Services: scaling, whitening, root canal, invisalign braces. Appointment required — walk-ins welcome for emergencies.</p>',
      thumbnail_image:
        'https://i.pinimg.com/736x/67/3e/c8/673ec83bf899f6269930218f871493cf.jpg',
      category: 'Health',
      location_id: kId,
      user_id: uJane,
      url_key: 'nepalcare-dental-clinic',
    },
    {
      title: 'Sunrise Fitness Studio',
      short_description:
        'Modern gym with personal training, Zumba, yoga, and nutrition counselling — Lalitpur.',
      content:
        '<p>State-of-the-art equipment, certified trainers, and a supportive community. Monthly membership: NPR 2,500. Trial week: NPR 500. Separate male and female workout zones. Steam room and locker facilities included.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1QjBzt8bsB8Pe7ccszeDMjLKlq-3Ulfl4-Q&s',
      category: 'Health',
      location_id: lId,
      user_id: uRam,
      url_key: 'sunrise-fitness-studio',
    },
    {
      title: 'MindWell Counselling Centre',
      short_description:
        'Professional mental health counselling — individual, couples, and family therapy in Pokhara.',
      content:
        '<p>Confidential sessions with licensed psychologists. In-person and online appointments available. Sliding-scale fees for those who need it. Topics: anxiety, depression, grief, relationships, and stress management. Book your first session today.</p>',
      thumbnail_image:
        'https://static.wixstatic.com/media/337046_ff8ec14c728047598031f11bdb507238~mv2.png/v1/fit/w_2500,h_1330,al_c/337046_ff8ec14c728047598031f11bdb507238~mv2.png',
      category: 'Health',
      location_id: pkId,
      user_id: uAdmin,
      url_key: 'mindwell-counselling-centre',
    },
    {
      title: 'Free Eye Check-Up Camp',
      short_description:
        'Free vision testing, spectacle prescription, and cataract screening for all ages — Butwal.',
      content:
        '<p>Organised by Nepal Eye Hospital in collaboration with local health posts. Subsidised glasses available for eligible patients. Camp runs every first Saturday of the month, 9 AM – 3 PM. No appointment needed.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq9s7qKNvoYRXG8PhOaOCptfkaoSCxUUaLuQ&s',
      category: 'Health',
      location_id: btId,
      user_id: uJane,
      url_key: 'free-eye-check-up-camp',
    },
    {
      title: 'Herbal Nepal Pharmacy',
      short_description:
        'Certified Ayurvedic and herbal medicines sourced directly from Himalayan producers.',
      content:
        '<p>Over 200 herbal products including churna, ark, and oil formulations. In-store consultation with a registered Ayurvedic practitioner every day from 10 AM – 5 PM. Online orders delivered within 3–5 days nationwide.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyIZS_xLWAY5QO-yFDkZ-gcvBV9TbcrMQzcw&s',
      category: 'Health',
      location_id: bkId,
      user_id: uRam,
      url_key: 'herbal-nepal-pharmacy',
    },

    // ── Travel ─────────────────────────────────────────────────────────────
    {
      title: 'Annapurna Base Camp Trek Package',
      short_description:
        '12-day guided ABC trek with accommodation, meals, permits, and experienced guides.',
      content:
        '<p>All-inclusive package departing from Pokhara. Altitude-acclimatised guides, teahouse stays, all meals, ACAP permits, and Annapurna Conservation Area entry included. Group size: 4–12. Price: NPR 45,000 per person.</p>',
      thumbnail_image:
        'https://media.holidaytoursnepal.com/uploads/fullbanner/annapurna-base-camp-trekking.webp',
      category: 'Travel',
      location_id: pkId,
      user_id: uAdmin,
      url_key: 'annapurna-base-camp-trek-package',
    },
    {
      title: 'Kathmandu Valley Heritage Tour',
      short_description:
        'One-day guided tour of 7 UNESCO World Heritage Sites across Kathmandu Valley.',
      content:
        '<p>Includes Pashupatinath, Boudhanath, Swayambhunath, Patan Durbar Square, Bhaktapur Durbar Square, Changu Narayan, and Dakshinkali. AC vehicle, guide, and lunch included. Price: NPR 3,500 per person. Min group: 2.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJL8f39aHbNljVurj7z-DCXK3E-GFyiTUAmQ&s',
      category: 'Travel',
      location_id: kId,
      user_id: uJane,
      url_key: 'kathmandu-valley-heritage-tour',
    },
    {
      title: 'Chitwan Jungle Safari Package',
      short_description:
        '2-night, 3-day wildlife safari in Chitwan National Park — all inclusive.',
      content:
        '<p>Activities: jeep safari, canoe ride, elephant bathing, tharu cultural show, and nature walk. Package includes transport from Kathmandu, accommodation (standard/deluxe), and all meals. Price from NPR 8,500 per person.</p>',
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKkGMULzkLOViOmOE5BIuID_-wWJLGhRBGnQ&s',
      category: 'Travel',
      location_id: ctId,
      user_id: uRam,
      url_key: 'chitwan-jungle-safari-package',
    },
    {
      title: 'Rara Lake Expedition',
      short_description:
        "Fly-in, fly-out 5-day tour to Nepal's largest and most remote lake — Rara, Mugu.",
      content:
        '<p>Twin-sharing tented camp with all meals, Kathmandu–Talcha–Kathmandu flights, and a guide. Trek through rhododendron forests to the pristine Rara Lake at 2,990 m. Limited departures — book at least 6 weeks in advance. Price: NPR 75,000.</p>',
      thumbnail_image:
        'https://cdn-gofap.nitrocdn.com/XAIAoodhjAyClNyfDbAwTgpupZFvYmCA/assets/images/optimized/rev-77b9497/trexmount.com/wp-content/uploads/2026/01/rara-lake-of-nepal.webp',
      category: 'Travel',
      location_id: kId,
      user_id: uAdmin,
      url_key: 'rara-lake-expedition',
    },
    {
      title: 'Biratnagar Weekend Getaway',
      short_description:
        'Explore the plains — Biratnagar, Dharan, and Ilam tea gardens in 3 days.',
      content:
        "<p>Visit the bustling Biratnagar market, hike to Budha Subba Temple in Dharan, and stroll through Ilam's rolling tea gardens. Package includes private vehicle, guesthouse stays, and a local guide. NPR 6,000 per person (min 2 people).</p>",
      thumbnail_image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKSCSCFgsDmYQI03fTjqStHFbllyyekX_qow&s',
      category: 'Travel',
      location_id: bnId,
      user_id: uJane,
      url_key: 'biratnagar-weekend-getaway',
    },
  ]);

  // ─── Resolve pamphlet IDs for contacts ────────────────────────────────────
  const seededPamphlets = await db
    .select({ id: pamphlets.id, url_key: pamphlets.url_key })
    .from(pamphlets);
  const byKey = new Map(seededPamphlets.map((p) => [p.url_key, p.id]));

  // ─── Contacts (one per pamphlet) ──────────────────────────────────────────
  await db.insert(pamphletContacts).values([
    // Business / Promotion
    {
      pamphlet_id: byKey.get('sunrise-digital-marketing-agency'),
      phone: '+977-9800000001',
      email: 'sunrise@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('himalayan-print-solutions'),
      phone: '+977-9800000002',
      email: 'print@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('bizboost-consulting'),
      phone: '+977-9800000003',
      email: 'bizboost@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('shoplocal-nepal-campaign'),
      phone: '+977-9800000004',
      email: 'shoplocal@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('promo-nepal-influencer-marketing'),
      phone: '+977-9800000005',
      email: 'promo@pamphlet.test',
    },

    // Education
    {
      pamphlet_id: byKey.get('code-nepal-academy'),
      phone: '+977-9800000006',
      email: 'code@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('bright-minds-tuition-centre'),
      phone: '+977-9800000007',
      email: 'tuition@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('pokhara-language-school'),
      phone: '+977-9800000008',
      email: 'language@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('eduskill-vocational-training'),
      phone: '+977-9800000009',
      email: 'eduskill@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('future-leaders-scholarship-programme'),
      phone: '+977-9800000010',
      email: 'scholarship@pamphlet.test',
    },

    // Events
    {
      pamphlet_id: byKey.get('kathmandu-international-film-festival'),
      phone: '+977-9800000011',
      email: 'filmfest@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('pokhara-trail-running-race'),
      phone: '+977-9800000012',
      email: 'trailrun@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('newari-cultural-night'),
      phone: '+977-9800000013',
      email: 'newari@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('startup-nepal-summit'),
      phone: '+977-9800000014',
      email: 'startup@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('chitwan-nature-festival'),
      phone: '+977-9800000015',
      email: 'naturefest@pamphlet.test',
    },

    // Food
    {
      pamphlet_id: byKey.get('momo-house-kathmandu'),
      phone: '+977-9800000016',
      email: 'momo@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('the-lakeside-kitchen'),
      phone: '+977-9800000017',
      email: 'lakeside@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('organic-farmers-market'),
      phone: '+977-9800000018',
      email: 'organic@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('bhaktapur-juju-dhau-dairy'),
      phone: '+977-9800000019',
      email: 'jujudhau@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('spice-route-tiffin'),
      phone: '+977-9800000020',
      email: 'tiffin@pamphlet.test',
    },

    // Health
    {
      pamphlet_id: byKey.get('nepalcare-dental-clinic'),
      phone: '+977-9800000021',
      email: 'dental@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('sunrise-fitness-studio'),
      phone: '+977-9800000022',
      email: 'fitness@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('mindwell-counselling-centre'),
      phone: '+977-9800000023',
      email: 'mindwell@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('free-eye-check-up-camp'),
      phone: '+977-9800000024',
      email: 'eyecamp@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('herbal-nepal-pharmacy'),
      phone: '+977-9800000025',
      email: 'herbal@pamphlet.test',
    },

    // Travel
    {
      pamphlet_id: byKey.get('annapurna-base-camp-trek-package'),
      phone: '+977-9800000026',
      email: 'abc@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('kathmandu-valley-heritage-tour'),
      phone: '+977-9800000027',
      email: 'heritage@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('chitwan-jungle-safari-package'),
      phone: '+977-9800000028',
      email: 'safari@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('rara-lake-expedition'),
      phone: '+977-9800000029',
      email: 'rara@pamphlet.test',
    },
    {
      pamphlet_id: byKey.get('biratnagar-weekend-getaway'),
      phone: '+977-9800000030',
      email: 'biratnagar@pamphlet.test',
    },
  ]);
};

seed()
  .then(() => {
    console.log(
      '✓ Seed complete — 3 users, 6 categories, 7 locations, 30 pamphlets, 30 contacts.',
    );
    process.exit(0);
  })
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`✗ Seed failed: ${message}`);
    process.exit(1);
  });
