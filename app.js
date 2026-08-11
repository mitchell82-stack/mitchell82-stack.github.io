const movies = [
  {
    id: 0,
    title: "Happy New Year",
    year: 2014,
    duration: "180 min",
    rating: 4.8,
    genre: "Accion / Comedia",
    type: "special",
    poster: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_.jpg",
    synopsis: "Un grupo de bailarines se infiltra en una competencia de baile para llevar a cabo un atraco.",
    times: ["14:30", "17:00", "19:30", "22:00"]
  },
  {
    id: 1,
    title: "3 Idiots",
    year: 2009,
    duration: "170 min",
    rating: 4.9,
    genre: "Comedia / Drama",
    type: "special",
    poster: "https://www.tallengestore.com/cdn/shop/products/7381745172660A_9471a5fc-a3dc-4e1a-a157-e585d3351b6c.jpg?v=1683929430",
    synopsis: "Tres amigos navegan por la presion academica y descubren el verdadero significado del exito.",
    times: ["13:00", "16:00", "19:00"]
  },
  {
    id: 2,
    title: "Dilwale Dulhania Le Jayenge",
    year: 1995,
    duration: "189 min",
    rating: 4.7,
    genre: "Romance / Drama",
    type: "classic",
    poster: "https://m.media-amazon.com/images/M/MV5BNDM5ZWM2ZTktZTM5My00NGQzLWFkYmItZjAyNDU0ZTliOGIyXkEyXkFqcGc@._V1_.jpg",
    synopsis: "Dos jovenes se enamoran durante un viaje por Europa, pero deben enfrentar las tradiciones familiares.",
    times: ["15:00", "18:00"]
  },
  {
    id: 3,
    title: "Lagaan",
    year: 2001,
    duration: "224 min",
    rating: 4.6,
    genre: "Drama / Deportes",
    type: "classic",
    poster: "https://m.media-amazon.com/images/I/61U2mIts0pL._AC_UF894,1000_QL80_.jpg",
    synopsis: "Aldeanos indios desafian a los britanicos en un partido de cricket para librarse de impuestos injustos.",
    times: ["14:00", "18:30"]
  },
  {
    id: 4,
    title: "PK",
    year: 2014,
    duration: "153 min",
    rating: 4.8,
    genre: "Comedia / Ciencia ficcion",
    type: "special",
    poster: "https://www.tallengestore.com/cdn/shop/products/7381746122932A_60e870c7-fb41-40bb-9bfc-cffb7c6a05e8_large.jpg?v=1683929494",
    synopsis: "Un visitante de otro planeta hace preguntas imposibles sobre la vida en la Tierra.",
    times: ["12:30", "16:30", "20:30"]
  },
  {
    id: 5,
    title: "Dangal",
    year: 2016,
    duration: "161 min",
    rating: 4.9,
    genre: "Drama / Biografia",
    type: "special",
    poster: "https://m.media-amazon.com/images/M/MV5BMjA4NzcxNzQxNl5BMl5BanBnXkFtZTgwNTUzODQxMDI@._V1_.jpg",
    synopsis: "Un exluchador entrena a sus hijas para convertirlas en campeonas.",
    times: ["13:30", "17:30", "21:00"]
  }
];

const state = {
  currentSlide: 0,
  currentFilter: "all",
  searchTerm: "",
  booking: {
    movieId: null,
    date: "",
    time: "",
    selectedSeats: [],
    step: 1
  }
};

const BASE_PRICE = 25;
const VIP_EXTRA = 10;
const OCCUPIED_SEATS = new Set(["A3", "A4", "B6", "C2", "D7", "E5"]);
const DATE_FORMATTER = new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short" });
const DAY_FORMATTER = new Intl.DateTimeFormat("es-PE", { weekday: "short" });

function init() {
  buildHeroDots();
  renderMovies();
  hydrateBookingDates();
  bindFilters();
  bindSearch();
  bindDateSelector();
  showSlide(0);
  setInterval(() => changeSlide(1), 6000);
}

function buildHeroDots() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.getElementById("heroDots");

  if (!dots) {
    return;
  }

  dots.innerHTML = "";
  slides.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hero-dot${index === 0 ? " active" : ""}`;
    button.setAttribute("aria-label", `Ir al slide ${index + 1}`);
    button.addEventListener("click", () => showSlide(index));
    dots.appendChild(button);
  });
}

function showSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");

  if (!slides.length) {
    return;
  }

  state.currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === state.currentSlide);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === state.currentSlide);
  });
}

function changeSlide(direction) {
  showSlide(state.currentSlide + direction);
}

function renderMovies() {
  const grid = document.getElementById("moviesGrid");

  if (!grid) {
    return;
  }

  const filteredMovies = movies.filter((movie) => {
    const matchesFilter = state.currentFilter === "all" || movie.type === state.currentFilter;
    const search = state.searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      movie.title.toLowerCase().includes(search) ||
      movie.genre.toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = filteredMovies
    .map(
      (movie) => `
        <article class="movie-card">
          <div class="movie-poster">
            <img src="${movie.poster}" alt="${movie.title}">
            <span class="movie-badge ${movie.type === "classic" ? "tag-classic" : "tag-special"}">
              ${movie.type === "classic" ? "Clasico" : "Especial"}
            </span>
          </div>
          <div class="movie-content">
            <div class="movie-meta">
              <span>${movie.year}</span>
              <span>${movie.duration}</span>
              <span>${movie.rating}/5</span>
            </div>
            <h3>${movie.title}</h3>
            <p>${movie.genre}</p>
            <button class="btn-book" type="button" onclick="openBooking(${movie.id})">Reservar</button>
          </div>
        </article>
      `
    )
    .join("");
}

function bindFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentFilter = button.dataset.filter || "all";
      document.querySelectorAll(".filter-btn").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      renderMovies();
    });
  });
}

function bindSearch() {
  const input = document.getElementById("searchInput");

  if (!input) {
    return;
  }

  input.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    renderMovies();
  });
}

function hydrateBookingDates() {
  const buttons = document.querySelectorAll(".date-btn");
  const today = new Date("2026-08-11T12:00:00");
  const dayLabels = ["Hoy", "Mie", "Jue", "Vie", "Sab", "Dom", "Lun"];

  buttons.forEach((button, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    const dayLabel = index === 0 ? dayLabels[0] : capitalize(DAY_FORMATTER.format(date).replace(".", ""));
    const dateLabel = capitalize(DATE_FORMATTER.format(date).replace(".", ""));
    const dayElement = button.querySelector(".day");
    const dateElement = button.querySelector(".date");

    button.dataset.date = isoDate;
    button.classList.toggle("active", index === 0);

    if (dayElement) {
      dayElement.textContent = dayLabel;
    }

    if (dateElement) {
      dateElement.textContent = dateLabel;
    }
  });
}

function bindDateSelector() {
  document.querySelectorAll(".date-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".date-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.booking.date = button.dataset.date || "";
      state.booking.time = "";
      renderTimes();
    });
  });
}

function openBooking(movieId) {
  const movie = movies.find((item) => item.id === movieId);
  const modal = document.getElementById("bookingModal");
  const firstDateButton = document.querySelector(".date-btn.active") || document.querySelector(".date-btn");

  if (!movie || !modal || !firstDateButton) {
    return;
  }

  state.booking = {
    movieId,
    date: firstDateButton.dataset.date || "",
    time: "",
    selectedSeats: [],
    step: 1
  };

  renderBookingMovie(movie);
  renderTimes();
  renderSeats();
  updateBookingSummary();
  updateSteps();
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeBooking() {
  const modal = document.getElementById("bookingModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function renderBookingMovie(movie) {
  const container = document.getElementById("bookingMovie");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <div class="booking-movie-info">
      <h3>${movie.title}</h3>
      <p>${movie.genre}</p>
      <p>${movie.duration} | ${movie.year}</p>
    </div>
  `;
}

function renderTimes() {
  const movie = getSelectedMovie();
  const container = document.getElementById("timeSelector");

  if (!movie || !container) {
    return;
  }

  container.innerHTML = movie.times
    .map(
      (time) => `
        <button
          type="button"
          class="time-slot${state.booking.time === time ? " active" : ""}"
          data-time="${time}"
        >
          ${time}
        </button>
      `
    )
    .join("");

  container.querySelectorAll(".time-slot").forEach((button) => {
    button.addEventListener("click", () => {
      state.booking.time = button.dataset.time || "";
      renderTimes();
      updateBookingSummary();
    });
  });
}

function renderSeats() {
  const container = document.getElementById("seatsContainer");

  if (!container) {
    return;
  }

  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  container.innerHTML = rows
    .map((row) => {
      const seats = Array.from({ length: seatsPerRow }, (_, index) => {
        const seatNumber = index + 1;
        const seatId = `${row}${seatNumber}`;
        const isVip = row === "D" || row === "E";
        const isOccupied = OCCUPIED_SEATS.has(seatId);
        const isSelected = state.booking.selectedSeats.includes(seatId);

        return `
          <button
            type="button"
            class="seat ${isVip ? "vip" : "available"}${isOccupied ? " occupied" : ""}${isSelected ? " selected" : ""}"
            data-seat="${seatId}"
            ${isOccupied ? "disabled" : ""}
          >
            ${seatNumber}
          </button>
        `;
      }).join("");

      return `
        <div class="seat-row">
          <span class="row-label">${row}</span>
          ${seats}
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".seat").forEach((button) => {
    if (button.disabled) {
      return;
    }

    button.addEventListener("click", () => toggleSeat(button.dataset.seat || ""));
  });
}

function toggleSeat(seatId) {
  if (!seatId) {
    return;
  }

  const seatIndex = state.booking.selectedSeats.indexOf(seatId);

  if (seatIndex >= 0) {
    state.booking.selectedSeats.splice(seatIndex, 1);
  } else {
    state.booking.selectedSeats.push(seatId);
    state.booking.selectedSeats.sort();
  }

  renderSeats();
  updateBookingSummary();
}

function updateBookingSummary() {
  const movie = getSelectedMovie();
  const selectedCount = document.getElementById("selectedCount");
  const totalPrice = document.getElementById("totalPrice");
  const summaryMovie = document.getElementById("summaryMovie");
  const summaryTime = document.getElementById("summaryTime");
  const summarySeats = document.getElementById("summarySeats");
  const summaryTotal = document.getElementById("summaryTotal");
  const continueButton = document.getElementById("btnContinueStep2");

  const seats = state.booking.selectedSeats;
  const total = calculateTotal();

  if (selectedCount) {
    selectedCount.textContent = String(seats.length);
  }

  if (totalPrice) {
    totalPrice.textContent = `S/ ${total.toFixed(2)}`;
  }

  if (summaryMovie) {
    summaryMovie.textContent = movie ? movie.title : "-";
  }

  if (summaryTime) {
    summaryTime.textContent = state.booking.time && state.booking.date ? `${state.booking.date} - ${state.booking.time}` : "-";
  }

  if (summarySeats) {
    summarySeats.textContent = seats.length ? seats.join(", ") : "-";
  }

  if (summaryTotal) {
    summaryTotal.textContent = `S/ ${total.toFixed(2)}`;
  }

  if (continueButton) {
    continueButton.disabled = seats.length === 0;
  }
}

function calculateTotal() {
  return state.booking.selectedSeats.reduce((total, seatId) => {
    const isVip = seatId.startsWith("D") || seatId.startsWith("E");
    return total + BASE_PRICE + (isVip ? VIP_EXTRA : 0);
  }, 0);
}

function goToStep(step) {
  if (step === 2 && !state.booking.time) {
    alert("Selecciona un horario antes de continuar.");
    return;
  }

  if (step === 3 && state.booking.selectedSeats.length === 0) {
    alert("Selecciona al menos una butaca antes de continuar.");
    return;
  }

  state.booking.step = step;
  updateSteps();
}

function updateSteps() {
  document.querySelectorAll(".step").forEach((stepElement) => {
    const stepNumber = Number(stepElement.dataset.step);
    stepElement.classList.toggle("active", stepNumber === state.booking.step);
    stepElement.classList.toggle("completed", stepNumber < state.booking.step);
  });

  document.querySelectorAll(".step-line").forEach((line, index) => {
    line.classList.toggle("completed", index + 1 < state.booking.step);
  });

  document.querySelectorAll(".step-content").forEach((content) => {
    content.classList.remove("active");
  });

  const activeContent = document.getElementById(`step${state.booking.step}`);
  if (activeContent) {
    activeContent.classList.add("active");
  }
}

function confirmBooking() {
  const name = document.getElementById("buyerName")?.value.trim() || "";
  const email = document.getElementById("buyerEmail")?.value.trim() || "";
  const phone = document.getElementById("buyerPhone")?.value.trim() || "";
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || "";

  if (!name || !email || !phone || !paymentMethod) {
    alert("Completa todos los datos antes de confirmar la reserva.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Ingresa un correo electronico valido.");
    return;
  }

  if (state.booking.selectedSeats.length === 0 || !state.booking.time) {
    alert("La reserva no esta completa.");
    return;
  }

  const ticket = document.getElementById("ticketPreview");
  const movie = getSelectedMovie();

  if (ticket && movie) {
    ticket.innerHTML = `
      <div class="ticket-item"><span>Reserva</span><span>${cryptoRandomCode()}</span></div>
      <div class="ticket-item"><span>Pelicula</span><span>${movie.title}</span></div>
      <div class="ticket-item"><span>Fecha</span><span>${state.booking.date}</span></div>
      <div class="ticket-item"><span>Horario</span><span>${state.booking.time}</span></div>
      <div class="ticket-item"><span>Butacas</span><span>${state.booking.selectedSeats.join(", ")}</span></div>
      <div class="ticket-item"><span>Cliente</span><span>${name}</span></div>
      <div class="ticket-item"><span>Pago</span><span>${paymentMethod.toUpperCase()}</span></div>
      <div class="ticket-item"><span>Total</span><span>S/ ${calculateTotal().toFixed(2)}</span></div>
    `;
  }

  document.querySelectorAll(".step, .step-line").forEach((element) => element.classList.remove("active", "completed"));
  document.querySelectorAll(".step-content").forEach((content) => content.classList.remove("active"));
  document.getElementById("stepSuccess")?.classList.add("active");
}

function handleContact(event) {
  event.preventDefault();
  alert("Tu mensaje fue enviado correctamente.");
  event.target.reset();
}

function getSelectedMovie() {
  return movies.find((movie) => movie.id === state.booking.movieId) || null;
}

function capitalize(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function cryptoRandomCode() {
  return `SPCI-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

window.changeSlide = changeSlide;
window.openBooking = openBooking;
window.closeBooking = closeBooking;
window.goToStep = goToStep;
window.confirmBooking = confirmBooking;
window.handleContact = handleContact;

document.addEventListener("DOMContentLoaded", init);
