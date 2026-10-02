import { fetchAIKpKundliData } from "@/app/actions/generateKpKundli";

export async function GET(req: Request) {
  try {
    const data = await fetchAIKpKundliData("Test", "2000-01-01", "12:00", "Kolkata");
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
