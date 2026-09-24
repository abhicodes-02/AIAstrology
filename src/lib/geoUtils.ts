/**
 * Calculates the accurate standard UTC timezone offset (in hours)
 * for astronomical calculations.
 */
export async function getAccurateTimezone(
  lat: number,
  lon: number,
  countryCode?: string,
  pobString?: string
): Promise<number> {
  const code = countryCode?.toLowerCase() || "";
  const pobLower = (pobString || "").toLowerCase();

  // 1. Direct Indian Subcontinent Recognition
  if (
    code === "in" ||
    pobLower.includes("india") ||
    pobLower.includes("west bengal") ||
    pobLower.includes("kolkata") ||
    pobLower.includes("delhi") ||
    pobLower.includes("mumbai") ||
    pobLower.includes("bangalore") ||
    pobLower.includes("chennai") ||
    pobLower.includes("hyderabad") ||
    pobLower.includes("shyamnagar") ||
    pobLower.includes("bhatpara") ||
    pobLower.includes("barrackpur")
  ) {
    return 5.5; // Indian Standard Time (IST) is UTC +5:30
  }

  if (code === "bd" || pobLower.includes("bangladesh") || pobLower.includes("dhaka")) {
    return 6.0;
  }

  if (code === "np" || pobLower.includes("nepal") || pobLower.includes("kathmandu")) {
    return 5.75; // Nepal Time is UTC +5:45
  }

  if (code === "lk" || pobLower.includes("sri lanka") || pobLower.includes("colombo")) {
    return 5.5;
  }

  if (code === "pk" || pobLower.includes("pakistan") || pobLower.includes("karachi")) {
    return 5.0;
  }

  // Geographic Bounding Box for India if coordinates are provided
  if (lat >= 8.0 && lat <= 36.0 && lon >= 68.5 && lon <= 97.25) {
    // Check if not Bangladesh
    if (!(lat >= 20.5 && lat <= 26.6 && lon >= 88.0 && lon <= 92.7)) {
      // Check if not Nepal
      if (!(lat >= 26.3 && lat <= 30.5 && lon >= 80.0 && lon <= 88.2)) {
        return 5.5;
      }
    }
  }

  // 2. Global lookup via TimeAPI with quick timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.standardUtcOffset?.seconds === "number") {
        return data.standardUtcOffset.seconds / 3600;
      }
    }
  } catch {
    // Fallback on timeout or network error
  }

  // 3. Fallback: Nearest half-hour division from longitude
  return Math.round((lon / 15) * 2) / 2;
}
