<template>
  <div class="relative p-4 bg-gray-100 rounded-lg shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto h-full">

    <!-- Botón Volver -->
    <router-link to="/"
      class="absolute top-1 left-1 bg-blue-500 text-white font-semibold py-2 px-3 rounded-md shadow-md hover:bg-blue-600 transition flex items-center">
      <i class="fas fa-arrow-left"></i>
      <span class="hidden md:inline ml-2">Volver</span>
    </router-link>

    <!-- Título del chat -->
    <h1 class="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4">
      Chat Privado con: {{ destinatarioNombre }}
    </h1>

    <!-- Mensajes -->
    <div v-if="conversacionActual.length" class="overflow-y-auto bg-white p-4 rounded-lg max-h-[500px]">
      <div v-for="mensaje in conversacionActual" :key="mensaje.id" :class="['mb-6 p-4 rounded-lg max-w-[60%] shadow-md flex items-start',
        mensaje.usuario === usuarioActualId ? 'bg-red-50 ml-auto text-right flex-row-reverse'
          : 'bg-gray-50 mr-auto text-left']">

        <!-- Imagen de perfil -->
        <img v-if="mensaje.fotoPerfil" :src="mensaje.fotoPerfil" alt="Foto de perfil"
          class="rounded-full w-14 h-14 object-cover border-4 border-cyan-600" />

        <!-- Contenido del mensaje -->
        <div class="mx-3 flex flex-col">
          <strong class="text-sm font-semibold mb-1">{{ mensaje.usuarioNombre }}</strong>
          <p class="text-base">{{ mensaje.texto }}</p>
          <span class="text-sm text-gray-600 mt-2">{{ formatFecha(mensaje.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- Campo de entrada con evento Enter -->
    <div v-if="destinatarioId" class="flex mt-4">
      <input v-model="mensajePrivadoTexto" placeholder="Escribe un mensaje"
        class="p-3 border border-gray-300 rounded-lg flex-1 mr-2 text-base" @keyup.enter="enviarMensajePrivado" />
      <button @click="enviarMensajePrivado"
        class="py-2 px-4 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition">
        Enviar
      </button>
    </div>

    <!-- Mensaje si no hay conversación -->
    <div v-if="!conversacionActual.length && !destinatarioId" class="mt-4 text-center">
      <p class="text-gray-700">Seleccione un usuario para iniciar una conversación.</p>
    </div>
  </div>
</template>


<script>
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default {
  data() {
    return {
      conversacionActual: [],
      mensajePrivadoTexto: '',
      destinatarioId: this.$route.params.destinatarioId,
      destinatarioNombre: this.$route.params.destinatarioNombre || 'Usuario Desconocido',
      usuarioActualId: null,
      fotoPerfilUsuarioActual: null,
    };
  },
  async created() {
    const auth = getAuth();
    const storage = getStorage();
    const usuario = auth.currentUser;

    this.usuarioActualId = usuario.uid;

    // Cargar foto de perfil del usuario actual
    if (usuario.photoURL) {
      try {
        const fotoRef = ref(storage, usuario.photoURL);
        this.fotoPerfilUsuarioActual = await getDownloadURL(fotoRef);
      } catch (error) {
        console.error('Error al cargar la foto de perfil del usuario actual:', error);
        this.fotoPerfilUsuarioActual = '/img/user.svg';
      }
    }

    this.cargarConversacion();
  },
  methods: {
    cargarConversacion() {
      const db = getFirestore();
      onSnapshot(collection(db, 'chatPrivado'), (snapshot) => {
        this.conversacionActual = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (mensaje) =>
              (mensaje.usuario === this.usuarioActualId && mensaje.destinatario === this.destinatarioId) ||
              (mensaje.destinatario === this.usuarioActualId && mensaje.usuario === this.destinatarioId)
          )
          .sort((a, b) => a.timestamp - b.timestamp); // Ordenar del más antiguo al más nuevo

        // Obtener el nombre del destinatario si no está definido
        const otroUsuario = this.conversacionActual.find(
          (mensaje) => mensaje.usuario !== this.usuarioActualId
        );
        if (otroUsuario) {
          this.destinatarioNombre = otroUsuario.usuarioNombre;
        }

        // Desplazar scroll hacia el último mensaje
        this.$nextTick(() => {
          const chatBox = document.querySelector('.overflow-y-auto');
          if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
          }
        });
      });
    },
    async enviarMensajePrivado() {
      if (!this.mensajePrivadoTexto.trim() || !this.destinatarioId) return;

      const db = getFirestore();
      const auth = getAuth();
      const usuario = auth.currentUser;

      try {
        // Guardar el mensaje en la colección chatPrivado
        await addDoc(collection(db, 'chatPrivado'), {
          usuario: usuario.uid,
          destinatario: this.destinatarioId,
          texto: this.mensajePrivadoTexto,
          usuarioNombre: usuario.displayName || 'Anónimo',
          fotoPerfil: this.fotoPerfilUsuarioActual,
          timestamp: Date.now(),
        });

        // Guardar la notificación en la colección notificaciones
        await addDoc(collection(db, 'notificaciones'), {
          usuarioId: this.destinatarioId, // Usuario que recibirá la notificación
          remitenteId: usuario.uid, // Usuario que envía el mensaje
          mensaje: `Nuevo mensaje de ${usuario.displayName || 'Anónimo'}`,
          timestamp: Date.now(),
          leido: false
        });

        this.mensajePrivadoTexto = '';
      } catch (error) {
        console.error('Error al enviar el mensaje privado o la notificación:', error);
      }
    },
    formatFecha(timestamp) {
      const fecha = new Date(timestamp);
      return fecha.toLocaleString();
    },
  },
};
</script>