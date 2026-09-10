import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Course = 'Starter' | 'Main course' | 'Dessert';
type Item = { id:string; name:string; description:string; course:Course; price:number };

export default function App() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [course, setCourse] = useState<Course>('Starter');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [menu, setMenu] = useState<Item[]>([]);
  const total = menu.reduce((s,i)=>s+i.price,0);

  const save = () => {
    if(!name.trim() || !desc.trim() || !price.trim()){ 
    setError('Enter required information'); 
    return; 
    }
    if(isNaN(parseFloat(price))){
    setError('Price must be a number');
    return;
    }
    setMenu([...menu, { id:Date.now().toString(), name, description:desc, course, price: parseFloat(price) }]);
    setName(''); setDesc(''); setPrice(''); setCourse('Starter'); setError('');
  };
  
  const clear = () => { 
    setName(''); setDesc(''); setPrice(''); setCourse('Starter'); setError(''); 
  };

  return(
  <View style={s.bg}>
  <View style={s.header}>
  <Image source={require('../../assets/images/logo.jpg')} style={s.logo} />
  <Text style={s.headerTitle}>Christoffels Kitchen</Text>
  </View>

  <ScrollView 
  style={s.scroll} 
  contentContainerStyle={s.contentContainer}
  showsVerticalScrollIndicator={true}>
        
  <Text style={s.title}>Add Menu Item</Text>

  <Text style={s.label}>Dish Name</Text>
  <TextInput style={s.input} value={name} onChangeText={setName} />

  <Text style={s.label}>Description</Text>
  <TextInput style={[s.input, s.textArea]} multiline value={desc} onChangeText={setDesc} />

  <Text style={s.label}>Course</Text>
  <View style={s.pickerWrap}>
  <Picker selectedValue={course} onValueChange={setCourse} style={{color:'#2A2C41'}}>
  <Picker.Item label="Starter" value="Starter" />
  <Picker.Item label="Main course" value="Main course" />
  <Picker.Item label="Dessert" value="Dessert" />
  </Picker>
  </View>
  <Text style={s.hint}>Starter, Main course, Dessert</Text>

  <Text style={s.label}>Price</Text>
  <TextInput style={s.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

  <TouchableOpacity style={s.primaryBtn} onPress={save}>
  <Text style={s.primaryBtnText}>Save Menu Item</Text>
  </TouchableOpacity>

   <TouchableOpacity style={s.secondaryBtn} onPress={clear}>
    <Text style={s.secondaryBtnText}>Clear</Text>
    </TouchableOpacity>

  {error ? (
 <Text style={s.error}>⚠️ {error}</Text>
) : (
 <Text style={s.footer}>Enter required information</Text>
 )}

<View style={s.divider} />

<Text style={s.title}>Menu Items - Total: {menu.length}</Text>

{menu.length === 0 ? (
<Text style={s.empty}>No items yet. Add your first dish above!</Text>
) : (
 menu.map(i=>(
<View key={i.id} style={s.card}>
<View style={s.cardTop}>
<Text style={s.cardName}>{i.name} - {i.course}</Text>
<Text style={s.cardPrice}>R{i.price.toFixed(2)}</Text>
</View>
<Text style={s.cardDesc}>{i.description}</Text>
</View>
))
)}

<Text style={s.totalPrice}>Total Price: R{total.toFixed(2)}</Text>
<View style={{height:150}} />
      
      
</ScrollView>
</View>
  )
}

const s = StyleSheet.create({
  bg: { flex:1, height: Platform.OS==='web' ? '100vh' as any : '100%', backgroundColor:'#F4F4F8' },
  scroll: { flex:1 },
  contentContainer: { padding:20, paddingBottom:200, flexGrow:1 },
  header: { backgroundColor:'#2A2C41', padding:15, paddingTop:50, flexDirection:'row', alignItems:'center' },
  headerTitle: { color:'white', fontSize:18, fontWeight:'bold', marginLeft:12 },
  logo: { width:60, height:60, resizeMode:'contain', backgroundColor:'white', borderRadius:8 },
  title: { fontSize:20, fontWeight:'bold', color:'#2A2C41', textAlign:'center', marginBottom:10, marginTop:10 },
  label: { fontSize:13, fontWeight:'700', color:'#2A2C41', marginTop:14, marginBottom:5 },
  input: { backgroundColor:'white', borderWidth:1.5, borderColor:'#2A2C41', borderRadius:10, padding:12, fontSize:14 },
  textArea: { height:90, textAlignVertical:'top' },
  pickerWrap: { backgroundColor:'#FDBF50', borderWidth:1.5, borderColor:'#2A2C41', borderRadius:10, overflow:'hidden' },
  hint: { fontSize:11, color:'#2A2C41', marginTop:4 },
  primaryBtn: { backgroundColor:'#FF724C', borderRadius:10, padding:15, alignItems:'center', marginTop:20 },
  primaryBtnText: { color:'white', fontWeight:'bold', fontSize:15 },
  secondaryBtn: { backgroundColor:'white', borderWidth:1.5, borderColor:'#2A2C41', borderRadius:10, padding:13, alignItems:'center', marginTop:12 },
  secondaryBtnText: { color:'#2A2C41', fontWeight:'700' },
  error: { color:'white', backgroundColor:'#FF724C', textAlign:'center', marginTop:15, fontWeight:'bold', padding:12, borderRadius:8, overflow:'hidden' },
  footer: { textAlign:'center', marginTop:15, fontSize:12, color:'#2A2C41', borderTopWidth:1, borderColor:'#2A2C41', paddingTop:10 },
  divider: { height:2, backgroundColor:'#2A2C41', marginTop:25, marginBottom:10 },
  empty: { textAlign:'center', marginTop:20, color:'#888' },
  card: { backgroundColor:'white', borderWidth:1.5, borderColor:'#2A2C41', borderRadius:12, padding:12, marginTop:12 },
  cardTop: { flexDirection:'row', justifyContent:'space-between' },
  cardName: { fontWeight:'bold', color:'#2A2C41', flex:1, fontSize:14 },
  cardPrice: { fontWeight:'bold', color:'#2A2C41', fontSize:12 },
  cardDesc: { fontSize:12, color:'#555', marginTop:5, textAlign:'center' },
  totalPrice: { textAlign:'right', fontWeight:'bold', color:'#2A2C41', marginTop:15, fontSize:16 },
});