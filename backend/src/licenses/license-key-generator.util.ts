import { LicenseType } from '@prisma/client';
import * as crypto from 'crypto';

const PREFIXES: Record<LicenseType, string> = {
  PLUGIN: 'PLG',
  SCREEN_TEMPLATE: 'TMP',
  BUILDER: 'BLD',
};

function generateRandomSegment(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charsLength = chars.length;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charsLength);
    result += chars[randomIndex];
  }
  
  return result;
}

export function generateLicenseKey(type: LicenseType): string {
  const prefix = PREFIXES[type];
  const segment1 = generateRandomSegment(4);
  const segment2 = generateRandomSegment(4);
  const segment3 = generateRandomSegment(4);
  
  return `${prefix}-${segment1}-${segment2}-${segment3}`;
}

export function validateLicenseKeyFormat(key: string): boolean {
  const pattern = /^(PLG|TMP|BLD)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(key);
}

export function getLicenseTypeFromKey(key: string): LicenseType | null {
  if (!validateLicenseKeyFormat(key)) {
    return null;
  }
  
  const prefix = key.split('-')[0];
  
  if (prefix === 'PLG') return LicenseType.PLUGIN;
  if (prefix === 'TMP') return LicenseType.SCREEN_TEMPLATE;
  if (prefix === 'BLD') return LicenseType.BUILDER;
  
  return null;
}