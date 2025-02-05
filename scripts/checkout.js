/*    CHECKOUT    */
const getCheckOut = () => JSON.parse(sessionStorage.getItem("checkout")) || null

const data = getCheckOut()
if (data === null) {
  window.location.href = "index.html"
} else {
  const { items, offers } = data
  const subTotal = Number(
    items
      .reduce((prev, curr) => (prev += curr.price * curr.count), 0)
      .toFixed(2)
  )
  /* Converted to Number because toFixed returns string type,
  which is not best for further numerical computations */
  const discount = offers.reduce((prev, curr) => {
    const reduced = (subTotal * curr.reducer) / 100
    return (prev += reduced)
  }, 0)

  const shippingFee = 0.5
  const total = subTotal - discount + shippingFee

  $("#subtotal").text(`$${subTotal.toFixed(2)}`)
  $("#discount").text(`$${discount.toFixed(2)}`)
  $("#shipping-fee").text(`$${shippingFee.toFixed(2)}`)
  $("#total").text(`$${total.toFixed(2)}`)
}

/*  CARD MONTH & YEAR VALID   */

const monthInput = document.querySelector("#card-month")
const yearInput = document.querySelector("#card-year")

const focusSibling = function (target, direction, callback) {
  const nextTarget = target[direction]
  nextTarget && nextTarget.focus()
  // if callback is supplied we return the sibling target which has focus
  callback && callback(nextTarget)
}

// input event only fires if there is space in the input for entry.
// If an input of x length has x characters, keyboard press will not fire this input event.
monthInput.addEventListener("input", (event) => {
  const value = event.target.value.toString()
  // adds 0 to month user input like 9 -> 09
  if (value.length === 1 && value > 1) {
    event.target.value = "0" + value
  }
  // bounds
  if (value === "00") {
    event.target.value = "01"
  } else if (value > 12) {
    event.target.value = "12"
  }
  // if we have a filled input we jump to the year input
  2 <= event.target.value.length &&
    focusSibling(event.target, "nextElementSibling")
  event.stopImmediatePropagation()
})

yearInput.addEventListener("keydown", (event) => {
  // if the year is empty jump to the month input
  if (event.key === "Backspace" && event.target.selectionStart === 0) {
    focusSibling(event.target, "previousElementSibling")
    event.stopImmediatePropagation()
  }
})

const inputMatchesPattern = function (e) {
  const { value, selectionStart, selectionEnd, pattern } = e.target

  const character = String.fromCharCode(e.which)
  const proposedEntry =
    value.slice(0, selectionStart) + character + value.slice(selectionEnd)
  const match = proposedEntry.match(pattern)

  return (
    e.metaKey || // cmd/ctrl
    e.which <= 0 || // arrow keys
    e.which == 8 || // delete key
    (match && match["0"] === match.input)
  ) // pattern regex isMatch - workaround for passing [0-9]* into RegExp
}

document.querySelectorAll("input[data-pattern-validate]").forEach((el) =>
  el.addEventListener("keypress", (e) => {
    if (!inputMatchesPattern(e)) {
      return e.preventDefault()
    }
  })
)

document.querySelector(".icon-back").addEventListener("click", () => {
  window.history.back()
})

/*    CONFIRM PAYMENT    */
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault()
  openPayModal()
})

function openPayModal() {
  const div = document.createElement("div")
  div.classList.add("modal", "pay-modal")
  div.innerHTML = `
    <button class="icon-close pay-modal-close"><i class="fa-solid fa-x"></i></button>
    <h2>Are you sure to confirm this <span class="highlight-title">payment</span>?</h2>
    <div>
      <button id="pay-modal-cancel" class="secbtn-cancel">Cancel</button>
      <button id="pay-modal-confirm" class="secbtn-confirm">Confirm</button>
    </div>
    `
  const divBackdrop = document.createElement("div")
  divBackdrop.classList.add(
    "modal-backdrop",
    "bg-blur",
    "pay-modal-backdrop",
    "pay-modal-close"
  )
  document.body.appendChild(divBackdrop)
  document.body.appendChild(div)

  $(".pay-modal-backdrop").fadeOut(0)
  $(".pay-modal-backdrop").fadeIn(400)
  $(".pay-modal").fadeOut(0)
  $(".pay-modal").fadeIn(400)

  $("#pay-modal-confirm").on("click", () => {
    sessionStorage.removeItem("checkout")
    cart.empty()
    div.innerHTML = `
      <button class="icon-close pay-modal-close"><i class="fa-solid fa-x"></i></button>
      <h2>Payment Successful!</h2>
      <div>
        <button id="pay-modal-okay" class="secbtn-okay">Okay ( <span id="countdown">5</span>s )</button>
      </div>
    `
    let i = 0
    setInterval(() => {
      if (i >= 5) {
        window.history.back()
      } else {
        $("#countdown").text(5 - i)
        i++
      }
    }, 1000)
  })

  $("#pay-modal-cancel").on("click", () => {
    closePayModal()
  })

  $(".pay-modal-close").click(() => {
    closePayModal()
  })
}

function closeSubModal() {
  $(".pay-modal").fadeOut(400)
  $(".pay-modal-backdrop").fadeOut(400, () => {
    $(".pay-modal").remove()
    $(".pay-modal-backdrop").remove()
  })
}
