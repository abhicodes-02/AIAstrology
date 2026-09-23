import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#020205',
    color: '#FEF08A', // yellow-200
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1px solid #A16207', // yellow-700
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#EAB308', // yellow-500
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#FEF08A',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#281504', // orange-950/40 approx
    borderRadius: 8,
    border: '1px solid #713F12',
  },
  heading: {
    fontSize: 16,
    color: '#FDE047', // yellow-300
    marginBottom: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#FEF08A',
  },
  monthContainer: {
    marginTop: 20,
  },
  monthBox: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#1E1E24',
    borderRadius: 8,
    border: '1px solid #422006',
  },
  monthTitle: {
    fontSize: 14,
    color: '#EAB308',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  monthTheme: {
    fontSize: 10,
    color: '#FDE047',
    marginBottom: 8,
    fontStyle: 'italic',
  }
});

export const VarshaphalPDF = ({ data, name, dob, tob, pob }: any) => {
  const monthlyData = Array.isArray(data.monthlyPredictions) 
    ? data.monthlyPredictions 
    : [{ month: "Overview", prediction: typeof data.monthlyPredictions === 'string' ? data.monthlyPredictions : "Data unavailable." }];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Solar Return (Varshaphal)</Text>
          <Text style={styles.subtitle}>Name: {name}</Text>
          <Text style={styles.subtitle}>DOB: {dob} | Time: {tob}</Text>
          <Text style={styles.subtitle}>Location: {pob}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Annual Forecast Overview</Text>
          <Text style={styles.text}>{data.varshaphal}</Text>
        </View>
      </Page>
      
      {/* Month by month break down in new page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Monthly Predictions</Text>
        
        {monthlyData.map((month: any, i: number) => (
          <View key={i} style={styles.monthBox} wrap={false}>
            <Text style={styles.monthTitle}>{i + 1}. {month.month}</Text>
            {month.theme && <Text style={styles.monthTheme}>Theme: {month.theme}</Text>}
            <Text style={styles.text}>{month.prediction}</Text>
            
            {(month.career || month.relationships) && (
              <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                {month.career && (
                  <View style={{ width: '48%' }}>
                    <Text style={{ fontSize: 10, color: '#93C5FD', marginBottom: 3, fontWeight: 'bold' }}>Career</Text>
                    <Text style={{ fontSize: 10, color: '#DBEAFE', lineHeight: 1.4 }}>{month.career}</Text>
                  </View>
                )}
                {month.relationships && (
                  <View style={{ width: '48%' }}>
                    <Text style={{ fontSize: 10, color: '#F9A8D4', marginBottom: 3, fontWeight: 'bold' }}>Relationships</Text>
                    <Text style={{ fontSize: 10, color: '#FCE7F3', lineHeight: 1.4 }}>{month.relationships}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};
