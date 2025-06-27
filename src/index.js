// ...existing code...

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch and render toys
  fetch("http://localhost:3000/toys")
    .then((resp) => resp.json())
    .then((toys) => {
      toys.forEach(renderToyCard);
    });

  // Toggle form display
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Handle new toy form submission
  toyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then((resp) => resp.json())
      .then((toy) => {
        renderToyCard(toy);
        toyForm.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      });
  });

  // Render a toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const btn = document.createElement("button");
    btn.className = "like-btn";
    btn.id = toy.id;
    btn.textContent = "Like ❤️";

    btn.addEventListener("click", function () {
      const newLikes = toy.likes + 1;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          likes: newLikes,
        }),
      })
        .then((resp) => resp.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          p.textContent = `${updatedToy.likes} Likes`;
        });
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(btn);

    toyCollection.appendChild(card);
  }
}
);