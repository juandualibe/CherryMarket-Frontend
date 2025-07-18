# 🍒 Cherry Market - Panel de Administración (Frontend)

Bienvenido al frontend de **Cherry Market**, una Aplicación de Página Única (SPA) completa para la gestión de un punto de venta (POS) y su inventario. Construida con React y Material-UI, esta interfaz ofrece una experiencia de usuario moderna, profesional y totalmente responsive.

## Live Demo
* **Frontend Desplegado en Vercel:** `https://cherry-market-frontend.vercel.app`
* **Backend Desplegado en Render:** `https://cherry-market-api.onrender.com`

*(Nota: El plan gratuito del backend puede causar una demora inicial de ~30 segundos en la primera carga del día mientras el servidor "despierta").*

---
## Flujo de Usuario y Características Principales

Esta no es solo una página web, es una aplicación web completa con un flujo de autenticación seguro.

### 1. **Creación de Cuenta y Autenticación**
Para acceder al panel de control, primero es necesario tener una cuenta.
* **Página de Registro:** La aplicación cuenta con una ruta `/register` donde un nuevo administrador puede crear sus credenciales (usuario y contraseña).
* **Página de Login:** Una vez registrado, el usuario puede iniciar sesión desde la ruta `/login`. El sistema utiliza **tokens JWT (JSON Web Tokens)** para manejar la sesión de forma segura.
* **Sesión Persistente:** Gracias al uso de `localStorage`, la sesión del usuario se mantiene activa. Si cierras la pestaña o refrescas la página, no necesitarás volver a iniciar sesión.
* **Rutas Protegidas:** Todo el panel de administración es inaccesible para usuarios no autenticados. Cualquier intento de acceder a una ruta protegida será redirigido a la página de login.

### 2. **Panel de Control y Navegación**
Una vez dentro, el usuario es recibido por un layout profesional.
* **Diseño Responsive:** La aplicación se adapta a cualquier tamaño de pantalla. En escritorio, presenta un menú lateral fijo. En dispositivos móviles, este se convierte en un menú "hamburguesa" ☰ para optimizar el espacio.
* **Navegación por Rutas:** Se utiliza `React Router DOM` para una navegación fluida entre secciones, con URLs limpias y funcionales (ej: `/dashboard`, `/pos`, `/management`).

### 3. **Dashboard Interactivo**
La página de inicio del panel, que ofrece una vista rápida del estado del negocio.
* **Estadísticas en Tiempo Real:** Las tarjetas se conectan a la API para mostrar las **ventas totales del día** y la **cantidad de productos con bajo stock**.
* **Gráfico de Ventas:** Un gráfico de barras visualiza dinámicamente el rendimiento de las ventas durante la última semana.

### 4. **Gestión de Inventario (`/management`)**
La sección para administrar todos los productos de la tienda.
* **CRUD Completo:** Permite Crear, Leer, Actualizar y Eliminar productos.
* **Interfaz Intuitiva:** La edición de productos se realiza a través de un **modal (ventana emergente)**, garantizando una experiencia cómoda y sin errores, especialmente en pantallas pequeñas.

### 5. **Punto de Venta (`/pos`)**
El corazón de la aplicación, diseñado para ser rápido y eficiente.
* **Catálogo de Productos con Búsqueda:** Muestra todos los productos disponibles con un campo de búsqueda que filtra los resultados en tiempo real por nombre o código de barras.
* **Carrito de Compras Dinámico:** Lógica completa para añadir productos, modificar sus cantidades o eliminarlos del carrito. El total de la venta se actualiza al instante.
* **Validación de Stock:** La interfaz previene de forma inteligente que se puedan vender más unidades de un producto de las que existen en el inventario.
* **Registro de Ventas:** Al finalizar la compra, la transacción se registra de forma segura en la base de datos y el stock de los productos vendidos se descuenta automáticamente.

### 6. **Reportes y Analítica (`/history`)**
Una herramienta esencial para el análisis del negocio.
* **Historial Completo de Ventas:** Muestra una lista de todas las transacciones realizadas.
* **Filtro por Rango de Fechas:** Permite consultar las ventas de un día específico, la última semana, el último mes o cualquier rango personalizado gracias a sus selectores de calendario.
* **Vista Detallada:** Cada venta en el historial se puede expandir para ver un desglose de los productos, cantidades y precios de esa transacción específica.

---
## Stack Tecnológico
* **React**: Librería principal para la interfaz de usuario.
* **React Router DOM**: Para la navegación y el sistema de rutas.
* **Material-UI (MUI)**: Librería de componentes para un diseño profesional y responsive.
* **Axios**: Para realizar peticiones HTTP a la API del backend.
* **Recharts**: Para la creación de gráficos en el Dashboard.
* **React Toastify**: Para mostrar notificaciones amigables.
* **Date-fns**: Para el manejo y formateo de fechas.

---
## Cómo Empezar (Desarrollo Local)

### 1. Clonar el Repositorio
```bash
git clone [https://github.com/juandualibe/CherryMarket-Frontend.git](https://github.com/juandualibe/CherryMarket-Frontend.git)
cd CherryMarket-Frontend
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto y añade la siguiente variable. Para desarrollo local, debe apuntar a tu servidor backend local.
```
REACT_APP_API_URL=http://localhost:5000
```

### 4. Iniciar la Aplicación
```bash
npm start
```
La aplicación se ejecutará en `http://localhost:3000`.
