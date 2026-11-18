import { buildStandardCdnUrl, CdnResizeMode } from './cdn';

export type ProductNormalizeOptions = {
  titleWordLimit?: number;
  shuffle?: boolean;
  maxProducts?: number;
  rewriteViaCdn?: boolean;
  website?: string;
  cdnBaseUrl?: string;
  resizeMode?: CdnResizeMode;
  imageWidth?: number;
  imageHeight?: number;
};

export function limitWords(value: string, wordLimit: number): string {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  if (wordLimit <= 0 || words.length <= wordLimit) return words.join(' ');
  return `${words.slice(0, wordLimit).join(' ')}...`;
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalizeProductGroup(
  products: any[],
  options: ProductNormalizeOptions = {},
): Record<string, any>[] {
  const titleWordLimit = options.titleWordLimit ?? 8;
  let normalized = (Array.isArray(products) ? products : []).map((pp) => {
    const item: Record<string, any> = { ...pp };
    item.url = pp?.product_url ?? pp?.url ?? null;

    if (item.title && titleWordLimit > 0) {
      const words = String(item.title).trim().split(/\s+/).filter(Boolean);
      if (words.length > titleWordLimit) {
        item.title = limitWords(String(item.title), titleWordLimit);
      }
    }

    if (options.rewriteViaCdn && options.website && item.image) {
      item.image = buildStandardCdnUrl({
        website: options.website,
        imgSource: String(item.image),
        cdnBaseUrl: options.cdnBaseUrl,
        resizeMode: options.resizeMode,
        width: options.imageWidth,
        height: options.imageHeight,
      });
    }

    const currency = pp?.currency ?? '';
    if (pp?.price !== null && pp?.price !== undefined && pp?.price !== '') {
      item.price_new = `${pp.price}${currency ? ` ${currency}` : ''}`;
    } else if (pp?.price_new !== null && pp?.price_new !== undefined) {
      item.price_new = `${pp.price_new}${currency ? ` ${currency}` : ''}`;
    }

    if (pp?.price_new == pp?.price_old) {
      item.price_old = null;
    } else if (pp?.price_old !== null && pp?.price_old !== undefined && pp?.price_old !== '') {
      item.price_old = `${pp.price_old}${currency ? ` ${currency}` : ''}`;
    }

    return item;
  });

  if (options.shuffle) {
    normalized = shuffleArray(normalized);
  }

  const max = options.maxProducts ?? 0;
  if (max > 0 && normalized.length > max) {
    normalized = normalized.slice(0, max);
  }

  return normalized;
}
