export const fetcher = async ([url, postalCode]: [string, string]): Promise<PostalcodeResponse> => {
  const response = await fetch(`${url}?zipcode=${postalCode}`);
  const data = await response.json();
  return data;
}

export const validatePostalCode = (postalCode: string): boolean => {
  // 正規表現で7桁の数字かどうかを判定
  return /^\d{7}$/.test(postalCode);
}
