import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Line, Rect, G } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 15, backgroundColor: '#FFFCF5', fontFamily: 'Times-Roman' },
  pageBorder: { border: '2px solid #8B0000', padding: 20, flex: 1 },
  headerCenter: { alignItems: 'center', marginBottom: 15, borderBottom: '1px solid #8B0000', paddingBottom: 15 },
  omText: { fontSize: 22, color: '#D35400', marginBottom: 5 },
  mainTitle: { fontSize: 24, color: '#8B0000', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 5 },
  infoCol: { width: '48%' },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  infoLabel: { width: '35%', fontSize: 10, color: '#8B0000', fontWeight: 'bold' },
  infoValue: { width: '65%', fontSize: 10, color: '#333333' },
  chartsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 15, marginBottom: 15 },
  section: { marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 14, color: '#8B0000', borderBottom: '1px solid #8B0000', paddingBottom: 2, marginBottom: 6, fontWeight: 'bold', backgroundColor: '#FFF0D4', paddingLeft: 5, paddingTop: 3, textTransform: 'uppercase' },
  paragraph: { fontSize: 11, color: '#2C2C2C', lineHeight: 1.5, textAlign: 'justify' },
  watermark: { position: 'absolute', top: '30%', left: '25%', opacity: 0.05, fontSize: 300, color: '#D35400', zIndex: -1 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #F5C6A5', paddingTop: 5 },
  footerText: { fontSize: 8, color: '#8B0000' },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderColor: "#D35400", borderWidth: 1, marginTop: 10, marginBottom: 10 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableHeader: { backgroundColor: '#FFF0D4' },
  tableCol: { borderStyle: "solid", borderColor: "#D35400", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 4, fontSize: 9, textAlign: "center" },
  tableHeaderCell: { margin: 4, fontSize: 9, fontWeight: "bold", textAlign: "center", color: '#8B0000' }
});

const PdfEastIndianChart = ({ title, planets, cusps, size = 180 }: any) => {
  const u = size / 3;
  const s = size;

  const signPolygons = [
    { id: 1, cx: 1.5*u, cy: 0.5*u }, { id: 2, cx: 0.67*u, cy: 0.33*u }, { id: 3, cx: 0.33*u, cy: 0.67*u },
    { id: 4, cx: 0.5*u, cy: 1.5*u }, { id: 5, cx: 0.33*u, cy: 2.33*u }, { id: 6, cx: 0.67*u, cy: 2.67*u },
    { id: 7, cx: 1.5*u, cy: 2.5*u }, { id: 8, cx: 2.33*u, cy: 2.67*u }, { id: 9, cx: 2.67*u, cy: 2.33*u },
    { id: 10, cx: 2.5*u, cy: 1.5*u }, { id: 11, cx: 2.67*u, cy: 0.67*u }, { id: 12, cx: 2.33*u, cy: 0.33*u }
  ];

  const romanNumerals = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 12, color: '#8B0000', marginBottom: 5, fontWeight: 'bold' }}>{title}</Text>
      <Svg viewBox={`0 0 ${s} ${s}`} width={s} height={s}>
        {signPolygons.map((sign, idx) => {
          const signPlanets = planets.filter((p: any) => p.signIndex === sign.id);
          const signCusps = cusps ? cusps.filter((c: any) => c.signIndex === sign.id) : [];
          return (
            <G key={idx}>
              <Text x={sign.cx} y={sign.cy - 6} fill="#0369A1" style={{fontSize: 7}} textAnchor="middle">{signPlanets.map((p:any) => p.vedicName).join(" ")}</Text>
              {signCusps.map((c:any, cIdx:number) => (
                <Text key={`c${cIdx}`} x={sign.cx} y={sign.cy - 14 + (cIdx * 8)} fill="#991B1B" style={{fontSize: 7}} textAnchor="middle">{romanNumerals[c.houseNumber]}</Text>
              ))}
              <Text x={sign.cx} y={sign.cy + 12} fill="#D35400" style={{fontSize: 7}} textAnchor="middle">{sign.id}</Text>
            </G>
          )
        })}
        <Rect x={0} y={0} width={s} height={s} fill="none" stroke="#8B0000" strokeWidth="1.5" />
        <Line x1={u} y1={0} x2={u} y2={s} stroke="#8B0000" strokeWidth="1" />
        <Line x1={2*u} y1={0} x2={2*u} y2={s} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={u} x2={s} y2={u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={2*u} x2={s} y2={2*u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={0} x2={u} y2={u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={s} y1={0} x2={2*u} y2={u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={0} y1={s} x2={u} y2={2*u} stroke="#8B0000" strokeWidth="1" />
        <Line x1={s} y1={s} x2={2*u} y2={2*u} stroke="#8B0000" strokeWidth="1" />
        <Text x={1.5*u} y={1.4*u} fill="#D35400" style={{fontSize: 16}} textAnchor="middle">ॐ</Text>
      </Svg>
    </View>
  );
};

export const KpKundliPDF = ({ chartData, name, dob, tob, pob }: any) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>ॐ</Text>
        <View style={styles.pageBorder}>
          <View style={styles.headerCenter}>
            <Text style={styles.omText}>ॐ</Text>
            <Text style={styles.mainTitle}>KP Kundali</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Name:</Text><Text style={styles.infoValue}>{name}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Date of Birth:</Text><Text style={styles.infoValue}>{dob}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Time of Birth:</Text><Text style={styles.infoValue}>{tob}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Place of Birth:</Text><Text style={styles.infoValue}>{pob}</Text></View>
              </View>
              <View style={styles.infoCol}>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>KP Ayanamsa:</Text><Text style={styles.infoValue}>{chartData.ayanamsaVal}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Ascendant:</Text><Text style={styles.infoValue}>{chartData.ascendant}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Moon Sign:</Text><Text style={styles.infoValue}>{chartData.moonSign}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Sun Sign:</Text><Text style={styles.infoValue}>{chartData.sunSign}</Text></View>
              </View>
            </View>
          </View>

          <View style={styles.chartsRow}>
            <View style={{ width: '48%', alignItems: 'center' }}>
              <PdfEastIndianChart title="KP Nirayana Bhava Chalit" planets={chartData.planets || []} cusps={chartData.cusps || []} size={220} />
            </View>
          </View>

          
          {chartData.dashaData && (
            <View style={styles.section} break>
              <Text style={styles.sectionTitle}>Vimshottari Dasha (120-Year Timeline)</Text>
              
              {chartData.dashaData.currentMahadasha && (
                <View style={{ marginBottom: 10, padding: 8, backgroundColor: '#FFF0D4', borderStyle: 'solid', borderColor: '#8B0000', borderWidth: 1 }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#8B0000' }}>
                    Currently Running: {chartData.dashaData.currentMahadasha.planet} Mahadasha & {chartData.dashaData.currentAntardasha?.planet} Antardasha
                  </Text>
                  <Text style={{ fontSize: 9, color: '#333' }}>
                    Current Antardasha ends on {new Date(chartData.dashaData.currentAntardasha?.end).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </Text>
                </View>
              )}

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableHeaderCell}>Mahadasha Planet</Text></View>
                  <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableHeaderCell}>Duration</Text></View>
                  <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableHeaderCell}>Start Date</Text></View>
                  <View style={{...styles.tableCol, width: '25%', borderRightWidth: 0}}><Text style={styles.tableHeaderCell}>End Date</Text></View>
                </View>
                {chartData.dashaData.mahadashas.map((md: any, i: number) => {
                  const isCurrent = chartData.dashaData.currentMahadasha?.planet === md.planet;
                  return (
                    <View style={{...styles.tableRow, backgroundColor: isCurrent ? '#FFF0D4' : 'transparent'}} key={i}>
                      <View style={{...styles.tableCol, width: '25%'}}><Text style={{...styles.tableCell, fontWeight: isCurrent ? 'bold' : 'normal', color: isCurrent ? '#8B0000' : '#333'}}>{md.planet}</Text></View>
                      <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableCell}>{md.duration} Years</Text></View>
                      <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableCell}>{new Date(md.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text></View>
                      <View style={{...styles.tableCol, width: '25%', borderRightWidth: 0}}><Text style={styles.tableCell}>{new Date(md.end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text></View>
                    </View>
                  )
                })}
              </View>
            </View>
          )}

          {chartData.planets && (
            <View style={styles.section} break>
              <Text style={styles.sectionTitle}>Planetary Details (KP)</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableHeaderCell}>Planet</Text></View>
                  <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableHeaderCell}>Sign</Text></View>
                  <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableHeaderCell}>Degree</Text></View>
                  <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableHeaderCell}>Sign Lord</Text></View>
                  <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableHeaderCell}>Star Lord</Text></View>
                  <View style={{...styles.tableCol, width: '20%', borderRightWidth: 0}}><Text style={styles.tableHeaderCell}>Sub Lord</Text></View>
                </View>
                {chartData.planets.map((p: any, i: number) => (
                  <View style={styles.tableRow} key={i}>
                    <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCell}>{p.name}</Text></View>
                    <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCell}>{p.signName}</Text></View>
                    <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{p.degFormatted}</Text></View>
                    <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCell}>{p.signLord}</Text></View>
                    <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCell}>{p.starLord}</Text></View>
                    <View style={{...styles.tableCol, width: '20%', borderRightWidth: 0}}><Text style={styles.tableCell}>{p.subLord}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>KP Astrological Analysis</Text>
            <Text style={styles.paragraph}>{chartData.reading}</Text>
          </View>
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Career & Profession</Text>
            <Text style={styles.paragraph}>{chartData.career}</Text>
          </View>
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Wealth & Finance</Text>
            <Text style={styles.paragraph}>{chartData.wealth}</Text>
          </View>
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Relationships & Marriage</Text>
            <Text style={styles.paragraph}>{chartData.relationships}</Text>
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
