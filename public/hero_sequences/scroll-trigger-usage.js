// JavaScript usage example for scroll-trigger-config.json
const scrollVideo = document.querySelector('.scroll-video');
const frames = []; // your frame images
const events = [
  {
    "scrollPx": 0,
    "scrollPercent": 0,
    "frameIndex": 0,
    "progress": 0,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 30,
    "scrollPercent": 1.01,
    "frameIndex": 1,
    "progress": 3.13,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 119,
    "scrollPercent": 3.97,
    "frameIndex": 2,
    "progress": 6.25,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 259,
    "scrollPercent": 8.63,
    "frameIndex": 3,
    "progress": 9.38,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 438,
    "scrollPercent": 14.61,
    "frameIndex": 4,
    "progress": 12.5,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 643,
    "scrollPercent": 21.44,
    "frameIndex": 5,
    "progress": 15.63,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 857,
    "scrollPercent": 28.56,
    "frameIndex": 6,
    "progress": 18.75,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 1062,
    "scrollPercent": 35.39,
    "frameIndex": 7,
    "progress": 21.88,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 1241,
    "scrollPercent": 41.37,
    "frameIndex": 8,
    "progress": 25,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 1381,
    "scrollPercent": 46.03,
    "frameIndex": 9,
    "progress": 28.13,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 1470,
    "scrollPercent": 48.99,
    "frameIndex": 10,
    "progress": 31.25,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 1500,
    "scrollPercent": 50,
    "frameIndex": 11,
    "progress": 34.38,
    "scene": "Scene 1"
  },
  {
    "scrollPx": 1500,
    "scrollPercent": 50,
    "frameIndex": 12,
    "progress": 37.5,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 1530,
    "scrollPercent": 51.01,
    "frameIndex": 13,
    "progress": 40.63,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 1619,
    "scrollPercent": 53.97,
    "frameIndex": 14,
    "progress": 43.75,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 1759,
    "scrollPercent": 58.63,
    "frameIndex": 15,
    "progress": 46.88,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 1938,
    "scrollPercent": 64.61,
    "frameIndex": 16,
    "progress": 50,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 2143,
    "scrollPercent": 71.44,
    "frameIndex": 17,
    "progress": 53.13,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 2357,
    "scrollPercent": 78.56,
    "frameIndex": 18,
    "progress": 56.25,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 2562,
    "scrollPercent": 85.39,
    "frameIndex": 19,
    "progress": 59.38,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 2741,
    "scrollPercent": 91.37,
    "frameIndex": 20,
    "progress": 62.5,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 2881,
    "scrollPercent": 96.03,
    "frameIndex": 21,
    "progress": 65.63,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 2970,
    "scrollPercent": 98.99,
    "frameIndex": 22,
    "progress": 68.75,
    "scene": "Scene 2"
  },
  {
    "scrollPx": 3000,
    "scrollPercent": 100,
    "frameIndex": 23,
    "progress": 71.88,
    "scene": "Scene 2"
  }
];

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrollRange = document.body.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / scrollRange, 1);
  
  // Find closest frame
  let currentFrame = 0;
  for (const event of events) {
    if (progress * 100 >= event.scrollPercent) {
      currentFrame = event.frameIndex;
    }
  }
  scrollVideo.src = frames[currentFrame];
});
