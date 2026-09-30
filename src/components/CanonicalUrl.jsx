import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://clevanoo.com";

const getCanonicalUrl = (pathname) => {
  const cleanPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return `${SITE_URL}${cleanPath}`;
};

const upsertHeadTag = (selector, createTag, updateTag) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = createTag();
    document.head.appendChild(tag);
  }

  updateTag(tag);
};

const CanonicalUrl = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(pathname);

    upsertHeadTag(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        return link;
      },
      (link) => link.setAttribute("href", canonicalUrl)
    );

    upsertHeadTag(
      'meta[property="og:url"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:url");
        return meta;
      },
      (meta) => meta.setAttribute("content", canonicalUrl)
    );
  }, [pathname]);

  return null;
};

export default CanonicalUrl;