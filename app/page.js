'use client'

import { useState } from 'react'

const makeIcon = glyph => function Icon({ size = 18, className = '' }) { return <span className={`glyph ${className}`} style={{fontSize: size}}>{glyph}</span> }
const Menu=makeIcon('☰'), BrandGithub=makeIcon('●'), ChevronDown=makeIcon('⌄'), Code2=makeIcon('‹›'), CircleDot=makeIcon('⊙'), GitPullRequest=makeIcon('⑂'), Gauge=makeIcon('◔'), PlayCircle=makeIcon('▶'), Table=makeIcon('▦'), BookOpen=makeIcon('▥'), ShieldAlert=makeIcon('♢'), ChartNoAxesColumnIncreasing=makeIcon('⌁'), Settings=makeIcon('⚙'), Search=makeIcon('⌕'), Users=makeIcon('♙'), Plus=makeIcon('+'), CircleDotDashed=makeIcon('◉'), GitBranch=makeIcon('⑂'), Monitor=makeIcon('▱'), Inbox=makeIcon('▰'), Pin=makeIcon('⌖'), Eye=makeIcon('◉'), Star=makeIcon('☆'), UserPlus=makeIcon('♧'), Copy=makeIcon('▣'), Check=makeIcon('✓')

const nav = [
  [Code2, 'Code'], [CircleDot, 'Issues'], [GitPullRequest, 'Pull requests'],
  [Gauge, 'Agents'], [PlayCircle, 'Actions'], [Table, 'Projects'],
  [BookOpen, 'Wiki'], [ShieldAlert, 'Security and quality'],
  [ChartNoAxesColumnIncreasing, 'Insights'], [Settings, 'Settings']
]

function IconButton({ children, wide = false }) {
  return <button className={`icon-button ${wide ? 'wide' : ''}`}>{children}</button>
}

function StatButton({ icon: Icon, label, value, menu = true }) {
  return <div className="stat-group"><button><Icon size={17}/><span>{label}</span>{value !== undefined && <b>{value}</b>}</button>{menu && <button className="drop"><ChevronDown size={14}/></button>}</div>
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  return <button className="copy" aria-label="Copy" onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200) }}>{copied ? <Check size={18}/> : <Copy size={18}/>}</button>
}

export default function Home() {
  const clone = 'https://github.com/deepinc84/PES.git'
  return <main>
    <header>
      <div className="topbar">
        <div className="identity">
          <IconButton><Menu size={20}/></IconButton><BrandGithub className="github" size={33} fill="currentColor"/>
          <span className="owner">deepinc84</span><span className="slash">/</span><strong>PES</strong><ChevronDown size={15}/>
        </div>
        <div className="toolbar">
          <button className="search"><Search size={18}/><span>Type <kbd>/</kbd> to search</span></button>
          <IconButton wide><Users size={17}/><ChevronDown size={14}/></IconButton>
          <i></i><IconButton wide><Plus size={19}/><ChevronDown size={14}/></IconButton>
          <IconButton><CircleDotDashed size={19}/></IconButton><IconButton><GitPullRequest size={19}/></IconButton>
          <IconButton><Monitor size={18}/></IconButton><IconButton><Inbox size={18}/></IconButton>
          <div className="avatar">▦</div>
        </div>
      </div>
      <nav>{nav.map(([Icon, label], i) => <button className={i === 0 ? 'active' : ''} key={label}><Icon size={17}/><span>{label}</span>{label === 'Pull requests' && <em>0</em>}</button>)}</nav>
    </header>

    <section className="repo-shell">
      <div className="repo-line">
        <div className="repo-title"><div className="repo-avatar">▦</div><h1>PES</h1><span>Public</span></div>
        <div className="stats"><StatButton icon={Pin} label="Pin" menu={false}/><StatButton icon={Eye} label="Watch" value="0"/><StatButton icon={GitBranch} label="Fork" value="0"/><StatButton icon={Star} label="Star" value="0"/></div>
      </div>

      <div className="cards">
        <article><Monitor size={23}/><h2>Start coding with Codespaces</h2><p>Add a README file and start coding in a secure, configurable, and dedicated<br className="desktop"/> development environment.</p><button>Create a codespace</button></article>
        <article><UserPlus size={25}/><h2>Add collaborators to this repository</h2><p>Search for people using their GitHub username or email address.</p><button>Invite collaborators</button></article>
      </div>

      <section className="quick">
        <div className="quick-head">
          <h2>Quick setup — if you’ve done this kind of thing before</h2>
          <div className="clone-row"><button className="desktop-setup"><Monitor size={16}/> Set up in Desktop</button><span>or</span><div className="protocol"><button className="selected">HTTPS</button><button>SSH</button></div><div className="url"><code>{clone}</code><CopyButton value={clone}/></div></div>
          <p>Get started by <a>creating a new file</a> or <a>uploading an existing file</a>. We recommend every repository include a <a>README</a>, <a>LICENSE</a>, and <a>.gitignore</a>.</p>
        </div>
        <Command title="…or create a new repository on the command line" lines={['echo "# PES" >> README.md','git init','git add README.md','git commit -m "first commit"','git branch -M main','git remote add origin https://github.com/deepinc84/PES.git','git push -u origin main']}/>
        <Command title="…or push an existing repository from the command line" lines={['git remote add origin https://github.com/deepinc84/PES.git','git branch -M main','git push -u origin main']}/>
      </section>
    </section>
  </main>
}

function Command({ title, lines }) {
  const value = lines.join('\n')
  return <div className="command"><h2>{title}</h2><div className="codebox"><code>{lines.map(line => <span key={line}>{line}</span>)}</code><CopyButton value={value}/></div></div>
}
