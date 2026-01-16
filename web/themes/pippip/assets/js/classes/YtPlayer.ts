// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.

// Load the IFrame Player API code asynchronously.

// Interface for YouTube player options
export interface YouTubePlayerOptions {
    height: string;
    width: string;
    videoId: string;
    playerVars: {
      autoplay: number;
      controls: number;
      showinfo: number;
      loop: number;
      mute: number;
      rel: number;
      playlist: string;
    };
  }

declare global {
    interface Window {
        onYouTubePlayerAPIReady: () => void;
    }
}
  
// YouTube player class
class YouTubePlayer {
    private player: YT.Player | null = null;

    constructor(videoId: string, options: YouTubePlayerOptions) {
        const videoEl = document.querySelector('#ytplayer') as HTMLElement;

        if (videoEl) {
            // Load YouTube API script dynamically
            const script = document.createElement('script');
            script.src = "https://www.youtube.com/player_api";
            document.body.appendChild(script);

            // Handle API ready event
            window.onYouTubePlayerAPIReady = () => {
                this.player = new YT.Player('ytplayer', options);
            };
        }
    }
}

export default YouTubePlayer;