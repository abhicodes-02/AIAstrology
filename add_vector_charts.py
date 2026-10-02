import os

filepath = 'src/components/KundliPDF.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add react-pdf Svg components to import
content = content.replace("import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';", "import { Document, Page, Text, View, StyleSheet, Image, Svg, Line, Polygon, Rect, G } from '@react-pdf/renderer';")

# Define PdfEastIndianChart component
chart_component = """
const PdfEastIndianChart = ({ title, planets, size = 180 }: any) => {
  const u = size / 3;
  const s = size;

  const signPolygons = [
    { id: 1, name: "Aries", points: `${u},0 ${2*u},0 ${2*u},${u} ${u},${u}`, cx: 1.5*u, cy: 0.5*u },
    { id: 2, name: "Taurus", points: `0,0 ${u},0 ${u},${u}`, cx: 0.67*u, cy: 0.33*u },
    { id: 3, name: "Gemini", points: `0,0 ${u},${u} 0,${u}`, cx: 0.33*u, cy: 0.67*u },
    { id: 4, name: "Cancer", points: `0,${u} ${u},${u} ${u},${2*u} 0,${2*u}`, cx: 0.5*u, cy: 1.5*u },
    { id: 5, name: "Leo", points: `0,${2*u} ${u},${2*u} 0,${3*u}`, cx: 0.33*u, cy: 2.33*u },
    { id: 6, name: "Virgo", points: `0,${3*u} ${u},${2*u} ${u},${3*u}`, cx: 0.67*u, cy: 2.67*u },
    { id: 7, name: "Libra", points: `${u},${2*u} ${2*u},${2*u} ${2*u},${3*u} ${u},${3*u}`, cx: 1.5*u, cy: 2.5*u },
    { id: 8, name: "Scorpio", points: `${2*u},${2*u} ${2*u},${3*u} ${3*u},${3*u}`, cx: 2.33*u, cy: 2.67*u },
    { id: 9, name: "Sagittarius", points: `${2*u},${2*u} ${3*u},${3*u} ${3*u},${2*u}`, cx: 2.67*u, cy: 2.33*u },
    { id: 10, name: "Capricorn", points: `${2*u},${u} ${3*u},${u} ${3*u},${2*u} ${2*u},${2*u}`, cx: 2.5*u, cy: 1.5*u },
    { id: 11, name: "Aquarius", points: `${2*u},${u} ${3*u},${u} ${3*u},0`, cx: 2.67*u, cy: 0.67*u },
    { id: 12, name: "Pisces", points: `${2*u},0 ${3*u},0 ${2*u},${u}`, cx: 2.33*u, cy: 0.33*u }
  ];

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 12, color: '#8B0000', marginBottom: 5, fontWeight: 'bold' }}>{title}</Text>
      <Svg viewBox={`0 0 ${s} ${s}`} width={s} height={s}>
        {/* Draw Polygons for Text Hit Areas */}
        {signPolygons.map((sign, idx) => {
          const signPlanets = planets.filter((p: any) => p.d1SignIndex === sign.id || p.d9SignIndex === sign.id);
          return (
            <G key={idx}>
              <Text x={sign.cx} y={sign.cy - 12} fill="#8B0000" fontSize="9" textAnchor="middle">{signPlanets.map((p:any) => p.shortName).join(" ")}</Text>
              <Text x={sign.cx} y={sign.cy + 12} fill="#D35400" fontSize="7" textAnchor="middle">{sign.id}</Text>
            </G>
          )
        })}
        {/* Draw Grid Lines */}
        <Rect x={0} y={0} width={s} height={s} fill="none" stroke="#8B0000" strokeWidth="1.5" />
        <Line x1={u} y1={0} x2={u} y2={s} stroke="#8B0000" strokeWidth="1" />
        <Line x1={2*u} y1={0} x2={2*u} y2={s} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={u} x2={s} y2={u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={2*u} x2={s} y2={2*u} stroke="#8B0000" strokeWidth="1" />
        
        <Line x1={0} y1={0} x2={u} y2={u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={s} y1={0} x2={2*u} y2={u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={s} x2={u} y2={2*u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={s} y1={s} x2={2*u} y2={2*u} stroke="#8B0000" strokeWidth="1" />
        
        <Text x={1.5*u} y={1.4*u} fill="#D35400" fontSize="16" textAnchor="middle">ॐ</Text>
        <Text x={1.5*u} y={1.6*u} fill="#8B0000" fontSize="8" textAnchor="middle">{title}</Text>
      </Svg>
    </View>
  );
};
"""

content = content.replace("export const KundliPDF = ({ chartData, name, dob, tob, pob, d1Image, d9Image }: any) => {", chart_component + "\nexport const KundliPDF = ({ chartData, name, dob, tob, pob }: any) => {")

# Replace chart rendering block
old_charts_row = """          {/* Charts Section */}
          <View style={styles.chartsRow}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Lagna Chart (D-1)</Text>
              {d1Image ? <Image src={d1Image} style={styles.chartImage} /> : <Text style={{fontSize: 10, textAlign: 'center', marginTop: 80}}>Chart Loading...</Text>}
            </View>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Navamsa Chart (D-9)</Text>
              {d9Image ? <Image src={d9Image} style={styles.chartImage} /> : <Text style={{fontSize: 10, textAlign: 'center', marginTop: 80}}>Chart Loading...</Text>}
            </View>
          </View>"""

new_charts_row = """          {/* Vector SVG Charts Section */}
          <View style={styles.chartsRow}>
            <View style={{ width: '48%', alignItems: 'center' }}>
              <PdfEastIndianChart title="Lagna Chart (D-1)" planets={chartData.planetsData.map((p:any) => ({...p, d9SignIndex: null}))} size={200} />
            </View>
            <View style={{ width: '48%', alignItems: 'center' }}>
              <PdfEastIndianChart title="Navamsa Chart (D-9)" planets={chartData.planetsData.map((p:any) => ({...p, d1SignIndex: null}))} size={200} />
            </View>
          </View>"""

content = content.replace(old_charts_row, new_charts_row)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated KundliPDF to use native vector SVG charts")
