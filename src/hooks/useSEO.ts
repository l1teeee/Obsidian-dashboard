import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'profile';
  url?: string;
  image?: string;
  keywords?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = 'https://www.vielinks.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function useSEO({
  title,
  description,
  type = 'website',
  url,
  image = DEFAULT_IMAGE,
  keywords,
  jsonLd,
}: SEOConfig) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    if (keywords) {
      setMeta('keywords', keywords);
    }

    // Open Graph tags
    const setOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setOG('og:type', type);
    setOG('og:title', title);
    setOG('og:description', description);
    setOG('og:image', image);
    setOG('og:url', url || `${BASE_URL}${window.location.pathname}`);

    // Twitter tags
    const setTwitter = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setTwitter('twitter:card', 'summary_large_image');
    setTwitter('twitter:title', title);
    setTwitter('twitter:description', description);
    setTwitter('twitter:image', image);

    // JSON-LD structured data
    if (jsonLd) {
      let script = document.getElementById('json-ld') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, type, url, image, keywords, jsonLd]);
}
