# 👩‍💻 Guía para Agregar las Páginas Personales de las Alumnas

¡Bienvenidas al repositorio de páginas personales del **Programa Formativo +ChicasTec**!

En esta carpeta `alumnas/` se organizan los proyectos y páginas personales de cada una de las 30 participantes.

---

## 📁 Estructura Recomendada de Carpetas

Para mantener el proyecto ordenado, cada estudiante puede tener su propia subcarpeta con su número de lista y nombre:

```text
alumnas/
├── 01-valeria-gomez/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── 02-camila-quispe/
│   └── index.html
├── ...
├── 30-milagros-vega/
│   └── index.html
└── plantilla-portafolio/    <-- (Plantilla base lista para copiar y personalizar)
    ├── index.html
    └── styles.css
```

---

## 🚀 Pasos para que una Señorita agregue su Página

1. **Copia la carpeta** `alumnas/plantilla-portafolio/` y renómbrala con tu número y nombre (ejemplo: `alumnas/01-valeria-gomez`).
2. Abre el archivo `index.html` en tu editor de código (VS Code, etc.).
3. **Personaliza tus datos:**
   - Tu nombre completo y ciudad.
   - Tu especialidad (Frontend, UI/UX, Full Stack, Impacto Social).
   - Tu descripción y frase motivacional.
   - Tus proyectos realizados en el taller.
   - Tus enlaces a GitHub y LinkedIn.
4. **Vincular con la Landing Page Principal:**
   - En el archivo `data/students.js` de la raíz del proyecto, actualiza el campo `portfolioUrl` con la ruta local:
     ```javascript
     portfolioUrl: "alumnas/01-valeria-gomez/index.html"
     ```
   - O si ya lo publicaste en **GitHub Pages** / **Vercel** / **Netlify**, puedes colocar tu enlace público:
     ```javascript
     portfolioUrl: "https://tu-usuario.github.io/mi-portafolio/"
     ```

---

## 💡 Recursos Incluidos

En `alumnas/plantilla-portafolio/` se incluye una plantilla completamente funcional, moderna, responsiva y con la paleta armónica de **+ChicasTec** (Azul Marino y Palo Rosa), lista para ser editada.

