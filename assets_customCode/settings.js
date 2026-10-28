/**
 * Gets the app version and OS and displays it
 *
 * @returns Nothing
 */
async function displayAppInfo() {
  const targetElement = document.getElementById('appVersion');
  if (!targetElement) {
    Toast.show({
      text: 'Element with ID "appVersion" was not found in the DOM.',
    });
    return;
  }

  try {
    // Fetch app info and device info concurrently
    const [appInfo, deviceInfo] = await Promise.all([
      App.getInfo(),
      Device.getInfo(),
    ]);

    // Format: e.g., "v1.0.4 (ios)" or "v1.2.0 (android)"
    const versionText = `v${appInfo.version} (${deviceInfo.operatingSystem})`;

    targetElement.innerHTML =
      `<b>${targetElement.textContent.trim()}</b> ${versionText}`.trim();
  } catch (error) {
    Toast.show({ text: error.message });
  }
}

displayAppInfo();
