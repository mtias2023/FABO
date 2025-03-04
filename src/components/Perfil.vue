<template>
  <div class="fondo-perfil mx-auto py-8 relative">
    <div class="perfil p-6 bg-white rounded-lg shadow-lg relative">
      <router-link to="/"
        class="absolute top-[15px] md:top-[-10px] left-[15px] md:left-[-25px] bg-blue-500 text-white font-semibold py-3 px-3 md:px-2 md:py-2 rounded-md shadow-md hover:bg-blue-600 transition flex items-center transform -translate-x-2 -translate-y-2">
        <i class="fas fa-arrow-left"></i>
        <span class="hidden md:inline ml-2">Volver</span>
      </router-link>

      <!-- Botón de cambio de contraseña -->
      <button @click="toggleModal"
        class="absolute top-2 right-2 w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-cyan-500 hover:text-white transition duration-300 shadow-md">
        <i class="fa-solid fa-lock text-lg"></i>
      </button>

      <Loader v-if="cargando" />

      <div v-else>
        <!-- Contenedor de imagen de perfil y datos del usuario -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div class="perfil-imagen">
            <img v-if="userPhotoURL" :src="userPhotoURL" alt="Foto de perfil"
              class="rounded-full w-24 h-24 object-cover border-4 border-cyan-400 shadow-md">
            <p v-else class="text-gray-500">Sin foto de perfil</p>
          </div>
          <div class="text-center sm:text-left">
            <p class="text-lg font-semibold text-gray-800">Nombre: <span class="font-medium">{{ userName }}</span></p>
            <p class="text-gray-600 text-sm">Email: <span class="font-medium">{{ userEmail }}</span></p>
          </div>
        </div>

        <button @click="toggleEditar"
          class="border border-cyan-400 text-white bg-cyan-500 rounded p-3 hover:bg-transparent hover:text-black transition px-4 py-2 sm:px-4 sm:py-2 sm:text-base mt-2">
          <i class="fa fa-edit mr-2"></i>
          {{ mostrarFormulario ? 'Cancelar Edición' : 'Editar Perfil' }}
        </button>

        <div v-if="mostrarFormulario" class="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 class="text-x2 sm:text-lg font-semibold mb-4 text-center text-cyan-500">Editar perfil</h2>
          <form @submit.prevent="actualizarDatos">
            <div class="mb-4">
              <label for="nombre" class="block text-sm sm:text-base font-medium text-gray-700">Nuevo nombre:</label>
              <input v-model="newName" type="text" id="nombre"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
            </div>

            <!-- Input para la imagen de perfil -->
            <div class="mb-4">
              <label for="foto" class="block text-sm sm:text-base font-medium text-gray-700">Nueva foto de
                perfil:</label>
              <input type="file" @change="onFileChange" id="foto"
                class="mt-1 block w-full text-sm sm:text-base focus:outline-none">
            </div>

            <button type="submit"
              class="bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-blue-600 text-sm sm:text-base w-auto mx-auto ">
              Guardar cambios
            </button>
          </form>
        </div>

        <!-- Sección para completar el perfil con encuesta -->
        <button v-if="!perfilCompleto" @click="mostrarModal = true"
          class="border border-blue-500 text-white bg-blue-600 rounded p-3 hover:bg-transparent hover:text-black transition px-4 py-2 sm:px-4 sm:py-2 sm:text-base mt-4 mx-4">
          Completar perfil
        </button>

        <!-- Modal Cambio de Contraseña -->
        <div v-if="mostrarModalPassword"
          class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button @click="toggleModal"
              class="absolute top-2 left-2 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition duration-300 shadow-md">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>

            <h2 class="text-lg font-semibold text-center text-cyan-500 mb-4">Cambiar contraseña</h2>
            <form @submit.prevent="cambiarContrasena">
              <div class="mb-4 relative">
                <label for="currentPassword" class="block text-sm font-medium text-gray-700">Contraseña actual:</label>
                <input :type="mostrarPasswordActual ? 'text' : 'password'" v-model="currentPassword"
                  id="currentPassword"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 focus:ring-2 focus:ring-cyan-400">
                <button type="button" @click="toggleMostrarPasswordActual"
                  class="absolute top-1/2 right-3 transform -translate-y-1 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-cyan-500 hover:text-white transition duration-300 shadow-md">
                  <i :class="mostrarPasswordActual ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>

              <div class="mb-4 relative">
                <label for="newPassword" class="block text-sm font-medium text-gray-700">Nueva contraseña:</label>
                <input :type="mostrarPassword ? 'text' : 'password'" v-model="newPassword" id="newPassword"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 focus:ring-2 focus:ring-cyan-400">
                <button type="button" @click="toggleMostrarPassword"
                  class="absolute top-1/2 right-3 transform -translate-y-1 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-cyan-500 hover:text-white transition duration-300 shadow-md">
                  <i :class="mostrarPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>

              <div class="flex justify-end">
                <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Cambiar
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Encuesta -->
        <div v-if="mostrarModal" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div class="relative bg-white p-6 rounded-lg shadow-lg w-96">

            <!-- Botón de Cierre con Cruz -->
            <button @click="mostrarModal = false"
              class="absolute top-2 left-2 w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition duration-300 shadow-md">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>

            <h2 class="text-xl font-semibold text-cyan-500 mb-4 text-center">Completa tu perfil</h2>
            <form @submit.prevent="guardarEncuesta">

              <!-- Selección de Deporte -->
              <div class="mb-4">
                <label for="deporte" class="block text-sm sm:text-base font-medium text-gray-700">Deporte
                  favorito:</label>
                <select v-model="encuesta.deporte" @change="actualizarPosiciones" id="deporte" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="" disabled selected>Selecciona un deporte</option>
                  <option value="Fútbol">Fútbol</option>
                  <option value="Básquet">Básquet</option>
                  <option value="Tenis">Tenis</option>
                </select>
              </div>

              <!-- Selección de Nivel de Juego -->
              <div class="mb-4">
                <label for="nivel" class="block text-sm sm:text-base font-medium text-gray-700">Nivel de juego:</label>
                <select v-model="encuesta.nivel" id="nivel" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="" disabled selected>Selecciona tu nivel</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <!-- Selección de Posición -->
              <div class="mb-4">
                <label for="posicion" class="block text-sm sm:text-base font-medium text-gray-700">Posición en el
                  deporte:</label>
                <select v-model="encuesta.posicion" id="posicion" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="" disabled selected>Selecciona una posición</option>
                  <option v-for="pos in posiciones" :key="pos" :value="pos">{{ pos }}</option>
                </select>
              </div>

              <!-- Descripción personal -->
              <div class="mb-4">
                <label for="descripcion" class="block text-sm sm:text-base font-medium text-gray-700">Descripción
                  personal:</label>
                <textarea v-model="encuesta.descripcion" id="descripcion" required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400"></textarea>
              </div>

              <!-- Botón Guardar -->
              <button type="submit"
                class="bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-blue-600 text-sm sm:text-base w-auto mx-auto block">
                Guardar respuestas
              </button>
            </form>
          </div>
        </div>

        <!-- Mostrar respuestas de la encuesta si ya han sido guardadas -->
        <div class="mt-2">
          <!-- Datos de la Encuesta -->
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Detalles del perfil</h3>
          <div v-if="encuesta"
            class="mt-2 bg-cyan-100 p-6 rounded-lg shadow-md border border-cyan-200">
            <div class="grid grid-cols-2 gap-3 text-gray-700">
              <p><span class="font-medium">Deporte favorito:</span> {{ encuesta.deporte }}</p>
              <p><span class="font-medium">Nivel:</span> {{ encuesta.nivel }}</p>
              <p><span class="font-medium">Posición:</span> {{ encuesta.posicion }}</p>
            </div>
            <p class="mt-3 italic text-gray-600">{{ encuesta.descripcion }}</p>
          </div>
          <p v-else class="text-gray-500 mt-2 mb-4 text-center">No hay datos disponibles.</p>
          <button @click="mostrarModal = true" class="mt-2 text-cyan-500 font-semibold hover:underline">Editar
            respuestas</button>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="text-xl sm:text-lg font-semibold mb-4 text-cyan-500">Mis publicaciones</h2>
      <div v-for="publicacion in publicaciones" :key="publicacion.id"
        class="mb-6 p-6 border border-gray-200 rounded-lg shadow-md text-sm sm:text-base hover:shadow-xl transition">
        <h3 class="text-lg sm:text-base font-semibold">{{ publicacion.titulo }}</h3>
        <p class="text-gray-700 text-sm sm:text-base">{{ publicacion.contenido }}</p>
        <img v-if="publicacion.imagenUrl" :src="publicacion.imagenUrl" alt="Imagen de la publicación"
          class="mt-2 w-full h-auto rounded-md">
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { getAuth, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from './Loader.vue';

export default {
  components: {
    Loader
  },
  data() {
    return {
      userName: '',
      userEmail: '',
      userPhotoURL: '',
      newName: '',
      newPhoto: null,
      publicaciones: [],
      mostrarFormulario: false,
      cargando: false,
      encuesta: {
        deporte: "",
        nivel: "",
        posicion: "",
        descripcion: "",
      },
      posiciones: [],
      encuestaGuardada: false,
      mostrarModal: false,
      mostrarModalPassword: false,
      mostrarPassword: false,
      mostrarPasswordActual: false,
      perfilCompleto: false // Nueva propiedad para controlar la visibilidad del botón
    };
  },
  async mounted() {
    if (this.encuesta.deporte) {
      this.cargarPosiciones();
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      this.userName = user.displayName || "Sin nombre";
      this.userEmail = user.email;
      this.userPhotoURL = user.photoURL;
      this.newName = user.displayName;
      await this.obtenerMisPublicaciones(user.uid);
      await this.obtenerEncuesta(user.uid); // Verifica si ya completó la encuesta
    }
  },
  methods: {
    toggleEditar() {
      this.mostrarFormulario = !this.mostrarFormulario;
    },
    toggleModal() {
      this.mostrarModalPassword = !this.mostrarModalPassword;
    },
    toggleMostrarPassword() {
      this.mostrarPassword = !this.mostrarPassword;
    },
    toggleMostrarPasswordActual() {
      this.mostrarPasswordActual = !this.mostrarPasswordActual;
    },
    async obtenerMisPublicaciones(uid) {
      const db = getFirestore();
      const publicacionesRef = collection(db, "publicaciones");
      const q = query(publicacionesRef, where("userId", "==", uid));
      const publicacionesSnapshot = await getDocs(q);
      this.publicaciones = publicacionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    actualizarPosiciones() {
      const posicionesPorDeporte = {
        Fútbol: ["Delantero", "Mediocampista", "Defensor", "Arquero"],
        Básquet: ["Base", "Escolta", "Alero", "Ala-Pívot", "Pívot"],
        Tenis: ["Individual", "Dobles", "Dobles Mixto"],
      };

      this.posiciones = posicionesPorDeporte[this.encuesta.deporte] || [];
      this.encuesta.posicion = ""; // Reinicia la selección de posición
    },
    async obtenerEncuesta(uid) {
      const db = getFirestore();
      const encuestaRef = doc(db, "encuestas", uid);
      const encuestaDoc = await getDoc(encuestaRef);

      if (encuestaDoc.exists()) {
        this.encuesta = encuestaDoc.data();
        this.encuestaGuardada = true;
        this.perfilCompleto = true; // Oculta el botón si ya completó la encuesta
      }
    },
    onFileChange(event) {
      this.newPhoto = event.target.files[0];
    },
    async actualizarDatos() {
      this.cargando = true;
      const auth = getAuth();
      const user = auth.currentUser;
      const updates = {};

      try {
        if (this.newName && this.newName !== user.displayName) {
          updates.displayName = this.newName;
        }

        if (this.newPhoto) {
          const storage = getStorage();
          const storageRef = ref(storage, `perfil/${user.uid}/${this.newPhoto.name}`);
          await uploadBytes(storageRef, this.newPhoto);
          updates.photoURL = await getDownloadURL(storageRef);
        }

        await updateProfile(user, updates);
        this.userName = updates.displayName || this.userName;
        this.userPhotoURL = updates.photoURL || this.userPhotoURL;

        this.mostrarFormulario = false;

        Swal.fire({
          title: '¡Perfil actualizado!',
          text: 'Los cambios se guardaron correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000
        });

      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `No se pudo actualizar el perfil: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      } finally {
        this.cargando = false;
      }
    },
    async guardarEncuesta() {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const encuestaRef = doc(db, "encuestas", user.uid);

      try {
        await setDoc(encuestaRef, this.encuesta);
        this.encuestaGuardada = true;
        this.perfilCompleto = true; // Oculta el botón después de guardar
        this.mostrarModal = false;

        Swal.fire({
          title: '¡Perfil completado!',
          text: 'Gracias por completar tu perfil.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 3000
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `No se pudo guardar la encuesta: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    },
    // Cambiar contraseña
    async cambiarContrasena() {
      const auth = getAuth();
      const user = auth.currentUser;
      this.cargando = true; // Activar loader

      if (!this.currentPassword || !this.newPassword) {
        this.cargando = false;
        return Swal.fire("Error", "Debes completar todos los campos.", "error");
      }

      try {
        const credential = EmailAuthProvider.credential(user.email, this.currentPassword);
        await reauthenticateWithCredential(user, credential);

        if (this.newPassword.length < 6) {
          throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
        }

        await updatePassword(user, this.newPassword);
        this.newPassword = '';
        this.currentPassword = '';

        Swal.fire("Éxito", "Tu contraseña ha sido cambiada con éxito.", "success");
        this.toggleModal();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      } finally {
        this.cargando = false; // Desactivar loader
      }
    },
  }
};
</script>



<style scoped>
.fondo-perfil {
  max-width: 800px;
  background-color: #f7fafc;
  box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
  padding: 2rem;
  border-radius: 0.5rem;
  border-radius: 14px;
}

.perfil {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(201, 243, 254, 0.3);
  border-radius: 0.5rem;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  h2 {
    font-size: 1.2rem;
  }

  button {
    width: auto;
  }
}
</style>
