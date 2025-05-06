import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import api from '@/api/api';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  photo: string;
}

interface HomeData {
  user: {
    name: string;
    profilePicture: string;
  };
  categories: Category[];
  topDoctors: Doctor[];
}

export default function HomeScreen() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);

  async function fetchHomeData() {
    try {
      const res = await api.get('/home');
      setHomeData(res.data);
    } catch (error) {
      console.error("Erro ao buscar dados da home:", error);
    }
  }

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (!homeData) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        }}>
          <Image source={{ uri: homeData.user.profilePicture }} style={styles.avatar} />
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userName}>{homeData.user.name}</Text>
          </View>
        </View>

        <View style={styles.searchBox}>
          <TextInput placeholder="Search doctor" style={styles.input} />
          <Ionicons name="search" size={20} color="#1976D2" />
        </View>
      </View>



      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categories}>
          {homeData.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryBox}>
              <Image source={{ uri: cat.icon }} style={styles.icons} />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top doctors</Text>
        {homeData.topDoctors.map((doc) => (
          <View key={doc.id} style={styles.doctorCard}>
            <Image source={{ uri: doc.photo }} style={styles.doctorPhoto} />
            <View>
              <Text style={styles.doctorName}>{doc.name}</Text>
              <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{doc.rating} ({doc.reviews} Reviews)</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f4ff',
    flex: 1,
  },
  header: {
    backgroundColor: '#636DFF',
    padding: 16,
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBox: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryBox: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  doctorPhoto: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  icons: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#444',
  }
});
