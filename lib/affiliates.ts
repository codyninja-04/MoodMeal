// Affiliate deep links to food-delivery apps for a given restaurant. Affiliate
// IDs are optional env vars — without them we still link to the platform search
// so the feature degrades to plain (unattributed) links.

export interface DeliveryLink {
  platform: 'GrabFood' | 'Deliveroo';
  url: string;
}

export function deliveryLinks(restaurantName: string): DeliveryLink[] {
  const q = encodeURIComponent(restaurantName);
  const grabAff = process.env.NEXT_PUBLIC_GRABFOOD_AFFILIATE_ID;
  const deliverooAff = process.env.NEXT_PUBLIC_DELIVEROO_AFFILIATE_ID;

  let grab = `https://food.grab.com/sg/en/restaurants?search=${q}`;
  if (grabAff) grab += `&aff_id=${encodeURIComponent(grabAff)}`;

  let deliveroo = `https://deliveroo.com.sg/search?q=${q}`;
  if (deliverooAff) deliveroo += `&aff=${encodeURIComponent(deliverooAff)}`;

  return [
    { platform: 'GrabFood', url: grab },
    { platform: 'Deliveroo', url: deliveroo },
  ];
}
