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
  <Box flexDirection="column" height="100%">

    {/* APP HEADING */}
    <Box justifyContent="center" marginBottom={1}>
      <Text bold>TERMINAL MUSIC PLAYER</Text>
    </Box>

    {/* TOP SECTION */}
    <Box flexDirection="row" height="65%">

      {/* MY MUSIC */}
      <Box
        flexDirection="column"
        width="35%"
        borderStyle="single"
        padding={1}
      >
        <Text bold>My Music</Text>

        {/* SPACE BELOW HEADING */}
        <Box marginBottom={1} />

        {songs.map((song, index) => (
          <Text key={song.path}>
            {index === selected ? "▶ " : "  "}
            {song.title}
          </Text>
        ))}
      </Box>

      {/* NOW PLAYING */}
      <Box
        flexDirection="column"
        width="65%"
        borderStyle="single"
        padding={1}
      >
        <Text bold>Now Playing</Text>
         <Box marginBottom={1} />

        <Text>
          {songs.length > 0 ? songs[selected].title : "No song selected"}
        </Text>

        <Text>
          {songs.length > 0 ? songs[selected].artist : ""}
        </Text>

        <Text>
          {isPlaying ? "▶ Playing" : "⏸ Paused"}
        </Text>
      </Box>

    </Box>

    {/* QUEUE */}
    <Box
      flexDirection="column"
      height="35%"
      borderStyle="single"
      padding={1}
    >
      <Text bold>Queue</Text>

      <Text>Upcoming songs</Text>
    </Box>

  </Box>
);
}

export default App;