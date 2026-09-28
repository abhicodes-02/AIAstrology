async function test() {
  const res = await fetch("https://nominatim.openstreetmap.org/search?q=Shyamnagar,Bhatpara,WB,India&format=json&limit=1&addressdetails=1", { headers: { "User-Agent": "AIAstrology/1.0" } });
  const data = await res.json();
  console.log(data);
}
test();
