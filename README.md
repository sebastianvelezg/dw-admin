# 🧭 DevelopWave Admin Dashboard

Un **dashboard administrativo moderno y modular**, desarrollado con **Next.js 16** y **shadcn/ui**, diseñado para centralizar la gestión interna de **proyectos, clientes, finanzas y empleados** de DevelopWave.

Este panel tiene como objetivo optimizar la organización, seguimiento y control de los distintos procesos de la empresa, desde la captación de clientes hasta la facturación final.

---

## 📋 Tabla de Contenidos

- [Tecnologías principales](#-tecnologías-principales)
- [Prerequisitos](#-prerequisitos)
- [Instalación](#-instalación)
- [Scripts disponibles](#-scripts-disponibles)
- [Características principales](#-características-principales)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Componentes UI disponibles](#-componentes-ui-disponibles)
- [Flujo general de datos](#-flujo-general-de-datos)
- [Desarrollo](#-desarrollo)

---

## 🚀 Tecnologías principales

- **[Next.js 16](https://nextjs.org/)** — Framework de React con App Router y React Server Components
- **[React 19](https://react.dev/)** — Biblioteca UI de última generación
- **[TypeScript](https://www.typescriptlang.org/)** — Tipado estático para mayor robustez y mantenibilidad
- **[shadcn/ui](https://ui.shadcn.com/)** — Biblioteca completa de componentes UI elegantes y accesibles (todos instalados)
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Sistema de estilos utility-first
- **[Radix UI](https://www.radix-ui.com/)** — Primitivos de UI sin estilos y accesibles
- **[Lucide Icons](https://lucide.dev/)** — Iconos modernos y personalizables
- **[React Hook Form](https://react-hook-form.com/)** — Manejo de formularios eficiente
- **[Zod](https://zod.dev/)** — Validación de esquemas TypeScript-first
- **[Recharts](https://recharts.org/)** — Biblioteca de gráficos para visualización de datos
- **[next-themes](https://github.com/pacocoursey/next-themes)** — Soporte para modo claro/oscuro

---

## 📦 Prerequisitos

Asegúrate de tener instalado:

- **Node.js** 18.17 o superior
- **npm**, **yarn**, **pnpm** o **bun** (gestor de paquetes)

---

## ⚙️ Instalación

1. **Clona el repositorio:**

```bash
git clone <repository-url>
cd dw-admin
```

2. **Instala las dependencias:**

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

3. **Copia el archivo de variables de entorno (si aplica):**

```bash
cp .env.example .env.local
```

4. **Inicia el servidor de desarrollo:**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 🛠️ Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta ESLint para verificar el código
```

---

## 🧩 Características principales

### 👥 Módulo de Clientes

Gestiona todos los clientes de DevelopWave en un solo lugar.

- Crear, editar y eliminar clientes.
- Asignar **estatus** (Lead, Activo, Inactivo, Finalizado, etc.).
- Relacionar **proyectos asociados** a cada cliente.
- Ver histórico de interacciones y notas internas.
- Subir y vincular **documentos, enlaces o cotizaciones.**

### 🧱 Módulo de Proyectos

Administra los proyectos desde su inicio hasta su cierre.

- Crear proyectos vinculados a un cliente.
- Definir **precio total** y **forma de pago** (por hitos, mensualidades, pago único, etc.).
- Agregar **links de trabajo, documentación, entregas, repositorios, demos, etc.**
- Seguimiento por **estatus**: planeación, desarrollo, revisión, completado, en pausa.
- Conectar los datos con el módulo de **Finanzas** para control automático de pagos.
- Asignar **empleados** responsables o colaboradores.

### 💰 Módulo de Finanzas

Controla las finanzas de la empresa de forma clara y organizada.

- Registro de **pagos**, **ingresos** y **gastos**.
- Creación y gestión de **facturas (invoices)** y **cotizaciones.**
- Vinculación directa con los **proyectos activos.**
- Estado financiero general y por cliente/proyecto.
- Dashboard visual con métricas clave (ingresos mensuales, pagos pendientes, gastos, etc).

### 🧑‍💼 Módulo de Empleados

Mantén organizada toda la información del equipo de trabajo.

- Listado de empleados activos.
- Asignación de roles y permisos (Administrador, Finanzas, Desarrollador, Soporte, etc).
- Vinculación de cada empleado con los proyectos en los que participa.
- Información de contacto, estado laboral, historial de participación.
- Posible integración futura con control de horas o productividad.

---

## 🧠 Flujo General de Datos

1. **Clientes** → pueden tener varios **Proyectos**.
2. Cada **Proyecto** → tiene su **estatus**, **precio**, **forma de pago**, **cotización** y **empleados asignados**.
3. Los **Pagos** → se registran automáticamente en el módulo de **Finanzas**, enlazados al proyecto y cliente correspondiente.
4. Los **Empleados** → se asocian a uno o más proyectos, con visibilidad de su participación y desempeño.
5. El panel mostrará **dashboards visuales** con datos agregados (rendimiento, ingresos, clientes activos, etc).

---

## 📁 Estructura del proyecto

```
dw-admin/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── ...                # Rutas y páginas
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de shadcn/ui
├── lib/                  # Utilidades y configuraciones
│   └── utils.ts         # Funciones helper
├── public/              # Archivos estáticos
├── styles/              # Estilos globales
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
├── tailwind.config.ts   # Configuración de Tailwind CSS
└── next.config.js       # Configuración de Next.js
```

---

## 🎨 Componentes UI disponibles

Este proyecto incluye **todos los componentes de shadcn/ui** pre-instalados y listos para usar:

### Layout & Navigation
- **Accordion** - Contenido colapsable
- **Collapsible** - Secciones expandibles
- **Menubar** - Barra de menú
- **Navigation Menu** - Menú de navegación
- **Tabs** - Pestañas
- **Resizable** - Paneles redimensionables

### Forms & Inputs
- **Button** - Botones interactivos
- **Checkbox** - Casillas de verificación
- **Input** - Campos de texto
- **Input OTP** - Entrada de códigos OTP
- **Label** - Etiquetas de formulario
- **Radio Group** - Grupos de radio buttons
- **Select** - Selectores desplegables
- **Slider** - Controles deslizantes
- **Switch** - Interruptores toggle
- **Textarea** - Áreas de texto multilínea
- **Form** - Integración con React Hook Form

### Feedback & Overlays
- **Alert Dialog** - Diálogos de alerta
- **Dialog** - Ventanas modales
- **Drawer** - Paneles deslizables (vaul)
- **Popover** - Contenido emergente
- **Toast** - Notificaciones (sonner)
- **Tooltip** - Información contextual
- **Hover Card** - Tarjetas al pasar el mouse
- **Progress** - Barras de progreso

### Data Display
- **Avatar** - Avatares de usuario
- **Badge** - Insignias y etiquetas
- **Card** - Tarjetas de contenido
- **Carousel** - Carruseles de imágenes
- **Chart** - Gráficos (recharts)
- **Separator** - Divisores visuales
- **Table** - Tablas de datos

### Menus & Commands
- **Command** - Paleta de comandos (cmdk)
- **Context Menu** - Menú contextual
- **Dropdown Menu** - Menús desplegables

### Utilities
- **Aspect Ratio** - Contenedores con ratio fijo
- **Scroll Area** - Áreas con scroll personalizado
- **Calendar** - Selector de fechas (react-day-picker)
- **Date Picker** - Selector de fechas
- **Toggle** - Botones de alternancia
- **Toggle Group** - Grupos de toggles

### Theming
- **Theme Provider** - Soporte para modo claro/oscuro con next-themes

**Para usar un componente:**

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

---

## 💻 Desarrollo

### Buenas prácticas

- **Componentes:** Crear componentes reutilizables en `/components`
- **Tipado:** Usar TypeScript y definir tipos/interfaces claros
- **Estilos:** Usar Tailwind CSS y las utilidades de `cn()` de `lib/utils.ts`
- **Formularios:** Usar React Hook Form + Zod para validación
- **Server Components:** Aprovechar React Server Components cuando sea posible
- **Accesibilidad:** Los componentes de shadcn/ui ya incluyen buenas prácticas de a11y

### Agregar nuevos componentes de shadcn/ui

Si necesitas agregar más componentes (aunque ya están todos instalados):

```bash
npx shadcn@latest add [component-name]
```

### Personalización de componentes

Los componentes en `/components/ui` pueden ser modificados libremente. shadcn/ui es "copy-paste" friendly, lo que significa que tienes control total sobre el código.

### Modo oscuro

El proyecto incluye soporte para modo claro/oscuro usando `next-themes`. Para usarlo:

```tsx
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

---

## 🤝 Contribución

1. Crea una rama desde `main`
2. Realiza tus cambios
3. Asegúrate de que el linting pase: `npm run lint`
4. Crea un Pull Request

---

## 📝 Notas

- Este es un proyecto en desarrollo activo
- La integración con backend está pendiente
- Se recomienda configurar las variables de entorno según sea necesario
- Para más información sobre shadcn/ui: [ui.shadcn.com](https://ui.shadcn.com/)

---

## 📄 Licencia

Proyecto privado de DevelopWave.

---

**Desarrollado con ❤️ por el equipo de DevelopWave**
