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
// --- BASE DE DATOS DE COCHES PARA EL MODAL ---
const carDatabase = {
    'seat-ibiza': {
        title: 'Seat Ibiza 1.9 TDI Sport 100cv',
        img: 'assets/IBIZA6L.png',
        price: '4,500 €',
        specs: {
            'Año': '2007',
            'Kilómetros': '130.450 km',
            'Motor': '1.9 TDI 100cv AXR',
            'Combustible': 'Diésel',
            'Consumo': '4.9 L/100km',
            'Transmisión': 'Manual 5 vel.',
            'Color': 'Negro Mágico',
            'Etiqueta': 'B'
        },
        equipment: ['Llantas de aleación 15"', 'Climatizador automático', 'Control de crucero', 'Pantalla Junsun V1 Plus', 'Elevalunas eléctricos']
    },
    'volkswagen-golf': {
        title: 'Volkswagen Golf 1.9 TDI Highline',
        img: 'assets/GolfTDI.png',
        price: '5,200 €',
        specs: { 'Año': '2008', 'Kilómetros': '180.200 km', 'Motor': '1.9 TDI 105cv', 'Combustible': 'Diésel', 'Consumo': '5.0 L/100km', 'Transmisión': 'Manual 5 vel.', 'Color': 'Plata Reflex', 'Etiqueta': 'C' },
        equipment: ['Asientos deportivos', 'Climatizador bi-zona', 'Sensores de luz y lluvia', 'Llantas 16"']
    },
    'bmw-serie-3': {
        title: 'BMW Serie 3 320d',
        img: 'assets/BMW320D.png',
        price: '8,900 €',
        specs: { 'Año': '2010', 'Kilómetros': '120.320 km', 'Motor': '2.0 Diesel 184cv', 'Combustible': 'Diésel', 'Consumo': '4.7 L/100km', 'Transmisión': 'Manual 6 vel.', 'Color': 'Gris Oscuro', 'Etiqueta': 'C' },
        equipment: ['Faros Bi-Xenon', 'Navegador GPS', 'Sensores de aparcamiento', 'Control de crucero', 'Volante multifunción']
    },
    'audi-a4': {
        title: 'Audi A4 2.0 TDI Avant',
        img: 'assets/AudiA4_TDI.png',
        price: '7,500 €',
        specs: { 'Año': '2009', 'Kilómetros': '161.160 km', 'Motor': '2.0 TDI 140cv', 'Combustible': 'Diésel', 'Consumo': '5.3 L/100km', 'Transmisión': 'Manual 6 vel.', 'Color': 'Azul Marino', 'Etiqueta': 'C' },
        equipment: ['Barras de techo cromadas', 'Pantalla MMI', 'Climatizador automático', 'Freno de mano eléctrico']
    },
    'mercedes-c-class': {
        title: 'Mercedes-Benz Clase C 220 CDI',
        img: 'assets/MercedesC220CDI.png',
        price: '9,800 €',
        specs: { 'Año': '2011', 'Kilómetros': '139.980 km', 'Motor': '2.1 CDI 170cv', 'Combustible': 'Diésel', 'Consumo': '4.8 L/100km', 'Transmisión': 'Automática 7G-Tronic', 'Color': 'Gris Tenorita', 'Etiqueta': 'C' },
        equipment: ['Asientos de cuero mixto', 'Sensores de aparcamiento', 'Bluetooth', 'Control de velocidad']
    },
    'ford-focus': {
        title: 'Ford Focus 1.6 TDCi Titanium',
        img: 'assets/FordFocus_TDCi.png',
        price: '6,300 €',
        specs: { 'Año': '2012', 'Kilómetros': '111.115 km', 'Motor': '1.6 TDCi 115cv', 'Combustible': 'Diésel', 'Consumo': '4.2 L/100km', 'Transmisión': 'Manual 6 vel.', 'Color': 'Gris Plata', 'Etiqueta': 'C' },
        equipment: ['Arranque sin llave', 'Llantas 17"', 'Control por voz (SYNC)', 'Climatizador bi-zona']
    },
    'opel-astra': {
        title: 'Opel Astra 1.7 CDTI Cosmo',
        img: 'assets/OpelAstraCosmo.png',
        price: '3,800 €',
        specs: { 'Año': '2006', 'Kilómetros': '193.127 km', 'Motor': '1.7 CDTI 100cv', 'Combustible': 'Diésel', 'Consumo': '5.1 L/100km', 'Transmisión': 'Manual 5 vel.', 'Color': 'Azul Marino', 'Etiqueta': 'Sin Distintivo' },
        equipment: ['Llantas de aleación', 'Ordenador de a bordo', 'Aire acondicionado', 'Retrovisores eléctricos']
    },
    'renault-megane': {
        title: 'Renault Megane III 1.5 dCi Dynamique',
        img: 'assets/RenaultMegane3.png',
        price: '7,200 €',
        specs: { 'Año': '2013', 'Kilómetros': '101.050 km', 'Motor': '1.5 dCi 110cv', 'Combustible': 'Diésel', 'Consumo': '4.4 L/100km', 'Transmisión': 'Manual 6 vel.', 'Color': 'Gris Oscuro', 'Etiqueta': 'C' },
        equipment: ['Tarjeta manos libres', 'Llantas 16"', 'Regulador/Limitador de velocidad', 'Bluetooth']
    },
    'golf-gti': { // Usamos este ID porque es el que está en el HTML para el GTI
        title: 'Volkswagen Golf VI GTI 2.0 TSI DSG',
        img: 'assets/GTI_JR.png',
        price: '11,200 €',
        specs: { 'Año': '2011', 'Kilómetros': '205.630 km', 'Motor': '2.0 TSI 210cv', 'Combustible': 'Gasolina', 'Consumo': '7.4 L/100km', 'Transmisión': 'Automática DSG 6 vel.', 'Color': 'Negro Perlado', 'Etiqueta': 'C' },
        equipment: ['Asientos deportivos a cuadros', 'Llantas AvantGarde M310 19"', 'Faros Bi-Xenon', 'Levas en el volante']
    },
    'citroen-c4': {
        title: 'Citroën C4 1.6 HDi Exclusive',
        img: 'assets/CitroenC4.png',
        price: '9,000 €',
        specs: { 'Año': '2015', 'Kilómetros': '85.257 km', 'Motor': '1.6 HDi 92cv', 'Combustible': 'Diésel', 'Consumo': '4.1 L/100km', 'Transmisión': 'Manual 5 vel.', 'Color': 'Blanco Perla', 'Etiqueta': 'C' },
        equipment: ['Pantalla táctil', 'Asientos con función masaje', 'Sensores de aparcamiento', 'Climatizador']
    },
    'fiat-500': {
        title: 'Fiat 500 1.2 Lounge',
        img: 'assets/Fiat500.png',
        price: '4,200 €',
        specs: { 'Año': '2010', 'Kilómetros': '131.555 km', 'Motor': '1.2 69cv', 'Combustible': 'Gasolina', 'Consumo': '5.1 L/100km', 'Transmisión': 'Manual 5 vel.', 'Color': 'Blanco Gelato', 'Etiqueta': 'B' },
        equipment: ['Techo solar panorámico', 'Llantas de aleación', 'Sistema Blue&Me', 'Modo City (Dirección asistida)']
    },
    'toyota-corolla': {
        title: 'Toyota Corolla 1.4 D-4D Terra',
        img: 'assets/CorollaD4D.png',
        price: '3,500 €',
        specs: { 'Año': '2005', 'Kilómetros': '202.575 km', 'Motor': '1.4 D-4D 90cv', 'Combustible': 'Diésel', 'Consumo': '4.8 L/100km', 'Transmisión': 'Manual 5 vel.', 'Color': 'Plata Metálico', 'Etiqueta': 'Sin Distintivo' },
        equipment: ['Aire acondicionado', 'Radio CD', 'Elevalunas eléctricos delanteros', 'Cadena de distribución']
    }
};

// --- FUNCIONES DEL MODAL ---
function openModal(cocheId) {
    const car = carDatabase[cocheId];
    if (!car) return; // Si no existe, no hace nada

    // Rellenar datos básicos
    document.getElementById('modal-car-title').innerText = car.title;
    document.getElementById('modal-car-img').src = car.img;
    document.getElementById('modal-car-price').innerText = car.price;
    document.getElementById('coche-interes').value = car.title; // Para el formulario

    // Rellenar cuadrícula de especificaciones
    const specsContainer = document.getElementById('modal-car-specs');
    specsContainer.innerHTML = ''; // Limpiar anteriores
    for (const [key, value] of Object.entries(car.specs)) {
        specsContainer.innerHTML += `
            <div class="spec-item">
                <span>${key}</span>
                <strong>${value}</strong>
            </div>
        `;
    }

    // Rellenar lista de equipamiento
    const equipContainer = document.getElementById('modal-car-equip');
    equipContainer.innerHTML = '';
    car.equipment.forEach(item => {
        equipContainer.innerHTML += `<li>${item}</li>`;
    });

    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('info-form').reset();
}

// Hacer que al pinchar en cualquier parte de la carta se abra el modal
// Hacer que al pinchar en cualquier parte de la carta se abra el modal
document.addEventListener('DOMContentLoaded', () => {
    // Busca todas las cartas del catálogo
    const tarjetas = document.querySelectorAll('.card-vehiculo');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', function() {
            // Ahora sacamos el ID directamente del div de la tarjeta
            const cocheId = this.getAttribute('data-id');
            if(cocheId) {
                openModal(cocheId);
            }
        });
    });
});

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