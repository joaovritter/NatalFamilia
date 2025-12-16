<script setup>
import { ref, watch, onMounted } from 'vue';

const isPlaying = ref(false);
const audioRef = ref(null);
const currentSource = ref(null);
const youtubePlayer = ref(null);
const isYoutube = ref(false);

const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const setSource = (src) => {
    currentSource.value = src;
    const ytId = extractYoutubeId(src);
    
    if (ytId) {
        isYoutube.value = true;
        if (youtubePlayer.value) {
            youtubePlayer.value.loadVideoById(ytId);
        } else {
             initYoutubePlayer(ytId);
        }
    } else {
        isYoutube.value = false;
        // Reset normal audio
        if (audioRef.value) {
             audioRef.value.pause();
             audioRef.value.currentTime = 0;
        }
    }
};

const initYoutubePlayer = (videoId) => {
    if (window.YT && window.YT.Player) {
        createPlayer(videoId);
    } else {
        // Load API if not loaded
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = () => createPlayer(videoId);
    }
};

const createPlayer = (videoId) => {
    youtubePlayer.value = new window.YT.Player('youtube-player-hidden', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'loop': 1
        },
        events: {
            'onReady': (event) => {
                 // Auto play or seek logic
            },
            'onStateChange': (event) => {
                 if (event.data === window.YT.PlayerState.PLAYING) {
                     isPlaying.value = true;
                 } else if (event.data === window.YT.PlayerState.PAUSED) {
                     isPlaying.value = false;
                 }
            }
        }
    });
};

const playAudio = async () => {
  if (isYoutube.value && youtubePlayer.value) {
      youtubePlayer.value.playVideo();
      isPlaying.value = true;
  } else if (audioRef.value) {
    try {
        await audioRef.value.play();
        isPlaying.value = true;
    } catch(e) {
        console.log("Auto-play prevented", e);
    }
  }
};

const toggleAudio = () => {
    if (isYoutube.value) {
        if (!youtubePlayer.value) return;
        if (isPlaying.value) {
            youtubePlayer.value.pauseVideo();
        } else {
            youtubePlayer.value.playVideo();
        }
    } else {
        if (!audioRef.value) return;
        if (isPlaying.value) {
            audioRef.value.pause();
            isPlaying.value = false;
        } else {
            audioRef.value.play().catch(e => console.log(e));
            isPlaying.value = true;
        }
    }
};

onMounted(() => {
    // Default song if no source set
    if (!currentSource.value) {
        // standard jingle bells
    }
});

defineExpose({
  playAudio,
  setSource,
  toggleAudio
});
</script>

<template>
  <div>
    <div class="audio-control" @click="toggleAudio" title="Tocar Música">
      <span class="audio-icon">{{ isPlaying ? '❚❚' : '▶' }}</span>
    </div>
    
    <!-- Youtube Hidden Div -->
    <div id="youtube-player-hidden" class="hidden"></div>
    
    <!-- Normal Audio -->
    <audio ref="audioRef" loop v-show="!isYoutube">
      <source src="https://actions.google.com/sounds/v1/holidays/jingle_bells_orchestra.ogg" type="audio/ogg">
    </audio>
  </div>
</template>

<style scoped>
.audio-control {
  position: fixed;
  bottom: clamp(15px, 4vw, 20px);
  right: clamp(15px, 4vw, 20px);
  z-index: 1000;
  margin-bottom: env(safe-area-inset-bottom);
  margin-right: env(safe-area-inset-right);
  background: var(--color-red, #D42426);
  color: white;
  width: clamp(50px, 12vw, 60px);
  height: clamp(50px, 12vw, 60px);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 30px rgba(212, 36, 38, 0.6);
  transition: transform 0.3s ease, background 0.3s;
  border: 2px solid var(--color-gold, #F8B229);
}
.audio-control:hover { transform: scale(1.1); }
.audio-control:active { transform: scale(0.95); }
.audio-icon { font-size: clamp(20px, 5vw, 24px); user-select: none; }
.hidden { display: none; visibility: hidden; width: 0; height: 0; }
</style>