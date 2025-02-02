
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  let formatted = "";

  if (cleaned.length > 0) {
    formatted += cleaned.slice(0, 1);
  }

  if (cleaned.length >= 2) {
    formatted += "-" + cleaned.slice(1, 4);
  }

  if (cleaned.length >= 5) {
    formatted += "-" + cleaned.slice(4, 7);
  }

  if (cleaned.length >= 8) {
    formatted += "-" + cleaned.slice(7, 9);
  }

  if (cleaned.length >= 10) {
    formatted += "-" + cleaned.slice(9, 11);
  }

  return formatted;
};