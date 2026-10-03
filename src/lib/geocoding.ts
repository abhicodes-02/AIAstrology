export async function getCoordinates(placeName: string) {
    const apiKey = process.env.MAPBOX_API_KEY;
    
    if (apiKey && apiKey !== "your_mapbox_api_key_here") {
        try {
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json?access_token=${apiKey}&autocomplete=true&types=place,locality,neighborhood,address`);
            const data = await res.json();
            if (data.features && data.features.length > 0) {
                return data.features.map((f: any) => ({
                    display_name: f.place_name,
                    lat: f.center[1].toString(),
                    lon: f.center[0].toString(),
                    country_code: f.context?.find((c: any) => c.id.startsWith('country'))?.short_code?.toLowerCase() || "in"
                }));
            }
        } catch (err) {
            console.error("Mapbox Geocoding failed, falling back to Nominatim", err);
        }
    }

    // Fallback to Nominatim
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=5&addressdetails=1`, {
            headers: { "User-Agent": "AIAstrology/2.0" }
        });
        const data = await res.json();
        return data.map((r: any) => ({
            display_name: r.display_name,
            lat: r.lat,
            lon: r.lon,
            country_code: r.address?.country_code || "in"
        }));
    } catch (err) {
        console.error("Nominatim Geocoding failed:", err);
        return [];
    }
}
