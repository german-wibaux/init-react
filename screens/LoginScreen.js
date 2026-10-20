import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen({
  email,
  password,
  error,
  loading = false,
  session = null,
  onChangeEmail,
  onChangePassword,
  onLogin,
  onLogout,
}) {
  const loggedIn = Boolean(session);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.kicker}>TP Anual</Text>
        <Text style={styles.title}>
          {loggedIn ? 'Entraste' : 'Iniciar sesión'}
        </Text>
        <Text style={styles.subtitle}>
          {loggedIn
            ? `Sesión iniciada como ${session.user?.email || email}`
            : 'Prueba: alumno@tecnica.edu / 1234'}
        </Text>

        {loggedIn ? (
          <Pressable style={styles.button} onPress={onLogout}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </Pressable>
        ) : (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={onChangeEmail}
              placeholder="alumno@tecnica.edu"
              placeholderTextColor="#8A9A94"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={onChangePassword}
              placeholder="••••••••"
              placeholderTextColor="#8A9A94"
              secureTextEntry
              editable={!loading}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={onLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Ingresando...' : 'Entrar'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#555',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#F4D6D6',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A5A5A',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#5C3A3A',
  },
  subtitle: {
    fontSize: 14,
    color: '#7A5555',
    marginBottom: 8,
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
  error: {
    color: '#9B2C2C',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
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
});
