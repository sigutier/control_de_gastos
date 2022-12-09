const formNuevaTransaccion = document.getElementById("form");
formNuevaTransaccion.addEventListener("submit", submit);
const transacciones = [];

if (localStorage.getItem("usuario") !== undefined) {
  //Recuperar objetos del LocalStorage
  const recuperarTransacciones = JSON.parse(localStorage.getItem("usuario"));
  recuperarTransacciones.forEach(function (transaccion) {
    añadirTransaccion(transaccion.valor, transaccion.concepto);
  });
  actualizarAhorro();
  actualizarIngreso();
  actualizarGasto();
}

function submit(evt) {
  // Prevenir petición http post que hace el navegador por defecto
  evt.preventDefault();
  let concepto = document.getElementById("concepto").value;
  let cantidad = parseFloat(document.getElementById("cantidad").value);
  añadirTransaccion(cantidad, concepto);
  actualizarAhorro();
  actualizarIngreso();
  actualizarGasto();
  guardarSesion();
  formNuevaTransaccion.reset();
}

function añadirTransaccion(cantidad, concepto) {
  const containerTransaccion = document.createElement("div");
  const conceptoTransaccion = document.createElement("div");
  const cantidadTransaccion = document.createElement("div");
  conceptoTransaccion.textContent = concepto;
  cantidadTransaccion.textContent = `${cantidad} €`;
  containerTransaccion.appendChild(conceptoTransaccion);
  containerTransaccion.appendChild(cantidadTransaccion);
  //containerTransaccion.textContent = `${concepto} \t ${cantidad} €`;
  const listaHistorial = document.getElementById("lista-historial");
  listaHistorial.appendChild(containerTransaccion);
  if (cantidad > 0){
    containerTransaccion.classList.add("callout", "callout-green");
  } else {
    containerTransaccion.classList.add("callout", "callout-red");
  }
  const transaccion = {
    concepto: concepto,
    valor: cantidad,
  };
  transacciones.push(transaccion);
}

function actualizarAhorro() {
  let ahorroTotal = 0;
  transacciones.forEach(function (transaccion) {
    ahorroTotal += transaccion.valor;
  });
  const total = document.getElementById("ahorro-total");
  total.textContent = ahorroTotal;
}

function actualizarIngreso() {
  const numerosPositivos = transacciones
    .filter((transaccion) => transaccion.valor > 0)
    .reduce(function (acc, transaccion) {
      return acc + transaccion.valor;
    }, 0);
  const ingresoTotal = document.getElementById("ingreso-total");
  ingresoTotal.textContent = numerosPositivos;
}

function actualizarGasto() {
  const numerosNegativos = transacciones
    .filter((transaccion) => transaccion.valor < 0)
    .reduce(function (acc, transaccion) {
      return acc + transaccion.valor;
    }, 0);
  const gastoTotal = document.getElementById("gasto-total");
  gastoTotal.textContent = numerosNegativos;
}

function guardarSesion() {
  localStorage.setItem("usuario", JSON.stringify(transacciones));
}

function añadirClaseListaHistorial() {}
