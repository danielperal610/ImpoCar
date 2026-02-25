// JavaScript modular para interacciones

// Función para manejar el wizard
function initWizard() {
    const steps = document.querySelectorAll('.step');
    const contents = document.querySelectorAll('.wizard-content');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    let currentStep = 1;

    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
        document.querySelector(`.wizard-content[data-step="${step}"]`).classList.add('active');
        currentStep = step;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < 5) {
                showStep(currentStep + 1);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // Permitir navegación directa haciendo clic en los pasos
    steps.forEach(stepEl => {
        stepEl.style.cursor = 'pointer';
        stepEl.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            showStep(step);
        });
    });
}

// Función para manejar el envío de formularios (simulado)
function initForms() {
    const wizardForm = document.querySelector('.wizard-form');
    const traemosForm = document.querySelector('.form-traemos');
    const infoForm = document.querySelector('#info-form');

    wizardForm.addEventListener('submit', (e) => {
        // Validación de todos los pasos
        const marca = document.getElementById('marca');
        const marcaOtra = document.getElementById('marca-otra');
        const modelo = document.getElementById('modelo');
        const presupuesto = document.getElementById('presupuesto');
        const extrasOptions = document.querySelectorAll('#extras-group .extras-option');
        const correo = document.getElementById('correo');

        // Paso 1: Marca
        let marcaValida = false;
        if (marca.value === 'Otra') {
            marcaValida = marcaOtra.value.trim() !== '';
        } else {
            marcaValida = marca.value !== '';
        }
        if (!marcaValida) {
            e.preventDefault();
            alert('Debes seleccionar o escribir una marca (Paso 1).');
            return;
        }
        // Paso 2: Modelo
        if (!modelo.value.trim()) {
            e.preventDefault();
            alert('Debes rellenar el modelo (Paso 2).');
            return;
        }
        // Paso 3: Presupuesto
        if (!presupuesto.value.trim() || parseInt(presupuesto.value) < 3000) {
             e.preventDefault();
            alert('Debes indicar un presupuesto válido de al menos 3000€ (Paso 3).');
             return;
        }
        // Paso 4: Extras (validar selección múltiple y lógica de 'Sin preferencia')
        const extrasSelected = Array.from(extrasOptions).filter(opt => opt.classList.contains('selected')).map(opt => opt.dataset.value);
        if (extrasSelected.length === 0) {
            e.preventDefault();
            alert('Debes seleccionar al menos una opción de extras (Paso 4).');
            return;
        }
        if (extrasSelected.includes('Sin preferencia') && extrasSelected.length > 1) {
            e.preventDefault();
            alert('Si seleccionas "Sin preferencia" no puedes elegir otros extras (Paso 4).');
            return;
        }
        // Paso 5: Correo
        if (!correo.value.trim()) {
            e.preventDefault();
            alert('Debes indicar tu correo electrónico (Paso 5).');
            return;
        }
        // Si todo está bien
        alert('Presupuesto solicitado. Te contactaremos pronto.');
    });

    traemosForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Importación iniciada. Te mantendremos informado.');
    });

    infoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('modal-nombre').value;
        const correo = document.getElementById('modal-correo').value;
        const telefono = document.getElementById('modal-telefono').value;
        const comentario = document.getElementById('modal-comentario').value;
        alert(`Solicitud enviada para el coche seleccionado.\nNombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono}\nComentario: ${comentario}`);
        closeModal();
    });
}

// Funciones para el modal
function openModal(cocheId) {
    document.getElementById('modal').style.display = 'flex';
    // Opcional: almacenar el id del coche si se necesita
    console.log('Coche seleccionado:', cocheId);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('info-form').reset();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initWizard();
    initForms();

    // Mostrar input de marca personalizada si se elige "Otra"
    const marcaSelect = document.getElementById('marca');
    const marcaOtra = document.getElementById('marca-otra');
    if (marcaSelect && marcaOtra) {
        marcaSelect.addEventListener('change', function() {
            if (this.value === 'Otra') {
                marcaOtra.style.display = 'block';
                marcaOtra.required = true;
            } else {
                marcaOtra.style.display = 'none';
                marcaOtra.required = false;
                marcaOtra.value = '';
            }
        });
    }

    // Lógica para los divs de extras
    if (extrasOptions.length) {
        extrasOptions.forEach(opt => {
            opt.addEventListener('click', function(e) {
                e.preventDefault(); // Evita selección de texto
                if (this.dataset.value === 'Sin preferencia') {
                    // Si seleccionas Sin preferencia, desmarca todas las demás
                    extrasOptions.forEach(o => {
                        if (o !== this) o.classList.remove('selected');
                    });
                    this.classList.toggle('selected');
                } else {
                    // Si seleccionas cualquier otro, desmarca Sin preferencia
                    const sinPref = Array.from(extrasOptions).find(o => o.dataset.value === 'Sin preferencia');
                    sinPref.classList.remove('selected');
                    this.classList.toggle('selected');
                }
            });
        });
    }
});

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});