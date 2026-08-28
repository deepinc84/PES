import {nextRedirects} from './data/legacy-redirects.js'

const nextConfig={
  trailingSlash:true,
  async redirects(){return [
    {source:'/:path*',has:[{type:'host',value:'www.pt-electrical.com'}],destination:'https://pt-electrical.com/:path*/',statusCode:301},
    ...nextRedirects,
  ]},
}
export default nextConfig
