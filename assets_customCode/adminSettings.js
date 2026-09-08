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
    if (firebaseIDElement) {
      firebaseIDElement.innerHTML =
        firebaseIDElement.innerHTML + '\n' + result.token;
      firebaseIDElement.style.wordBreak = 'break-word';
    }
  } catch (error) {
    ((firebaseIDElement.innerHTML = 'Error getting Firebase ID:'), error);
  }
}

getFirebaseID();
