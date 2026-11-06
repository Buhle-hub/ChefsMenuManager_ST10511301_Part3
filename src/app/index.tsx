import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


type Dish = { id: string; name: string; description: string; course: string; price: string };

export default function App() {
  
  const [dishes, setDishes] = useState<Dish[]>([
    { id: '1', name: 'pasta', description: 'creamy pasta', course: 'Main course', price: '50' },
    { id: '2', name: 'chocolate cake', description: 'slice of chocolate cake', course: 'Dessert', price: '45' },
  ]);

  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starter');
  const [price, setPrice] = useState('');

  
  const [errorMsg, setErrorMsg] = useState('');

  
  const [searchText, setSearchText] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  
  const [editingId, setEditingId] = useState<string | null>(null);

  
  const saveDish = () => {
    
    if (name.trim() === '' || description.trim() === '' || price.trim() === '') {
      setErrorMsg('Please enter Dish Name, Description and Price');
      return;
    }
    
    if (isNaN(Number(price))) {
      setErrorMsg('Please enter a valid Price - numbers only');
      return;
    }
    
    setErrorMsg('');

    
    if (editingId) {
      setDishes(dishes.map(d =>
        d.id === editingId
          ? { ...d, name: name.trim(), description: description.trim(), course, price: price.trim() }
          : d
      ));
      setEditingId(null);
    } else {
      
      setDishes([...dishes, { id: Date.now().toString(), name: name.trim(), description: description.trim(), course, price: price.trim() }]);
    }

    
    setName(''); setDescription(''); setPrice(''); setCourse('Starter');
  };

  
  const startEdit = (dish: Dish) => {
    setErrorMsg('');
    setName(dish.name);
    setDescription(dish.description);
    setCourse(dish.course);
    setPrice(dish.price);
    setEditingId(dish.id);
  };

  
  const deleteDish = (id: string) => {
    setDishes(dishes.filter(d => d.id !== id));
  };

  
  const clearForm = () => {
    setName(''); setDescription(''); setPrice(''); setCourse('Starter'); setEditingId(null); setErrorMsg('');
  };

  
  let filtered = dishes;
  if (searchText.trim() !== '') {
    filtered = filtered.filter(d => d.name.toLowerCase().includes(searchText.toLowerCase()));
  }
  if (filterCourse !== 'All') {
    filtered = filtered.filter(d => d.course === filterCourse);
  }

  
  const total = dishes.length;
  const totalPrice = dishes.reduce((sum, d) => sum + Number(d.price), 0);
  const avgPrice = total > 0 ? (totalPrice / total).toFixed(2) : '0.00';

  return (
    <ScrollView style={styles.container}>
  <View style={styles.header}>
  <View style={styles.logoBox}>
  <Image source={require('./logo.jpg')} style={styles.logo} />
  </View>
  <Text style={styles.headerTitle}>Christoffels Kitchen</Text>
  </View>

  <Text style={styles.addTitle}>Add Menu Item</Text>

  <View style={styles.form}>
  <Text style={styles.label}>Dish Name</Text>
  <TextInput style={styles.input} value={name} onChangeText={setName} />
  <Text style={styles.label}>Description</Text>
  <TextInput style={[styles.input, styles.descInput]} value={description} onChangeText={setDescription} multiline />

  <Text style={styles.label}>Course</Text>
  <View style={styles.pickerBox}>
  <Picker selectedValue={course} onValueChange={setCourse}>
  <Picker.Item label="Starter" value="Starter" />
  <Picker.Item label="Main course" value="Main course" />
  <Picker.Item label="Dessert" value="Dessert" />
  </Picker>
  </View>

  <Text style={styles.label}>Price</Text>
  <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

  <TouchableOpacity style={styles.saveBtn} onPress={saveDish}>
  <Text style={styles.saveText}>{editingId ? 'UPDATE MENU ITEM' : 'SAVE MENU ITEM'}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
  <Text style={styles.clearText}>CLEAR</Text>
  </TouchableOpacity>

  {errorMsg !== '' && (
  <View style={styles.errorBox}>
  <Text style={styles.errorText}>{errorMsg}</Text>
  </View>
  )}

  <View style={styles.statsCard}>
  <Text style={styles.sectionTitle}>Search & Filter</Text>
  <Text style={styles.label}>Search</Text>
  <TextInput style={styles.input} placeholder="Search by dish name" value={searchText} onChangeText={setSearchText} />

  <Text style={styles.label}>Filter by Course</Text>
  <View style={styles.pickerBox}>
  <Picker selectedValue={filterCourse} onValueChange={setFilterCourse}>
  <Picker.Item label="All Courses" value="All" />
  <Picker.Item label="Starter" value="Starter" />
  <Picker.Item label="Main course" value="Main course" />
  <Picker.Item label="Dessert" value="Dessert" />
  </Picker>
  </View>

  <TouchableOpacity style={styles.clearBtn} onPress={() => { setSearchText(''); setFilterCourse('All'); }}>
  <Text style={styles.clearText}>CLEAR SEARCH & FILTER</Text>
  </TouchableOpacity>
  </View>

<View style={styles.listHeader}>
<Text style={styles.listHeaderText}>Menu Items - Total: {filtered.length}</Text>
</View>

 {filtered.map((item) => (
<View key={item.id} style={styles.menuItem}>
<View style={{ flex: 1 }}>
<Text style={styles.menuName}>{item.name} - {item.course}</Text>
<Text style={styles.menuDesc}>{item.description}</Text>
 </View>

<View style={{ alignItems: 'flex-end' }}>
<Text style={styles.menuPrice}>R{Number(item.price).toFixed(2)}</Text>
<View style={{ flexDirection: 'row', marginTop: 6 }}>
<TouchableOpacity onPress={() => startEdit(item)}><Text style={styles.editTxt}>EDIT</Text></TouchableOpacity>
<TouchableOpacity onPress={() => deleteDish(item.id)}><Text style={styles.delTxt}>DELETE</Text></TouchableOpacity>
</View>
</View>
</View>
))}

<View style={styles.totalRow}>
<Text style={styles.totalText}>Total Price: R{filtered.reduce((sum, d) => sum + Number(d.price), 0).toFixed(2)}</Text>
</View>

      
<View style={styles.statsCard}>
<Text style={styles.sectionTitle}>Menu Statistics</Text>
<View style={styles.statsRow}>
<View style={styles.statBox}><Text style={styles.statNum}>{total}</Text><Text style={styles.statLabel}>Total Items</Text></View>
<View style={styles.statBox}><Text style={styles.statNum}>R{avgPrice}</Text><Text style={styles.statLabel}>Avg Price</Text></View>
<View style={styles.statBox}><Text style={styles.statNum}>R{totalPrice.toFixed(2)}</Text><Text style={styles.statLabel}>Total Price</Text></View>
</View>
          
          
<View style={styles.statsRow}>
<View style={styles.statBox}><Text style={styles.statNum}>{dishes.filter(d => d.course === 'Starter').length}</Text><Text style={styles.statLabel}>Starters</Text></View>
<View style={styles.statBox}><Text style={styles.statNum}>{dishes.filter(d => d.course === 'Main course').length}</Text><Text style={styles.statLabel}>Main</Text></View>
<View style={styles.statBox}><Text style={styles.statNum}>{dishes.filter(d => d.course === 'Dessert').length}</Text><Text style={styles.statLabel}>Desserts</Text></View>
</View>
</View>

<View style={{ height: 60 }} />
</View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { backgroundColor: '#1e2e4a', height: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  logoBox: { width: 56, height: 56, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logo: { width: 52, height: 52, borderRadius: 8 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '800' },
  addTitle: { textAlign: 'center', fontSize: 14, fontWeight: '800', marginTop: 20, marginBottom: 14, color: '#111', textTransform: 'uppercase' },
  form: { paddingHorizontal: 12 },
  label: { fontSize: 11, color: '#444', marginTop: 10, marginBottom: 3, fontWeight: '600' },
  input: { borderWidth: 1.5, borderColor: '#222', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, height: 42, backgroundColor: '#fff' },
  descInput: { height: 80, textAlignVertical: 'top' },
  pickerBox: { borderWidth: 1.5, borderColor: '#222', borderRadius: 8, height: 42, justifyContent: 'center', backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#d9441a', height: 52, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  saveText: { color: 'white', fontSize: 15, fontWeight: '900' },
  clearBtn: { borderWidth: 2, borderColor: '#111', height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#fff' },
  clearText: { fontSize: 13, color: '#111', fontWeight: '800' },
  errorBox: { borderWidth: 2, borderColor: '#d9441a', borderRadius: 8, minHeight: 44, justifyContent: 'center', alignItems: 'center', marginTop: 10, backgroundColor: '#ffe8e0', paddingHorizontal: 10, paddingVertical: 8 },
  errorText: { fontSize: 12, color: '#a83212', fontWeight: '800', textAlign: 'center' },
  statsCard: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginTop: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 10, color: '#111', textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', marginTop: 6 },
  statBox: { flex: 1, backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, alignItems: 'center', marginHorizontal: 3 },
  statNum: { fontSize: 13, fontWeight: '800', color: '#1e2e4a' },
  statLabel: { fontSize: 9, color: '#666', marginTop: 2, fontWeight: '600' },
  listHeader: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
  listHeaderText: { fontSize: 13, fontWeight: '800', color: '#111', textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', borderWidth: 1.5, borderColor: '#111', borderRadius: 10, padding: 12, marginTop: 8, backgroundColor: '#fff', alignItems: 'center' },
  menuName: { fontSize: 14, color: '#111', fontWeight: '800', textTransform: 'uppercase' },
  menuDesc: { fontSize: 11, color: '#555', marginTop: 3 },
  menuPrice: { fontSize: 14, color: '#111', fontWeight: '800' },
  editTxt: { fontSize: 12, color: '#fff', fontWeight: '900', backgroundColor: '#1e2e4a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  delTxt: { fontSize: 12, color: '#fff', fontWeight: '900', backgroundColor: '#d9441a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, overflow: 'hidden', marginLeft: 6 },
  totalRow: { alignItems: 'flex-end', marginTop: 14 },
  totalText: { fontSize: 14, fontWeight: '900', color: '#111', textTransform: 'uppercase' },
});