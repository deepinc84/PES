// Auditable one-hop migrations from obsolete historical URLs to live semantic destinations.
export const legacyRedirects = [
  {source:'/electrician-services',destination:'/our-services/',category:'consolidation',reason:'Legacy service index consolidated into the protected service hub.'},
  {source:'/electrician-services/chandelier-installation',destination:'/electrician-services/lighting/',category:'service consolidation',reason:'Chandelier installation is part of the rebuilt lighting service.'},
  {source:'/electrician-services/dental-equipment-repair',destination:'/electrician-services/industrial-mechanics/',category:'service consolidation',reason:'Specialized equipment support consolidated into industrial electrical and mechanical services.'},
  {source:'/electrician-services/energy-efficient-upgrades',destination:'/electrician-services/lighting/',category:'service consolidation',reason:'Historical energy-upgrade intent is best represented by the live lighting upgrade page.'},
  {source:'/electrician-services/fire-alarm-life-safety-installs',destination:'/electrician-services/fire-alarm-life-safety/',category:'duplicate',reason:'Two historical slugs described the same service.'},
  {source:'/electrician-services/mechanical-electrical-maintenance',destination:'/electrician-services/industrial-mechanics/',category:'service consolidation',reason:'Consolidated related industrial maintenance content.'},
  {source:'/electrician-services/mechanical-maintenance',destination:'/electrician-services/industrial-mechanics/',category:'service consolidation',reason:'Consolidated related industrial maintenance content.'},
  {source:'/electrician-services/mechanical-repairs',destination:'/electrician-services/industrial-mechanics/',category:'service consolidation',reason:'Consolidated related industrial repair content.'},
  {source:'/electrician-services/medical-equipment-repair',destination:'/electrician-services/industrial-mechanics/',category:'service consolidation',reason:'Specialized equipment support consolidated into the closest live capability page.'},
  {source:'/electrician-services/thermography',destination:'/electrician-services/ir-thermography-inspections/',category:'duplicate',reason:'Consolidated duplicate thermography topics into the specific IR inspection page.'},
]

export const nextRedirects=legacyRedirects.flatMap(({source,destination})=>[
  {source,destination,statusCode:301},
  {source:`${source}/`,destination,statusCode:301},
])
