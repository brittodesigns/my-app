import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  name: string;
  role: string;
  image_url_thumb: string;
  department: string;
}

interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function UserDirectoryScreen() {
  const { companyId } = useLocalSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'department'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const loadUsers = useCallback(async (page: number = 1, search: string = '', sort: string = 'name', reset: boolean = true) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // TODO: Replace with actual API call
      // GET /companies/:company_id/users?page=1&limit=20&search=john&sort_by=name
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - create different users for different pages
      const allMockUsers: User[] = [
        {
          id: "user1-abc-123",
          name: "John Doe",
          role: "Senior Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/007AFF/FFFFFF?text=JD",
          department: "Engineering"
        },
        {
          id: "user2-def-456",
          name: "Jane Smith",
          role: "Product Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/34C759/FFFFFF?text=JS",
          department: "Product"
        },
        {
          id: "user3-ghi-789",
          name: "Mike Johnson",
          role: "Software Engineer",
          image_url_thumb: "https://via.placeholder.com/60x60/FF9500/FFFFFF?text=MJ",
          department: "Engineering"
        },
        {
          id: "user4-jkl-012",
          name: "Sarah Wilson",
          role: "Designer",
          image_url_thumb: "https://via.placeholder.com/60x60/FF3B30/FFFFFF?text=SW",
          department: "Design"
        },
        {
          id: "user5-mno-345",
          name: "David Brown",
          role: "Marketing Director",
          image_url_thumb: "https://via.placeholder.com/60x60/5856D6/FFFFFF?text=DB",
          department: "Marketing"
        },
        // Additional users for pagination
        {
          id: "user6-pqr-678",
          name: "Lisa Anderson",
          role: "HR Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/FF2D92/FFFFFF?text=LA",
          department: "Human Resources"
        },
        {
          id: "user7-stu-901",
          name: "Robert Taylor",
          role: "Sales Director",
          image_url_thumb: "https://via.placeholder.com/60x60/30D158/FFFFFF?text=RT",
          department: "Sales"
        },
        {
          id: "user8-vwx-234",
          name: "Emily Davis",
          role: "Finance Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/64D2FF/FFFFFF?text=ED",
          department: "Finance"
        }
      ];

      // Simulate pagination by slicing the array
      const startIndex = (page - 1) * 5; // 5 users per page
      const endIndex = startIndex + 5;
      const pageUsers = allMockUsers.slice(startIndex, endIndex);

      const filteredUsers = search 
        ? pageUsers.filter(user => 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.role.toLowerCase().includes(search.toLowerCase()) ||
            user.department.toLowerCase().includes(search.toLowerCase())
          )
        : pageUsers;

      const sortedUsers = filteredUsers.sort((a, b) => {
        if (sort === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return a.department.localeCompare(b.department);
        }
      });

      if (reset) {
        setUsers(sortedUsers);
        setCurrentPage(1);
      } else {
        setUsers(prev => [...prev, ...sortedUsers]);
        setCurrentPage(prev => prev + 1);
      }

      setTotalUsers(allMockUsers.length);
      setHasMore(page < 2); // Mock pagination limit (2 pages)
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // For search, we need to search through all users, not just the current page
    if (query.trim()) {
      // Filter all users for search
      const allUsers = [
        {
          id: "user1-abc-123",
          name: "John Doe",
          role: "Senior Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/007AFF/FFFFFF?text=JD",
          department: "Engineering"
        },
        {
          id: "user2-def-456",
          name: "Jane Smith",
          role: "Product Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/34C759/FFFFFF?text=JS",
          department: "Product"
        },
        {
          id: "user3-ghi-789",
          name: "Mike Johnson",
          role: "Software Engineer",
          image_url_thumb: "https://via.placeholder.com/60x60/FF9500/FFFFFF?text=MJ",
          department: "Engineering"
        },
        {
          id: "user4-jkl-012",
          name: "Sarah Wilson",
          role: "Designer",
          image_url_thumb: "https://via.placeholder.com/60x60/FF3B30/FFFFFF?text=SW",
          department: "Design"
        },
        {
          id: "user5-mno-345",
          name: "David Brown",
          role: "Marketing Director",
          image_url_thumb: "https://via.placeholder.com/60x60/5856D6/FFFFFF?text=DB",
          department: "Marketing"
        },
        {
          id: "user6-pqr-678",
          name: "Lisa Anderson",
          role: "HR Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/FF2D92/FFFFFF?text=LA",
          department: "Human Resources"
        },
        {
          id: "user7-stu-901",
          name: "Robert Taylor",
          role: "Sales Director",
          image_url_thumb: "https://via.placeholder.com/60x60/30D158/FFFFFF?text=RT",
          department: "Sales"
        },
        {
          id: "user8-vwx-234",
          name: "Emily Davis",
          role: "Finance Manager",
          image_url_thumb: "https://via.placeholder.com/60x60/64D2FF/FFFFFF?text=ED",
          department: "Finance"
        }
      ];

      const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase()) ||
        user.department.toLowerCase().includes(query.toLowerCase())
      );

      const sortedUsers = filteredUsers.sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          return a.department.localeCompare(b.department);
        }
      });

      setUsers(sortedUsers);
      setTotalUsers(filteredUsers.length);
      setHasMore(false); // No pagination for search results
    } else {
      // Reset to normal pagination
      loadUsers(1, '', sortBy, true);
    }
  };

  const handleSort = (newSortBy: 'name' | 'department') => {
    setSortBy(newSortBy);
    if (searchQuery.trim()) {
      // If we're in search mode, re-sort the current results
      setUsers(prevUsers => {
        const sortedUsers = [...prevUsers].sort((a, b) => {
          if (newSortBy === 'name') {
            return a.name.localeCompare(b.name);
          } else {
            return a.department.localeCompare(b.department);
          }
        });
        return sortedUsers;
      });
    } else {
      // Normal pagination mode
      loadUsers(1, searchQuery, newSortBy, true);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadUsers(currentPage + 1, searchQuery, sortBy, false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (searchQuery.trim()) {
      // If we're in search mode, refresh the search results
      handleSearch(searchQuery);
    } else {
      // Normal pagination mode
      loadUsers(1, searchQuery, sortBy, true);
    }
  };

  const handleUserPress = (userId: string) => {
    router.push({
      pathname: '/user-profile',
      params: { userId, companyId }
    });
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleUserPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.image_url_thumb }}
          style={styles.userAvatar}
          resizeMode="cover"
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
          <Text style={styles.userDepartment}>{item.department}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more users...</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading directory...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Directory</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, role, or department"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
            onPress={() => handleSort('name')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>
              Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'department' && styles.sortButtonActive]}
            onPress={() => handleSort('department')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'department' && styles.sortButtonTextActive]}>
              Department
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <Text style={styles.resultsCount}>
          {totalUsers} {totalUsers === 1 ? 'member' : 'members'} found
        </Text>

        {/* User List */}
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#007AFF"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  clearButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 12,
    color: '#999',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
