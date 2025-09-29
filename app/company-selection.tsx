import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Company {
  company_id: string;
  name: string;
  logo_url: string;
  description: string;
}

export default function CompanySelectionScreen() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call
      // GET /companies/available with JWT token
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockCompanies: Company[] = [
        {
          company_id: "abc12345-def6-7890-abcd-1234567890ef",
          name: "Acme Corporation",
          logo_url: "https://via.placeholder.com/80x80/007AFF/FFFFFF?text=AC",
          description: "Leading firm in engineering and innovation."
        },
        {
          company_id: "def67890-abc1-2345-def6-789012345678",
          name: "Tech Solutions Inc",
          logo_url: "https://via.placeholder.com/80x80/34C759/FFFFFF?text=TS",
          description: "Digital transformation and software development."
        },
        {
          company_id: "ghi23456-def7-8901-ghi2-345678901234",
          name: "Global Enterprises",
          logo_url: "https://via.placeholder.com/80x80/FF9500/FFFFFF?text=GE",
          description: "International business and consulting services."
        }
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      Alert.alert('Error', 'Failed to load companies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
  };

  const handleContinue = () => {
    if (!selectedCompany) {
      Alert.alert('Selection Required', 'Please select a company to continue.');
      return;
    }

    // Navigate to user directory with selected company
    router.push({
      pathname: '/user-directory',
      params: { companyId: selectedCompany }
    });
  };

  const renderCompanyCard = ({ item }: { item: Company }) => {
    const isSelected = selectedCompany === item.company_id;
    
    return (
      <TouchableOpacity
        style={[
          styles.companyCard,
          isSelected && styles.companyCardSelected
        ]}
        onPress={() => handleCompanySelect(item.company_id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: item.logo_url }}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{item.name}</Text>
            <Text style={styles.companyDescription}>{item.description}</Text>
          </View>
          
          <View style={styles.selectionIndicator}>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
            ) : (
              <View style={styles.unselectedCircle} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading companies...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Company</Text>
          <Text style={styles.subtitle}>
            Choose the company directory you want to access
          </Text>
        </View>

        {/* Company List */}
        <FlatList
          data={companies}
          renderItem={renderCompanyCard}
          keyExtractor={(item) => item.company_id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedCompany && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedCompany}
        >
          <Text style={styles.continueButtonText}>
            Continue to Directory
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    paddingBottom: 24,
  },
  companyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  companyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  unselectedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
