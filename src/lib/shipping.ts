// Australia shipping zones by postcode prefix.
// References: AusPost zones, simplified into 3 buckets.
// Free shipping kicks in at FREE_SHIPPING_THRESHOLD regardless of zone.

export const FREE_SHIPPING_THRESHOLD = 100;

export type ShippingZone = 'metro' | 'regional' | 'remote';

interface ZoneRate {
  zone: ShippingZone;
  label: string;
  cost: number;
}

const ZONE_RATES: Record<ShippingZone, ZoneRate> = {
  metro: { zone: 'metro', label: 'Metro standard', cost: 8.95 },
  regional: { zone: 'regional', label: 'Regional standard', cost: 12.95 },
  remote: { zone: 'remote', label: 'Remote / outback', cost: 19.95 },
};

// Postcode → zone. Ranges based on AusPost state allocations.
// NT, far-north QLD, remote WA → remote.
// Outside-capital QLD/WA/TAS/SA + most VIC/NSW regional → regional.
// Capital city metros → metro.
function classifyPostcode(postcode: string): ShippingZone {
  const pc = parseInt(postcode, 10);
  if (!Number.isFinite(pc) || postcode.length !== 4) return 'regional';

  // NT (all)
  if (pc >= 800 && pc <= 999) return 'remote';

  // NSW
  if (pc >= 1000 && pc <= 2249) return 'metro'; // Sydney metro
  if (pc >= 2250 && pc <= 2999) return 'regional';

  // ACT
  if (pc >= 2600 && pc <= 2618) return 'metro';
  if (pc >= 2900 && pc <= 2920) return 'metro';

  // VIC
  if (pc >= 3000 && pc <= 3207) return 'metro'; // Melbourne metro
  if (pc >= 3208 && pc <= 3999) return 'regional';
  if (pc >= 8000 && pc <= 8999) return 'metro';

  // QLD
  if (pc >= 4000 && pc <= 4207) return 'metro'; // Brisbane metro
  if (pc >= 4208 && pc <= 4699) return 'regional';
  if (pc >= 4700 && pc <= 4999) return 'remote'; // FNQ + outback
  if (pc >= 9000 && pc <= 9999) return 'metro';

  // SA
  if (pc >= 5000 && pc <= 5199) return 'metro'; // Adelaide metro
  if (pc >= 5200 && pc <= 5799) return 'regional';
  if (pc >= 5800 && pc <= 5999) return 'remote';

  // WA
  if (pc >= 6000 && pc <= 6199) return 'metro'; // Perth metro
  if (pc >= 6200 && pc <= 6699) return 'regional';
  if (pc >= 6700 && pc <= 6799) return 'remote'; // Pilbara/Kimberley
  if (pc >= 6800 && pc <= 6999) return 'metro';

  // TAS
  if (pc >= 7000 && pc <= 7099) return 'metro'; // Hobart metro
  if (pc >= 7100 && pc <= 7999) return 'regional';

  return 'regional';
}

export interface ShippingQuote {
  cost: number;
  zone: ShippingZone | null;
  label: string;
  isFree: boolean;
  reason: 'free-threshold' | 'zone' | 'no-postcode';
}

export function calculateShipping(subtotal: number, postcode: string): ShippingQuote {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return {
      cost: 0,
      zone: null,
      label: 'Free shipping',
      isFree: true,
      reason: 'free-threshold',
    };
  }
  if (!postcode || postcode.length !== 4) {
    return {
      cost: 0,
      zone: null,
      label: 'Enter postcode to calculate',
      isFree: false,
      reason: 'no-postcode',
    };
  }
  const zone = classifyPostcode(postcode);
  const rate = ZONE_RATES[zone];
  return {
    cost: rate.cost,
    zone,
    label: rate.label,
    isFree: false,
    reason: 'zone',
  };
}
