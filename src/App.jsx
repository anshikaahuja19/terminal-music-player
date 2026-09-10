import React, { useEffect, useState } from "react";
import { scanMusicFolder } from "./scanner.js";
import { formatDuration } from "./utils.js";
import { Box, Text, useInput } from "ink";
import { playSong, stopSong } from "./player.js";

function App() {
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function loadSongs() {
      const result = await scanMusicFolder("./songs");
      setSongs(result);
    }

    loadSongs();
  }, []);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelected((current) => Math.max(0, current - 1));
    }

    if (key.downArrow) {
      setSelected((current) =>
        Math.min(songs.length - 1, current + 1)
      );
    }

    if (input === " " && songs.length > 0) {
      if (isPlaying) {
        stopSong();
        setIsPlaying(false);
      } else {
        playSong(songs[selected].path);
        setIsPlaying(true);
      }
    }
  });

  return (
    <Box flexDirection="column">
      <Text>My Music</Text>

      {songs.map((song, index) => (
        <Text key={song.path}>
          {index === selected ? "▶ " : "  "}
          {index + 1}. {song.title} | {song.artist} | {song.album} |{" "}
          {formatDuration(song.duration)}
        </Text>
      ))}

      <Text>
        {isPlaying ? "Playing" : "Paused"}
      </Text>
    </Box>
  );
}

export default App;