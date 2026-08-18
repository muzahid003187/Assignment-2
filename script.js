let selectedDrinks = 0;
let selectedList = [];

const defaultSearches = [
    "margarita",
    "martini",
    "mojito"
];

async function loadDefaultDrinks() {
    let drinks = [];

    for (const item of defaultSearches) {
        const response = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${item}`
        );

        const data = await response.json();

        if (data.drinks) {
            drinks = drinks.concat(data.drinks);
        }
    }

    displayDrinks(drinks.slice(0, 10));
}

function displayDrinks(drinks) {
    const container =
        document.getElementById("drink-container");

    container.innerHTML = "";

    if (!drinks || drinks.length === 0) {
        container.innerHTML =
            "<h2>Not Found</h2>";

        return;
    }

    drinks.forEach((drink) => {
        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${drink.strDrinkThumb}">

            <h3>${drink.strDrink}</h3>

            <p>${drink.strCategory}</p>

            <p>
                ${drink.strInstructions.slice(0, 15)}...
            </p>

            <button onclick="addToGroup('${drink.strDrink}', '${drink.strDrinkThumb}', this)">
                Add to cart
            </button>

            <button onclick="showDetails('${drink.idDrink}')">
                Details
            </button>
        `;

        container.appendChild(card);
    });
}

document
    .getElementById("search-btn")
    .addEventListener("click", searchDrink);

function searchDrink() {
    const value = document.getElementById("search-input").value.trim();

    if (!value) {
        displayDrinks([]);
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${value}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.drinks) {
                displayDrinks(data.drinks);
            } else {
                displayDrinks([]);
            }
        })
        .catch(() => {
            displayDrinks([]);
        });
}


function addToGroup(name, img, btn) {
    const existing = Array.from(document.querySelectorAll("#group-list li span:last-child"))
        .some(span => span.innerText === name);

    if (existing) {
        btn.innerText = "Already selected";
        btn.disabled = true;
        return;
    }

    if (selectedDrinks >= 7) {
        document.getElementById("modal-body").innerHTML = `
            <h2>Limit Reached</h2>
            <p>You cannot add more than 7 drinks.</p>
        `;
        document.getElementById("modal").style.display = "block";
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <span>${selectedDrinks + 1}.</span>
        <img src="${img}" alt="${name}" class="cart-img">
        <span>${name}</span>
    `;

    document.getElementById("group-list").appendChild(li);

    selectedDrinks++;
    document.getElementById("drink-count").innerText = selectedDrinks;

    btn.innerText = "Already selected";
    btn.disabled = true;

    if (selectedDrinks === 7) {
        document.getElementById("modal-body").innerHTML = `
            <h2>Limit Reached</h2>
            <p>You have selected 7 drinks. No more can be added.</p>
        `;
        document.getElementById("modal").style.display = "block";
    }
}

function showDetails(id) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((response) => response.json())
        .then((data) => {
            const drink = data.drinks[0];

            document.getElementById("modal-body").innerHTML = `
                <h2>${drink.strDrink}</h2>
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <p><strong>Category:</strong> ${drink.strCategory}</p>
                <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
                <p><strong>Glass:</strong> ${drink.strGlass}</p>
                <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
            `;

            document.getElementById("modal").style.display = "block";
        });
}

document
    .querySelector(".close")
    .addEventListener("click", () => {
        document.getElementById(
            "modal"
        ).style.display = "none";
    });

loadDefaultDrinks();
