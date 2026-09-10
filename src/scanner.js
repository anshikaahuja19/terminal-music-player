import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";

export async function scanMusicFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  const audioFiles = files.filter((file) => {
    const extension = path.extname(file).toLowerCase();

    return [".mp3", ".wav", ".flac", ".m4a"].includes(extension);
  });

  const songs = [];

  for (const file of audioFiles) {
    const filePath = path.join(folderPath, file);

    const metadata = await parseFile(filePath);

    songs.push({
      title: metadata.common.title || file,
      artist: metadata.common.artist || "Unknown",
      album: metadata.common.album || "Unknown",
      duration: metadata.format.duration || 0,
      path: filePath,
    });
  }

  return songs;
}