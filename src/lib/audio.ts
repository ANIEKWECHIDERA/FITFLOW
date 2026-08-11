let sharedAudioContext: AudioContext | null = null;

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function playCue(type: "start" | "rest" | "tick" | "finish") {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = sharedAudioContext ?? new AudioContextClass();
  sharedAudioContext = context;
  if (context.state === "suspended") void context.resume();

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequencies = { start: 620, rest: 360, tick: 840, finish: 760 };
  const startAt = context.currentTime + 0.004;
  const cueLength = type === "finish" ? 0.55 : type === "tick" ? 0.09 : 0.18;

  oscillator.frequency.value = frequencies[type];
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.16, startAt + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + cueLength);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + cueLength + 0.01);
}
