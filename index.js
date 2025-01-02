


// Función para mostrar el cargando
function showLoading() {
    const loadingContainer = document.getElementById("loading-container");
    loadingContainer.classList.remove("hidden");
}

// Función para ocultar el cargando
function hideLoading() {
    const loadingContainer = document.getElementById("loading-container");
    loadingContainer.classList.add("hidden");
}

// Función para mostrar el mensaje de error
function showError(message = "Ocurrió un error") {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;  // Muestra el mensaje de error específico
    errorMessage.classList.remove("hidden");

    // Ocultar mensaje de error automáticamente después de 10 segundos
    setTimeout(() => {
        errorMessage.classList.add("hidden");
    }, 10000);
}

// Función para ocultar el mensaje de error
function hideError() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.classList.add("hidden");
}







document.getElementById("mostrar-certificado").addEventListener("click", async function () {
    const cedula = document.getElementById("cedula").value;
    const certificadoContainer = document.getElementById("certificado-container");
    const certificadoCanvas = document.getElementById("certificado-canvas");
    const descargarCertificado = document.getElementById("descargar-certificado");

    if (!cedula) {
        showError("Por favor, ingrese su cédula.");
        return;
    }

    showLoading();
    hideError();

    const url = `certificados/${cedula}.pdf`;

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
        descargarCertificado.download = `${cedula}.pdf`;

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

        // Ocultar la imagen después de 10 segundos
        setTimeout(() => {
            certificadoContainer.classList.add("hidden");
        }, 20000);

    } catch (error) {
        hideLoading();
        showError(error.message || "Hubo un problema al cargar el certificado.");
    }
});