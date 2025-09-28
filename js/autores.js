const API = "http://172.22.128.72:3000/autores";
const lista = document.getElementById("listaAutores");
const form = document.getElementById("formAutor");
let autorEditandoId = null; 

async function cargarAutores() {
  lista.innerHTML = "";
  try {
    const res = await fetch(API);
    const autores = await res.json();
    autores.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a.nombre} (${a.pais})`;
      // Botón editar
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "✏️";
      btnEditar.title = "Editar autor";
      btnEditar.addEventListener("click", () => {
        document.getElementById("nombre").value = a.nombre;
        document.getElementById("pais").value = a.pais;
        autorEditandoId = a.id; 
      });

      // Botón eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "🗑️";
      btnEliminar.title = "Eliminar autor";
      btnEliminar.addEventListener("click", async () => {
        await fetch(`${API}/${a.id}`, { method: "DELETE" });
        cargarAutores();
      });

      li.appendChild(btnEditar);
      li.appendChild(btnEliminar);
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando autores:", err);
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const pais = document.getElementById("pais").value.trim();
  if (!nombre || !pais) return alert("Complete los campos.");

  try {
    if (autorEditandoId) {
      await fetch(`${API}/${autorEditandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, pais })
      });
      autorEditandoId = null; 
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, pais }) 
      });
    }
    form.reset();
    cargarAutores();
  } catch (err) {
    console.error("Error agregando o editando autor:", err);
  }
});

cargarAutores();
