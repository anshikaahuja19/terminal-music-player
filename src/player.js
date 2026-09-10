import player from "play-sound";

const audioPlayer = player();

let currentProcess = null;

export function playSong(filePath) {
  stopSong();

  currentProcess = audioPlayer.play(filePath);
}

export function stopSong() {
  if (currentProcess) {
    currentProcess.kill();
    currentProcess = null;
  }
}