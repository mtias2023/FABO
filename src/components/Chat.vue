<template>
  <div class="chat-publico h-full">
    <h1 class="text-2xl text-cyan-500 font-bold mb-6">Chat público</h1>

    <Loader v-if="cargando" />

    <div v-else class="mensajes-conversacion">
      <div v-for="mensaje in mensajesPublicos" :key="mensaje.id"
        :class="['mensaje', mensaje.userId === user.uid ? 'mensaje-propio' : 'mensaje-otro']">

        <div class="contenido-mensaje">
          <img v-if="mensaje.fotoPerfil" :src="mensaje.fotoPerfil" alt="Foto de perfil" class="foto-perfil"
            @error="mensaje.fotoPerfil = '/img/user.png'" />

          <div class="mensaje-texto">
            <strong>{{ mensaje.usuario }}:</strong>
            <p>{{ mensaje.texto }}</p>
          </div>
        </div>
        <div class="mensaje-footer">
          <span class="mensaje-fecha">{{ formatTimestamp(mensaje.timestamp).date }}</span>
          <span class="mensaje-hora">{{ formatTimestamp(mensaje.timestamp).time }}</span>
        </div>
      </div>
    </div>

    <div class="input-container">
      <input v-model="mensajeTexto" placeholder="Escribe un mensaje" class="input-message" />
      <button @click="enviarMensaje" class="btn-enviar">Enviar</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Loader from './Loader.vue';

export default {
  components: {
    Loader,
  },
  data() {
    return {
      mensajesPublicos: [],
      mensajeTexto: '',
      user: null,
      fotoPerfil: null,
      cargando: true,
    };
  },
  async created() {
    const auth = getAuth();
    const storage = getStorage();
    this.user = auth.currentUser;

    if (this.user?.photoURL) {
      try {
        const fotoRef = ref(storage, this.user.photoURL);
        this.fotoPerfil = await getDownloadURL(fotoRef);
      } catch (error) {
        console.error("Error al cargar la foto de perfil:", error);
        this.fotoPerfil = "/img/user.png";
      }
    }
    this.obtenerMensajesPublicos();
  },
  methods: {
    obtenerMensajesPublicos() {
      const db = getFirestore();
      const chatPublicoRef = collection(db, 'chatPublico');
      onSnapshot(chatPublicoRef, (snapshot) => {
        this.mensajesPublicos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => a.timestamp - b.timestamp);

        this.cargando = false;
      });
    },
    async enviarMensaje() {
      if (this.mensajeTexto.trim()) {
        const db = getFirestore();
        const nuevoMensaje = {
          usuario: this.user.displayName || 'Anónimo',
          texto: this.mensajeTexto,
          timestamp: Date.now(),
          userId: this.user.uid,
          fotoPerfil: this.fotoPerfil,
        };

        try {
          await addDoc(collection(db, 'chatPublico'), nuevoMensaje);
          this.mensajeTexto = '';
        } catch (error) {
          console.error("Error al enviar el mensaje:", error);
        }
      }
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
      const formattedDate = date.toLocaleDateString(undefined, optionsDate);
      const formattedTime = date.toLocaleTimeString(undefined, optionsTime).slice(0, -3); // Remove 
      return { date: formattedDate, time: formattedTime };
    }
  },
};
</script>

<style scoped>
.chat-publico {
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

h1 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  font-weight: bold;

}

.mensajes-conversacion {
  margin: 1rem 0;
  max-height: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mensaje-texto p {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.mensaje {
  width: 55%;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.mensaje-otro {
  background-color: #ffffff;
  align-self: flex-start;
}

/* Mensajes propios */
.mensaje-propio {
  background-color: #ffeeee;
  /* Color rosado */
  align-self: flex-end;
  text-align: right;
}

/* Contenido del mensaje */
.contenido-mensaje {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mensaje-propio .contenido-mensaje {
  flex-direction: row-reverse;
  text-align: right;
}

.foto-perfil {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #00bcd4;
  object-fit: cover;
}

.mensaje .flex {
  align-items: center;
  gap: 10px;
}

.mensaje-propio .flex {
  flex-direction: row-reverse;
  /* Invertir orden en mensajes propios */
  text-align: right;
}

.mensaje-contenido {
  flex: 1;
  word-break: break-word;
}

.mensaje-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.mensaje-fecha {
  color: #999;
}

.mensaje-hora {
  color: #666;
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
