# 🍒 Cherry Market - Frontend

Esta es la interfaz de usuario para la aplicación de punto de venta y gestión de inventario de Cherry Market, construida con React.

## Tecnologías Utilizadas
- **React**: Librería para construir la interfaz de usuario.
- **React Router DOM**: Para la navegación y el ruteo de la aplicación.
- **Material-UI (MUI)**: Para un diseño profesional y componentes de UI pre-construidos.
- **Axios**: Para realizar peticiones HTTP al backend.
- **React Toastify**: Para mostrar notificaciones amigables al usuario.

---

## Características Implementadas
- **Autenticación**: Página de inicio de sesión para administradores.
- **Layout Profesional**: Diseño con menú lateral persistente y barra de navegación superior.
- **Dashboard**: Página de bienvenida con resúmenes visuales.
- **Gestión de Productos**: Funcionalidad CRUD (Crear, Leer, Actualizar, Eliminar) completa para los productos.
- **Punto de Venta (POS)**: Interfaz para seleccionar productos, añadirlos a un carrito, modificar cantidades y registrar la venta.
- **Búsqueda en Tiempo Real**: Filtrado instantáneo de productos en el catálogo.
- **Validación de Stock**: La interfaz previene vender más productos de los que hay disponibles.

---

## Cómo Empezar

### Instalación y Ejecución
1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    ```
2.  **Navegar a la carpeta del frontend:**
    ```bash
    cd tu-repositorio/frontend
    ```
3.  **Instalar dependencias:**
    ```bash
    npm install
    ```
4.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `frontend` y añade la siguiente variable apuntando a la URL de tu backend:
    ```
    REACT_APP_API_URL=http://localhost:5000
    ```
5.  **Iniciar la aplicación:**
    ```bash
    npm start
    ```
La aplicación se abrirá en `http://localhost:3000`.
