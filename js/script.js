// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const button = document.querySelector('.filters button');

// Call the setupDateInputs function from dateRange.js
setupDateInputs(startInput, endInput);

// Use your own NASA API key here if you have one
const API_KEY = 'xHWrSmPTSqXygOX33mUaEdt5Rghflf05Z7H38Ua0';

// Random space facts for extra credit
const spaceFacts = [
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? Neutron stars can spin over 600 times per second.",
  "Did you know? A sunset on Mars appears blue.",
  "Did you know? Jupiter has the shortest day of all the planets.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? The footprints on the Moon can last for millions of years.",
  "Did you know? Saturn could float in water because it is mostly made of gas.",
  "Did you know? Light from the Sun takes about 8 minutes to reach Earth."
];

// Show a random fact when the page loads
showRandomFact();

button.addEventListener('click', fetchSpaceImages);

async function fetchSpaceImages() {
  const startDate = startInput.value;
  

  if (!startDate) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
      </div>
    `;
    return;
  }

  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos...</p>
    </div>
  `;

  try {
   // Calculate exactly 9 days
const calculatedEndDate = new Date(startDate);
calculatedEndDate.setDate(calculatedEndDate.getDate() + 8);

const todayDate = new Date();

const finalEndDate = calculatedEndDate > todayDate
  ? todayDate.toISOString().split('T')[0]
  : calculatedEndDate.toISOString().split('T')[0];

// Update the end date input visually
endInput.value = finalEndDate;

// Use calculated end date in API call
const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${finalEndDate}`;
const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch NASA data.');
    }

    const data = await response.json();

    // Reverse so newest appears first
    data.reverse();

    displayGallery(data);
  } catch (error) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">❌</div>
        <p>Sorry, something went wrong while loading the images.</p>
      </div>
    `;
    console.error(error);
  }
}

function displayGallery(items) {
  gallery.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-item';

    // Handle videos for extra credit
    let mediaHTML = '';

    if (item.media_type === 'image') {
      mediaHTML = `<img src="${item.url}" alt="${item.title}" />`;
    } else if (item.media_type === 'video') {
      mediaHTML = `
        <div class="video-entry">
          <p><strong>Video Entry</strong></p>
          <a href="${item.url}" target="_blank">Watch the NASA video</a>
        </div>
      `;
    } else {
      mediaHTML = `<p>Media not available.</p>`;
    }

    card.innerHTML = `
      ${mediaHTML}
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    card.addEventListener('click', () => openModal(item));

    gallery.appendChild(card);
  });
}

function openModal(item) {
  const oldModal = document.querySelector('.modal-overlay');
  if (oldModal) oldModal.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  let modalMedia = '';

  if (item.media_type === 'image') {
    modalMedia = `<img src="${item.hdurl || item.url}" alt="${item.title}" class="modal-image" />`;
  } else if (item.media_type === 'video') {
    modalMedia = `
      <div class="modal-video-link">
        <p>This APOD entry is a video.</p>
        <a href="${item.url}" target="_blank">Open video</a>
      </div>
    `;
  }

  modalOverlay.innerHTML = `
    <div class="modal">
      <button class="close-modal">&times;</button>
      ${modalMedia}
      <h2>${item.title}</h2>
      <p><strong>${item.date}</strong></p>
      <p>${item.explanation}</p>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeButton = modalOverlay.querySelector('.close-modal');

  closeButton.addEventListener('click', () => {
    modalOverlay.remove();
  });

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
}

function showRandomFact() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];

  const factBox = document.createElement('div');
  factBox.className = 'space-fact';
  factBox.innerHTML = `<strong>Did You Know?</strong> ${fact}`;

  const container = document.querySelector('.container');
  const filters = document.querySelector('.filters');
  container.insertBefore(factBox, filters);
}