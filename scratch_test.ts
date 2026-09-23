import { fetchAIKundliData } from "./src/app/actions/generateKundli";
import { config } from "dotenv";

config({ path: ".env.local" });

async function run() {
  try {
    const res = await fetchAIKundliData("Abhi", "2002-01-09", "09:30", "Kolkata");
    console.log("Success! Reading:", res.reading.substring(0, 50));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
