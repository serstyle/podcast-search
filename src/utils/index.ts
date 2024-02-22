export const getTruncatedText = (text: string, length: number) => {
  if (text.length > length) return text.slice(0, length) + "...";
  return text;
};

export const prettyTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
