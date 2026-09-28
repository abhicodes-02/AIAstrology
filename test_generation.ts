import { fetchAIKpKundliData } from './src/app/actions/generateKpKundli.ts';

async function test() {
  console.log("Generating KP chart...");
  const data = await fetchAIKpKundliData("S", "1998-11-30", "00:03", "Shyamnagar,Bhatpara,WB,India");
  console.log(data.reading ? "AI Reading SUCCESS" : "AI Reading FAILED");
  if (!data.reading) {
     console.log(data);
  }
}
test();
