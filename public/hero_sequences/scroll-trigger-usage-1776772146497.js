/**
 * Artisan Labs — Scroll Trigger Integration
 * Generated: 2026-04-21T11:49:06.497Z
 * Mode: easeInOut | Frames: 32 | Scroll: 3000px
 */

// Scroll trigger configuration
const scrollConfig = {
  "mode": "easeInOut",
  "scrollDistance": 3000,
  "scrollUnit": "px",
  "triggerStart": 0,
  "triggerEnd": 1,
  "overshootBehavior": "clamp",
  "pinElement": true,
  "smoothing": 0.08,
  "snapToFrame": false
};

// Frame trigger events
const scrollEvents = [
  {
    "scrollPx": 0,
    "scrollPercent": 0,
    "frameIndex": 0,
    "progress": 0
  },
  {
    "scrollPx": 0,
    "scrollPercent": 0.01,
    "frameIndex": 1,
    "progress": 3.23
  },
  {
    "scrollPx": 3,
    "scrollPercent": 0.11,
    "frameIndex": 2,
    "progress": 6.45
  },
  {
    "scrollPx": 11,
    "scrollPercent": 0.36,
    "frameIndex": 3,
    "progress": 9.68
  },
  {
    "scrollPx": 26,
    "scrollPercent": 0.86,
    "frameIndex": 4,
    "progress": 12.9
  },
  {
    "scrollPx": 50,
    "scrollPercent": 1.68,
    "frameIndex": 5,
    "progress": 16.13
  },
  {
    "scrollPx": 87,
    "scrollPercent": 2.9,
    "frameIndex": 6,
    "progress": 19.35
  },
  {
    "scrollPx": 138,
    "scrollPercent": 4.61,
    "frameIndex": 7,
    "progress": 22.58
  },
  {
    "scrollPx": 206,
    "scrollPercent": 6.87,
    "frameIndex": 8,
    "progress": 25.81
  },
  {
    "scrollPx": 294,
    "scrollPercent": 9.79,
    "frameIndex": 9,
    "progress": 29.03
  },
  {
    "scrollPx": 403,
    "scrollPercent": 13.43,
    "frameIndex": 10,
    "progress": 32.26
  },
  {
    "scrollPx": 536,
    "scrollPercent": 17.87,
    "frameIndex": 11,
    "progress": 35.48
  },
  {
    "scrollPx": 696,
    "scrollPercent": 23.2,
    "frameIndex": 12,
    "progress": 38.71
  },
  {
    "scrollPx": 885,
    "scrollPercent": 29.5,
    "frameIndex": 13,
    "progress": 41.94
  },
  {
    "scrollPx": 1105,
    "scrollPercent": 36.84,
    "frameIndex": 14,
    "progress": 45.16
  },
  {
    "scrollPx": 1360,
    "scrollPercent": 45.32,
    "frameIndex": 15,
    "progress": 48.39
  },
  {
    "scrollPx": 1641,
    "scrollPercent": 54.68,
    "frameIndex": 16,
    "progress": 51.61
  },
  {
    "scrollPx": 1895,
    "scrollPercent": 63.16,
    "frameIndex": 17,
    "progress": 54.84
  },
  {
    "scrollPx": 2115,
    "scrollPercent": 70.5,
    "frameIndex": 18,
    "progress": 58.06
  },
  {
    "scrollPx": 2304,
    "scrollPercent": 76.8,
    "frameIndex": 19,
    "progress": 61.29
  },
  {
    "scrollPx": 2464,
    "scrollPercent": 82.13,
    "frameIndex": 20,
    "progress": 64.52
  },
  {
    "scrollPx": 2597,
    "scrollPercent": 86.57,
    "frameIndex": 21,
    "progress": 67.74
  },
  {
    "scrollPx": 2706,
    "scrollPercent": 90.21,
    "frameIndex": 22,
    "progress": 70.97
  },
  {
    "scrollPx": 2794,
    "scrollPercent": 93.13,
    "frameIndex": 23,
    "progress": 74.19
  },
  {
    "scrollPx": 2862,
    "scrollPercent": 95.39,
    "frameIndex": 24,
    "progress": 77.42
  },
  {
    "scrollPx": 2913,
    "scrollPercent": 97.1,
    "frameIndex": 25,
    "progress": 80.65
  },
  {
    "scrollPx": 2950,
    "scrollPercent": 98.32,
    "frameIndex": 26,
    "progress": 83.87
  },
  {
    "scrollPx": 2974,
    "scrollPercent": 99.14,
    "frameIndex": 27,
    "progress": 87.1
  },
  {
    "scrollPx": 2989,
    "scrollPercent": 99.64,
    "frameIndex": 28,
    "progress": 90.32
  },
  {
    "scrollPx": 2997,
    "scrollPercent": 99.89,
    "frameIndex": 29,
    "progress": 93.55
  },
  {
    "scrollPx": 3000,
    "scrollPercent": 99.99,
    "frameIndex": 30,
    "progress": 96.77
  },
  {
    "scrollPx": 3000,
    "scrollPercent": 100,
    "frameIndex": 31,
    "progress": 100
  }
];

// Frame images (replace with your actual frame URLs)
const frameImages = [
  '/frames/frame-0000.webp',
  '/frames/frame-0001.webp',
  '/frames/frame-0002.webp',
  '/frames/frame-0003.webp',
  '/frames/frame-0004.webp'
  // ... add remaining 27 frames
];

// Initialize scroll video
function initScrollVideo() {
  const scrollVideo = document.querySelector('.scroll-video');
  if (!scrollVideo) {
    console.error('Scroll video element not found');
    return;
  }

  // Preload frames
  const loadedFrames = [];
  frameImages.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    loadedFrames[index] = img;
  });

  // Calculate scroll range
  const scrollMax = document.body.scrollHeight - window.innerHeight;

  // Handle scroll events
  window.addEventListener('scroll', () => {
    const scrollY = Math.min(window.scrollY, scrollMax);
    const progress = scrollMax > 0 ? scrollY / scrollMax : 0;

    // Find current frame based on progress
    let currentFrame = 0;
    for (const event of scrollEvents) {
      if (progress * 100 >= event.scrollPercent) {
        currentFrame = event.frameIndex;
      } else {
        break;
      }
    }

    // Update video frame
    if (loadedFrames[currentFrame]) {
      scrollVideo.src = loadedFrames[currentFrame].src;
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollVideo);
} else {
  initScrollVideo();
}

// Export for module usage
export { scrollConfig, scrollEvents, initScrollVideo };
