/**
 * Get the Firebase ID and display it
 */
async function getFirebaseID() {
  try {
    // Request permission (needed for iOS and Android 13+)
    await FirebaseMessaging.requestPermissions();

    // Get the FCM token
    const result = await FirebaseMessaging.getToken();

    const firebaseIDElement = document.getElementById('firebaseID');
    firebaseIDElement.innerHTML =
      `<b>${firebaseIDElement.textContent.trim()}</b> ${result.token}`.trim();
  } catch (error) {
    ((firebaseIDElement.innerHTML = 'Error getting Firebase ID:'), error);
  }
}

getFirebaseID();
