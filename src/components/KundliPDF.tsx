import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Line, Polygon, Rect, G } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 15,
    backgroundColor: '#FFFCF5', // Traditional light cream/yellowish tint
    fontFamily: 'Times-Roman',
  },

  watermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    opacity: 0.05,
    fontSize: 300,
    color: '#D35400',
    zIndex: -1,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1px solid #F5C6A5',
    paddingTop: 5,
  },
  footerText: {
    fontSize: 8,
    color: '#8B0000',
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#D35400",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableHeader: {
    backgroundColor: '#FFF0D4',
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#D35400",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 4,
    fontSize: 9,
    textAlign: "center"
  },
  tableHeaderCell: {
    margin: 4,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    color: '#8B0000'
  },
  pageBorder: {
    border: '2px solid #8B0000', // Deep red/maroon traditional border
    padding: 20,
    flex: 1,
  },
  headerCenter: {
    alignItems: 'center',
    marginBottom: 15,
    borderBottom: '1px solid #8B0000',
    paddingBottom: 15,
  },
  omText: {
    fontSize: 22,
    color: '#D35400',
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 24,
    color: '#8B0000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  infoCol: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    width: '35%',
    fontSize: 10,
    color: '#8B0000',
    fontWeight: 'bold',
  },
  infoValue: {
    width: '65%',
    fontSize: 10,
    color: '#333333',
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  chartContainer: {
    width: '48%',
    border: '1px solid #D35400',
    padding: 5,
    backgroundColor: '#FFFFFF',
  },
  chartTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#8B0000',
    marginBottom: 5,
    fontWeight: 'bold',
    backgroundColor: '#FFF0D4',
    paddingVertical: 3,
  },
  chartImage: {
    width: '100%',
    height: 180,
    objectFit: 'contain',
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8B0000',
    borderBottom: '1px solid #8B0000',
    paddingBottom: 2,
    marginBottom: 6,
    fontWeight: 'bold',
    backgroundColor: '#FFF0D4',
    paddingLeft: 5,
    paddingTop: 3,
    textTransform: 'uppercase',
  },
  paragraph: {
    fontSize: 11,
    color: '#2C2C2C',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  doshaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  doshaBadgeYes: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    padding: '4px 8px',
    marginRight: 8,
    marginBottom: 4,
    fontSize: 9,
    border: '1px solid #F87171',
  },
  doshaBadgeNo: {
    backgroundColor: '#ECFCCB',
    color: '#3F6212',
    padding: '4px 8px',
    marginRight: 8,
    marginBottom: 4,
    fontSize: 9,
    border: '1px solid #BEF264',
  }
});


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
              <Text x={sign.cx} y={sign.cy - 12} fill="#8B0000" style={{ fontSize: 9 }} textAnchor="middle">{signPlanets.map((p:any) => p.shortName).join(" ")}</Text>
              <Text x={sign.cx} y={sign.cy + 12} fill="#D35400" style={{ fontSize: 7 }} textAnchor="middle">{sign.id}</Text>
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
        
        <Text x={1.5*u} y={1.4*u} fill="#D35400" style={{ fontSize: 16 }} textAnchor="middle">ॐ</Text>
        <Text x={1.5*u} y={1.6*u} fill="#8B0000" style={{ fontSize: 8 }} textAnchor="middle">{title}</Text>
      </Svg>
    </View>
  );
};

export const KundliPDF = ({ chartData, name, dob, tob, pob }: any) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>ॐ</Text>
        <View style={styles.pageBorder}>
          
          {/* Header Section */}
          <View style={styles.headerCenter}>
            <Text style={styles.omText}>ॐ</Text>
            <Text style={styles.mainTitle}>Janma Kundali</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Name:</Text><Text style={styles.infoValue}>{name}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Date of Birth:</Text><Text style={styles.infoValue}>{dob}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Time of Birth:</Text><Text style={styles.infoValue}>{tob}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Place of Birth:</Text><Text style={styles.infoValue}>{pob}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Ayanamsa:</Text><Text style={styles.infoValue}>{chartData.ayanamsaVal}</Text></View>
              </View>
              
              <View style={styles.infoCol}>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Ascendant:</Text><Text style={styles.infoValue}>{chartData.ascendant} (D-9: {chartData.ascendantNavamsa?.split(' ')[0]})</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Moon Sign:</Text><Text style={styles.infoValue}>{chartData.moonSign} (D-9: {chartData.moonNavamsa?.split(' ')[0]})</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Sun Sign:</Text><Text style={styles.infoValue}>{chartData.sunSign} (D-9: {chartData.sunNavamsa?.split(' ')[0]})</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Nakshatra:</Text><Text style={styles.infoValue}>{chartData.nakshatra} {chartData.nakshatraPada ? `(Pada ${chartData.nakshatraPada})` : ""}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Panchang:</Text><Text style={styles.infoValue}>{chartData.tithi} | {chartData.yoga} | {chartData.karana}</Text></View>
              </View>
            </View>

              {chartData.gana && (
                <View style={{...styles.infoGrid, marginTop: 15, borderTop: '1px solid #F5C6A5', paddingTop: 10}}>
                  <View style={styles.infoCol}>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Gana:</Text><Text style={styles.infoValue}>{chartData.gana}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Varna:</Text><Text style={styles.infoValue}>{chartData.varna}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Yoni:</Text><Text style={styles.infoValue}>{chartData.yoni}</Text></View>
                  </View>
                  <View style={styles.infoCol}>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Nadi:</Text><Text style={styles.infoValue}>{chartData.nadi}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Tatva:</Text><Text style={styles.infoValue}>{chartData.tatva}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Paya:</Text><Text style={styles.infoValue}>{chartData.paya}</Text></View>
                  </View>
                </View>
              )}
          </View>

          {/* Vector SVG Charts Section */}
          <View style={styles.chartsRow}>
            <View style={{ width: '48%', alignItems: 'center' }}>
              <PdfEastIndianChart title="Lagna Chart (D-1)" planets={chartData.planetsData.map((p:any) => ({...p, d9SignIndex: null}))} size={200} />
            </View>
            <View style={{ width: '48%', alignItems: 'center' }}>
              <PdfEastIndianChart title="Navamsa Chart (D-9)" planets={chartData.planetsData.map((p:any) => ({...p, d1SignIndex: null}))} size={200} />
            </View>
          </View>

          {/* Dosha Analysis (Newly Added) */}
          {chartData.doshas && chartData.doshas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dosha Analysis</Text>
              <View style={styles.doshaRow}>
                {chartData.doshas.map((dosha: any, idx: number) => (
                  <Text key={idx} style={dosha.present ? styles.doshaBadgeYes : styles.doshaBadgeNo}>
                    {dosha.name}: {dosha.present ? "Present" : "Not Present"}
                  </Text>
                ))}
              </View>
            </View>
          )}

          
          {/* Planetary Degrees Table */}
          {chartData.planetsData && (
            <View style={styles.section} break>
              <Text style={styles.sectionTitle}>Planetary Positions</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={styles.tableCol}><Text style={styles.tableHeaderCell}>Planet</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableHeaderCell}>Sign</Text></View>
                  <View style={styles.tableCol}><Text style={styles.tableHeaderCell}>Degree</Text></View>
                  <View style={{...styles.tableCol, borderRightWidth: 0}}><Text style={styles.tableHeaderCell}>Retrograde</Text></View>
                </View>
                {chartData.planetsData.filter((p: any) => !["Uranus", "Neptune", "Pluto", "Chiron", "Sirius"].includes(p.name)).map((p: any, i: number) => (
                  <View style={styles.tableRow} key={i}>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{p.name === 'North Node' ? 'Rahu' : p.name === 'South Node' ? 'Ketu' : p.name}</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{p.signName || 'N/A'}</Text></View>
                    <View style={styles.tableCol}><Text style={styles.tableCell}>{p.degreeStr || 'N/A'}</Text></View>
                    <View style={{...styles.tableCol, borderRightWidth: 0}}><Text style={styles.tableCell}>{p.isRetrograde ? "Yes" : "No"}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* AI Readings Section */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Core Soul Urge</Text>
            <Text style={styles.paragraph}>{chartData.reading}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career & Power</Text>
            <Text style={styles.paragraph}>{chartData.career}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wealth & Finance</Text>
            <Text style={styles.paragraph}>{chartData.wealth || "No wealth data available."}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Love & Destiny</Text>
            <Text style={styles.paragraph}>{chartData.relationships}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health & Vitality</Text>
            <Text style={styles.paragraph}>{chartData.health || "No health data available."}</Text>
          </View>
          
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Ultimate Life Path</Text>
            <Text style={styles.paragraph}>{chartData.fullLife || "Full life overview is not available."}</Text>
          </View>

        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by AI Astrology Premium</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (`Page ${pageNumber} of ${totalPages}`)} />
        </View>
      </Page>
    </Document>
  );
};