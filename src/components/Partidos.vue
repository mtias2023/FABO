<template>
  <div class="fondo-limitado mx-auto py-8">
    <div class="w-full max-w-3x1 mx-auto p-6 bg-white shadow-md rounded-lg" id="partido">
      <h1 class="text-2xl text-cyan-500 font-bold mb-6">Partidos disponibles</h1>

      <!-- Botón para obtener ubicación en la esquina superior derecha -->
      <button @click="obtenerUbicacionUsuario"
        class=" border-2 border-blue-500 text-white bg-blue-500 rounded p-2 hover:bg-transparent hover:text-black transition md:top-6 md:right-6">
        <i class="fa-solid fa-location-dot"></i>
        <span class="hidden md:inline ml-2">Obtener ubicación</span>
      </button>

      <!-- Componente Loader mientras los partidos están cargando -->
      <Loader v-if="cargando" />

      <div v-else>
        <!-- Mostrar ubicación del usuario -->
        <p v-if="ubicacionUsuario" class="text-gray-600 flex items-center">
          <i class="fas fa-map-marker-alt mr-2"></i>
          Tu ubicación: {{ ubicacionUsuario.direccion }}
        </p>

        <!-- Filtros -->
        <div class="mt-4 space-y-4 bg-white p-4 rounded-lg shadow-md">
          <!-- Filtro por deporte -->
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-1">Filtro por deporte:</label>
            <select v-model="filtroDeporte"
              class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="futbol">Fútbol</option>
              <option value="basquet">Básquet</option>
              <option value="tenis">Tenis</option>
            </select>
          </div>

          <!-- Filtro por cercanía con toggle switch -->
          <div class="flex items-center space-x-3">
            <label class="text-lg text-gray-700">Mostrar solo cercanos</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="filtroCercania" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-500 
               after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 
               after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5">
              </div>
            </label>
          </div>
        </div>


        <div v-if="partidosFiltrados.length" class="mt-6 space-y-4">
          <div v-for="partido in partidosFiltrados" :key="partido.id" class="border p-4 rounded shadow-sm">
            <div
              class="w-full h-[17rem] sm:h-[10rem] md:h-[20rem] lg:h-[35rem] relative rounded overflow-hidden mb-4 bg-gray-100">
              <!-- Se muestra la imagen del partido según el deporte -->
              <img :src="`/img/${partido.imagen}`" alt="Imagen del partido"
                class="absolute inset-0 w-full h-full object-cover" />
            </div>

            <h2 class="text-xl font-semibold mb-2">
              <i v-if="partido.deporte === 'futbol'" class="fas fa-futbol mr-2"></i>
              <i v-else-if="partido.deporte === 'basquet'" class="fas fa-basketball-ball mr-2"></i>
              <i v-else-if="partido.deporte === 'tenis'" class="fas fa-table-tennis mr-2"></i>{{ partido.nombre }}
            </h2>

            <p class="text-gray-600 flex items-center mb-2">
              <i class="fas fa-user-circle mr-2"></i>
              Organizado por<span class="font-medium">: {{ partido.organizadoPor }}</span>
            </p>

            <p class="text-gray-500 flex items-center mb-2">
              <i class="fas fa-calendar-alt mr-3"></i>
              {{ formatoFechaHora(partido.fechaHora) }}
            </p>

            <p class="text-gray-500 flex items-center mb-2">
              <i class="fas fa-dollar-sign mr-4"></i>
              ${{ partido.precio }}
            </p>

            <p class="text-gray-500 flex items-center mb-2">
              <i class="fas fa-map-marker-alt mr-3"></i>
              {{ abreviarDireccion(partido.direccion) }}
            </p>

            <p class="text-gray-500 flex items-center mb-2">
              <i class="fas fa-users mr-1"></i>
              Lugares disponibles: {{ partido.lugaresDisponibles }}
            </p>

            <div class="flex space-x-2">
              <!-- Botón "Ver más" -->
              <router-link :to="{ name: 'Jugadores', params: { id: partido.id } }"
                class="items-center justify-center border-2 border-blue-500 text-white bg-blue-500 rounded px-1 py-2 hover:bg-transparent hover:text-black transition text-center">
                Ver más
              </router-link>

              <!-- Botón "Unirse al partido" -->
              <button v-if="partido.lugaresDisponibles >= 1" @click="unirseAPartido(partido)"
                class="items-center justify-center border-2 border-cyan-500 text-white bg-cyan-500 rounded px-1 py-2 hover:bg-transparent hover:text-black transition text-center">
                Unirse al partido
              </button>
              <p class="items-center justify-center border-2 border-cyan-500 text-white bg-cyan-500 rounded px-1 py-1 transition text-center"
                v-else>No hay lugares disponibles</p>
            </div>

          </div>
        </div>

        <!-- Mensaje cuando no hay partidos -->
        <p v-else class="text-gray-500 mt-6">No hay partidos disponibles.</p>

        <!-- Modal de confirmación de unión -->
        <div v-if="modalVisible" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white p-6 rounded-lg max-w-md">
            <h2 class="text-xl font-semibold mb-4">Te has unido al partido</h2>
            <!-- Detalles del partido -->
            <p class="text-gray-500 mb-1">Nombre: {{ partidoUnido.nombre }}</p>
            <p class="text-gray-500 mb-1">Organizado por: {{ partidoUnido.organizadoPor }}</p>
            <p class="text-gray-500 mb-1">Fecha y hora: {{ formatoFechaHora(partidoUnido.fechaHora) }}</p>
            <p class="text-gray-500 mb-1">Precio: ${{ partidoUnido.precio }}</p>

            <!-- Botones -->
            <div class="mt-4">
              <button @click="abrirModalPago" class="bg-blue-500 text-white rounded p-2 mr-2">Pagar ahora</button>
              <button @click="cerrarModal" class="bg-gray-500 text-white rounded p-2">Cerrar</button>
            </div>
          </div>
        </div>

        <!-- Modal de pago -->
        <div v-if="modalPagoVisible" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white p-6 rounded-lg max-w-md">
            <h2 class="text-xl font-semibold mb-4">Formulario de Pago</h2>
            <form @submit.prevent="procesarPago">
              <div class="mb-4">
                <label class="block text-gray-700">Nombre del titular:</label>
                <input type="text" v-model="formPago.nombreTitular" required
                  class="w-full border border-gray-300 rounded p-2" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Número de tarjeta:</label>
                <input type="text" v-model="formPago.numeroTarjeta" required
                  class="w-full border border-gray-300 rounded p-2" />
              </div>
              <div class="flex gap-4">
                <div class="mb-4">
                  <label class="block text-gray-700">Fecha de expiración:</label>
                  <input type="text" v-model="formPago.fechaExpiracion" placeholder="MM/YY" required
                    class="w-full border border-gray-300 rounded p-2" />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700">CVV:</label>
                  <input type="text" v-model="formPago.cvv" required
                    class="w-full border border-gray-300 rounded p-2" />
                </div>
              </div>
              <div class="mt-4">
                <button type="submit" class="bg-green-500 text-white rounded p-2 mr-2">Confirmar pago</button>
                <button @click="cerrarModalPago" class="bg-gray-500 text-white rounded p-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, onSnapshot, updateDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2';
import Loader from './Loader.vue';

export default {
  components: {
    Loader,
  },
  setup() {
    const db = getFirestore();
    const partidos = ref([]); // Lista de partidos obtenidos desde Firebase
    const ubicacionUsuario = ref(null); // Ubicación actual del usuario
    const cargando = ref(true); // Estado de carga
    const filtroDeporte = ref(""); // Filtro por deporte
    const filtroCercania = ref(false); // Filtro por cercanía
    const modalVisible = ref(false);
    const partidoUnido = ref(null); // Partido al que el usuario se unió

    // Objeto que asocia el deporte con su imagen (en formato webp)
    const imagenesDeportes = {
      futbol: "futbol.webp",
      basquet: "basquet.webp",
      tenis: "tenis.webp"
    };

    // Cargar los partidos desde Firebase
    const cargarPartidos = () => {
      const partidosCollection = collection(db, "partidos");
      onSnapshot(partidosCollection, (snapshot) => {
        partidos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cargando.value = false;
      });
    };

    // Computed para filtrar los partidos y asignar la imagen según su deporte
    const partidosFiltrados = computed(() => {
      return partidos.value
        .filter((partido) => {
          const cumpleDeporte = filtroDeporte.value ? partido.deporte === filtroDeporte.value : true;
          const cumpleCercania = filtroCercania.value
            ? calcularDistancia(ubicacionUsuario.value, partido.ubicacion) <= 10
            : true;
          return cumpleDeporte && cumpleCercania;
        })
        .map((partido) => ({
          ...partido,
          imagen: imagenesDeportes[partido.deporte] || "default.webp"
        }))
        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)); // Ordenar por fecha ascendente
    });

    // Obtener la ubicación del usuario
    const obtenerUbicacionUsuario = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            ubicacionUsuario.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            await obtenerDireccion(ubicacionUsuario.value.lat, ubicacionUsuario.value.lng);
          },
          (error) => {
            console.error("Error al obtener ubicación:", error);
            Swal.fire('Error', 'No se pudo obtener la ubicación. Activa el GPS.', 'error');
          }
        );
      } else {
        Swal.fire('Error', 'Geolocalización no soportada.', 'error');
      }
    };

    // Obtener dirección desde coordenadas
    const obtenerDireccion = async (lat, lng) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.address) {
          const { road, city, country } = data.address;
          ubicacionUsuario.value.direccion = `${road || ''}, ${city || ''}, ${country || ''}`.trim();
        } else {
          Swal.fire('Error', 'No se pudo obtener la dirección.', 'error');
        }
      } catch (error) {
        console.error("Error al intentar obtener la dirección:", error);
        Swal.fire('Error', 'Ocurrió un error al intentar obtener la dirección.', 'error');
      }
    };

    // Calcular la distancia entre dos ubicaciones
    const calcularDistancia = (ubicacion1, ubicacion2) => {
      if (!ubicacion1 || !ubicacion2) return Infinity;
      const R = 6371;
      const dLat = (ubicacion2.lat - ubicacion1.lat) * Math.PI / 180;
      const dLng = (ubicacion2.lng - ubicacion1.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(ubicacion1.lat * Math.PI / 180) * Math.cos(ubicacion2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Formatear fecha y hora 
    const formatoFechaHora = (fechaHora) => {
      const fecha = new Date(fechaHora);
      return fecha.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
    };

    // Abreviar dirección 
    const abreviarDireccion = (direccion) => direccion?.split(',').slice(0, 2).join(', ') || "Dirección desconocida";

    // Unirse a un partido
    const unirseAPartido = async (partido) => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Swal.fire("Error", "Debes iniciar sesión para unirte a un partido.", "error");
        return;
      }

      try {
        const partidoRef = doc(db, "partidos", partido.id);
        const partidoSnap = await getDoc(partidoRef);

        if (!partidoSnap.exists()) {
          Swal.fire("Error", "El partido ya no está disponible.", "error");
          return;
        }

        const partidoData = partidoSnap.data();
        const jugadores = partidoData.jugadores || [];

        // Verificar si el usuario ya está en la lista de jugadores
        const usuarioYaUnido = jugadores.some(jugador => jugador.uid === user.uid);

        if (usuarioYaUnido) {
          Swal.fire("Atención", "Ya estás unido a este partido.", "info");
          return;
        }

        // Si el usuario no está en la lista, proceder a unirlo con su foto de perfil
        await updateDoc(partidoRef, {
          jugadores: arrayUnion({
            uid: user.uid,
            nombre: user.displayName || "Usuario desconocido",
            email: user.email,
            fotoPerfil: user.photoURL, // Imagen por defecto si no tiene foto
          }),
          lugaresDisponibles: partidoData.lugaresDisponibles - 1
        });

        Swal.fire("Éxito", "Te has unido al partido.", "success");

      } catch (error) {
        console.error("Error al unirse al partido:", error);
        Swal.fire("Error", "No se pudo unir al partido.", "error");
      }
    };

    const modalPagoVisible = ref(false); // Controla la visibilidad del modal de pago
    const formPago = ref({ nombreTitular: '', numeroTarjeta: '', fechaExpiracion: '', cvv: '' });

    const abrirModalPago = () => {
      modalVisible.value = false; // Cierra el modal de confirmación
      modalPagoVisible.value = true; // Abre el modal de pago
    };

    const cerrarModalPago = () => {
      modalPagoVisible.value = false;
    };

    const procesarPago = () => {
      // Simulación del proceso de pago
      Swal.fire('Pago exitoso', `El pago para el partido "${partidoUnido.value.nombre}" se ha realizado.`, 'success');
      cerrarModalPago();
    };

    // Cerrar el modal
    const cerrarModal = () => {
      modalVisible.value = false;
      partidoUnido.value = null;
    };
    onMounted(() => {
      cargarPartidos();
    });

    return {
      partidosFiltrados,
      obtenerUbicacionUsuario,
      ubicacionUsuario,
      filtroDeporte,
      filtroCercania,
      unirseAPartido,
      formatoFechaHora,
      abreviarDireccion,
      modalVisible,
      partidoUnido,
      modalPagoVisible,
      formPago,
      abrirModalPago,
      cerrarModalPago,
      procesarPago,
      cerrarModal,
      cargando
    };
  },
};
</script>

<style scoped>
.fondo-limitado {
  max-width: 950px;
  background-color: #f7fafc;
  box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
  padding: 2rem;
  border-radius: 15px;
}

#partido {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
}

h1 {
  font-size: 1.6rem;
}

/* Ajustes para dispositivos móviles */
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  .text-lg {
    font-size: 0.9rem;
  }

  .text-xl {
    font-size: 1rem;
  }

  .text-gray-600,
  .text-gray-500 {
    font-size: 0.875rem;
  }

  button {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }

  .w-full {
    width: 100%;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .mt-6 {
    margin-top: 1.5rem;
  }

  .space-y-4 {
    gap: 1rem;
  }
}
</style>
