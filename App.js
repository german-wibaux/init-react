import { useState } from 'react';
import {
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

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  category: '',
};

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [products, setProducts] = useState([]);

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
  };

  const isSubmitDisabled = !form.name.trim() || !form.price.trim();

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* <View style={styles.card}>
          <Text style={styles.cardText}>Primeros pasos en la app</Text>
        </View> */}

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

        {products.length > 0 && (
          <View style={styles.listCard}>
            <Text style={styles.listTitle}>Productos ({products.length})</Text>
            {products.map((product) => (
              <View key={product.id} style={styles.productItem}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {product.category} · ${product.price.toLocaleString('es-AR')}
                </Text>
                {product.description ? (
                  <Text style={styles.productDescription}>{product.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#555',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 56,
    gap: 16,
  },
  card: {
    backgroundColor: '#B8E0D2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D4A3E',
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
