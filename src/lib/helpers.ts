export const getFromSessionStorage = <T>(key: string): T => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key) as T;
  }
  return "" as T;
};

export const setInSessionStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, value);
  }
};

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const isValidEmail = (email: string) => {
  if (!email || email.length > 254 || /\s/.test(email)) return false;

  const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailPattern.test(email)) return false;

  const [localPart, domainPart] = email.split("@");
  if (!localPart || !domainPart) return false;

  if (
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return false;
  }

  if (
    domainPart.startsWith(".") ||
    domainPart.endsWith(".") ||
    domainPart.includes("..")
  ) {
    return false;
  }

  const tld = domainPart.split(".").pop();
  return Boolean(tld && tld.length >= 2);
};