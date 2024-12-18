// ====================== TWITCH WERBUNG BLOCKIEREN ======================

function overrideTwitchFetch() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    try {
      if (args[0].includes('/gql') && args[1]?.body.includes('PlaybackAccessToken')) {
        const body = JSON.parse(args[1].body);

        body.variables.playerType = "site";
        body.variables.adblock = true;
        body.variables.playback = "normal";

        args[1].body = JSON.stringify(body);
        console.log("Twitch fetch-Anfrage umgangen:", args);
      }
    } catch (error) {
      console.error("Fehler bei der Fetch-Umgehung:", error);
    }
    return originalFetch(...args);
  };
}

function removeTwitchAds() {
  const adSelectors = [
    '[data-test-selector="ad-banner"]',
    '.video-ad',
    '.ad-showing',
    '.player-ad-overlay'
  ];

  adSelectors.forEach((selector) => {
    const adElements = document.querySelectorAll(selector);
    adElements.forEach((ad) => {
      console.log("Twitch Werbung entfernt:", ad);
      ad.remove();
    });
  });

  const video = document.querySelector('video');
  if (document.querySelector('.ad-showing') && video) {
    console.log("Werbung erkannt – Stream wird neu geladen...");
    video.currentTime = video.duration;
  }
}

function monitorTwitchAds() {
  const observer = new MutationObserver(() => removeTwitchAds());
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(() => {
    removeTwitchAds();
  }, 1000);
}

function initTwitchAdBlocker() {
  overrideTwitchFetch();
  monitorTwitchAds();
  console.log("Twitch AdBlocker gestartet!");
}

// ====================== YOUTUBE WERBUNG BLOCKIEREN ======================
function blockYouTubeAds() {
  const player = document.querySelector('video');
  const adOverlay = document.querySelector('.ytp-ad-overlay-container');
  const adModule = document.querySelector('.ytp-ad-module');

  if (adOverlay) adOverlay.remove();
  if (adModule) adModule.remove();

  if (player) {
    const isAdPlaying = document.querySelector('.ad-showing');
    if (isAdPlaying) {
      console.log("Werbung erkannt – überspringen...");
      player.currentTime = player.duration;
    }
  }
}

function initYouTubeAdBlocker() {
  const observer = new MutationObserver(() => blockYouTubeAds());
  observer.observe(document.body, { childList: true, subtree: true });
  blockYouTubeAds();
}

// ====================== INITIALISIERUNG ======================
if (window.location.hostname.includes('youtube.com')) {
  console.log("Starte YouTube AdBlocker...");
  initYouTubeAdBlocker();
}

if (window.location.hostname.includes('twitch.tv')) {
  console.log("Starte Twitch AdBlocker...");
  initTwitchAdBlocker();
}

