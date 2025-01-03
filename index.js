





// Función para mostrar el cargando
function showLoading() {
    const loadingContainer = document.getElementById("loading-container");
    if (!loadingContainer) {
        console.error("El elemento 'loading-container' no existe en el DOM.");
        return;
    }
    loadingContainer.classList.remove("hidden");
}

// Función para ocultar el cargando
function hideLoading() {
    const loadingContainer = document.getElementById("loading-container");
    if (!loadingContainer) {
        console.error("El elemento 'loading-container' no existe en el DOM.");
        return;
    }
    loadingContainer.classList.add("hidden");
}

// Función para mostrar el mensaje de error
function showError(message = "Ocurrió un error") {
    const errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
        console.error("El elemento 'error-message' no existe en el DOM.");
        return;
    }
    errorMessage.textContent = message;  // Muestra el mensaje de error específico
    errorMessage.classList.remove("hidden");

    // Ocultar mensaje de error automáticamente después de 10 segundos
    setTimeout(() => {
        hideError(); // Usa la función ya creada
    }, 10000);
}

// Función para ocultar el mensaje de error
function hideError() {
    const errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
        console.error("El elemento 'error-message' no existe en el DOM.");
        return;
    }
    errorMessage.classList.add("hidden");
}

// Temporizador para ocultar el certificado
let certificadoTimeout;
function mostrarCertificadoTemporalmente() {
    clearTimeout(certificadoTimeout);
    certificadoTimeout = setTimeout(() => {
        const certificadoContainer = document.getElementById("certificado-container");
        if (!certificadoContainer) {
            console.error("El elemento 'certificado-container' no existe en el DOM.");
            return;
        }
        certificadoContainer.classList.add("hidden");
    }, 20000);
}

// Evento principal asociado al botón "mostrar-certificado"
document.getElementById("mostrar-certificado").addEventListener("click", async function () {
    const cedula = document.getElementById("cedula");
    const certificadoContainer = document.getElementById("certificado-container");
    const certificadoCanvas = document.getElementById("certificado-canvas");
    const descargarCertificado = document.getElementById("descargar-certificado");

    // Validaciones iniciales
    if (!cedula) {
        console.error("El elemento 'cedula' no existe en el DOM.");
        return;
    }
    if (!certificadoContainer || !certificadoCanvas || !descargarCertificado) {
        console.error("Uno o más elementos necesarios no existen en el DOM.");
        return;
    }

    if (!cedula.value) {
        showError("Por favor, ingrese su cédula.");
        return;
    }

    showLoading();
    hideError();

    const url = `certificados/${cedula.value}.pdf`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("No se encontró un certificado para este documento... Por favor, ¡acérquese a las oficinas de bienestar!");
        }
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        // Mostrar el certificado y preparar la descarga
        certificadoContainer.classList.remove("hidden");
        descargarCertificado.href = objectURL;
        descargarCertificado.download = `${cedula.value}.pdf`;

        // Usar pdfjsLib para mostrar el PDF en un canvas
        const pdf = await pdfjsLib.getDocument(objectURL).promise;
        const page = await pdf.getPage(1);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        certificadoCanvas.width = viewport.width;
        certificadoCanvas.height = viewport.height;
        const context = certificadoCanvas.getContext("2d");

        // Renderizar la página en el canvas
        await page.render({
            canvasContext: context,
            viewport,
        });

        hideLoading();
        // Quitar el fondo cuando se muestra el certificado
        document.body.classList.add("no-background");

        // Iniciar el temporizador para ocultar el certificado
        mostrarCertificadoTemporalmente();

    } catch (error) {
        hideLoading();
        showError(error.message || "Hubo un problema al cargar el certificado.");
    }
});





// SCRIPT PARA QUE AL PRESIONAR "ENTER" TAMBIÉN CARGUE LA IMG

document.addEventListener('keydown', (event) => {
    const mostrarCertificado = document.getElementById("mostrar-certificado");

    if (!mostrarCertificado) {
        console.error("El botón 'mostrar-certificado' no existe en el DOM.");
        return;
    }

    if (event.key === "Enter" && document.activeElement.id === "cedula") {
        event.preventDefault(); // Previene que el formulario se envíe
        mostrarCertificado.click(); // Simula el clic del botón
    }
});
