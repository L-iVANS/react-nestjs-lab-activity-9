// Password validation rules
const passwordRules = {
  length: {
    test: (password) => password.length >= 8,
    message: "At least 8 characters (12+ recommended)",
  },
  uppercase: {
    test: (password) => /[A-Z]/.test(password),
    message: "At least 1 uppercase letter (A–Z)",
  },
  lowercase: {
    test: (password) => /[a-z]/.test(password),
    message: "At least 1 lowercase letter (a–z)",
  },
  number: {
    test: (password) => /[0-9]/.test(password),
    message: "At least 1 digit (0–9)",
  },
  specialChar: {
    test: (password) => /[!@#$%^&*]/.test(password),
    message: "At least 1 special character (!@#$%^&*)",
  },
};

// Validate password against all rules
export const validatePassword = (password) => {
  const errors = [];
  const passed = [];

  Object.keys(passwordRules).forEach((key) => {
    const rule = passwordRules[key];
    if (rule.test(password)) {
      passed.push(key);
    } else {
      errors.push(rule.message);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    passed,
  };
};

// Check if password meets all requirements
export const isPasswordValid = (password) => {
  return validatePassword(password).isValid;
};
