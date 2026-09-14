// Set maximum number of containers
const { setGlobalOptions } = require('firebase-functions');
setGlobalOptions({
  maxInstances: 10,
});

// The Firebase Admin SDK to access Firestore
const admin = require('firebase-admin');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { initializeApp } = require('firebase-admin/app');

initializeApp();
const db = getFirestore();
const DEFAULT_WORTH_POINTS = 10;

/**
 * initalizeUser
 *
 * Creates a new user in Firestore with the default settings
 * Returns the new document id
 *
 * @params {firstName, lastInitial, scoutingId, email}
 * @returns {id}
 */
exports.initializeUser = onCall(async (request) => {
  // Extract parameters from the request data
  const { firstName, lastInitial, scoutingId, email } = request.data;
  const createdAt = admin.firestore.FieldValue.serverTimestamp()

  // Basic validation to ensure all required fields are present
  if (!firstName || !lastInitial || !scoutingId || !email) {
    throw new HttpsError(
      'invalid-argument',
      'The function must be called with all params',
    );
  }

  try {
    // Add a new document to the 'users' collection
    const docRef = await db.collection('users').add({
      firstName: firstName,
      firstNameLower: firstName.toLowerCase(),
      lastInitial: lastInitial,
      scoutingId: scoutingId,
      email: email,
      emailLower: email.toLowerCase(),
      currentPoints: 0,
      worthPoints: DEFAULT_WORTH_POINTS,
      pointValueComment: '',
      usersMet: [],
      usersMetId: [],
      numUsersMet: 0,
      createdAt: createdAt,
    });

    // Return the document name (ID)
    return { id: docRef.id };
  } catch (error) {
    throw new HttpsError('internal', 'Unable to initialize user.', error);
  }
});

/**
 * getUserData
 *
 * Pulls the user data from Firestore from the provided document id
 *
 * @params {docId}
 * @returns {currentPoints, usersMet}
 */
exports.getUserData = onCall(async (request) => {
  // Extract docId from the request data
  const { docId } = request.data;

  try {
    // Reference the specific document in the 'users' collection
    const userDoc = await db.collection('users').doc(docId).get();

    // Check if the document actually exists
    if (!userDoc.exists) {
      throw new HttpsError(
        'not-found',
        'No user found with the provided docId.',
      );
    }

    const data = userDoc.data();

    // Return the specific fields requested
    return {
      currentPoints: data.currentPoints,
      usersMet: data.usersMet,
      numUsersMet: data.numUsersMet,
    };
  } catch (error) {
    throw new HttpsError('internal', 'Unable to retrieve user data.', error);
  }
});

/**
 * executeScan
 *
 * Awards points and records a scan
 * Returns the new user met and updated score
 *
 * @params {scannerUserId, scannedUserId}
 * @returns {result} if there was an error
 * @returns {result, addedPoints, newPoints, userMet} if the scan was successful
 */
exports.executeScan = onCall(async (request) => {
  // Extract parameters from the request data
  const { scannerUserId, scannedUserId } = request.data;

  // Basic validation to ensure IDs are provided
  if (!scannerUserId || !scannedUserId) {
    throw new HttpsError(
      'invalid-argument',
      'The function must be called with scannerUserId and scannedUserId.',
    );
  }

  try {
    const scannerRef = db.collection('users').doc(scannerUserId);
    const scannedRef = db.collection('users').doc(scannedUserId);

    const resultData = await db.runTransaction(async (transaction) => {
      const scannerDoc = await transaction.get(scannerRef);
      const scannedDoc = await transaction.get(scannedRef);

      if (!scannerDoc.exists) {
        return { result: 'Scanner user does not exist' };
      }
      if (!scannedDoc.exists) {
        return { result: 'Scanned user does not exist' };
      }

      const scannerData = scannerDoc.data();
      const scannedData = scannedDoc.data();

      // Check if the user has already been scanned
      const usersMetId = scannerData.usersMetId || [];
      if (usersMetId.includes(scannedUserId)) {
        return { result: 'Already Scanned' };
      }

      // Calculate new points
      const worthPoints = scannedData.worthPoints;
      const currentPoints = scannerData.currentPoints;
      const newPoints = currentPoints + worthPoints;
      const numUsersMet = scannerData.numUsersMet;

      // Prepare the display name
      const userMetDisplayName = `${scannedData.firstName} ${scannedData.lastInitial}.`;

      // Prepare the usersMet array
      const currentUsersMet = scannerData.usersMet;
      currentUsersMet.push(userMetDisplayName);

      // Update the scanner's document
      transaction.update(scannerRef, {
        currentPoints: newPoints,
        usersMetId: FieldValue.arrayUnion(scannedUserId),
        usersMet: currentUsersMet,
        numUsersMet: numUsersMet + 1,
      });

      return {
        result: 'Success',
        addedPoints: worthPoints,
        newPoints: newPoints,
        userMet: userMetDisplayName,
      };
    });

    return resultData;
  } catch (error) {
    // Re-throw HttpsErrors so the client receives the correct status code
    if (error instanceof HttpsError) throw error;

    console.error('Scan Error:', error);
    throw new HttpsError('internal', 'Unable to execute scan.', error.message);
  }
});
