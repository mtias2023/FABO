# Proyecto: FABO - Comunidad Deportiva

FABO es una aplicación web diseñada para facilitar la conexión entre aficionados al deporte. Permite a los usuarios compartir experiencias, organizar y participar en partidos deportivos, y comunicarse a través de chats públicos y privados. El objetivo principal es fomentar la interacción y la organización deportiva en una comunidad dinámica y accesible.

---

## Funcionalidades Principales

### **1. Comunidad**
- Los usuarios pueden:
  - **Publicar experiencias** relacionadas con su deporte favorito.
  - **Editar y eliminar publicaciones** creadas por ellos mismos.
  - **Comentar publicaciones** de otros usuarios.
  - **Eliminar y editar comentarios** propios.

---

### **2. Crear Partidos**
- A través de un formulario, los usuarios pueden:
  - Definir la ubicación del partido.
  - Seleccionar el deporte.
  - Establecer la cantidad de participantes necesarios.
  - Indicar el precio de participación.
  - Fijar la fecha y hora.
  - Especificar quién organiza el partido.

---

### **3. Sesión de Partidos**
- Funcionalidades avanzadas:
  - **Obtener ubicación actual** del usuario para facilitar la organización y búsqueda.
  - **Filtros disponibles**:
    - Por cercanía.
    - Por deporte.
    - Por ubicación específica.
  - **Visualización de partidos disponibles**, con detalles completos.
  - Posibilidad de:
    - **Unirse a un partido**.
    - **Pagar** por el partido inmediatamente o dejarlo para después.

---

### **4. Perfil de Usuario**
- En esta sección, los usuarios pueden:
  - Ver y editar su información personal.
  - Revisar los partidos a los que están inscritos o que han organizado.

---

### **5. Chat**
- **Chat Público**: Un espacio donde toda la comunidad puede interactuar, compartir ideas y resolver dudas.
- **Chat Privado**: Comunicación directa entre dos usuarios para coordinar detalles o interactuar de forma privada.

---

## 🛠 Tecnologías Utilizadas

### **Frontend**
- **Vue.js 3**: Framework para la construcción de interfaces dinámicas.
- **TailwindCSS**: Framework para estilos rápidos y responsivos.
- **JavaScript (ES6)**: Lógica del cliente.
- **HTML5 y CSS3**: Estructura y diseño.

### **Backend**
- **Firebase**:
  - Firestore: Base de datos en tiempo real para almacenar publicaciones, comentarios y partidos.
  - Firebase Authentication: Gestión de usuarios.
- **Google Maps API**: Para manejo de ubicaciones.

### **Otros**
- **SweetAlert2**: Alertas personalizables y modernas.
- **Day.js**: Manejo de fechas y horas.
- **Axios**: Peticiones HTTP.

---

## Instalación
- Inicia el servidor de desarrollo con: npm run serve

