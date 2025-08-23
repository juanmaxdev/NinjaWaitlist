# 🥷 Ninja Waitlist

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Una landing page interactiva y misteriosa para capturar leads con temática ninja**

[Demo en Vivo](#) • [Documentación](#) • [Reportar Bug](#)

</div>

---

## Características

### **Experiencia Visual Inmersiva**
- **Diseño temático ninja** con gradientes y efectos visuales avanzados
- **Animaciones fluidas** usando Framer Motion para transiciones suaves
- **Efecto de lluvia interactivo** que se activa al hacer clic en el avatar ninja
- **Tipografías personalizadas** con fuentes japonesas auténticas

### **Sistema de Captura de Leads**
- **Formulario inteligente** con validación en tiempo real
- **Sistema de acertijos** que desbloquea campos ocultos
- **Countdown timer** que genera palabras secretas en japonés
- **Validación de email** robusta y responsive

### **Interactividad Gamificada**
- **Menú secreto ninja** que aparece al resolver acertijos
- **Sistema de letras caídas** durante el efecto de lluvia
- **Mapeo de alfabeto japonés** para generar palabras secretas
- **Experiencia de usuario envolvente** con elementos sorpresa

---

## Stack Tecnológico

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipado estático avanzado
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first

### **Animaciones & UX**
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones y transiciones
- **[Lucide React](https://lucide.dev/)** - Iconografía moderna y consistente
- **Fuentes personalizadas** - NinjaKage, Zenjirou, Jansina, AssassinNinja

### **Testing & Desarrollo**
- **[Vitest](https://vitest.dev/)** - Framework de testing rápido
- **[Testing Library](https://testing-library.com/)** - Utilidades para testing de componentes
- **MSW** - Mock Service Worker para testing de APIs

---

## Instalación y Uso

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn

### **Clonar y Instalar**
```bash
git clone https://github.com/tu-usuario/ninjawaitlist.git
cd ninjawaitlist
npm install
```

### **Desarrollo Local**
```bash
npm run dev
# Abre http://localhost:3000
```

### **Build de Producción**
```bash
npm run build
npm start
```

### **Testing**
```bash
npm test          # Ejecutar tests en modo watch
npm run test:run  # Ejecutar tests una vez
npm run coverage  # Generar reporte de cobertura
```

---

## Cómo Funciona

### **1. Landing Hero**
- Página principal con título "INICIATIVA NINJA WAITLIST"
- Avatar ninja clickeable que activa el efecto de lluvia
- Mensaje misterioso sobre "algo que se está forjando en las sombras"

### **2. Countdown Timer Interactivo**
- Cuenta regresiva hacia una fecha específica (15 Septiembre 2025)
- Cada unidad de tiempo es clickeable y genera letras japonesas
- Las letras se combinan para formar palabras secretas

### **3. Efecto de Lluvia**
- Se activa al hacer clic en el avatar ninja
- Simula lluvia con gotas animadas en canvas
- Opcionalmente muestra letras que caen

### **4. Formulario de Captura**
- Campo de email con validación en tiempo real
- Campo de palabra secreta que se autocompleta
- Campo de acertijo adicional para mayor engagement
- Estados de loading, éxito y error

---

## Arquitectura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── components/         # Componentes reutilizables
│   │   ├── sections/      # Secciones principales
│   │   │   ├── Hero.tsx           # Página principal
│   │   │   ├── CountdownTimer.tsx # Timer interactivo
│   │   │   ├── EmailSignup.tsx    # Formulario de captura
│   │   │   └── Footer.tsx         # Pie de página
│   │   ├── RainOverlay.tsx        # Efecto de lluvia
│   │   └── NinjaSecretMenu.tsx    # Menú secreto
│   ├── lib/               # Utilidades y helpers
│   │   └── japaneseAlphabetMapper.ts
│   └── globals.css        # Estilos globales
├── hooks/                 # Custom hooks
│   └── riddles/          # Hooks para acertijos
└── tests/                # Tests unitarios
```

---

## Personalización

### **Fuentes Personalizadas**
```css
/* Fuentes ninja incluidas */
@font-face {
  font-family: 'NinjaKage';
  src: url('/assets/fonts/NinjaKage-Regular.otf');
}

@font-face {
  font-family: 'Zenjirou';
  src: url('/assets/fonts/Zenjirou.otf');
}
```
---

## Testing

El proyecto incluye una suite completa de tests:

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run coverage

# Tests específicos
npm test -- EmailSignup
```

### **Cobertura de Tests**
- ✅ Componentes principales
- ✅ Hooks personalizados
- ✅ Utilidades y helpers
- ✅ Integración de formularios

---

## Responsive Design

- **Mobile First** - Optimizado para dispositivos móviles
- **Breakpoints** - sm, md, lg, xl, 2xl
- **Adaptive Layout** - Se adapta a cualquier tamaño de pantalla
- **Touch Friendly** - Interacciones optimizadas para touch


---


<div align="center">

*Construido con ❤️ y mucho código ninja*

</div>


