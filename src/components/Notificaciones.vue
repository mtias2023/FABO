<template>
  <div class="p-4 bg-white rounded-lg shadow-md w-full sm:w-96 relative">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Notificaciones</h2>
      <button @click="$emit('cerrar')" class="text-gray-500 hover:text-red-600">
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>
    </div>

    <ul v-if="notificaciones.length">
      <li v-for="notificacion in notificaciones" :key="notificacion.id"
        class="p-3 border-b flex justify-between items-center cursor-pointer relative"
        :class="{ 'bg-gray-100': !notificacion.leido }" @click="redirigirAlChat(notificacion)">

        <span class="flex-1">{{ notificacion.mensaje }}</span>

        <button v-if="!notificacion.leido" class="text-blue-600 text-sm mr-2">
          Marcar como leída
        </button>

        <button @click.stop="eliminarNotificacion(notificacion.id)" class="text-red-500 text-lg font-bold">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </ul>

    <p v-else class="text-gray-500 text-center">No tienes notificaciones.</p>
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

        // Marcar la notificación como leída
        const notificacionRef = doc(db, 'notificaciones', notificacion.id);
        await updateDoc(notificacionRef, { leido: true });

        // Redirigir al chat privado con los datos correctos
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
