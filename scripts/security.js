async function deriveKey(email, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(email), // Using email as a base key
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000, // High iteration count for better security
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )
}

async function encryptAndStoreUser(email, password) {
  const encoder = new TextEncoder()

  // Generate a unique salt for this user
  const salt = window.crypto.getRandomValues(new Uint8Array(16))

  // Derive a unique encryption key from email + salt
  const key = await deriveKey(email, salt)

  // Generate a random IV (Initialization Vector)
  const iv = window.crypto.getRandomValues(new Uint8Array(12))

  // Encrypt password
  const encryptedPassword = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoder.encode(password)
  )

  // Convert values to Base64 for safe storage
  const encryptedPasswordBase64 = btoa(
    String.fromCharCode(...new Uint8Array(encryptedPassword))
  )
  const saltBase64 = btoa(String.fromCharCode(...salt))
  const ivBase64 = btoa(String.fromCharCode(...iv))

  // Retrieve existing user data
  let users = JSON.parse(localStorage.getItem("users")) || {}

  // Store user credentials
  users[email] = {
    encryptedPassword: encryptedPasswordBase64,
    salt: saltBase64,
    iv: ivBase64,
  }
  localStorage.setItem("users", JSON.stringify(users))
}

async function verifyUser(email, enteredPassword) {
  const users = JSON.parse(localStorage.getItem("users")) || {}

  if (!users[email]) {
    console.error("User not found!")
    return false
  }

  // Retrieve stored user data
  const storedData = users[email]
  const salt = Uint8Array.from(atob(storedData.salt), (c) => c.charCodeAt(0))
  const iv = Uint8Array.from(atob(storedData.iv), (c) => c.charCodeAt(0))
  const encryptedPassword = Uint8Array.from(
    atob(storedData.encryptedPassword),
    (c) => c.charCodeAt(0)
  )

  // Derive the same key using the stored salt
  const key = await deriveKey(email, salt)

  try {
    // Decrypt the stored password
    const decryptedPasswordBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedPassword
    )

    const decoder = new TextDecoder()
    const decryptedPassword = decoder.decode(decryptedPasswordBuffer)

    // Compare decrypted password with entered password
    if (decryptedPassword === enteredPassword) {
      console.log("Login successful!")
      return true
    } else {
      console.log("Incorrect password!")
      return false
    }
  } catch (e) {
    console.error("Decryption failed:", e)
    return false
  }
}
