//capturamos los id en const que vamos a usar en el js
const formulario = document.getElementById('formulario');
const input = document.getElementById('input');
const listaTarea = document.getElementById('lista-tareas')
//creamos las const de template y fragment para agregar los elemento html 
const template = document.getElementById('template').content
const fragment = document.createDocumentFragment()



//creamos el objeto donde se iran guardando las tareas que vayamos agregando
let tareasList = {}



//creamos los eventos:
//cargamos los templates en el dom cuando esten creados
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tareasList')) {
        tareasList = JSON.parse(localStorage.getItem('tareasList'))
    }
    pintarTareas()
})
//accedemos a todos los eventos click del elemento listaTarea y pasamos la función btnAccion
listaTarea.addEventListener('click', e => {
    btnAccion(e)
})
//creamos el evento para extraer el valor del input
formulario.addEventListener('submit', e => {
    e.preventDefault()
    // console.log(e.target[0].value)
    // console.log(input.value)
    setTarea(e)//función crear tarea
})



//función crear tarea
const setTarea = e => {
    //verificamos si el input está vacio
    //.trim() elemina los espacio en blanco, por lo tanto está comprando si el input está vacio
    if(input.value.trim() === '') {
        console.log('Está vacio')
        return
    }
    //console.log('Diste click')

    const tarea = {
        id: Date.now(), //catura la fecha y tiempo actual de la pc en forma de id
        texto: input.value,
        estado: false
    }

    //le pasamos el id del objeto tarea, al objeto tareasList
    tareasList[tarea.id] = tarea
    //console.log(tareasList)
    //borra lo que hayamos escrito en el input cada vez que le damos click en agregar
    formulario.reset()
    //cada que se borra el input al darle click en agregar el focus se mantiene en el input, esto para que veas que tienes que escribir en el input otra vez
    input.focus()

    pintarTareas();//función para agregar tarea al dom
}



//función para agregar las tareas (templates) al dom
const pintarTareas = () => {
    
    //guardamos las tareas que hemos creamos en el localStorage para que no se borren si actualizamos el navegador
    //JSON.stringify(tareasList): pasamos un objeto a un array
    localStorage.setItem('tareasList', JSON.stringify(tareasList))

    //preguntamos si el objeto de las tareas está vacio, si así es muestra un msn que no hay tareas
    if (Object.values(tareasList).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center">
        Sin tareas pendientes 😍
        </div>
        `
        return
    }

    listaTarea.innerHTML = '' //partimos con el dom vacio para que no se repitan la tareas cada que agregamos una tarea

    //como estamos trabajando con objetos no podemos usar forEach ni otro método de array de forma directa
    //En cambio usamos el Object.values(nombre del objeto).forEach
    Object.values(tareasList).forEach(tarea => {
        
        //la const clone permite tomar un elemento html y duplicarlo en dom
        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = tarea.texto

        //si es estado de la tarea es true cambimos las clases del boton check para que haga cierta acción
        if (tarea.estado) {
            //cambiamos de clases para cambiar de color de fondo
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            //cambiamos de clases para cambiar el ícono
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt')
            //hacemos el texto de la tarea tenga una linea de tachado
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id
        fragment.appendChild(clone)
    })
    listaTarea.appendChild(fragment)
}



//funcionalidades de los botones de check y eliminar las tareas
const btnAccion = e => {

    //dar true cuando le demos al boton check de la tarea
    if(e.target.classList.contains('fa-check-circle')) {
        //console.log(e.target.dataset.id)
        tareasList[e.target.dataset.id].estado = true
        pintarTareas()
        console.log(tareasList)
    }

    //eliminar la tarea
    if(e.target.classList.contains('fa-minus-circle')) {
        //console.log(e.target.dataset.id)
        delete tareasList[e.target.dataset.id]
        pintarTareas()
        console.log(tareasList)
    }

    //cuando le damos al boton de check otra vez cuando la tarea está tachada la tarea volverá a su estado inicial
    if (e.target.classList.contains('fa-undo-alt')) {
        tareasList[e.target.dataset.id].estado = false
        pintarTareas()
    }
    e.stopPropagation()
}

