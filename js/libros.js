const API = "http://172.22.128.72:3000/libros";
const lista = document.getElementById("listaLibros");
const form = document.getElementById("formLibro");
let libroEditandoId = null; 

async function cargarLibros() {
  lista.innerHTML = "";
  try {
    const res = await fetch(API);
    const libros = await res.json();
    libros.forEach(l => {
      const li = document.createElement("li");
      li.textContent = `${l.titulo} - ${l.autor}`; 
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "✏️";
      btnEditar.title = "Editar libro";
      btnEditar.addEventListener("click", () => {
        document.getElementById("titulo").value = l.titulo;
        document.getElementById("autor").value = l.autor;
        libroEditandoId = l.id; 
      });

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑️";
      btnEliminar.title = "Eliminar libro";
      btnEliminar.addEventListener("click", async () => {
        await fetch(`${API}/${l.id}`, { method: "DELETE" });
        cargarLibros();
      });

      li.appendChild(btnEditar);
      li.appendChild(btnEliminar);
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando libros:", err);
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  if (!titulo || !autor) return alert("Complete los campos.");

  try {
    if (libroEditandoId) {
      await fetch(`${API}/${libroEditandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor })
      });
      libroEditandoId = null;
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, autor }) 
      });
    }
    form.reset();
    cargarLibros();
  } catch (err) {
    console.error("Error agregando o editando libro:", err);
  }
});

cargarLibros();
