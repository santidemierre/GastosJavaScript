// VARIABLES
// 1.

const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')


// EVENTOS
// 2.

eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    
    document.addEventListener('DOMContentLoaded', () => {

        gasto = JSON.parse(localStorage.getItem('gasto')) || {}
        console.log(gasto)

    })

    // 10.     
    formulario.addEventListener('submit', agregarGasto)
}



// Clases -- Va a tener 2 clases. Una para el presupuesto y otra para la interfaz de usuario
// 4.

class Presupuesto {

    constructor(presupuesto) {

        // 7. Agregamos restante y gastos
        // El mismo constructor se puede utilizar en propiedades diferentes

        this.presupuesto = Number(presupuesto) // Para asegurarnos que sea un número
        this.restante = Number(presupuesto) 
        this.gastos = []

    }

    // 13. El gasto viene de la funcion agregarGasto(). Punto 14
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto] // Tomamos una copia de lo que hay en this.gastos, por eso los ... y le agregamos el nuevo gasto al final del arreglo 

        this.calcularRestante()
    }

    // 18
    calcularRestante() {
        // 1° Obtener cuanto dinero tenemos gastado.
        // 2° total es el acumulado y gasto es el objeto actual
        // 3° Va a iterar sobre el arreglo de gastos y nos va a ir tirando CUANTO DINERO fuimos gastando
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0 )
        
        // 19. Le restamos lo gastado al presupuesto  
        this.restante = this.presupuesto - gastado
    }

    // 26
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        
        // 27. Va a iterar sobre los gastos y nos va a decir cuanto hemos gastado y calcular el restante a partit de ahi 
        this.calcularRestante()
    }

    presupuestoStorage(presupuesto) {
        localStorage.setItem('presupuesto', JSON.stringify(presupuesto))
    }

    sincronizarStorage(gasto) {
        localStorage.setItem('gasto', JSON.stringify(gasto))
    }
}

// 9. Clase encargada de mostrar los resultados en pantalla

class UI {
    // Metodos
    insertarPresupuesto(cantidad) {
        
        // Extraemos los valores:
        const { presupuesto, restante } = cantidad

        // Agregamos al HTML
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante 
    } 

    mostrarMensajeError(mensaje, tipo) {
        const div = document.createElement('div')
        div.classList.add('text-center', 'alert')

        if(tipo === 'error') {
            div.classList.add('alert-danger') // Clase de bootstrap
        } else {
            div.classList.add('alert-success') // Clase de bootstrap
        }

        div.textContent = mensaje

        // Insertamos en el HTML
        document.querySelector('.primario').insertBefore(div, formulario) // formulario es donde lo voy a insertar, que es este id #agregar-gasto

        // Para eliminar el mensaje despues de 2 segundos
        setTimeout(() => {
            div.remove()
            }, 2000);
        }

    // 16. Creamos el método para mostrar los gastos en la UI
    mostrarGastos(gastos) {

        this.limpiarHTML() // Elimina el HTML previo
        
        // Iterar sobre los gastos
        gastos.forEach( gasto => {
            
            const { cantidad, nombre, id } = gasto
        
            // Crear un li gastos
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            nuevoGasto.dataset.id = id // Para darle un id y poder manipularlo
            console.log(nuevoGasto)

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            // Boton para agregar el gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.textContent = "Borrar"

            // 25. Funcionalidad para borrar
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }

            nuevoGasto.appendChild(btnBorrar) // Agrego a nuevo gasto el boton de borrar

            // Lo agregamos al HTML
            gastoListado.appendChild(nuevoGasto) // No borra el HTML previo.

        });

    }

    // 17. Limpiar el HTML, los registros previos para evitar duplicar. Se manda a llamar con this, mas arriba
    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    // 20. Creamos la funcion y la llamamos en agregarGasto()
    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante 
    }

    // 21. 
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj
        const restanteDiv = document.querySelector(".restante")
        // Comprobar el 25%
        if( (presupuesto / 4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        } else if ( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove("alert-success")
            restanteDiv.classList.add("alert-warning")
        } else {

            // Para cuando se borran los gastos y vuelva al color que estaba
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add("alert-success")
        }

        // 24. Si el total es menor a 0
        if(restante <= 0) {
            ui.mostrarMensajeError('El presupuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true
        }
    }
    
}

// INSTANCIAR

// 8. Instanciamos ui globalmente para poder acceder desde las distintas funciones
const ui = new UI()

// 5. Agregamos una variable global para usarla en la funcion preguntarPresupuesto() 

let presupuesto; // Este luego va a ser un objeto, esto se ve en el punto 6.

// FUNCIONES
// 3.

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')

    if( presupuestoUsuario === '' || presupuestoUsuario === null || presupuestoUsuario <= 0 || isNaN(presupuestoUsuario) ) {
        window.location.reload() // Recarga la página
    } 

    // 6.Guardamos en la var global en objeto presupuesto

    presupuesto = new Presupuesto(presupuestoUsuario) 
    
    // 10. Le paso presupuesto, que tiene el objeto con toda la info
    ui.insertarPresupuesto(presupuesto)

} 

// 11

function agregarGasto(e) {
    e.preventDefault()

    const nombre = document.querySelector('#gasto').value // Permite acceder al valor que poner el usuario
    const cantidad = Number(document.querySelector('#cantidad').value)

    if(nombre === '' || cantidad === '') {
        ui.mostrarMensajeError('Todos los campos son obligatorios', 'error')
        return
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.mostrarMensajeError('Ingresa un valor válido', 'error')
        return
    }

    // 12. Generar un objeto con el gasto
    // Lo cantrario a destructuring, esta sintaxis UNE nombre y cantidad a gasto, en ves de extraer
    const gasto = { nombre, cantidad, id: Date.now() }

    // 14. Añadimos un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    // 16. Imprimir los gastos
    const { gastos, restante } = presupuesto // Para no pasarle tooodo el objeto entero, ya que solo se requiere el gasto
    ui.mostrarGastos(gastos)

    // 21. Llamo a la funcion
    ui.actualizarRestante(restante)

    // 23. LLamo a la funcion 
    ui.comprobarPresupuesto(presupuesto)

    // 15. Mostrar mensaje success y limpiar el formulario
    ui.mostrarMensajeError('Agregado correctamente', 'correcto')
    formulario.reset()

    presupuesto.sincronizarStorage(gasto)

}

// 26. 
function eliminarGasto(id) {
    // Elimina del objeto
    presupuesto.eliminarGasto(id)

    // Elimina los gastos del HTML  
    const { gastos, restante } = presupuesto // Para extraerlo de presupuesto
    ui.mostrarGastos(gastos)

    // 28.
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto)
}