import {legacyRedirects,nextRedirects} from './data/legacy-url-map.js'

const nextConfig={
  trailingSlash:true,
  async redirects(){return [
    // Host-specific legacy rules precede the catch-all so www aliases make one
    // hop to their final canonical URL rather than chaining via the same path.
    ...legacyRedirects.map(({source,destination})=>({source,has:[{type:'host',value:'www.pt-electrical.com'}],destination:`https://pt-electrical.com${destination}`,statusCode:301})),
    {source:'/:path*',has:[{type:'host',value:'www.pt-electrical.com'}],destination:'https://pt-electrical.com/:path*/',statusCode:301},
    ...nextRedirects,
  ]},
}
export default nextConfig
