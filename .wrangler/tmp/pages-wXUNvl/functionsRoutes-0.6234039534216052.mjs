import { onRequestGet as __member__slug__js_onRequestGet } from "/workspace/functions/member/[slug].js"
import { onRequestGet as __sitemap_xml_js_onRequestGet } from "/workspace/functions/sitemap.xml.js"
import { onRequest as ___middleware_js_onRequest } from "/workspace/functions/_middleware.js"

export const routes = [
    {
      routePath: "/member/:slug",
      mountPath: "/member",
      method: "GET",
      middlewares: [],
      modules: [__member__slug__js_onRequestGet],
    },
  {
      routePath: "/sitemap.xml",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__sitemap_xml_js_onRequestGet],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]