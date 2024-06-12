let fortuneMessages = [];
let currentFortuneIndex = null;

// Función para cargar las frases según el idioma
function loadFortunes(language) {
  if (language === "es") {
    fortuneMessages = fortuneMessagesEs;
  } else {
    fortuneMessages = fortuneMessagesEn;
  }
}

// Obtener el botón y el elemento de texto de la fortuna
const generateButton = document.querySelector(".generate-phrase");
const fortuneText = document.getElementById("fortune-text");
const modal = document.getElementById("fortuneModal");
const closeModal = document.querySelector(".close");

// Función para cargar y aplicar la traducción
function loadLanguage(language) {
  const script = document.createElement("script");
  script.src = language === "es" ? "fortuneMessagesEs.js" : "fortuneMessagesEn.js";
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
    localStorage.setItem('todayFortuneIndex', currentFortuneIndex); // Guardar el índice de la fortuna del día
    localStorage.setItem('fortuneDate', new Date().toISOString().split('T')[0]); // Guardar la fecha de hoy
  } else {
    console.error('No se pudo generar una fortuna. Verifique que las frases estén cargadas correctamente.');
  }
  showSparks();
}

// Función para mostrar la fortuna del día si ya existe
function displayTodayFortune() {
  const savedIndex = localStorage.getItem("todayFortuneIndex");
  const savedDate = localStorage.getItem("fortuneDate");
  const today = new Date().toISOString().split("T")[0];

  if (savedIndex !== null && savedDate === today) {
    currentFortuneIndex = parseInt(savedIndex, 10);
    fortuneText.textContent = `"${fortuneMessages[currentFortuneIndex]}"`;
  } else {
    hideSparks();
    generateRandomFortune();
  }
}

// Función para mostrar las imágenes de sparks
function showSparks() {
  const buttonRect = generateButton.getBoundingClientRect(); // Obtener la posición del botón
  const bodyRect = document.body.getBoundingClientRect(); // Obtener los límites del body
  const sparks = document.querySelectorAll(".spark");
  sparks.forEach((spark) => {
    spark.style.display = "block"; // Mostrar los sparks
  });

  for (let i = 0; i < 50; i++) {
    // Ajusta el número de sparks según sea necesario
    const spark = document.createElement("img");
    spark.src = "img/spark2.png"; // Reemplaza con la ruta correcta de tu imagen de spark
    spark.classList.add("spark");
    document.body.appendChild(spark);

    // Colocar el spark en la posición del botón
    spark.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
    spark.style.top = `${buttonRect.top + buttonRect.height / 2}px`;

    // Mover el spark a una posición aleatoria alrededor del botón dentro de los límites del body
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 300 + 50; // Ajusta el radio según sea necesario
    const offsetX = radius * Math.cos(angle);
    const offsetY = radius * Math.sin(angle);

    const targetX = buttonRect.left + buttonRect.width / 2 + offsetX;
    const targetY = buttonRect.top + buttonRect.height / 2 + offsetY;

    // Asegurarse de que el spark no se salga de los límites del body
    const maxX = bodyRect.width - spark.width;
    const maxY = bodyRect.height - spark.height;

    spark.style.left = `${Math.min(Math.max(targetX, 0), maxX)}px`;
    spark.style.top = `${Math.min(Math.max(targetY, 0), maxY)}px`;

    // Animar el spark a la nueva posición
    spark.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Eliminar el spark después de la animación
    spark.addEventListener("animationend", () => {
      spark.remove();
    });
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

// Función para manejar el clic en el botón
function handleButtonClick() {
  if (checkFortuneOpenedToday()) {
    modal.style.display = "flex";
  } else {
    generateRandomFortune();
    setFortuneOpenedToday();
  }
}

// Añadir un evento de escucha al botón
generateButton.addEventListener("click", handleButtonClick);

// Función para cerrar el modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Función para cambiar el idioma
function setLanguage(language) {
  loadLanguage(language);
}

// Definición de la función hideSparks
function hideSparks() {
  const sparks = document.querySelectorAll(".spark");
  sparks.forEach((spark) => {
    spark.style.display = "none";
  });
}

// Cargar el idioma preferido al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const preferredLanguage = localStorage.getItem("language") || "es";
  loadLanguage(preferredLanguage);
});

// Verificar que las frases se carguen correctamente al cambiar el idioma
function loadLanguage(language) {
  fetch(`${language}.json`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("title-text").textContent = data.title;
      document.getElementById("slogan").textContent = data.slogan;
      document.getElementById("reveal-button").textContent = data.reveal_button;
      document.getElementById("modal-message").innerHTML = data.modal_message; // Usar innerHTML para el mensaje del modal
      localStorage.setItem("language", language);
      loadFortunes(language); // Cargar las frases según el idioma
      translateFortune(); // Traducir la fortuna del día
    });
}

// Función para traducir la fortuna del día
function translateFortune() {
  const savedIndex = localStorage.getItem('todayFortuneIndex');
  if (savedIndex !== null) {
    const index = parseInt(savedIndex, 10);
    fortuneText.textContent = `"${fortuneMessages[index]}"`;
  }
}

// Manejar el cambio de idioma
document.getElementById("languageSwitch").addEventListener("change", (event) => {
  const language = event.target.checked ? "en" : "es";
  setLanguage(language);
  document.getElementById("languageSwitch").setAttribute("data-label", language.toUpperCase());
});
