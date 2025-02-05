/*  ====> fetch.js  */

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
    } else if (
      target === "events" ||
      target === "offers" ||
      target === "subscriptions"
    ) {
      let res = await fetch(`/data/${target}.json`)
      if (!res.ok) {
        throw new Error(`Data error: Cannot fetch ${target}.`)
      }
      let data = await res.json()
      return data
    }
  } catch (error) {
    console.error("Unable to fetch data:", error)
    return []
  }
}
