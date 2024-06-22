let fortuneMessages = [];
let backgroundImage = "";
let currentFortuneIndex = null;

// Función para cargar las frases según el idioma
function loadFortunes(language) {
  if (language === "es") {
    fortuneMessages = fortuneMessagesEs;
  } else {
    fortuneMessages = fortuneMessagesEn;
  }
}

// Obtener los elementos del DOM
const generateButton = document.querySelector(".generate-phrase");
const fortuneText = document.getElementById("fortune-text");
const modalF = document.getElementById("fortuneModal");
const closeModalF = document.querySelector(".close-fortune");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const shareButton = document.getElementById("share-button");
const viewButton = document.getElementById("view-button");
const closeModal = document.querySelector(".close");
const languageSwitch = document.getElementById("languageSwitch");

// Función para cargar y aplicar la traducción
function loadLanguage(language) {
  const script = document.createElement("script");
  script.src =
    language === "es" ? "fortuneMessagesEs.js" : "fortuneMessagesEn.js";
  document.head.appendChild(script);
  script.onload = () => {
    loadFortunes(language);
    localStorage.setItem("language", language);
    updateUIWithTranslations(language); // Función para actualizar la UI con las traducciones
    displayTodayFortune(); // Mostrar la fortuna del día si ya existe
  };
}

// Función para generar y mostrar una fortuna aleatoria
function generateRandomFortune() {
  currentFortuneIndex = Math.floor(Math.random() * fortuneMessages.length);
  const randomFortune = fortuneMessages[currentFortuneIndex];
  if (randomFortune) {
    fortuneText.textContent = `"${randomFortune}"`;
    localStorage.setItem("todayFortuneIndex", currentFortuneIndex); // Guardar el índice de la fortuna del día
    localStorage.setItem("fortuneDate", new Date().toISOString().split("T")[0]); // Guardar la fecha de hoy
  } else {
    console.error(
      "No se pudo generar una fortuna. Verifique que las frases estén cargadas correctamente."
    );
  }
  showShareButton(); // Mostrar el botón de compartir
}

// Función para mostrar la fortuna del día si ya existe
function displayTodayFortune() {
  const savedIndex = localStorage.getItem("todayFortuneIndex");
  const savedDate = localStorage.getItem("fortuneDate");
  const today = new Date().toISOString().split("T")[0];

  if (savedIndex !== null && savedDate === today) {
    currentFortuneIndex = parseInt(savedIndex, 10);
    fortuneText.textContent = `"${fortuneMessages[currentFortuneIndex]}"`;
    showShareButton(); // Mostrar el botón de compartir si ya se ha revelado la fortuna
  }
}

// Función para comprobar si la galleta de la fortuna ya fue abierta hoy
function checkFortuneOpenedToday() {
  const lastOpened = localStorage.getItem("fortuneLastOpened");
  if (!lastOpened) return false;

  const lastOpenedDate = new Date(lastOpened);
  const today = new Date();

  return lastOpenedDate.toDateString() === today.toDateString();
}

// Función para registrar la fecha de apertura de la galleta de la fortuna
function setFortuneOpenedToday() {
  const today = new Date();
  localStorage.setItem("fortuneLastOpened", today.toString());
}

// Función para manejar el clic en el botón "Revelar"
function handleButtonClick() {
  if (checkFortuneOpenedToday()) {
    // Mostrar el modal si la fortuna ya fue revelada hoy
    modalF.style.display = "flex";
  } else {
    // Generar y mostrar una nueva fortuna
    generateRandomFortune();
    setFortuneOpenedToday();
    languageSwitch.disabled = true; // Deshabilitar el cambio de idioma
    languageSwitch.classList.add("disabled"); // Añadir clase para estilo en escala de grises
    generateButton.disabled = false; // Habilitar el botón de revelar
  }
}

// Añadir un evento de escucha al botón "Revelar"
generateButton.addEventListener("click", handleButtonClick);

// Función para cerrar el modal
closeModalF.addEventListener("click", () => {
  modalF.style.display = "none";
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener("click", (event) => {
  if (event.target === modalF) {
    modalF.style.display = "none";
  }
});

// Cargar el idioma preferido al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const preferredLanguage = localStorage.getItem("language") || "es";
  loadLanguage(preferredLanguage);
  generateImage(preferredLanguage).then(() => {
    displayTodayFortune(); // Mostrar la fortuna del día si ya existe
  });
  
  const today = new Date().toISOString().split("T")[0];
  const savedDate = localStorage.getItem("fortuneDate");

  // Deshabilitar el cambio de idioma si ya se ha revelado la fortuna hoy
  if (savedDate === today) {
    languageSwitch.disabled = true;
    languageSwitch.classList.add("disabled");
    generateButton.disabled = true;
  }
});

// Función para cargar la imagen de fondo según el idioma
function loadBackgroundImage(language) {
  return language === "es" ? "img/bg-imgEN.jpg" : "img/bg-imgES.jpg";
}

// Verificar que las frases se carguen correctamente al cambiar el idioma
function loadLanguage(language) {
  fetch(`${language}.json`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("title-text").textContent = data.title;
      document.getElementById("slogan").textContent = data.slogan;
      document.getElementById("reveal-button").textContent = data.reveal_button;
      document.getElementById("modal-message").innerHTML = data.modal_message;
      document.getElementById("share-button").textContent = data.share_button;
      document.getElementById("view-button").textContent = data.view_button;
      // Usar innerHTML para el mensaje del modal
      localStorage.setItem("language", language);
      loadFortunes(language); // Cargar las frases según el idioma
      translateFortune(); // Traducir la fortuna del día
    });
}

// Función para cargar y establecer el idioma
function setLanguage(language) {
  loadLanguage(language);

  // Generar la imagen con el texto aleatorio y la imagen de fondo según el idioma
  generateImage(language).then(() => {
    displayTodayFortune(); // Mostrar la fortuna del día si ya existe
  });
}

// Función para traducir la fortuna del día
function translateFortune() {
  const savedIndex = localStorage.getItem("todayFortuneIndex");
  if (savedIndex !== null) {
    const index = parseInt(savedIndex, 10);
    fortuneText.textContent = `"${fortuneMessages[index]}"`;
  }
}

// Manejar el cambio de idioma
document
  .getElementById("languageSwitch")
  .addEventListener("change", (event) => {
    const language = event.target.checked ? "en" : "es";
    setLanguage(language);
    document
      .getElementById("languageSwitch")
      .setAttribute("data-label", language.toUpperCase());
  });

// Función para mostrar el botón de compartir
function showShareButton() {
  shareButton.style.display = "inline-block";
  viewButton.style.display = "inline-block";
}

// Función para obtener el nombre del archivo de acuerdo al idioma y la fecha
function getFilename() {
  const language = localStorage.getItem("language") || "es";
  const date = new Date();
  let formattedDate;

  if (language === "es") {
    // Formato de fecha para español: dd/mm/yy
    formattedDate = `${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;
    return `miFortuna-${formattedDate}.png`;
  } else {
    // Formato de fecha para inglés: mm/dd/yy
    formattedDate = `${("0" + (date.getMonth() + 1)).slice(-2)}/${(
      "0" + date.getDate()
    ).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;
    return `myFortune-${formattedDate}.png`;
  }
}

// Añadir evento al botón de compartir
shareButton.addEventListener("click", () => {
  generateImage(); // Generar la imagen con texto
  setTimeout(() => {
    // Esperar un breve momento para asegurarse de que generateImage() haya terminado
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const language = localStorage.getItem("language");
      const date = new Date().toLocaleDateString(
        language === "es" ? "es-ES" : "en-US"
      );
      const fileName =
        language === "es" ? `miFortuna-${date}.png` : `myFortune-${date}.png`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }, 100); // Esperar 100ms (ajusta según sea necesario)
});

// Añadir evento al botón de ver para mostrar el modal de imagen
viewButton.addEventListener("click", () => {
  generateImage().then(() => {
    // Esperar a que generateImage() termine
    const imageModal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modal-image");
    modalImage.src = canvas.toDataURL(); // Establecer la imagen generada en el modal
    imageModal.style.display = "flex";
  });
});

// Función para generar la imagen con el texto aleatorio
function generateImage(language) {
  return new Promise((resolve, reject) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtener la imagen de fondo según el idioma
    const backgroundImage = loadBackgroundImage(language);

    // Crear una nueva imagen de fondo
    const img = new Image();
    img.onload = function () {
      // Establecer el tamaño del canvas al tamaño de la imagen
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar la imagen de fondo en el canvas
      ctx.drawImage(img, 0, 0);

      // Estilos para el texto
      ctx.font = "60px Futura";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = fortuneText.textContent; // Obtener la frase aleatoria generada
      const x = canvas.width / 2;
      const y = canvas.height / 2;

      // Ajustar el texto para que se divida en líneas si es muy largo
      const maxWidth = canvas.width - 100; // Ajusta el ancho máximo según sea necesario
      const lineHeightFactor = 1.55;
      const lineHeight = 50; // Ajusta la altura de la línea según sea necesario
      const lines = wrapText(ctx, text, x, y, maxWidth, lineHeight);

      // Calcular la posición y para cada línea de texto
      lines.forEach((line, i) => {
        const offsetY = i * lineHeight * lineHeightFactor;
        ctx.fillText(line, x, y + offsetY);
      });

      resolve(); // Resolvemos la promesa después de completar la generación
    };

    // Manejar errores de carga de la imagen de fondo
    img.onerror = function () {
      console.error("Error al cargar la imagen de fondo.");
      reject("Error al cargar la imagen de fondo.");
    };

    // Establecer la ruta de la imagen de fondo
    img.src = backgroundImage;
  });
}

// Función para dividir el texto en líneas según el ancho máximo
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && line.length > 0) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  });

  lines.push(line.trim());
  return lines;
}

// Cerrar el modal de imagen
const imageCloseButton = document.querySelector("#imageModal .close");
imageCloseButton.addEventListener("click", () => {
  document.getElementById("imageModal").style.display = "none";
});

// Cerrar el modal de imagen si se hace clic fuera de él
window.addEventListener("click", (event) => {
  const imageModal = document.getElementById("imageModal");
  if (event.target === imageModal) {
    imageModal.style.display = "none";
  }
});
