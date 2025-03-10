<template>
  <div class="fondo mx-auto py-8 relative">
    <router-link to="/partidos"
      class="absolute top-3 left-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition flex items-center">
      <i class="fas fa-arrow-left mr-2"></i>
      Volver
    </router-link>

    <div class="jugadores p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-cyan-500 mb-6">
        <i :class="iconoDeporte"></i>
        {{ partido?.nombre || 'Cargando...' }}
      </h1>

      <div v-if="cargando" class="text-center">
        <Loader />
      </div>

      <div v-else>
        <p class="text-gray-600 mb-4">
          <i class="fas fa-user-circle mr-2"></i>
          Organizado por: <span class="font-medium">{{ partido.organizadoPor }}</span>
        </p>
        <p class="text-gray-600 mb-4">
          <i class="fas fa-calendar-alt mr-2"></i>
          Fecha y hora: {{ formatoFechaHora(partido.fechaHora) }}
        </p>
        <p class="text-gray-600 mb-4">
          <i class="fas fa-map-marker-alt mr-2"></i>
          Ubicación: {{ partido.direccion }}
        </p>

        <p v-if="partido.descripcion" class="text-gray-600 mb-4">
          <i class="fas fa-info-circle mr-2"></i>
          Descripción: {{ partido.descripcion }}
        </p>

        <h2 class="text-xl font-semibold mb-2">Jugadores inscritos:</h2>
        <div class="flex flex-wrap gap-2 mb-4">
          <div v-for="jugador in partido.jugadores" :key="jugador.uid || jugador.id"
            class="flex items-center space-x-2 bg-cyan-100 px-3 py-1 rounded-full shadow-md cursor-pointer"
            @click="abrirPerfil(jugador)">
            <img :src="jugador.fotoPerfil || '/img/user.png'" alt="Foto de perfil"
              class="w-8 h-8 rounded-full object-cover border-2 border-cyan-400">
            <span class="text-cyan-700 text-sm font-semibold hover:underline">{{ jugador.nombre }}</span>
          </div>
        </div>

        <div v-if="!yaInscrito">
          <!-- Bases y condiciones -->
          <div class="bg-white p-4 rounded-lg shadow-md text-gray-700">
            <div class="flex items-center mb-2">
              <i class="fas fa-file-contract text-blue-500 text-lg mr-2"></i>
              <strong class="text-lg">Bases y Condiciones</strong>
            </div>

            <p class="text-blue-500 cursor-pointer font-medium hover:underline transition"
              @click="mostrarBases = !mostrarBases">
              {{ mostrarBases ? 'Ocultar' : 'Ver' }} bases y condiciones
            </p>

            <transition name="fade">
              <div v-if="mostrarBases" class="mt-3 p-3 bg-gray-100 rounded-md text-sm">
                <ul class="list-disc list-inside space-y-1">
                  <li>Estar disponible en la fecha y hora del partido.</li>
                  <li>Respetar a todos los jugadores y al organizador del partido.</li>
                  <li>Confirmar tu asistencia con antelación para una mejor organización.</li>
                </ul>
              </div>
            </transition>

            <div class="mt-4 flex items-center space-x-2">
              <input type="checkbox" id="aceptar" v-model="aceptadas" class="hidden">
              <label for="aceptar" class="flex items-center cursor-pointer text-sm text-gray-600 w-full">
                <div
                  class="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition-all shrink-0"
                  :class="{ 'bg-blue-500 border-blue-500': aceptadas }">
                  <i v-if="aceptadas" class="fas fa-check text-white text-xs"></i>
                </div>
                <span class="ml-2">Acepto las bases y condiciones mencionadas arriba</span>
              </label>
            </div>
          </div>

          <!-- Botón para unirse -->
          <button :disabled="!aceptadas"
            class="w-full bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md mt-4 disabled:bg-gray-400"
            @click="unirseAlPartido">
            Unirme al partido
          </button>
        </div>
        <p v-else class="text-green-500 font-semibold">¡Te has unido al partido!</p>

        <!-- Modal de perfil -->
        <PerfilModal :jugador="jugadorSeleccionado" :mostrar="mostrarPerfil" @cerrar="cerrarPerfil" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, doc, addDoc, serverTimestamp, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';
import Loader from './Loader.vue';
import PerfilModal from './ModalPerfilPartidos.vue';

export default {
  components: { Loader, PerfilModal },
  props: ['id'],
  setup(props) {
    const db = getFirestore();
    const partido = ref(null);
    const cargando = ref(true);
    const aceptadas = ref(false);
    const yaInscrito = ref(false);
    const mostrarBases = ref(false);
    const jugadorSeleccionado = ref(null);
    const mostrarPerfil = ref(false);

    const iconoDeporte = computed(() => {
      if (!partido.value?.deporte) return '';
      const iconos = {
        futbol: 'fas fa-futbol',
        basquet: 'fas fa-basketball-ball',
        tenis: 'fas fa-table-tennis',
      };
      return iconos[partido.value.deporte.toLowerCase()] || 'fas fa-question-circle';
    });

    const abrirPerfil = (jugador) => {
      jugadorSeleccionado.value = {
        ...jugador,
        fotoPerfil: jugador.fotoPerfil || '/img/user.png' // Asegurar que siempre haya una imagen
      };
      mostrarPerfil.value = true;
    };

    const cerrarPerfil = () => {
      jugadorSeleccionado.value = null;
      mostrarPerfil.value = false;
    };

    const cargarPartido = async () => {
      try {
        const partidoDoc = await getDoc(doc(db, 'partidos', props.id));
        if (partidoDoc.exists()) {
          partido.value = partidoDoc.data();
          const usuario = { id: 'id-usuario' };
          yaInscrito.value = partido.value.jugadores.some(jugador => jugador.id === usuario.id);
        } else {
          console.error('Partido no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar el partido:', error);
      } finally {
        cargando.value = false;
      }
    };

    const formatoFechaHora = (fechaHora) => {
      const fecha = new Date(fechaHora);
      return fecha.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    };

    const unirseAlPartido = async () => {
      if (!aceptadas.value) return;

      const auth = getAuth();
      const user = auth.currentUser;
      const usuarioId = user.uid;
      const nombreUsuario = user.displayName;
      const nombre = partido.value?.nombre || "Partido sin nombre";

      const leido = true

      if (!user) {
        Swal.fire("Error", "Debes iniciar sesión para unirte a un partido.", "error");
        return;
      }

      if (partido.value?.lugaresDisponibles <= 0) {
        Swal.fire("Lo sentimos", "No hay lugares disponibles para este partido.", "error");
        return;
      }

      try {
        const partidoRef = doc(db, 'partidos', props.id);
        const partidoDoc = await getDoc(partidoRef);

        if (partidoDoc.exists()) {
          const datosPartido = partidoDoc.data();

          const yaInscritoEnDB = datosPartido.jugadores && datosPartido.jugadores.some(jugador => jugador.uid === user.uid);
          if (yaInscritoEnDB) {
            Swal.fire({
              icon: 'info',
              title: 'Ya estás inscrito',
              text: 'Ya te encuentras en la lista de jugadores de este partido.',
            });
            yaInscrito.value = true; // ✅ Se actualiza la UI si ya estaba inscrito
            return;
          }

          // Obtener la URL de la foto de perfil o una por defecto
          const photoURL = user.photoURL && user.photoURL.startsWith('http') ? user.photoURL : '/img/user.png';

          // Guardar notificación en Firestore
          await guardarNotificacion(usuarioId, nombre, nombreUsuario, leido);

          // Actualizar el documento en Firestore
          await updateDoc(partidoRef, {
            jugadores: arrayUnion({
              uid: user.uid,
              nombre: user.displayName || 'Usuario desconocido',
              email: user.email,
              fotoPerfil: photoURL, // ✅ Se guarda correctamente la foto de perfil
            }),
            lugaresDisponibles: datosPartido.lugaresDisponibles - 1
          });

          // Actualizar localmente el objeto partido
          if (!datosPartido.jugadores) {
            datosPartido.jugadores = [];
          }
          datosPartido.jugadores.push({
            uid: user.uid,
            nombre: user.displayName || 'Usuario desconocido',
            email: user.email,
            fotoPerfil: photoURL, // ✅ Se mantiene el mismo nombre para consistencia
          });
          datosPartido.lugaresDisponibles -= 1;
          partido.value = { ...datosPartido };

          yaInscrito.value = true; // ✅ Se actualiza la UI para ocultar el botón y términos

          Swal.fire({
            icon: 'success',
            title: '¡Te has unido al partido!',
            text: 'Ahora eres parte de este evento.',
          });
        }
      } catch (error) {
        console.error('Error al unirse al partido:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al unirse',
          text: 'Hubo un error al intentar unirte al partido. Intenta nuevamente.',
        });
      }
    };
    const guardarNotificacion = async (usuarioId, nombre, nombreUsuario, leido) => {
      try {
        await addDoc(collection(db, "notificaciones"), {
          usuarioId,
          nombreUsuario,
          mensaje: `Te uniste a "${nombre}".`,
          timestamp: serverTimestamp(),
          leido,
        });
        console.log("Notificación guardada en Firestore.");
      } catch (error) {
        console.error("Error al guardar la notificación:", error);
      }
    };

    onMounted(cargarPartido);

    return { partido, cargando, formatoFechaHora, aceptadas, unirseAlPartido, mostrarBases, iconoDeporte, jugadorSeleccionado, mostrarPerfil, abrirPerfil, cerrarPerfil };
  },
};
</script>

<style scoped>
.fondo {
  max-width: 800px;
  background-color: #f7fafc;
  box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
  padding: 2rem;
  border-radius: 14px;
}

.jugadores {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(201, 243, 254, 0.3);
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 1.5rem;
}

ul {
  margin-left: 1rem;
}
</style>
