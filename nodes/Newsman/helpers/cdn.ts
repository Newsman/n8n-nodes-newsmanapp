import { createHash } from 'crypto';

export type CdnResizeMode =
  | 'none'
  | 'widthPreserve'
  | 'heightPreserve'
  | 'exact'
  | 'exactTrim';

export const DEFAULT_CDN_BASE_URL = 'http://cdn.nzmt.eu/nzi';

export type BuildCdnUrlOptions = {
  website: string;
  imgSource: string;
  cdnBaseUrl?: string;
  resizeMode?: CdnResizeMode;
  width?: number;
  height?: number;
};

const stripWww = (value: string): string =>
  value.replace(/^www\./i, '');

const stripScheme = (value: string): string =>
  value.replace(/^https?:\/\//i, '');

/**
 * Port of Zend `_getstandardcdnurl` without Mongo / block types.
 * Resize is controlled explicitly via mode + width/height.
 */
export function buildStandardCdnUrl(options: BuildCdnUrlOptions): string {
  const websiteRaw = String(options.website || '').trim();
  const imgSource = String(options.imgSource || '').trim();
  if (!websiteRaw || !imgSource) return imgSource;

  const website = stripWww(websiteRaw);
  const cdnBase = String(options.cdnBaseUrl || '').trim() || DEFAULT_CDN_BASE_URL;

  let urlNoScheme = stripScheme(imgSource);
  const xcdn = safeParseUrl(imgSource);

  let img: string;
  if (imgSource.indexOf(websiteRaw) === -1 && imgSource.indexOf(website) === -1 && !xcdn?.host) {
    if (!urlNoScheme.startsWith('/')) urlNoScheme = `/${urlNoScheme}`;
    img = `${website}${urlNoScheme}`;
  } else {
    img = stripWww(urlNoScheme);
  }

  img = img.replace(/\/\//g, '/').replace(/\.\./g, '');
  // restore protocol-style double-slash removal only inside path; keep single slashes
  img = img.replace(/\/{2,}/g, '/');

  const pcdn = safeParseUrl(`http://${img}`);
  let host = website;

  if (pcdn?.host && !(pcdn.path || '').includes(website)) {
    host = pcdn.host;
  } else if (xcdn?.host && !pcdn?.host && !(pcdn?.path || '').includes(website)) {
    host = xcdn.host;
  } else if (xcdn?.host && stripWww(xcdn.host) !== website) {
    host = stripWww(xcdn.host);
  } else if (!pcdn?.host && !xcdn?.host && pcdn?.path === xcdn?.path) {
    img = `${website}${img.startsWith('/') ? '' : '/'}${img}`;
    host = website;
  } else {
    host = website;
  }

  host = stripWww(host);

  const hash = createHash('md5').update(`Newsman${host}`).digest('hex').slice(0, 5);
  let cdn = `${cdnBase.replace(/\/$/, '')}/${hash}/${img.replace(/^\//, '')}`;

  const resizeMode = options.resizeMode || 'none';
  const query = buildResizeQuery(resizeMode, options.width, options.height);
  if (!query) return cdn;

  const prefix = cdn.includes('?') ? '&' : '?';
  return `${cdn}${prefix}${query}`;
}

function buildResizeQuery(
  mode: CdnResizeMode,
  width?: number,
  height?: number,
): string {
  const w = width && width > 0 ? Math.floor(width) : undefined;
  const h = height && height > 0 ? Math.floor(height) : undefined;

  switch (mode) {
    case 'widthPreserve':
      return w ? `w=${w}&pr=1` : '';
    case 'heightPreserve':
      return h ? `h=${h}&pr=1` : '';
    case 'exact':
      return w && h ? `w=${w}&h=${h}` : '';
    case 'exactTrim':
      return w && h ? `w=${w}&h=${h}&pr=t` : '';
    case 'none':
    default:
      return '';
  }
}

function safeParseUrl(value: string): { host?: string; path?: string } | null {
  try {
    // URL needs a base for scheme-relative / path-only values
    if (/^https?:\/\//i.test(value)) {
      const u = new URL(value);
      return { host: u.host, path: u.pathname + u.search };
    }
    if (value.startsWith('//')) {
      const u = new URL(`http:${value}`);
      return { host: u.host, path: u.pathname + u.search };
    }
    if (value.includes('/') && !value.startsWith('/')) {
      const u = new URL(`http://${value}`);
      return { host: u.host, path: u.pathname + u.search };
    }
    return { path: value };
  } catch {
    return null;
  }
}
