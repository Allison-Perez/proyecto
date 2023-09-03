document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('profile-form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const nombre = form.nombre.value;
        const numeroFicha = form["numero-ficha"].value;
        const formacion = form.formacion.value;
        const correo = form.correo.value;
        const imagenPerfil = form["imagen-perfil"].files[0];

        document.getElementById('nombre-guardado').textContent = nombre;
        document.getElementById('numero-ficha-guardado').textContent = numeroFicha;
        document.getElementById('formacion-guardada').textContent = formacion;
        document.getElementById('correo-guardado').textContent = correo;

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagen-guardada').src = e.target.result;
        };
        reader.readAsDataURL(imagenPerfil);

        document.getElementById('perfil-guardado').classList.remove('hidden');
    });
});
