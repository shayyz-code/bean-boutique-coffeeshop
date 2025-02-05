// DEFAULT CONFIG

// Offer Modal
const getAuth = () => {
  const user = Cookies.get("user") || sessionStorage.getItem("user") || null
  return JSON.parse(user)
}

const user = getAuth()

if (user === null) {
  openWelcomeModal()
}

function openWelcomeModal() {
  const div = document.createElement("div")
  div.classList.add("modal", "welcome-modal")

  const auth = getAuth()
  if (auth === null || auth.email === "anonymous") {
    div.innerHTML = `
    <button id="welcome-modal-close" class="icon-close"><i class="fa-solid fa-x"></i></button>
    <h2>Welcome to <span class="highlight-title">Bean Boutique</span> ☕</h2>
    <p>Sign up with your email to get a discount up to <span class="em-">35%</span> on your first purchase.</p>
    <form id="welcome-modal-form">
    <input id="welcome-modal-input-email" type="email" placeholder="Email" class="textinput-email" required />
    <input id="welcome-modal-input-password" type="password" placeholder="Password" class="textinput-password" required />
    <div>
    <button id="welcome-modal-login" class="secbtn-login">Log In</button>
    /
    <button id="welcome-modal-signup" class="secbtn-signup">Sign Up</button>
    </div>
    <span id="welcome-modal-error" class="err-signinup"></span>
    </form>
    `
  } else {
    div.innerHTML = `
      <button id="welcome-modal-close" class="icon-close"><i class="fa-solid fa-x"></i></button>
      <h2>Sign <span class="highlight-title">Out</span>?</h2>
      <p>Are you sure you want to sign out?</p>
      <div>
        <button id="welcome-modal-signout" class="secbtn-signout" onclick="signOut()">Sign Out</button>
      </div>
      `
  }
  const divBackdrop = document.createElement("div")
  divBackdrop.classList.add(
    "modal-backdrop",
    "bg-blur",
    "welcome-modal-backdrop"
  )
  document.body.appendChild(divBackdrop)
  document.body.appendChild(div)

  $(".welcome-modal-backdrop").fadeOut(0)
  $(".welcome-modal-backdrop").fadeIn(400)
  $(".welcome-modal").fadeOut(0)
  $(".welcome-modal").fadeIn(400)

  $("#welcome-modal-close").click(() => {
    sessionStorage.setItem(
      "user",
      JSON.stringify({ email: "anonymous", password: "" })
    )
    closeWelcomeModal()
  })

  $("#welcome-modal-form").on("submit", (e) => {
    e.preventDefault()
    const submitterID = e.originalEvent.submitter.id
    const email = $("#welcome-modal-input-email").val()
    const password = $("#welcome-modal-input-password").val()
    const value = { email, password }
    if (submitterID === "welcome-modal-signup") {
      signUp(value)
    } else if (submitterID === "welcome-modal-login") {
      logIn(value, true)
    }
  })
}

// login cookie procedure controlled with a boolean to be reusable
async function logIn(value, setCookie) {
  const users = JSON.parse(localStorage.getItem("users")) || null
  const isVerified = await verifyUser(value.email, value.password)
  if (users === null || !isVerified) {
    $("#welcome-modal-error").text("No user found with the provided email.")
    return { status: false }
  } else {
    if (setCookie) {
      Cookies.set(
        "user",
        JSON.stringify({ email: value.email, password: "" }),
        { expires: 3 }
      )
      closeWelcomeModal()
    }
    return { status: true }
  }
}

async function signUp(value) {
  const users = JSON.parse(localStorage.getItem("users")) || {}

  if (!users[value.email]) {
    await encryptAndStoreUser(value.email, value.password)
    logIn(value, true)
  } else {
    $("#welcome-modal-error").text("Email is already used.")
  }
}

function signOut() {
  sessionStorage.removeItem("user")
  Cookies.remove("user")
  closeWelcomeModal()
}

function closeWelcomeModal() {
  $(".welcome-modal").fadeOut(400)
  $(".welcome-modal-backdrop").fadeOut(400, () => {
    $(".welcome-modal").remove()
    $(".welcome-modal-backdrop").remove()
  })
}

// NAVIGATION

document.querySelectorAll("header nav li").forEach((item) => {
  if (item.getAttribute("data-links") === null) return
  const links = item.getAttribute("data-links").split(",")
  const box = document.createElement("div")
  box.classList.add("dropdown")
  box.innerHTML = links
    .map(
      (link) =>
        `<a href="/pages/products.html?query=${link.toLowerCase()}">${link}</a>`
    )
    .join("")
  box.style.visibility = "hidden"
  box.style.opacity = 0
  item.appendChild(box)

  item.addEventListener("mouseover", () => {
    box.style.visibility = "visible"
    box.style.opacity = 1
  })
  item.addEventListener("mouseout", () => {
    box.style.visibility = "hidden"
    box.style.opacity = 0
  })
})

let original_bg = window
  .getComputedStyle(document.querySelector("header"), null)
  .getPropertyValue("background-color")

const handleScroll = () => {
  if (window.scrollY > 100) {
    document.querySelector("header").classList.add("bg")
    document.querySelector("header").style.width = "95%"
  } else {
    // document.querySelector("header").style.background = original_bg
    document.querySelector("header").classList.remove("bg")
    document.querySelector("header").style.width = "100%"
  }
}
window.addEventListener("scroll", handleScroll)

// CART
const cartPanel = document.createElement("div")
cartPanel.classList.add("cart-panel")
cartPanel.innerHTML = `
    <div class="cart-nav">
      <button id="cart-close" class="icon-cart-close" onclick="closeCart()"><i class="fa-solid fa-x"></i></button>
    </div>
    <div class="cart-body">
    <div>
      <h2>Cart</h2>
      <table class="cart-items">
        <thead>
          <tr>
            <th class="table-t-left">Name</th>
            <th class="table-t-right">Price</th>
            <th class="table-t-right"></th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
    
    <div class="cart-info">
      <div class="cart-info-offer">
        <p class="offer-count font-onest-semibold">
          <span id="n-offer">No offer</span> applied
        </p>
        <button class="textbtn-useoffer font-onest-semibold" onclick="seeSpecialOffers()">
          See Special Offers
        </button>
      </div>
      <ul class="font-onest-semibold">
        <li>Total:</li>
        <li>$<span id="total-price">0</span></li>
      </ul>
      <button class="btn-checkout font-onest-semibold" onclick="checkout()">
        <span>Check Out</span>
        <i class="fa-solid fa-money-check-dollar"></i>
      </button>
    </div>
    </div>
`
document.body.appendChild(cartPanel)

cart.render()

function openCart() {
  cartPanel.style.transform = "translate(0, -50%)"
}

function closeCart() {
  cartPanel.style.transform = "translate(100%, -50%)"
}

/*  CHECKOUT  */

function checkout() {
  const path = window.location.pathname.split("/").pop()

  if (cart.getItemsLength() > 0) {
    cart.checkoutInProgress(true)
    if (path === "checkout.html") {
      closeCart()
    } else if (path === "index.html" || path === "") {
      window.location.href = "pages/checkout.html"
    } else {
      window.location.href = "checkout.html"
    }
  } else {
    closeCart()
    openCheckOutWarnModal()
  }
}

function openCheckOutWarnModal() {
  const div = document.createElement("div")
  div.classList.add("modal", "checkoutwarn-modal")
  div.innerHTML = `
        <button class="icon-close"><i class="fa-solid fa-x" onclick="closeCheckOutWarnModal()"></i></button>
        <h2>Empty Cart! ☕</h2>
        <p>Please add an item first to check out.</p>
        <button id="checkoutwarn-modal-okay" class="secbtn-checkout-okay" onclick="closeCheckOutWarnModal()">Okay</button>
        </form>
        `
  const divBackdrop = document.createElement("div")
  divBackdrop.classList.add(
    "modal-backdrop",
    "bg-blur",
    "checkoutwarn-modal-backdrop"
  )
  document.body.appendChild(divBackdrop)
  document.body.appendChild(div)

  $(".checkoutwarn-modal-backdrop").fadeOut(0)
  $(".checkoutwarn-modal-backdrop").fadeIn(400)
  $(".checkoutwarn-modal").fadeOut(0)
  $(".checkoutwarn-modal").fadeIn(400)
}

function closeCheckOutWarnModal() {
  $(".checkoutwarn-modal").fadeOut(400)
  $(".checkoutwarn-modal-backdrop").fadeOut(400, () => {
    $(".checkoutwarn-modal").remove()
    $(".checkoutwarn-modal-backdrop").remove()
  })
}

/*    SPECIAL OFFERS    */

function seeSpecialOffers() {
  const path = window.location.pathname.split("/").pop()
  if (path === "offers.html") {
    closeCart()
  } else if (path === "index.html" || path === "") {
    window.location.href = "pages/offers.html"
  } else {
    window.location.href = "offers.html"
  }
}
