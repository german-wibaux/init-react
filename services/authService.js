const API_URL = 'http://localhost:3000';
const USE_BACKEND = false;

const DEMO_USER = {
  name: 'Alumno Demo',
  email: 'alumno@tecnica.edu',
  password: '1234',
};

async function loginWithBackend(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Email o contraseña incorrectos.');
  }

  return {
    user: data.user,
    token: data.token,
  };
}

async function loginLocal(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    throw new Error('Email o contraseña incorrectos.');
  }

  return {
    user: {
      name: DEMO_USER.name,
      email: DEMO_USER.email,
    },
    token: 'local-demo-token',
  };
}

export async function login({ email, password }) {
  if (USE_BACKEND) {
    return loginWithBackend(email, password);
  }

  return loginLocal(email, password);
}

export async function logout() {
  // Cuando haya JWT, acá se borra el token guardado.
}
