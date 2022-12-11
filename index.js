const formNuevaTransaccion = document.getElementById("form");
formNuevaTransaccion.addEventListener("submit", submit);
let transacciones = [];

if (localStorage.getItem("usuario") !== undefined) {
  //Recuperar objetos del LocalStorage
  const recuperarTransacciones = JSON.parse(localStorage.getItem("usuario"));
  recuperarTransacciones.forEach(function (transaccion) {
    añadirTransaccion(transaccion.valor, transaccion.concepto);
  });
  actualizarPagina(false);
}

function submit(evt) {
  // Prevenir petición http post que hace el navegador por defecto
  evt.preventDefault();
  let concepto = document.getElementById("concepto").value;
  let cantidad = parseFloat(document.getElementById("cantidad").value);
  añadirTransaccion(cantidad, concepto);
  actualizarPagina(true);
  formNuevaTransaccion.reset();
}

function actualizarPagina(guardar) {
  actualizarAhorro();
  actualizarIngreso();
  actualizarGasto();
  if (guardar) {
    guardarSesion();
  }
}

function añadirTransaccion(cantidad, concepto) {
  const container = document.createElement("div");
  container.classList.add("transaccion");
  const containerTransaccion = document.createElement("div");
  containerTransaccion.style.flexBasis = "92%";
  const conceptoTransaccion = document.createElement("div");
  const cantidadTransaccion = document.createElement("div");

  conceptoTransaccion.textContent = concepto;
  cantidadTransaccion.textContent = `${cantidad} €`;

  container.appendChild(containerTransaccion);
  containerTransaccion.appendChild(conceptoTransaccion);
  containerTransaccion.appendChild(cantidadTransaccion);
  //containerTransaccion.textContent = `${concepto} \t ${cantidad} €`;
  const listaHistorial = document.getElementById("lista-historial");
  listaHistorial.appendChild(container);

  if (cantidad > 0) {
    containerTransaccion.classList.add("callout", "callout-green");
  } else {
    containerTransaccion.classList.add("callout", "callout-red");
  }
  const transaccion = {
    concepto: concepto,
    valor: cantidad,
  };
  transacciones.push(transaccion);

  añadirPapelera(container, transaccion);
}

function añadirPapelera(container, transaccion) {
  const trashButton = document.createElement("button");
  trashButton.setAttribute("type", "button");
  trashButton.setAttribute("class", "btn btn-light");
  trashButton.innerHTML = `<i class="bi bi-trash3"></i>`;
  container.appendChild(trashButton);
  trashButton.addEventListener("click", () => {
    container.remove();
    transacciones = transacciones.filter(
      (currentTransaccion) => currentTransaccion !== transaccion
    );
    actualizarPagina(true);
  });
}

function actualizarAhorro() {
  let ahorroTotal = 0;
  transacciones.forEach(function (transaccion) {
    ahorroTotal += transaccion.valor;
  });
  const total = document.getElementById("ahorro-total");
  total.textContent = `${ahorroTotal} €`;
}

function actualizarIngreso() {
  const numerosPositivos = transacciones
    .filter((transaccion) => transaccion.valor > 0)
    .reduce(function (acc, transaccion) {
      return acc + transaccion.valor;
    }, 0);
  const ingresoTotal = document.getElementById("ingreso-total");
  ingresoTotal.textContent = `${numerosPositivos} €`;
}

function actualizarGasto() {
  const numerosNegativos = transacciones
    .filter((transaccion) => transaccion.valor < 0)
    .reduce(function (acc, transaccion) {
      return acc + transaccion.valor;
    }, 0);
  const gastoTotal = document.getElementById("gasto-total");
  gastoTotal.textContent = `${numerosNegativos} €`;
}

function guardarSesion() {
  localStorage.setItem("usuario", JSON.stringify(transacciones));
}
