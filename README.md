# 🧭 DevelopWave Admin Dashboard

Un **dashboard administrativo moderno y modular**, desarrollado con **Next.js 16** y **shadcn/ui**, diseñado para centralizar la gestión interna de **proyectos, clientes, finanzas y empleados** de DevelopWave.

Este panel tiene como objetivo optimizar la organización, seguimiento y control de los distintos procesos de la empresa, desde la captación de clientes hasta la facturación final.

---

## 🚀 Tecnologías principales

- **Next.js 16** — Framework de React de alto rendimiento.
- **TypeScript** — Tipado estático para mayor robustez y mantenibilidad.
- **shadcn/ui** — Biblioteca de componentes UI elegantes y accesibles.
- **Tailwind CSS** — Sistema de estilos rápido y personalizable.
- **React Query / Zustand** — Para manejo de estado y datos asíncronos (opcional según backend).
- **Próximamente:** Integración con API/Backend personalizado (NestJS, Express, Supabase, etc).

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
