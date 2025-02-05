/*  ======> cart.js  */

class Cart {
  constructor() {
    this.items = localStorage.getItem("cart-items")
      ? JSON.parse(localStorage.getItem("cart-items"))
      : []
    this.offers = localStorage.getItem("cart-offers")
      ? JSON.parse(localStorage.getItem("cart-offers"))
      : []
  }

  getItemsLength() {
    return this.items.length
  }

  add(item_id, item_name, item_price) {
    if (this.items.map((item) => item.id).includes(item_id)) return
    this.items.push({
      id: item_id,
      name: item_name,
      price: item_price,
      count: 1,
    })
    this.update()
  }

  remove(item_id) {
    if (!this.items.map((item) => item.id).includes(item_id)) return
    this.items = this.items.filter((item) => item.id != item_id)
    this.update()
  }

  minusQuantity(item_id) {
    const item = this.items.find((item) => item.id === item_id)
    if (item.count === 1) {
      this.remove(item_id)
      return
    }
    item.count--
    this.update()
  }

  plusQuantity(item_id) {
    const item = this.items.find((item) => item.id === item_id)
    item.count++
    this.update()
  }

  update() {
    localStorage.setItem("cart-items", JSON.stringify(this.items))
    this.render()
  }

  empty() {
    localStorage.removeItem("cart-items")
    localStorage.removeItem("cart-offers")
    this.render()
  }

  applyOffer(offer) {
    this.offers.push(offer)
    localStorage.setItem("cart-offers", JSON.stringify(this.offers))
    this.render()
  }

  checkoutInProgress() {
    sessionStorage.setItem(
      "checkout",
      JSON.stringify({
        items: this.items,
        offers: this.offers,
      })
    )
  }

  render() {
    document.querySelector(".cart-panel .cart-items tbody").innerHTML =
      this.items.length > 0
        ? this.items
            .map(
              (product) =>
                `
                <tr>
                    <td class="font-onest-semibold">${product.name}</td>
                    <td class="table-t-right">$${product.price}</td>
                    <td class="table-t-center table-td-quantity">
                      <button class="icon-quanity-minus" onclick="cart.minusQuantity('${product.id}')" ><i class="fa-solid fa-minus"></i></button>
                      <span>${product.count}</span>
                      <button class="icon-quanity-plus" onclick="cart.plusQuantity('${product.id}')" ><i class="fa-solid fa-plus"></i></button>
                    </td>
                </tr>
            `
            )
            .join("")
        : `<tr>
              <td class="font-onest-semibold">No item added.</td>
            </tr>`
    document.getElementById("total-price").innerText = this.items
      .reduce((prev, curr) => (prev += curr.price * curr.count), 0)
      .toPrecision(4)
    const badge = document.createElement("span")
    badge.className = "badge"
    badge.innerText = `${this.items.length}`
    document.getElementById("cart-a").appendChild(badge)
    if (this.offers.length > 0) {
      document.getElementById("n-offer").innerText =
        this.offers.length === 1 ? `1 offer` : `${this.offers.length} offers`
    } else {
      document.getElementById("n-offer").innerText = `No offer`
    }
  }
}

const cart = new Cart()
