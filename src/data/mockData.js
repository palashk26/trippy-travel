/**
 * Mock Data for Trippy AI Travel Planner
 * All images are public Unsplash URLs.
 * Destination: Kerala (Alleppey / Munnar)
 * Origin: Hyderabad
 */

// ─── Cover / Hero Images ────────────────────────────────────────────
export const heroImages = {
  kerala:
    'https://loremflickr.com/800/600/kerala,india',
  alleppey:
    'https://loremflickr.com/800/600/kerala,houseboat',
  munnar:
    'https://loremflickr.com/800/600/kerala,tea,mountain',
  worldMap:
    'https://loremflickr.com/800/600/map,travel',
};

// ─── Outbound Flights (HYD → COK) ──────────────────────────────────
export const outboundFlights = [
  {
    id: 'fl_out_1',
    type: 'outbound',
    brand: 'indigo',
    airline: 'IndiGo',
    airlineLogo: 'https://ui-avatars.com/api/?name=IndiGo&background=00235D&color=fff&rounded=true&bold=true',
    flightNo: '6E-2145',
    from: 'HYD',
    to: 'COK',
    departTime: '06:00',
    arriveTime: '07:35',
    duration: '1h 35m',
    stops: 'Non-stop',
    price: 3200,
    image:
      'https://loremflickr.com/400/300/airplane,indigo',
    aiPick: true,
    aiBadge: 'EARLY START',
    aiReason: 'Arrives early so you get a full Day 1 — matches your relaxed pace.',
  },
  {
    id: 'fl_out_2',
    type: 'outbound',
    brand: 'airindia',
    airline: 'Air India',
    airlineLogo: 'https://ui-avatars.com/api/?name=Air+India&background=ED1C24&color=fff&rounded=true&bold=true',
    flightNo: 'AI-516',
    from: 'HYD',
    to: 'COK',
    departTime: '09:30',
    arriveTime: '11:10',
    duration: '1h 40m',
    stops: 'Non-stop',
    price: 4100,
    image:
      'https://loremflickr.com/400/300/airplane,flight',
    aiPick: true,
    aiBadge: 'BALANCED START',
    aiReason: 'Avoids the 6 AM rush while still arriving before lunch.',
  },
  {
    id: 'fl_out_3',
    type: 'outbound',
    brand: 'spicejet',
    airline: 'SpiceJet',
    airlineLogo: 'https://ui-avatars.com/api/?name=SpiceJet&background=ED1B24&color=fff&rounded=true&bold=true',
    flightNo: 'SG-723',
    from: 'HYD',
    to: 'COK',
    departTime: '14:15',
    arriveTime: '16:45',
    duration: '2h 30m',
    stops: '1 stop (BLR)',
    price: 2800,
    image:
      'https://loremflickr.com/400/300/airplane,spicejet',
    aiPick: true,
    aiBadge: 'BUDGET CHOICE',
    aiReason: 'Best price for this route, despite the short layover.',
  },
];

// ─── Return Flights (COK → HYD) ────────────────────────────────────
export const returnFlights = [
  {
    id: 'fl_ret_1',
    type: 'return',
    brand: 'indigo',
    airline: 'IndiGo',
    airlineLogo: 'https://ui-avatars.com/api/?name=IndiGo&background=00235D&color=fff&rounded=true&bold=true',
    flightNo: '6E-2146',
    from: 'COK',
    to: 'HYD',
    departTime: '19:30',
    arriveTime: '21:05',
    duration: '1h 35m',
    stops: 'Non-stop',
    price: 3400,
    image:
      'https://loremflickr.com/400/300/airplane,sky',
    aiPick: true,
    aiBadge: 'LATE DEPART',
    aiReason: 'Late departure lets you enjoy the full last day in Munnar.',
  },
  {
    id: 'fl_ret_2',
    type: 'return',
    brand: 'vistara',
    airline: 'Vistara',
    airlineLogo: 'https://ui-avatars.com/api/?name=Vistara&background=5A2D81&color=fff&rounded=true&bold=true',
    flightNo: 'UK-874',
    from: 'COK',
    to: 'HYD',
    departTime: '15:00',
    arriveTime: '16:40',
    duration: '1h 40m',
    stops: 'Non-stop',
    price: 4800,
    image:
      'https://loremflickr.com/400/300/airplane,vistara',
    aiPick: true,
    aiBadge: 'PREMIUM CHOICE',
    aiReason: 'Full-service comfort for your return journey home.',
  },
];

// ─── Hotels ─────────────────────────────────────────────────────────
export const hotels = [
  {
    id: 'htl_1',
    name: 'Lake Palace Resort',
    location: 'Alleppey, Kerala',
    rating: 4.5,
    reviews: 1243,
    pricePerNight: 4500,
    nights: 2,
    totalPrice: 9000,
    image: require('../../assets/mock/lake_palace.png'),
    images: [
      require('../../assets/mock/lake_palace.png'),
      'https://loremflickr.com/800/600/resort,room', 
    ],
    amenities: ['Pool', 'Free WiFi', 'Spa', 'Restaurant', 'Lake View', 'Gym'],
    description:
      'Nestled on the banks of Vembanad Lake, this heritage property offers serene backwater views, an infinity pool, and Ayurvedic spa treatments — the perfect base for your Alleppey exploration.',
    aiPick: true,
    aiBadge: 'LAKE VIEW',
    aiReason: 'Top lake-view resort with complimentary houseboat kayaking.',
    area: 'alleppey',
  },
  {
    id: 'htl_2',
    name: 'Coco Lagoon by Great Trails',
    location: 'Alleppey, Kerala',
    rating: 4.2,
    reviews: 876,
    pricePerNight: 3200,
    nights: 2,
    totalPrice: 6400,
    image:
      'https://loremflickr.com/400/300/resort,coconut', 
    images: [
      'https://loremflickr.com/800/600/resort,coconut',
    ],
    amenities: ['Pool', 'Free WiFi', 'Restaurant', 'Garden View'],
    description:
      'A cozy mid-range resort surrounded by coconut groves, offering a peaceful retreat with easy access to Alleppey beach and backwaters.',
    aiPick: true,
    aiBadge: 'NATURE RETREAT',
    aiReason: 'Nestled in coconut groves for a quieter, local experience.',
    area: 'alleppey',
  },
  {
    id: 'htl_3',
    name: 'Spice Tree Munnar',
    location: 'Munnar, Kerala',
    rating: 4.7,
    reviews: 2105,
    pricePerNight: 6200,
    nights: 1,
    totalPrice: 6200,
    image: require('../../assets/mock/spice_tree.png'), 
    images: [
      require('../../assets/mock/spice_tree.png'),
      'https://loremflickr.com/800/600/resort,tea',
    ],
    amenities: [
      'Mountain View',
      'Free WiFi',
      'Fireplace',
      'Restaurant',
      'Tea Garden Tour',
      'Bonfire',
    ],
    description:
      'Perched at 5,200 ft above sea level, Spice Tree offers panoramic views of the Western Ghats, private sit-outs, and curated tea-tasting experiences.',
    aiPick: true,
    aiBadge: 'MOUNTAIN VIEW',
    aiReason: 'Private mountain balconies — perfect for your chill preference.',
    area: 'munnar',
  },
  {
    id: 'htl_4',
    name: 'Blanket Hotel & Spa',
    location: 'Munnar, Kerala',
    rating: 4.3,
    reviews: 654,
    pricePerNight: 4800,
    nights: 1,
    totalPrice: 4800,
    image:
      'https://loremflickr.com/400/300/resort,spa', 
    images: [
      'https://loremflickr.com/800/600/resort,spa',
    ],
    amenities: ['Spa', 'Free WiFi', 'Restaurant', 'Valley View', 'Bar'],
    description:
      'A boutique hotel with minimalist interiors and valley views, known for its award-winning spa and craft cocktails.',
    aiPick: true,
    aiBadge: 'WELLNESS FOCUS',
    aiReason: 'Award-winning spa facilities for a relaxing mountain stay.',
    area: 'munnar',
  },
  {
    id: 'htl_5',
    name: 'The Fog Munnar Resort',
    location: 'Chithirapuram, Munnar',
    rating: 4.6,
    reviews: 1120,
    pricePerNight: 5500,
    nights: 1,
    totalPrice: 5500,
    image: 'https://loremflickr.com/400/300/resort,fog,mountain', 
    images: ['https://loremflickr.com/800/600/resort,fog,mountain'],
    amenities: ['Infinity Pool', 'Nature Walk', 'Club House'],
    description: 'Breathtaking views of the tea plantations and a peaceful atmosphere.',
    aiPick: false,
    area: 'munnar',
  },
  {
    id: 'htl_6',
    name: 'Tea County Munnar',
    location: 'KTDC, Munnar',
    rating: 4.1,
    reviews: 890,
    pricePerNight: 4200,
    nights: 1,
    totalPrice: 4200,
    image: 'https://loremflickr.com/400/300/hotel,munnar', 
    images: ['https://loremflickr.com/800/600/hotel,munnar'],
    amenities: ['Bar', 'Health Club', 'Doctor on call'],
    description: 'A charming property by KTDC, located close to the town center but away from the noise.',
    aiPick: false,
    area: 'munnar',
  },
];

// ─── Transfers / Transit ───────────────────────────────────────────
export const transfers = [
  {
    id: 'tr_1',
    type: 'transit',
    name: 'Private Car to Munnar',
    route: 'Alleppey -> Munnar',
    description: 'Direct flights are unavailable between Alleppey and Munnar. Enjoy a scenic 4.5h drive through the Western Ghats.',
    price: 3200,
    duration: '4h 30m',
    image: 'https://images.unsplash.com/photo-1590301157890-48106202473?w=400&q=80',
    aiPick: true,
    aiBadge: 'TRANSIT OPTION',
    aiReason: 'No flights for this route. Found a top-rated private car transfer.',
    isAlert: true,
    alertTitle: 'No flights found',
  },
  {
    id: 'tr_2',
    type: 'transit',
    name: 'Private Car to Kochi Airport',
    route: 'Munnar -> Kochi',
    description: 'Ending your mountain stay? Your chauffeur will take you back to Kochi (COK) for your departure flight.',
    price: 3500,
    duration: '4h 15m',
    image: 'https://images.unsplash.com/photo-1590301157890-48106202473?w=400&q=80',
    aiPick: true,
    aiBadge: 'TRANSIT OPTION',
    aiReason: 'No flights for this route. Found a top-rated private car transfer.',
    isAlert: true,
    alertTitle: 'No flights found',
  },
  {
    id: 'tr_bus_1',
    type: 'transit',
    name: 'KSRTC AC Bus to Munnar',
    route: 'Alleppey -> Munnar',
    description: 'The state-run AC Super Fast bus is the most economical way to reach Munnar. Enjoy local life and mountain views.',
    price: 550,
    duration: '5h 30m',
    aiPick: true,
    aiBadge: 'BUDGET FRIENDLY',
    aiReason: 'Significant savings compared to a private car.',
  },
  {
    id: 'tr_shared_1',
    type: 'transit',
    name: 'Shared Tourist Cab',
    route: 'Alleppey -> Munnar',
    description: 'A comfortable middle ground. Travel in an AC Innova shared with 3 other travelers.',
    price: 1200,
    duration: '4h 45m',
    aiPick: true,
    aiBadge: 'BEST VALUE',
    aiReason: 'Faster than the bus, cheaper than a private car.',
  },
  {
    id: 'tr_bus_2',
    type: 'transit',
    name: 'KSRTC AC Bus to Kochi',
    route: 'Munnar -> Kochi',
    description: 'Direct downhill bus service to Kochi city and airport. Reliability at a great price.',
    price: 600,
    duration: '5h 0m',
    aiPick: false,
  },
];

// ─── Activities ─────────────────────────────────────────────────────
export const activities = [
  {
    id: 'act_1',
    name: 'Alleppey Backwater Cruise',
    description:
      'Cruise along the tranquil backwaters of Alleppey on a traditional kettuvallam (houseboat). Enjoy coconut-lined canals, village sights, and a freshly cooked Kerala lunch on board.',
    duration: '4 hours',
    price: 1500,
    rating: 4.8,
    reviews: 3241,
    image:
      'https://loremflickr.com/400/300/kerala,houseboat,cruise',
    images: [
      'https://loremflickr.com/800/600/kerala,houseboat,cruise',
      'https://loremflickr.com/800/600/kerala,backwaters',
    ],
    aiPick: true,
    aiBadge: 'UNMISSABLE',
    aiReason: 'Top-rated Alleppey experience. Ideal for scenic backwater views.',
    area: 'alleppey',
  },
  {
    id: 'act_2',
    name: 'Alleppey Beach Sunset',
    description:
      'Relax at Alleppey Beach and watch one of Kerala\'s most stunning sunsets. The beach pier makes for a perfect photo spot.',
    duration: '2 hours',
    price: 0,
    rating: 4.5,
    reviews: 1820,
    image:
      'https://loremflickr.com/400/300/beach,sunset,kerala', 
    images: [
      'https://loremflickr.com/800/600/beach,sunset,kerala',
      'https://loremflickr.com/800/600/beach,sun',
    ],
    aiPick: true,
    aiBadge: 'GOLDEN HOUR',
    aiReason: 'The best spot in Alleppey for a legendary Kerala sunset.',
    area: 'alleppey',
  },
  {
    id: 'act_3',
    name: 'Sunset Shikara Cruise',
    description:
      'A 2-hour private Shikara boat cruise through the narrowest and most scenic canals of Alleppey. Perfect for bird watching and catching the golden hour.',
    duration: '2 hours',
    price: 1500,
    rating: 4.9,
    reviews: 1456,
    image:
      'https://loremflickr.com/400/300/kerala,shikara,boat', 
    images: [
      'https://loremflickr.com/800/600/kerala,shikara,boat',
      'https://loremflickr.com/800/600/backwaters,traditional,boat',
    ],
    aiPick: true,
    aiBadge: 'SIGNATURE CRUISE',
    aiReason: 'Highest-rated boating experience. This will be a premium add-on to your trip.',
    area: 'alleppey',
  },
  {
    id: 'act_4',
    name: 'Village Canoe Tour',
    description:
      'Explore the narrow canals of Kuttanad in a country canoe, visiting toddy shops, coir-making units, and paddy fields up close.',
    duration: '3 hours',
    price: 800,
    rating: 4.6,
    reviews: 987,
    image: require('../../assets/mock/canoe_tour.png'), 
    images: [
      require('../../assets/mock/canoe_tour.png'),
    ],
    aiPick: true,
    aiBadge: 'VILLAGE VIBE',
    aiReason: 'Highly recommended for an authentic Alleppey village experience.',
    area: 'alleppey',
  },
  {
    id: 'act_5',
    name: 'Munnar Tea Plantation Tour',
    description:
      'Walk through the rolling tea estates of Munnar with a local guide. Includes a visit to the Tea Museum and a tea-tasting session.',
    duration: '3 hours',
    price: 600,
    rating: 4.7,
    reviews: 2870,
    image: require('../../assets/mock/munnar_tea.png'), 
    images: [
      require('../../assets/mock/munnar_tea.png'),
      'https://loremflickr.com/800/600/tea,leaves',
    ],
    aiPick: true,
    aiBadge: 'BEST OF MUNNAR',
    aiReason: 'The signature Munnar experience. Budget-friendly and highly rated.',
    area: 'munnar',
  },
  {
    id: 'act_6',
    name: 'Eravikulam National Park Trek',
    description: 'Trek through the grasslands of Eravikulam, home to the endangered Nilgiri Tahr. Stunning mountain views and crisp highland air.',
    duration: '4 hours',
    price: 1200,
    rating: 4.4,
    reviews: 1340,
    image: 'https://loremflickr.com/400/300/trekking,mountain', 
    images: ['https://loremflickr.com/800/600/trekking,mountain'],
    aiPick: true,
    aiBadge: 'WILDLIFE SCAN',
    aiReason: 'Your best chance to spot the endangered Nilgiri Tahr.',
    area: 'munnar',
  },
  {
    id: 'act_7',
    name: 'Kathakali Performance',
    description: 'Witness the traditional classical dance-drama of Kerala with intricate costumes and storytelling.',
    duration: '1.5 hours',
    price: 500,
    rating: 4.9,
    reviews: 890,
    image: 'https://loremflickr.com/400/300/kathakali,dance', 
    images: ['https://loremflickr.com/800/600/kathakali,dance'],
    aiPick: false,
    area: 'alleppey',
  },
  {
    id: 'act_8',
    name: 'Sunrise Kayaking',
    description: 'Paddle through the narrow canals of Alleppey as the sun rises over the backwaters.',
    duration: '3 hours',
    price: 1800,
    rating: 4.8,
    reviews: 450,
    image: 'https://loremflickr.com/400/300/kayak,sunrise', 
    images: ['https://loremflickr.com/800/600/kayak,sunrise'],
    aiPick: false,
    area: 'alleppey',
  },
  {
    id: 'act_9',
    name: 'Tea Museum Visit',
    description: 'Learn about the history and production of tea in Munnar at India\'s first Tea Museum.',
    duration: '1 hour',
    price: 200,
    rating: 4.2,
    reviews: 1200,
    image: 'https://loremflickr.com/400/300/tea,museum', 
    images: ['https://loremflickr.com/800/600/tea,museum'],
    aiPick: false,
    area: 'munnar',
  },
  {
    id: 'act_10',
    name: 'Ayurvedic Massage',
    description: 'Rejuvenate with a traditional Kerala Ayurvedic oil massage at a certified local spa.',
    duration: '2 hours',
    price: 2500,
    rating: 4.7,
    reviews: 670,
    image: 'https://loremflickr.com/400/300/ayurveda,massage', 
    images: ['https://loremflickr.com/800/600/ayurveda,massage'],
    aiPick: false,
    area: 'alleppey',
  },
  {
    id: 'act_11',
    name: 'Mattupetty Dam Boating',
    description: 'Enjoy a speed boat ride or a peaceful pedal boat on the reservoir surrounded by tea hills.',
    duration: '2 hours',
    price: 900,
    rating: 4.5,
    reviews: 2100,
    image: 'https://loremflickr.com/400/300/dam,boating', 
    images: ['https://loremflickr.com/800/600/dam,boating'],
    aiPick: false,
    area: 'munnar',
  },
  {
    id: 'act_12',
    name: 'Kolukkumalai Jeep Safari',
    description: 'Ride to the world\'s highest tea plantation for a spectacular sunrise and panoramic hill views.',
    duration: '5 hours',
    price: 2500,
    rating: 4.9,
    reviews: 530,
    image: 'https://loremflickr.com/400/300/jeep,safari,mountain', 
    images: ['https://loremflickr.com/800/600/jeep,safari,mountain'],
    aiPick: true,
    aiBadge: 'ADVENTURE',
    area: 'munnar',
  },
  {
    id: 'act_13',
    name: 'Tea Tasting Experience',
    description: 'Sample over 10 varieties of premium Kerala tea while learning the nuances of tea production.',
    duration: '1.5 hours',
    price: 450,
    rating: 4.7,
    reviews: 310,
    image: 'https://loremflickr.com/400/300/tea,cup', 
    images: ['https://loremflickr.com/800/600/tea,cup'],
    aiPick: false,
    area: 'munnar',
  },
];

// ─── Trip Template (created after chat) ─────────────────────────────
export const keralaTripTemplate = {
  id: 'trip_kerala_1',
  title: 'Kerala Nature Exploration',
  subtitle: 'Alleppey(2) · Munnar(1)',
  destination: 'Kerala',
  duration: '3D/2N',
  dates: 'Oct 12 – Oct 14',
  travelers: 'Solo',
  origin: 'Hyderabad',
  preference: 'Chill',
  tags: ['Nature', 'Solo', 'Affordable'],
  status: 'planning',
  coverImage:
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  days: [
    {
      id: 'day_1',
      dayNumber: 1,
      title: 'Alleppey Beach',
      sections: [
        {
          type: 'flight',
          label: 'Arrive Flight',
          itemIds: ['fl_out_1', 'fl_out_2', 'fl_out_3'],
          lockKey: 'outboundFlight',
        },
        {
          type: 'hotel',
          label: 'Hotel Check-in',
          itemIds: ['htl_1', 'htl_2'],
          lockKey: 'hotel_alleppey',
        },
        {
          type: 'activity',
          label: 'Things To Do',
          itemIds: ['act_1', 'act_2'],
          lockKey: 'activities_day1',
        },
      ],
    },
    {
      id: 'day_2',
      dayNumber: 2,
      title: 'Alleppey Backwaters',
      sections: [
        {
          type: 'activity',
          label: 'Things To Do',
          itemIds: ['act_4', 'act_3'],
          lockKey: 'activities_day2',
        },
      ],
    },
    {
      id: 'day_3',
      dayNumber: 3,
      title: 'Munnar Mountains',
      sections: [
        {
          type: 'hotel',
          label: 'Hotel Check-out',
          itemIds: ['htl_1', 'htl_2'],
          lockKey: 'hotel_alleppey',
        },
        {
          type: 'transit',
          label: 'Inter-City Transfer',
          itemIds: ['tr_1'],
          lockKey: 'transit_day3',
        },
        {
          type: 'hotel',
          label: 'Hotel Check-in',
          itemIds: ['htl_3', 'htl_4'],
          lockKey: 'hotel_munnar',
        },
        {
          type: 'activity',
          label: 'Things To Do',
          itemIds: ['act_5', 'act_6'],
          lockKey: 'activities_day3',
        },
        {
          type: 'hotel',
          label: 'Hotel Check-out',
          itemIds: ['htl_3', 'htl_4'],
          lockKey: 'hotel_munnar',
        },
        {
          type: 'transit',
          label: 'Inter-City Transfer',
          itemIds: ['tr_2'],
          lockKey: 'transit_day4',
        },
        {
          type: 'flight',
          label: 'Depart Flight',
          itemIds: ['fl_ret_1', 'fl_ret_2'],
          lockKey: 'returnFlight',
        },
      ],
    },
  ],
};

// ─── Lookup helpers ─────────────────────────────────────────────────
const allItems = [
  ...outboundFlights,
  ...returnFlights,
  ...hotels,
  ...activities,
  ...transfers,
];

const itemMap = {};
allItems.forEach((item) => {
  itemMap[item.id] = item;
});

export function getItemById(id) {
  return itemMap[id] || null;
}

/**
 * Calculate base estimated trip cost
 * (cheapest AI-picked items as baseline)
 */
export function getBaseEstimate() {
  const cheapestOutbound = outboundFlights.reduce((min, f) =>
    f.price < min.price ? f : min
  );
  const cheapestReturn = returnFlights.reduce((min, f) =>
    f.price < min.price ? f : min
  );
  const cheapestAlpHotel = hotels
    .filter((h) => h.area === 'alleppey')
    .reduce((min, h) => (h.totalPrice < min.totalPrice ? h : min));
  const cheapestMnrHotel = hotels
    .filter((h) => h.area === 'munnar')
    .reduce((min, h) => (h.totalPrice < min.totalPrice ? h : min));
  const actTotal = activities.reduce((sum, a) => sum + a.price, 0);

  return (
    cheapestOutbound.price +
    cheapestReturn.price +
    cheapestAlpHotel.totalPrice +
    cheapestMnrHotel.totalPrice +
    actTotal +
    (transfers[0]?.price || 0)
  );
}
export function getEstimateRange() {
  const base = getBaseEstimate();
  // Provide a range from 10% below base to 50% above base for a realistic mix
  const min = Math.floor((base * 0.9) / 500) * 500;
  const max = Math.ceil((base * 1.5) / 500) * 500;
  return { min, max };
}
