<template>
  <div class="p-4 bg-white rounded-lg shadow-md w-full sm:w-96 relative">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Notificaciones</h2>
      <button @click="$emit('cerrar')"
        class="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-800 transition">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

    </div>

    <ul v-if="notificaciones.length">
      <li v-for="notificacion in notificaciones" :key="notificacion.id"
        class="p-3 border-b flex justify-between items-center cursor-pointer relative"
        :class="{ 'bg-gray-100': !notificacion.leido }" @click="manejarNotificacion(notificacion)">

        <span class="flex-1">{{ notificacion.mensaje }}</span>

        <button v-if="!notificacion.leido" class="text-blue-600 text-sm mr-2">
          Marcar como leída
        </button>

        <button @click.stop="eliminarNotificacion(notificacion.id)" class="text-red-500 text-lg font-bold">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>

    <p v-else class="text-gray-500 text-center">No tenes notificaciones.</p>
  </div>
</template>

<script>
import { getFirestore, collection, query, where, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      notificaciones: [],
    };
  },
  async created() {
    const auth = getAuth();
    const usuario = auth.currentUser;
    if (!usuario) return;

    const db = getFirestore();
    const q = query(collection(db, 'notificaciones'), where('usuarioId', '==', usuario.uid));

    onSnapshot(q, (snapshot) => {
      this.notificaciones = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    });
  },
  methods: {
    async manejarNotificacion(notificacion) {
      if (notificacion.remitenteId) {
        await this.redirigirAlChat(notificacion);
      } else if (notificacion.mensaje.includes('se ha unido al partido')) {
        await this.redirigirAPartidos();
      }
    },
    async redirigirAlChat(notificacion) {
      if (!notificacion.remitenteId) {
        console.error('La notificación no tiene remitenteId');
        return;
      }

      try {
        const db = getFirestore();
        const remitenteRef = doc(db, 'usuarios', notificacion.remitenteId);
        const remitenteSnap = await getDoc(remitenteRef);

        let remitenteNombre = 'Usuario';
        if (remitenteSnap.exists() && remitenteSnap.data().username) {
          remitenteNombre = remitenteSnap.data().username;
        }

        await this.marcarComoLeida(notificacion.id);

        this.$router.push({
          name: 'ChatPrivado',
          params: {
            destinatarioId: notificacion.remitenteId,
            destinatarioNombre: remitenteNombre,
          }
        });
      } catch (error) {
        console.error('Error al obtener el remitente:', error);
      }
    },
    async redirigirAPartidos() {
      await this.marcarComoLeida();

      this.$router.push('/partidos');
    },
    async marcarComoLeida(notificacionId) {
      try {
        const db = getFirestore();
        const notificacionRef = doc(db, 'notificaciones', notificacionId);
        await updateDoc(notificacionRef, { leido: true });
      } catch (error) {
        console.error('Error al marcar como leída la notificación:', error);
      }
    },
    async eliminarNotificacion(notificacionId) {
      try {
        const db = getFirestore();
        const notificacionRef = doc(db, 'notificaciones', notificacionId);
        await deleteDoc(notificacionRef);
        console.log(`Notificación ${notificacionId} eliminada.`);
      } catch (error) {
        console.error('Error al eliminar la notificación:', error);
      }
    }
  },
};
</script>
