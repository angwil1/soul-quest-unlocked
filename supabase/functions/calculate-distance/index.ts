import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Basic zip code to coordinates mapping (sample data - in production you'd use a proper geocoding service)
const zipCodeCoordinates: Record<string, { lat: number, lon: number }> = {
  // Major US cities for demo
  '10001': { lat: 40.7505, lon: -73.9934 }, // NYC
  '10002': { lat: 40.7209, lon: -73.9896 }, // NYC Lower East Side
  '10003': { lat: 40.7310, lon: -73.9896 }, // NYC East Village
  '10004': { lat: 40.7042, lon: -74.0142 }, // NYC Financial District
  '10010': { lat: 40.7391, lon: -73.9826 }, // NYC Flatiron
  '11201': { lat: 40.6926, lon: -73.9901 }, // Brooklyn Heights
  '11375': { lat: 40.7256, lon: -73.8486 }, // Forest Hills, Queens
  '10451': { lat: 40.8207, lon: -73.9250 }, // South Bronx
  '10301': { lat: 40.6323, lon: -74.1651 }, // St. George, Staten Island
  '06712': { lat: 41.5623, lon: -73.2106 }, // Prospect, CT (user's zip code)
  '90210': { lat: 34.0901, lon: -118.4065 }, // Beverly Hills
  '60601': { lat: 41.8781, lon: -87.6298 }, // Chicago
  '33101': { lat: 25.7617, lon: -80.1918 }, // Miami
  '94102': { lat: 37.7749, lon: -122.4194 }, // San Francisco
  '75201': { lat: 32.7767, lon: -96.7970 }, // Dallas
  '98101': { lat: 47.6062, lon: -122.3321 }, // Seattle
  '02101': { lat: 42.3601, lon: -71.0589 }, // Boston
  '20001': { lat: 38.9072, lon: -77.0369 }, // Washington DC
  '30301': { lat: 33.7490, lon: -84.3880 }, // Atlanta
};

// Geocoding service fallback (using a free API)
async function getCoordinatesFromAPI(zipCode: string): Promise<{ lat: number, lon: number } | null> {
  try {
    // Using a free geocoding service (in production, use Google Maps API, MapBox, etc.)
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      lat: parseFloat(data.places[0].latitude),
      lon: parseFloat(data.places[0].longitude)
    };
  } catch (error) {
    console.error('Geocoding API error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { zipCode1, zipCode2 } = await req.json()

    if (!zipCode1 || !zipCode2) {
      return new Response(
        JSON.stringify({ error: 'Both zip codes are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Clean zip codes (remove any extra characters)
    const cleanZip1 = zipCode1.replace(/[^0-9]/g, '').substring(0, 5);
    const cleanZip2 = zipCode2.replace(/[^0-9]/g, '').substring(0, 5);

    // Get coordinates for both zip codes
    let coords1 = zipCodeCoordinates[cleanZip1];
    let coords2 = zipCodeCoordinates[cleanZip2];

    // If not in our database, try the API
    if (!coords1) {
      coords1 = await getCoordinatesFromAPI(cleanZip1);
    }
    if (!coords2) {
      coords2 = await getCoordinatesFromAPI(cleanZip2);
    }

    if (!coords1 || !coords2) {
      return new Response(
        JSON.stringify({ 
          error: 'Could not find coordinates for one or both zip codes',
          zipCode1: cleanZip1,
          zipCode2: cleanZip2,
          coords1Found: !!coords1,
          coords2Found: !!coords2
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Calculate distance
    const distance = calculateDistance(coords1.lat, coords1.lon, coords2.lat, coords2.lon);

    return new Response(
      JSON.stringify({ 
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        zipCode1: cleanZip1,
        zipCode2: cleanZip2,
        coordinates: {
          zipCode1: coords1,
          zipCode2: coords2
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error calculating distance:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})