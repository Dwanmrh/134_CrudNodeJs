document.addEventListener("DOMContentLoaded", () => {
    const movieCards = document.querySelectorAll(".movie-card");
    const detailsTitle = document.getElementById("details-title");
    const detailsSynopsis = document.getElementById("details-synopsis");
    const selectedMovieId = document.getElementById("selected-movie-id");
    const buyTicketButton = document.getElementById("buy-ticket");
  
    movieCards.forEach((card) => {
      card.addEventListener("click", () => {
        const movieId = card.dataset.id;
        const movieTitle = card.querySelector(".card-title").innerText;
        const movieSynopsis = card.dataset.synopsis;
  
        detailsTitle.innerText = movieTitle;
        detailsSynopsis.innerText = movieSynopsis || "No synopsis available.";
        selectedMovieId.value = movieId;
  
        buyTicketButton.classList.remove("d-none");
      });
    });
  });
  