import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#020205',
    color: '#E0E7FF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1px solid #3730A3',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#818CF8',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#A5B4FC',
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#0F1123',
    borderRadius: 8,
    border: '1px solid #312E81',
  },
  heading: {
    fontSize: 16,
    color: '#C7D2FE',
    marginBottom: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#E0E7FF',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  chartBox: {
    width: '48%',
    padding: 10,
    backgroundColor: '#0F1123',
    borderRadius: 8,
    border: '1px solid #312E81',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 14,
    color: '#818CF8',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  chartImage: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
  }
});

export const KundliPDF = ({ chartData, name, dob, tob, pob, d1Image, d9Image }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Cosmic Blueprint</Text>
        <Text style={styles.subtitle}>Name: {name}</Text>
        <Text style={styles.subtitle}>DOB: {dob} | Time: {tob}</Text>
        <Text style={styles.subtitle}>Location: {pob}</Text>
        <Text style={styles.subtitle}>Ascendant: {chartData.ascendant} | Moon Sign: {chartData.moonSign}</Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Lagna Chart (D-1)</Text>
          {d1Image && <Image src={d1Image} style={styles.chartImage} />}
        </View>
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Navamsa Chart (D-9)</Text>
          {d9Image && <Image src={d9Image} style={styles.chartImage} />}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Core Soul Urge</Text>
        <Text style={styles.text}>{chartData.reading}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Career & Power</Text>
        <Text style={styles.text}>{chartData.career}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Wealth & Finance</Text>
        <Text style={styles.text}>{chartData.wealth || "No wealth data available."}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Love & Destiny</Text>
        <Text style={styles.text}>{chartData.relationships}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Health & Vitality</Text>
        <Text style={styles.text}>{chartData.health || "No health data available."}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Ultimate Life Path</Text>
        <Text style={styles.text}>{chartData.fullLife || "Full life overview is not available."}</Text>
      </View>
    </Page>
  </Document>
);

