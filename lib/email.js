export const validateEmailOptions = (emailOptions) => {
  if (
    !emailOptions.from ||
    !emailOptions.to ||
    !emailOptions.subject ||
    !emailOptions.html
  ) {
    return { success: false, error: 'Missing required fields', data: null };
  }
  if (
    typeof emailOptions.from !== 'string' ||
    typeof emailOptions.to !== 'string' ||
    typeof emailOptions.subject !== 'string' ||
    typeof emailOptions.html !== 'string'
  ) {
    return { success: false, error: 'Invalid data types', data: null };
  }
  return { success: true, error: null, data: emailOptions };
};
