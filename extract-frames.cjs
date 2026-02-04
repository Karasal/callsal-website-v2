const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const videoPath = process.argv[2] || 'C:\\Users\\shima\\Videos\\Screen Recordings\\Screen Recording 2026-02-03 145231.mp4';
const outputDir = path.join(__dirname, 'temp-stills');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Extracting frames...');

ffmpeg(videoPath)
  .outputOptions(['-vf', 'fps=8', '-q:v', '2'])
  .output(path.join(outputDir, 'frame_%04d.jpg'))
  .on('end', () => console.log('Done! Frames in:', outputDir))
  .on('error', (err) => console.error('Error:', err.message))
  .run();
