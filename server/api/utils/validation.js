export const validateChatInput = (input) => {
    if (typeof input !== 'string') return false;
    if (input.length > 500 || input.length < 1) return false;
    return /^[\w\s.,?!-'"()@#$%^&*]+$/i.test(input);
  };