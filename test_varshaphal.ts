import { fetchAIVarshaphalData } from './src/app/actions/generateVarshaphal';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
  console.log("Testing fetchAIVarshaphalData for 2027...");
  try {
    const data = await fetchAIVarshaphalData("Test User", "2000-01-01", "12:00", "New York", 2027);
    console.log("Varshaphal generated successfully!");
    console.log(data.varshaphal.substring(0, 100) + "...");
    console.log(`Months generated: ${data.monthlyPredictions?.length || 0}`);
    if (data.monthlyPredictions && data.monthlyPredictions.length > 0) {
      console.log("First month:", data.monthlyPredictions[0].month);
    }
  } catch (err) {
    console.error("Test failed!", err);
  }
}

runTest();
