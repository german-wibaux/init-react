import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.78, 300);

const MENU_ITEMS = [
  { id: 'home', label: 'Inicio' },
  { id: 'add', label: 'Agregar producto' },
  { id: 'list', label: 'Productos' },
];

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  category: '',
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [products, setProducts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home');
  const drawerX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(drawerX, {
        toValue: isDrawerOpen ? 0 : -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isDrawerOpen ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDrawerOpen, drawerX, overlayOpacity]);

  const toggleDrawer = () => setIsDrawerOpen((open) => !open);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleMenuPress = (id) => {
    setActiveScreen(id);
    closeDrawer();
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    const price = form.price.trim();

    if (!name || !price) {
      return;
    }

    setProducts((current) => [
      {
        id: Date.now().toString(),
        name,
        description: form.description.trim(),
        price: Number(price),
        category: form.category.trim() || 'Sin categoría',
      },
      ...current,
    ]);

    setForm(INITIAL_FORM);
    setActiveScreen('list');
  };

  const isSubmitDisabled = !form.name.trim() || !form.price.trim();

  const renderForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Agregar producto</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(value) => updateField('name', value)}
        placeholder="Ej: Remera básica"
        placeholderTextColor="#8A9A94"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={form.description}
        onChangeText={(value) => updateField('description', value)}
        placeholder="Detalles del producto"
        placeholderTextColor="#8A9A94"
        multiline
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={form.price}
        onChangeText={(value) => updateField('price', value)}
        placeholder="Ej: 1999"
        placeholderTextColor="#8A9A94"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Categoría</Text>
      <TextInput
        style={styles.input}
        value={form.category}
        onChangeText={(value) => updateField('category', value)}
        placeholder="Ej: Ropa, Electrónica"
        placeholderTextColor="#8A9A94"
      />

      <Pressable
        style={[styles.button, isSubmitDisabled && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
      >
        <Text style={styles.buttonText}>Guardar producto</Text>
      </Pressable>
    </View>
  );

  const renderList = () => (
    <View style={styles.listCard}>
      <Text style={styles.listTitle}>Productos ({products.length})</Text>

      {products.length === 0 ? (
        <Text style={styles.productMeta}>Todavía no agregaste productos.</Text>
      ) : (
        products.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productMeta}>
              ${product.price} · {product.category}
            </Text>
            {product.description ? (
              <Text style={styles.productDescription}>{product.description}</Text>
            ) : null}
          </View>
        ))
      )}
    </View>
  );

  const renderContent = () => {
    if (activeScreen === 'add') {
      return renderForm();
    }

    if (activeScreen === 'list') {
      return renderList();
    }

    return (
      <>
        {renderForm()}
        {renderList()}
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.menuButton}
            onPress={toggleDrawer}
            accessibilityRole="button"
            accessibilityLabel={isDrawerOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </Pressable>
          <Text style={styles.headerTitle}>Productos</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {renderContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <Pressable style={styles.overlayPressable} onPress={closeDrawer} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            transform: [{ translateX: drawerX }],
          },
        ]}
        pointerEvents={isDrawerOpen ? 'auto' : 'none'}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Menú</Text>
          <Pressable
            style={styles.closeButton}
            onPress={closeDrawer}
            accessibilityRole="button"
            accessibilityLabel="Cerrar menú"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {MENU_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.drawerItem, isActive && styles.drawerItemActive]}
              onPress={() => handleMenuPress(item.id)}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  isActive && styles.drawerItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#555',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 6,
  },
  menuLine: {
    height: 2,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 8,
    gap: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 9,
  },
  overlayPressable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#2D4A3E',
    paddingTop: 64,
    paddingHorizontal: 20,
    gap: 8,
    zIndex: 10,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  drawerItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#D8E8E0',
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#F4D6D6',
    padding: 20,
    borderRadius: 12,
    gap: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C3A3A',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3A3A',
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFF8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E8C4C4',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5C3A3A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listCard: {
    backgroundColor: '#D4E4F7',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A3F5F',
  },
  productItem: {
    backgroundColor: '#F5F9FF',
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A3F5F',
  },
  productMeta: {
    fontSize: 14,
    color: '#4A6280',
  },
  productDescription: {
    fontSize: 14,
    color: '#5A6F8C',
  },
});
