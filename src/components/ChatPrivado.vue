<template>
  <div class="chat-privado">
    <h1 class="chat-title">
      Chat Privado con: {{ destinatarioNombre }}
    </h1>

    <!-- Mensajes de la conversación seleccionada -->
    <div v-if="conversacionActual.length" class="mensajes-conversacion">
      <div v-for="mensaje in conversacionActual" :key="mensaje.id"
        :class="['mensaje', mensaje.usuario === usuarioActualId ? 'mensaje-propio' : 'mensaje-otro']">
        <!-- Foto de perfil -->
        <div v-if="mensaje.usuario !== usuarioActualId" class="mensaje-header">
          <img v-if="mensaje.fotoPerfil" :src="mensaje.fotoPerfil" alt="Foto de perfil" class="rounded-full w-14
            h-14 object-cover border-4 border-cyan-600" />
          <strong class="ml-3">{{ mensaje.usuarioNombre }}</strong>
        </div>

        <p class="mensaje-contenido">
          {{ mensaje.texto }}
        </p>
        <span class="mensaje-fecha">{{ formatFecha(mensaje.timestamp) }}</span>
      </div>
    </div>

    <!-- Input para enviar mensajes -->
    <div v-if="destinatarioId" class="input-container">
      <input v-model="mensajePrivadoTexto" placeholder="Escribe un mensaje" class="input-message" />
      <button @click="enviarMensajePrivado" class="btn-enviar">Enviar</button>
    </div>

    <!-- Mensaje de bienvenida si no hay conversaciones -->
    <div v-if="!conversacionActual.length && !destinatarioId" class="no-conversacion">
      <p>Seleccione un usuario para iniciar una conversación.</p>
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
          );

        const otroUsuario = this.conversacionActual.find(
          (mensaje) => mensaje.usuario !== this.usuarioActualId
        );
        if (otroUsuario) {
          this.destinatarioNombre = otroUsuario.usuarioNombre;
        }
      });
    },
    async enviarMensajePrivado() {
      if (!this.mensajePrivadoTexto.trim() || !this.destinatarioId) return;

      const db = getFirestore();
      const auth = getAuth();
      const usuario = auth.currentUser;

      try {
        await addDoc(collection(db, 'chatPrivado'), {
          usuario: usuario.uid,
          destinatario: this.destinatarioId,
          texto: this.mensajePrivadoTexto,
          usuarioNombre: usuario.displayName || 'Anónimo',
          fotoPerfil: this.fotoPerfilUsuarioActual,
          timestamp: Date.now(),
        });
        this.mensajePrivadoTexto = '';
      } catch (error) {
        console.error('Error al enviar el mensaje privado:', error);
      }
    },
    formatFecha(timestamp) {
      const fecha = new Date(timestamp);
      return fecha.toLocaleString();
    },
  },
};
</script>

<style scoped>
.mensaje-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.chat-privado {
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(202, 240, 251, 0.3);
  border-radius: 0.5rem;
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-title {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.05em;
}

.mensajes-conversacion {
  margin: 1rem 0;
  max-height: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 12px;
}

.mensaje {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  max-width: 80%;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mensaje-propio {
  background-color: #FFF5F5;
  align-self: flex-end;
  margin-left: auto;
  text-align: right;
  color: rgb(10, 10, 10);
}

.mensaje-otro {
  background-color: #fafafa;
  align-self: flex-start;
  margin-right: auto;
  text-align: left;
  color: #333;
}

.mensaje-contenido {
  margin: 0;
  font-size: 1rem;
}

.mensaje-fecha {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.5rem;
  display: block;
}

.input-container {
  display: flex;
  margin-top: 1rem;
}

.input-message {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  flex: 1;
  margin-right: 0.5rem;
  font-size: 1rem;
}

.btn-enviar {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #0076fc;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-enviar:hover {
  background-color: #05c9eb;
}

/* Media Queries */
@media (max-width: 768px) {
  .chat-title {
    font-size: 1.3rem;
  }

  .mensaje {
    padding: 0.75rem;
  }

  .mensaje-fecha {
    font-size: 0.7rem;
  }

  .input-message {
    padding: 0.6rem;
  }

  .btn-enviar {
    padding: 0.6rem 1.2rem;
  }
}

@media (max-width: 480px) {
  .chat-title {
    font-size: 1.2rem;
  }

  .mensaje {
    padding: 0.6rem;
  }

  .input-message {
    padding: 0.5rem;
  }

  .btn-enviar {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
