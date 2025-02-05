/*  ====> events.js */

const resEvents = fetchJSONData("events")

resEvents.then((data) => {
  document.querySelector(".main-events").innerHTML = data
    .map(
      ({ id, title, img, date, brief, details }) => `
  <div id="event-${id}" class="item-event">
    <div class="img-container">
      <img src="${img}" alt="event" />
    </div>
    <div class="event-info">
      <div>
        <h4 class="font-onest-semibold">${title}</h4>
        <span>${date}</span>
        <p>${brief}</p>
      </div>
      <button class="icon-chevron"><i class='fa-solid fa-chevron-down'></i></button>
    </div>
    <div class="event-details">
      <p>${details}</p>
      <button class="secbtn-register" onclick="openRegisterModal('${id}')">Register</button>
    </div>
  </div>
  `
    )
    .join("")

  document.querySelectorAll(".main-events .item-event").forEach((item) => {
    let isOpen = false
    const button = item.querySelector(".icon-chevron")
    item.querySelector(".event-details").style.maxHeight = "0"
    button.addEventListener("click", () => {
      if (isOpen) {
        item.querySelector(".event-details").style.maxHeight = "0"
        item.querySelector(".icon-chevron i").className =
          "fa-solid fa-chevron-down"
        isOpen = false
      } else {
        item.querySelector(".event-details").style.maxHeight = "100vh"
        item.querySelector(".icon-chevron i").className =
          "fa-solid fa-chevron-up"
        isOpen = true
      }
    })
  })
})

function openRegisterModal(id) {
  resEvents.then((events) => {
    const event = events.find((event) => event.id === id)
    const div = document.createElement("div")
    div.classList.add("modal", "event-modal")
    div.innerHTML = `
    <button class="icon-close event-modal-close"><i class="fa-solid fa-x"></i></button>
    <h2>Register <span class="highlight-title">${event.title}</span> ☕</h2>
    <p>Fill up your credentials to register for this event.</p>
    <form id="event-modal-form">
      <div>
        <input id="event-modal-input-firstname" type="text" placeholder="First Name" class="textinput-firstname" required />
        <input id="event-modal-input-lastname" type="text" placeholder="Last Name" class="textinput-lastname" required />
      </div>
      <input id="event-modal-input-email" type="email" placeholder="Enter your email" class="textinput-email" required />
      <div>
        <button id="event-modal-register" class="secbtn-register">Register</button>
      </div>
    </form>
    `
    const divBackdrop = document.createElement("div")
    divBackdrop.classList.add(
      "modal-backdrop",
      "bg-blur",
      "event-modal-backdrop",
      "event-modal-close"
    )
    document.body.appendChild(divBackdrop)
    document.body.appendChild(div)

    $(".event-modal-backdrop").fadeOut(0)
    $(".event-modal-backdrop").fadeIn(400)
    $(".event-modal").fadeOut(0)
    $(".event-modal").fadeIn(400)

    $("#event-modal-form").on("submit", (e) => {
      e.preventDefault()
      const firstname = $("#event-modal-input-firstname").val()
      const lastname = $("#event-modal-input-lastname").val()
      const email = $("#event-modal-input-email").val()

      if (firstname === "" || lastname === "" || email === "") {
        return
      }
      const status = setRegisteredEvents(
        { id: event.id, title: event.title },
        { firstname, lastname, email }
      )
      if (status) {
        div.innerHTML = `
        <button class="icon-close event-modal-close"><i class="fa-solid fa-x"></i></button>
        <h2>Registered <br /><span class="highlight-title">${event.title}</span> ☕</h2>
        <p>You have successfully registered for this event.</p>
        <button class="secbtn-register event-modal-close" onclick="closeRegisterModal()">Okay</button>
        `
      } else if (!status) {
        div.innerHTML = `
        <button class="icon-close event-modal-close"><i class="fa-solid fa-x"></i></button>
        <h2>☕</h2>
        <p>Sorry, you have already registered for this event.</p>
        <button class="secbtn-register event-modal-close" onclick="closeRegisterModal()">Okay</button>
        `
      }
    })

    $(".event-modal-close").click(() => {
      closeRegisterModal()
    })
  })
}

function getRegisteredEvents() {
  return JSON.parse(localStorage.getItem("events")) || []
}

function setRegisteredEvents(event, user) {
  const registeredEvents = getRegisteredEvents()
  const newRegister = { event, user }
  if (
    registeredEvents.find(
      (re) =>
        re.event.id == newRegister.event.id &&
        re.user.firstname == newRegister.user.firstname &&
        re.user.lastname == newRegister.user.lastname
    )
  ) {
    return false
  }
  localStorage.setItem(
    "events",
    JSON.stringify([...registeredEvents, newRegister])
  )
  return true
}

function closeRegisterModal() {
  $(".event-modal").fadeOut(400)
  $(".event-modal-backdrop").fadeOut(400, () => {
    $(".event-modal").remove()
    $(".event-modal-backdrop").remove()
  })
}
