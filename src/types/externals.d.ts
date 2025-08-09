declare module "ffmpeg-static" {
  const pathToFfmpeg: string;
  export default pathToFfmpeg;
}

declare module "ffprobe-static" {
  const ffprobe: { path: string };
  export default ffprobe;
}
