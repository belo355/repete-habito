// Detecção do ambiente de instalação (funções puras; os valores vêm do navegador em install.ts).

export function isIOSDevice({
  userAgent,
  maxTouchPoints,
}: {
  userAgent: string;
  maxTouchPoints: number;
}): boolean {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  // iPadOS em "modo desktop" se apresenta como Mac, mas tem tela de toque.
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

export function isRunningStandalone({
  displayModeStandalone,
  iosStandalone = false,
}: {
  displayModeStandalone: boolean;
  iosStandalone?: boolean;
}): boolean {
  return displayModeStandalone || iosStandalone;
}
