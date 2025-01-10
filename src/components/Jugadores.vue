<template>
    <div class="fondo mx-auto py-8">
      <div class="jugadores p-6 bg-white rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold text-cyan-500 mb-6">{{ partido?.nombre || 'Cargando...' }}</h1>
        
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
  
          <h2 class="text-xl font-semibold mb-4">Jugadores Inscritos:</h2>
          <ul class="list-disc list-inside">
            <li v-for="jugador in partido.jugadores" :key="jugador.id">
              {{ jugador.nombre }} ({{ jugador.email }})
            </li>
          </ul>
  
          <!-- Bases y condiciones -->
          <div class="text-gray-600 mb-4">
            <p><strong>BASES Y CONDICIONES:</strong></p>
            <p class="mb-2 text-blue-400" @click="mostrarBases = !mostrarBases">
              {{ mostrarBases ? 'Ocultar' : 'Ver' }} bases y condiciones
            </p>
  
            <div v-if="mostrarBases">
              <ul class="list-disc ml-6 mb-4">
                <li>Estar disponible en la fecha y hora del partido.</li>
                <li>Respetar a todos los jugadores y al organizador del partido.</li>
                <li>Confirmar tu asistencia con antelación para una mejor organización.</li>
              </ul>
            </div>
  
            <input 
              type="checkbox" 
              v-model="aceptadas" 
              class="mr-2"
              :disabled="!mostrarBases"
            />
            <label>
              Acepto las bases y condiciones mencionadas arriba
            </label>
          </div>
  
          <!-- Botón para unirse -->
          <button 
            :disabled="!aceptadas"
            class="w-full bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md mt-4 disabled:bg-gray-400"
            @click="unirseAlPartido"
          >
            Unirme al partido
          </button>
        
          <router-link 
            to="/partidos"
            class="text-amber-500 font-semibold hover:underline mt-5 text-sm sm:text-base "
          >
            Volver a la lista de partidos
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
  import Swal from 'sweetalert2';
  import Loader from './Loader.vue';
  
  export default {
    components: { Loader },
    props: ['id'],
    setup(props) {
      const db = getFirestore();
      const partido = ref(null);
      const cargando = ref(true);
      const aceptadas = ref(false);
      const mostrarBases = ref(false);
  
      const cargarPartido = async () => {
        try {
          const partidoDoc = await getDoc(doc(db, 'partidos', props.id));
          if (partidoDoc.exists()) {
            partido.value = partidoDoc.data();
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
  
        try {
          const usuario = {
            nombre: 'Nombre del Usuario', 
            email: 'usuario@ejemplo.com',
            id: 'id-usuario',
          };
  
          const partidoRef = doc(db, 'partidos', props.id);
          const partidoDoc = await getDoc(partidoRef);
          
          if (partidoDoc.exists()) {
            const datosPartido = partidoDoc.data();
  
            const yaInscrito = datosPartido.jugadores.some(jugador => jugador.id === usuario.id);
            if (yaInscrito) {
              Swal.fire({
                icon: 'info',
                title: 'Ya estás inscrito',
                text: 'Ya te encuentras en la lista de jugadores de este partido.',
              });
              return;
            }
  
            datosPartido.jugadores.push(usuario);
  
            await updateDoc(partidoRef, { jugadores: datosPartido.jugadores });
  
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
  
      onMounted(cargarPartido);
  
      return { partido, cargando, formatoFechaHora, aceptadas, unirseAlPartido, mostrarBases };
    },
  };
  </script>
  
  
  <style scoped>
  .fondo {
    max-width: 800px; 
    background-color: #f7fafc;
    box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
    padding: 2rem; 
    border-radius: 0.5rem;
    border-radius: 14px;
  }
  
  .jugadores {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(201, 243, 254, 0.3); 
    border-radius: 0.5rem; 
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
  