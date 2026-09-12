import React, { useEffect, useState } from "react";
import { scanMusicFolder } from "./scanner.js";
import { formatDuration } from "./utils.js";
import { Box, Text, useInput } from "ink";
import { playSong, stopSong } from "./player.js";

function App() {
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const queue = songs.slice(selected + 1, selected + 4);

  useEffect(() => {
    async function loadSongs() {
      const result = await scanMusicFolder("./songs");
      setSongs(result);
    }

    loadSongs();
  }, []);
  useEffect(() => {
    if (!isPlaying || songs.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime((time) => {
        const duration = songs[selected]?.duration || 0;

        if (time >= duration) {
          return duration;
        }

        return time + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, selected, songs]);

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
        setCurrentTime(0);
        setIsPlaying(true);
      }
    }
  });
  const currentSong = songs[selected];
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
            {currentSong ? currentSong.title : "No song selected"}
          </Text>

          <Text>
            {currentSong ? currentSong.artist : ""}
          </Text>
          {currentSong && (
  <Box marginTop={2} flexDirection="column">
    <Text>
      {"━".repeat(
        currentSong.duration
          ? Math.floor((currentTime / currentSong.duration) * 20)
          : 0
      )}
      {"•"}
      {"─".repeat(
        currentSong.duration
          ? 20 - Math.floor((currentTime / currentSong.duration) * 20)
          : 20
      )}
    </Text>

    <Box justifyContent="space-between">
      <Text>{formatDuration(currentTime)}</Text>
      <Text>{formatDuration(currentSong.duration)}</Text>
    </Box>
  </Box>
)}

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

        <Box marginTop={2}>

          {queue.length === 0 ? (
            <Text>No upcoming songs</Text>
          ) : (
            queue.map((song, index) => (
              <Box key={song.path} marginRight={3}>
                <Text>
                  • {song.title}
                </Text>
              </Box>
            ))
          )}
        </Box>
      </Box>

    </Box>
  );
}

export default App;