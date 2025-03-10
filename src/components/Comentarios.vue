<template>
  <div class="comentarios mt-4">
    <h1 class="text-lg sm:text-base font-semibold">Comentarios</h1>
    <form @submit.prevent="agregarComentario" class="flex items-center gap-2 mb-4">
      <input type="text" v-model="nuevoComentario" placeholder="Escribe un comentario..."
        class="border rounded p-2 flex-grow text-sm sm:text-base" required />
      <button type="submit"
        class="border border-blue-500 text-white bg-blue-500 rounded p-2 hover:bg-transparent hover:text-black transition text-sm sm:text-base flex items-center justify-center">
        <span class="hidden sm:inline">Agregar comentario</span>
        <i class="fas fa-paper-plane md:ml-2"></i>
      </button>
    </form>

    <ul>
      <li v-for="(comentario, index) in comentarios" :key="comentario.id" class="p-2 border-b last:border-0">
        <div class="flex justify-between">
          <div class="flex-1">
            <strong class="text-sm sm:text-base">{{ comentario.username }}</strong>:
            <span v-if="!comentario.editando">{{ comentario.texto }}</span>
            <div v-else>
              <input type="text" v-model="comentario.textoEditado"
                class="border rounded p-2 w-full text-sm sm:text-base" />
              <button @click="guardarEdicion(comentario)" class="text-green-500 text-xs sm:text-sm mt-2 mr-3">
                Guardar
              </button>
              <button @click="cancelarEdicion(comentario)" class="text-gray-500 text-xs sm:text-sm mt-2">
                Cancelar
              </button>
            </div>
          </div>
        </div>
        <div class="text-right text-xs sm:text-sm text-slate-600 mt-2">
          {{ comentario.fechaHora }}
        </div>
        <div v-if="comentario.userId === auth.currentUser?.uid" class="flex space-x-2 mt-1">
          <button @click="iniciarEdicion(comentario)" class="text-amber-500 text-xs sm:text-sm">
            Editar
          </button>
          <button @click="eliminarComentario(comentario.id)" class="text-red-500 text-xs sm:text-sm">
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2';

export default {
  props: ['publicacionId'],
  data() {
    return {
      nuevoComentario: '',
      comentarios: [],
      auth: getAuth(), // Obteniendo la instancia de autenticación
    };
  },
  async mounted() {
    await this.obtenerComentarios();
  },
  methods: {
    async obtenerComentarios() {
      const db = getFirestore();
      const comentariosRef = collection(db, "comentarios");
      const q = query(comentariosRef, where("publicacionId", "==", this.publicacionId));
      const comentariosSnapshot = await getDocs(q);

      this.comentarios = comentariosSnapshot.docs.map((doc) => {
        const data = doc.data();
        const fechaHora = this.formatFechaHora(data.createdAt.toDate());
        return {
          id: doc.id,
          ...data,
          fechaHora,
          editando: false,
          textoEditado: data.texto,
        };
      });
    },
    async agregarComentario() {
      if (this.nuevoComentario.trim() !== '') {
        const db = getFirestore();
        const user = this.auth.currentUser;

        try {
          const createdAt = new Date();
          const docRef = await addDoc(collection(db, "comentarios"), {
            publicacionId: this.publicacionId,
            texto: this.nuevoComentario.trim(),
            username: user ? user.displayName || "Usuario Anónimo" : "Usuario Anónimo",
            userId: user ? user.uid : null,
            createdAt,
          });

          const fechaHora = this.formatFechaHora(createdAt);
          this.comentarios.push({
            id: docRef.id,
            texto: this.nuevoComentario.trim(),
            username: user ? user.displayName || "Usuario Anónimo" : "Usuario Anónimo",
            userId: user ? user.uid : null,
            fechaHora,
            editando: false,
            textoEditado: this.nuevoComentario.trim(),
          });
          this.nuevoComentario = '';
        } catch (error) {
          console.error("Error al agregar el comentario: ", error);
        }
      } else {
        alert("El comentario no puede estar vacío.");
      }
    },
    async eliminarComentario(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const db = getFirestore();
          try {
            await deleteDoc(doc(db, "comentarios", id));
            this.comentarios = this.comentarios.filter((comentario) => comentario.id !== id);
            Swal.fire('Eliminado!', 'El comentario ha sido eliminado.', 'success');
          } catch (error) {
            console.error("Error al eliminar el comentario: ", error);
            Swal.fire('Error', 'Hubo un problema al eliminar el comentario. Inténtalo de nuevo.', 'error');
          }
        }
      });
    },
    iniciarEdicion(comentario) {
      comentario.editando = true;
    },
    cancelarEdicion(comentario) {
      comentario.editando = false;
      comentario.textoEditado = comentario.texto;
    },
    async guardarEdicion(comentario) {
      if (comentario.textoEditado.trim() === '') {
        Swal.fire('Error', 'El comentario no puede estar vacío.', 'error');
        return;
      }

      const db = getFirestore();
      try {
        await updateDoc(doc(db, "comentarios", comentario.id), {
          texto: comentario.textoEditado.trim(),
        });
        comentario.texto = comentario.textoEditado.trim();
        comentario.editando = false;
        Swal.fire('Guardado', 'El comentario ha sido actualizado.', 'success');
      } catch (error) {
        console.error("Error al editar el comentario: ", error);
        Swal.fire('Error', 'Hubo un problema al editar el comentario. Inténtalo de nuevo.', 'error');
      }
    },
    formatFechaHora(fecha) {
      const opcionesFecha = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
      const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
      const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);
      return `${fechaFormateada}, ${horaFormateada}`;
    },
  },
};
</script>

<style scoped>
.comentarios {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

button {
  transition: background-color 0.3s ease;
}

ul {
  list-style-type: none;
  padding: 0;
}

.text-xs {
  font-size: 0.85rem;
}

.text-sm {
  font-size: 0.950rem;
}
</style>
