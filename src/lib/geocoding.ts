export async function getCoordinates(placeName: string) {
    const apiKey = process.env.MAPBOX_API_KEY;
    
    if (!apiKey || apiKey === "your_mapbox_api_key_here") {
        console.error("Mapbox API key is missing. Please set MAPBOX_API_KEY in .env.local");
        return [];
    }

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
        return [];
    } catch (err) {
        console.error("Mapbox Geocoding failed:", err);
        return [];
    }
}
