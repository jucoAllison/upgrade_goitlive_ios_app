export const TruncateText = (text, maxLength) => {
  if (text?.length <= maxLength) {
    return text;
  } else {
    return text?.substring(0, maxLength - 3) + '...';
  }
};
