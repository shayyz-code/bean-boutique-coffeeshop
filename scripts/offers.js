const resOffers = fetchJSONData("offers")

renderOffers()
function renderOffers() {
  resOffers.then((data) => {
    document.querySelector(".main-offers").innerHTML = data
      .map(
        ({ id, title, code, offer, costover, brief }) => `
  <div id="offer-${id}" class="item-offer">
    <div class="offer-info">
      <div>
        <div class="offer-layer-head">
            <h4 class="font-onest-semibold">${title}</h4>
            <h5 class="font-onest-semibold offer-code">Code: ${code}</h5>
        </div>
        <ul>
          <li>${offer}</li>
          <li>can be applied starting from $${costover}</li>
        </ul>
        <p>${brief}</p>
      </div>
    </div>
      ${
        getAppliedOffers().find((o) => o.id == id)
          ? `<button class="secbtn-useoffer">Applied</button>`
          : `<button class="secbtn-useoffer" onclick="openOfferModal('${id}')">Apply Offer</button>`
      }
  </div>
  `
      )
      .join("")
  })
}

function openOfferModal(id) {
  resOffers.then((offers) => {
    const offer = offers.find((offer) => offer.id === id)
    const div = document.createElement("div")
    div.classList.add("modal", "offer-modal")
    div.innerHTML = `
    <button class="icon-close event-modal-close"><i class="fa-solid fa-x"></i></button>
    <h2>Apply this <span class="highlight-title">offer</span>?</h2>
    <div>
      <button id="offer-modal-cancel" class="secbtn-cancel">Cancel</button>
      <button id="offer-modal-confirm" class="secbtn-confirm">Confirm</button>
    </div>
    `
    const divBackdrop = document.createElement("div")
    divBackdrop.classList.add(
      "modal-backdrop",
      "bg-blur",
      "offer-modal-backdrop",
      "offer-modal-close"
    )
    document.body.appendChild(divBackdrop)
    document.body.appendChild(div)

    $(".offer-modal-backdrop").fadeOut(0)
    $(".offer-modal-backdrop").fadeIn(400)
    $(".offer-modal").fadeOut(0)
    $(".offer-modal").fadeIn(400)

    $("#offer-modal-confirm").on("click", () => {
      cart.applyOffer(offer)
      renderOffers()
      closeOfferModal()
    })

    $("#offer-modal-cancel").on("click", () => {
      closeOfferModal()
    })

    $(".event-modal-close").click(() => {
      closeOfferModal()
    })
  })
}

function getAppliedOffers() {
  return JSON.parse(localStorage.getItem("cart-offers")) || []
}

function closeOfferModal() {
  $(".offer-modal").fadeOut(400)
  $(".offer-modal-backdrop").fadeOut(400, () => {
    $(".offer-modal").remove()
    $(".offer-modal-backdrop").remove()
  })
}

/*    SUBSCRIPTIONS   */

const resSubs = fetchJSONData("subscriptions")
renderSubs()

function renderSubs() {
  resSubs.then((data) => {
    document.querySelector(".main-subs").innerHTML = data
      .map(
        ({ id, title, includes, perfectFor }) => `
  <div id="offer-${id}" class="item-sub">
    <div class="sub-info">
      <div>
        <div class="sub-layer-head">
            <h3 class="font-onest-semibold">${title}</h3>
        </div>
        <ul>
        ${includes.map((include) => `<li>${include}</li>`).join("")}
        </ul>
        <p>${perfectFor}</p>
      </div>
    </div>
    ${
      getSubs().find((s) => s.id == id)
        ? `<button class="secbtn-sub">Subscribed</button>`
        : `<button class="secbtn-sub" onclick="openSubModal('${id}')">Subscribe</button>`
    }
  </div>
  `
      )
      .join("")
  })
}

function openSubModal(id) {
  resSubs.then((subs) => {
    const sub = subs.find((sub) => sub.id === id)
    const div = document.createElement("div")
    div.classList.add("modal", "sub-modal")
    div.innerHTML = `
    <button class="icon-close sub-modal-close"><i class="fa-solid fa-x"></i></button>
    <h2>Subscribe this <span class="highlight-title">plan</span>?</h2>
    <div>
      <button id="sub-modal-cancel" class="secbtn-cancel">Cancel</button>
      <button id="sub-modal-confirm" class="secbtn-confirm">Confirm</button>
    </div>
    `
    const divBackdrop = document.createElement("div")
    divBackdrop.classList.add(
      "modal-backdrop",
      "bg-blur",
      "sub-modal-backdrop",
      "sub-modal-close"
    )
    document.body.appendChild(divBackdrop)
    document.body.appendChild(div)

    $(".sub-modal-backdrop").fadeOut(0)
    $(".sub-modal-backdrop").fadeIn(400)
    $(".sub-modal").fadeOut(0)
    $(".sub-modal").fadeIn(400)

    $("#sub-modal-confirm").on("click", () => {
      const subscriptions = getSubs() || []
      localStorage.setItem("subs", JSON.stringify([...subscriptions, sub]))
      renderSubs()
      closeSubModal()
    })

    $("#sub-modal-cancel").on("click", () => {
      closeSubModal()
    })

    $(".sub-modal-close").click(() => {
      closeSubModal()
    })
  })
}

function getSubs() {
  return JSON.parse(localStorage.getItem("subs")) || []
}

function closeSubModal() {
  $(".sub-modal").fadeOut(400)
  $(".sub-modal-backdrop").fadeOut(400, () => {
    $(".sub-modal").remove()
    $(".sub-modal-backdrop").remove()
  })
}
