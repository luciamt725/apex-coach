# 💪 APEX Coach — Tu entrenador personal IA

App personal de fitness con coach IA, diario de entrenos, tracking de calorías y gráficas de progreso. Gratis para siempre.

---

## 🚀 Cómo subirlo a Vercel (5 minutos)

### Opción A — Sin código, desde GitHub (recomendado)

1. **Crea una cuenta gratuita** en [github.com](https://github.com) si no tienes.

2. **Sube este proyecto a GitHub:**
   - Ve a github.com → botón verde "New" → crea un repo llamado `apex-coach`
   - Sube todos los archivos de esta carpeta (arrastra y suelta en la web de GitHub)

3. **Despliega en Vercel:**
   - Ve a [vercel.com](https://vercel.com) → "Sign up" con tu cuenta de GitHub
   - "Add New Project" → selecciona el repo `apex-coach`
   - Framework Preset: **Vite** (lo detecta automáticamente)
   - Pulsa **Deploy** → espera 1 minuto

4. **Listo.** Tienes tu URL tipo `apex-coach-lucia.vercel.app` 🎉

---

### Opción B — Con terminal (si tienes Node.js instalado)

```bash
# Dentro de esta carpeta:
npm install
npm run dev        # Para probar en local → http://localhost:5173
npm run build      # Para generar la versión de producción

# Instala Vercel CLI y despliega:
npm install -g vercel
vercel login
vercel --prod
```

---

## 📱 Usar como app en el móvil

Una vez desplegado en Vercel:
- Abre la URL en Safari (iPhone) o Chrome (Android)
- iPhone: botón compartir → "Añadir a pantalla de inicio"
- Android: menú ⋮ → "Añadir a pantalla de inicio"

Funciona como una app nativa 📲

---

## 🔑 API Key de Anthropic

La app usa la API de Claude para el coach IA. En Vercel funciona automáticamente porque el artifact ya tiene la clave configurada.

Si la despliegas por tu cuenta y quieres poner tu propia API key, edita `src/App.jsx` y busca la función `askClaude` — añade tu key en el header `x-api-key`.

---

## 💾 Datos guardados

Todos tus datos (perfil, entrenos, calorías, medidas) se guardan en el **localStorage** del navegador — sin servidores, sin cuentas, 100% privado.

Si cambias de dispositivo, puedes exportar/importar los datos desde el menú ⚙️ de la app.

---

## 🛠 Stack

- React 18 + Vite
- Recharts (gráficas)
- Claude API (coach IA)
- localStorage (persistencia)
