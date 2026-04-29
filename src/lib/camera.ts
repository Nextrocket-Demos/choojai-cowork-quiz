export interface CameraHandle {
  video: HTMLVideoElement;
  stream: MediaStream;
  stop: () => void;
}

export async function startSelfieCamera(): Promise<CameraHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      aspectRatio: { ideal: 9 / 16 },
      width:  { ideal: 720 },
      height: { ideal: 1280 },
    },
    audio: false,
  });

  const video = document.createElement('video');
  video.srcObject = stream;
  video.playsInline = true;
  video.muted = true;
  video.autoplay = true;
  await video.play();

  return {
    video,
    stream,
    stop: () => {
      stream.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    },
  };
}

export function isCameraSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
