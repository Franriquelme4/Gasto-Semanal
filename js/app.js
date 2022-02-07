//variables y selectores
const form = document.querySelector('#agregar-gasto');
const listaGasto= document.querySelector('#gastos ul');



eventListener();

//eventos 
function eventListener() {
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    form.addEventListener('submit',agregarGastos);
}


//classes
class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto=Number(presupuesto);
        this.restante=Number(presupuesto);
        this.gastos=[];
    }
    nuevoGasto(gasto){
        this.gastos=[...this.gastos,gasto];
        this.calcularRestante();
        console.log(this.gastos);
    }
    calcularRestante(){
        const gastado=this.gastos.reduce((total,gasto)=> total + gasto.cantidad,0);
        this.restante=this.presupuesto-gastado;

    }
    eliminarGasto(id){
        this.gastos=this.gastos.filter(gasto=>gasto.id!==id);
        this.calcularRestante();
    }
}
let presupuesto;

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto,restante}=cantidad;
        document.querySelector('#total').textContent=presupuesto;
        document.querySelector('#restante').textContent=presupuesto;
    }
    imprimirAlerta(mensaje,tipo){
        const div = document.createElement('div');
        div.classList.add('text-center','alert');
        if (tipo==='error') {
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success');
        }
        div.textContent=mensaje;
        document.querySelector('.primario').insertBefore(div,form);
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
    mostrarGastos(gastos){
        this.limpiarHTML();
        //iterar sobre los gastos 
    gastos.forEach(gasto => {
        const {cantidad,nombre,id}=gasto;
        //crear un li
        const nuevoGasto=document.createElement('li');
        nuevoGasto.className='list-group-item d-flex justify-content-between align-items-center';
       // nuevoGasto.setAttribute('data-id',id); -> Da el mismo resultado
        nuevoGasto.dataset.id=id; 

        nuevoGasto.innerHTML=`
        ${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;
        //crear boton
        const btnBorrar =  document.createElement('button');
        btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
        btnBorrar.onclick= ()=>{
            console.log('borrando');
            eliminarGasto(id);
        }
btnBorrar.innerHTML='Borrar &times';
nuevoGasto.appendChild(btnBorrar);
        //Agrega html

        listaGasto.appendChild(nuevoGasto);


    });

    }
    limpiarHTML(){
        while (listaGasto.firstChild) {
            listaGasto.removeChild(listaGasto.firstChild);
        }
    }
    actualizaRestante(restante){
        document.querySelector('#restante').textContent=restante;
    }
    comprobarPresupuesto(presupuestoOBJ){
        const {presupuesto,restante}=presupuestoOBJ;
        const restanteDIV=document.querySelector('.restante');
        //comprobar 25%
        if((presupuesto/4)>restante){
            restanteDIV.classList.remove('alert-success','alert-warning');
            restanteDIV.classList.add('alert-danger');
            console.log('Ya gastaste el 75%');
        }else if((presupuesto/2)>restante){
            restanteDIV.classList.remove('alert-success','alert-danger');
            restanteDIV.classList.add('alert-warning');
        }else{
            restanteDIV.classList.remove('alert-warning','alert-danger'); 
            restanteDIV.classList.add('alert-success');
        }
        if (restante<=0) {
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            form.querySelector('button[type="submit"]').disabled=true;
        }
    }
}

const ui= new UI();



// funciones
function preguntarPresupuesto() {
    const presupuestoUsuario=prompt('Cual es tu presupuesto ?');
    if (presupuestoUsuario==='' || presupuestoUsuario===null || isNaN(presupuestoUsuario) || presupuestoUsuario<=0) {
      window.location.reload();  
    } 
    presupuesto=new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
    console.log(presupuestoUsuario);
}
function agregarGastos(e) {
    e.preventDefault();
   
    const nombre= document.querySelector('#gasto').value;
    const cantidad= Number(document.querySelector('#cantidad').value);

    // validaciones
    if (nombre ==='' ||cantidad==='') {
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if(cantidad<=0 || isNaN(cantidad)){
        ui.imprimirAlerta('Agregar campos validos','error');
        return;
    }
    
    //agregando gastos al pasar la validacion
    let  gasto={nombre,cantidad,id:Date.now()};
    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Gasto agregado correctamente');
//imprimir los gastos 
const {gastos,restante}=presupuesto;
ui.mostrarGastos(gastos);
ui.actualizaRestante(restante);
ui.comprobarPresupuesto(presupuesto);
   // reinicia el formulario
    form.reset();

}
function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const {gastos,restante}=presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizaRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}