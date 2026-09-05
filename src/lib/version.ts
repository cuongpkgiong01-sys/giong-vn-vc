export const APP_VERSION = "1.2.0";

function parseVersion(version: string): [number, number, number] | null {
  const match = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(version.trim());
  if (!match) return null;

  const [, majorPart, minorPart, patchPart] = match;
  return [Number(majorPart), Number(minorPart), Number(patchPart)];
}

export function nextVersion(version = APP_VERSION): string {
  const parsed = parseVersion(version);
  if (!parsed) return APP_VERSION;

  const [majorPart, minorPart, patchPart] = parsed;
  const nextPatch = patchPart + 1;

  if (nextPatch <= 9) {
    return `${majorPart}.${minorPart}.${nextPatch}`;
  }

  return `${majorPart}.${minorPart + 1}.0`;
}

export function highestVersion(versions: string[]): string {
  const candidates = versions
    .map((version) => parseVersion(version))
    .filter((version): version is [number, number, number] => Boolean(version));

  if (candidates.length === 0) {
    return APP_VERSION;
  }

  candidates.sort(([majorA, minorA, patchA], [majorB, minorB, patchB]) => {
    if (majorA !== majorB) return majorA - majorB;
    if (minorA !== minorB) return minorA - minorB;
    return patchA - patchB;
  });

  const [majorPart, minorPart, patchPart] = candidates[candidates.length - 1];
  return `${majorPart}.${minorPart}.${patchPart}`;
}
