async function fetchJSONData(target) {
  try {
    if (target === "products") {
      const urlParams = new URLSearchParams(window.location.search)
      const param = urlParams.get("query")
      if (param == null) {
        return []
      }
      let res = await fetch(`/data/${param}.json`)
      if (!res.ok) {
        throw new Error(`Data error: Cannot fetch Products.`)
      }
      let data = await res.json()
      return data
    } else if (target === "events") {
      let res = await fetch(`/data/events.json`)
      if (!res.ok) {
        throw new Error(`Data error: Cannot fetch Events.`)
      }
      let data = await res.json()
      return data
    }
  } catch (error) {
    console.error("Unable to fetch data:", error)
    return []
  }
}

const resProducts = fetchJSONData("products")

renderProducts(resProducts)

function renderProducts(resData) {
  resData.then((data) => {
    const cartItemIDs = localStorage.getItem("cart-items")
      ? JSON.parse(localStorage.getItem("cart-items")).map((item) => item.id)
      : []
    if (document.querySelector(".main-products")) {
      document.querySelector(".main-products").innerHTML = data
        .map(
          (product) =>
            `
          <div class="item-product" id="${product.id}">
            <div class="item-product-outer" onclick="openDetailsModal('${
              product.id
            }')">
              <div class="img-container">
                  <img src="${product.img}" alt="product" />
              </div>
              <div class="product-info">
                  <div>
                      <h4 class="font-onest-semibold">${product.name}</h4>
                      <span>$${product.price}</span>
                  </div>
                  
              </div>
              </div>
              <button class="icon-bag" onclick="(() => {
                cart.add('${product.id}', '${product.name}', ${product.price})
                renderProducts(resProducts)
              })()">
                      ${
                        !cartItemIDs.includes(product.id)
                          ? "<i class='fa-solid fa-bag-shopping'></i>"
                          : "<i class='fa-solid fa-check'></i>"
                      }
              </button>
          </div>
        `
        )
        .join("")
    }
  })
}

function openDetailsModal(product_id) {
  const cartItemIDs = localStorage.getItem("cart-items")
    ? JSON.parse(localStorage.getItem("cart-items")).map((item) => item.id)
    : []
  resProducts.then((products) => {
    const product = products.find((product) => product.id === product_id)
    const div = document.createElement("div")
    div.classList.add("modal", "product-details-modal")
    div.innerHTML = `
    <div class="first-layer">
      <div class="img-container">
        <img src="${product.img}" alt="product" />
      </div>
      <div class="brief-container">
        <h4 class="font-onest-semibold">${product.name}</h4>
        <span>$${product.price}</span>
        <button class="secbtn-addtocart" id="opendetails-add-${
          product.id
        }" onclick="handleOpenDetailsAddOnClick('${product.id}', '${
      product.name
    }', ${product.price})">
          <i class="fa-solid fa-bag-shopping"></i>
          <span>${
            !cartItemIDs.includes(product.id) ? "Add to Cart" : "Added"
          }</span>
        </button>
      </div>
    </div>
    <div class="details-container">
      <p>${product.description}</p>
      <h4>Tasting Notes</h4>
      <ul>
        ${product.tastingNotes.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <h4>Recommended Brewing Methods</h4>
      <ul>
        ${product.recommendedBrewingMethods
          .map((item) => `<li>${item}</li>`)
          .join("")}
      </ul>
    </div>
        `

    const divBackdrop = document.createElement("div")
    divBackdrop.classList.add(
      "modal-backdrop",
      "bg-blur",
      "product-details-modal-backdrop"
    )
    document.body.appendChild(divBackdrop)
    document.body.appendChild(div)
    $(".product-details-modal-backdrop").fadeOut(0)
    $(".product-details-modal-backdrop").fadeIn(400)
    $(".product-details-modal").fadeOut(0)
    $(".product-details-modal").fadeIn(400)

    $(".product-details-modal-backdrop").click(() => {
      $(".product-details-modal").fadeOut(400)
      $(".product-details-modal-backdrop").fadeOut(400, () => {
        document.body.removeChild(div)
        document.body.removeChild(divBackdrop)
      })
    })
  })
}

function handleOpenDetailsAddOnClick(id, name, price) {
  cart.add(id, name, price)
  document.getElementById(
    `opendetails-add-${id}`
  ).innerHTML = `<i class="fa-solid fa-bag-shopping"></i><span>Added</span>`
}

function search() {
  const searchInput = document.getElementById("search-input")
  const searchValue = searchInput.value.toLowerCase()
  resProducts.then((products) => {
    const resFilteredProducts = new Promise((resolve) => {
      resolve(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchValue)
        )
      )
    })
    renderProducts(resFilteredProducts)
  })
}
