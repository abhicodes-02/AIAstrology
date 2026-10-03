export async function getCoordinates(placeName: string) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (apiKey && apiKey !== "your_google_maps_api_key_here") {
        try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                return data.results.map((r: any) => ({
                    display_name: r.formatted_address,
                    lat: r.geometry.location.lat.toString(),
                    lon: r.geometry.location.lng.toString(),
                    country_code: r.address_components.find((c: any) => c.types.includes("country"))?.short_name.toLowerCase() || "in"
                }));
            }
        } catch (err) {
            console.error("Google Geocoding failed, falling back to Nominatim", err);
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
