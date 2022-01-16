const makeHashtags = (hashtags: string): string[] => {
  const result = hashtags
    .split(",")
    .map((word: string) => (word.startsWith("#") ? word : `#${word}`));

  return result;
};

export default makeHashtags;
