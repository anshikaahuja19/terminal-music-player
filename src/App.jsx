import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { scanMusicFolder } from "./scanner.js";
import { formatDuration } from "./utils.js";

function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function loadSongs() {
      const result = await scanMusicFolder("./songs");
      setSongs(result);
    }

    loadSongs();
  }, []);

  return (
    <Box flexDirection="column">
      <Text>🎵 My Music</Text>

      {songs.map((song, index) => (
        <Text key={song.path}>
          {index + 1}. {song.title} | {song.artist} | {song.album} |{" "}
          {formatDuration(song.duration)}
        </Text>
      ))}
    </Box>
  );
}

export default App;