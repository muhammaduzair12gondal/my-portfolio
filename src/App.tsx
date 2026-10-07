import { useEffect, useRef, useState } from "react"
import ParticleHero from "./components/ParticleHero"
import PortfolioAssistant from "./components/PortfolioAssistant"
import Icon from "./components/Icon"

const EMAIL = "muhammaduzairgondal10@gmail.com"
const GITHUB = "https://github.com/muhammaduzair12gondal"
const LINKEDIN = "https://www.linkedin.com/in/muhammad-uzair-437b452b0/"
type Filter = "All work" | "AI systems" | "Web platforms"
interface Project {
  number: string
  name: string
  subtitle: string
  category: Exclude<Filter, "All work">
  description: string
  image?: string
  imageAlt?: string
  imageTone: string
  stack: string[]
  details: string[]
  url?: string
  repo?: string
}
const projects: Project[] = [
  {
    number: "01",
    name: "Ripple",
    subtitle: "Decision physics engine",
    category: "AI systems",
    description:
      "What happens after a decision? Ripple combines synthetic agents, causal chains, and historical patterns to explore the consequences before you commit.",
    image: "/ripple.png",
    imageAlt:
      "Ripple decision simulation dashboard with retention forecasts and scenario analysis",
    imageTone: "ripple",
    stack: ["Next.js", "Python", "pgvector", "Multi-agent AI"],
    details: [
      "Synthetic populations with coherent traits and social dynamics.",
      "Causal propagation across multiple orders of consequences.",
      "Historical matching to ground simulated outcomes.",
    ],
    url: "https://ripple-lake-two.vercel.app/",
  },
  {
    number: "02",
    name: "AquaYield",
    subtitle: "Irrigation intelligence",
    category: "Web platforms",
    description:
      "A practical answer to “how much water does my crop need?” Weather data and machine learning, brought together for smallholder farmers.",
    image: "/2.PNG",
    imageAlt: "AquaYield weather dashboard and crop irrigation controls",
    imageTone: "aqua",
    stack: ["Next.js", "FastAPI", "Scikit-learn"],
    details: [
      "Random forest model for evapotranspiration estimates.",
      "Crop classification with the Hugging Face Inference API.",
      "Urdu localization with full right-to-left support.",
    ],
    url: "https://aqua-yield-xi.vercel.app/",
  },
  {
    number: "03",
    name: "Review Intelligence",
    subtitle: "Customer feedback, understood",
    category: "AI systems",
    description:
      "An NLP pipeline that separates mixed opinions, flags suspicious reviews, and finds the recurring themes behind customer feedback.",
    image: "/p1.PNG",
    imageAlt:
      "Customer Review Intelligence sentiment gauges and topic classification dashboard",
    imageTone: "reviews",
    stack: ["Python", "BERTopic", "XGBoost", "NLP"],
    details: [
      "Aspect-based sentiment for individual product features.",
      "Behavioral signals for fake review detection.",
      "Topic clustering to surface recurring customer concerns.",
    ],
    url: "https://customer-review-intelligence-h2k7drvfv.vercel.app/",
    repo: `${GITHUB}/customer-review-intelligence`,
  },
  {
    number: "04",
    name: "FootballAI",
    subtitle: "The game, through data",
    category: "Web platforms",
    description:
      "My love of football meets full-stack engineering. Live scores and match forecasts powered by ELO ratings, Poisson models, and a real-time data pipeline.",
    image: "/football.PNG",
    imageAlt:
      "FootballAI match predictions website with league navigation and live scores",
    imageTone: "football",
    stack: ["Node.js", "Express", "Redis", "Vite"],
    details: [
      "Custom ELO ratings, Poisson distributions, and calibration.",
      "Live updates with Server-Sent Events and Redis caching.",
      "A production API layer for scores and predictions.",
    ],
    url: "https://vantage-football-ai.vercel.app/",
  },
  {
    number: "05",
    name: "GigIntel",
    subtitle: "Research for better listings",
    category: "AI systems",
    description:
      "A multi-agent tool for researching competitors, diagnosing Fiverr gigs, and turning those findings into clearer, search-friendly listings.",
    imageTone: "gig",
    stack: ["React", "Gemini", "Groq", "Automation"],
    details: [
      "Competitor research from search results.",
      "Gig scoring and listing diagnostics.",
      "Parallel AI workflows for SEO copy suggestions.",
    ],
  },
]
const stack = [
  {
    number: "01",
    name: "Interfaces",
    description:
      "Responsive experiences that feel considered, from the first click to the last.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    number: "02",
    name: "Systems",
    description:
      "APIs, data, and the less visible work that keeps a product running.",
    tools: [
      "Node.js",
      "Python",
      "FastAPI",
      "Express",
      "MongoDB",
      "SQL",
      "Redis",
    ],
  },
  {
    number: "03",
    name: "Intelligence",
    description:
      "Models and automation connected to things people can actually use.",
    tools: ["Scikit-learn", "PyTorch", "NLP", "TensorFlow", "AI integration"],
  },
  {
    number: "04",
    name: "Delivery",
    description:
      "Version control, testing, and a dependable path from idea to deployment.",
    tools: ["Git", "GitHub", "Vercel", "Postman", "Selenium", "Jira"],
  },
]

function ProjectImage({ project }: { project: Project }) {
  return (
    <div className={`project-image ${project.imageTone}`}>
      <div className="project-image-top">
        <span>{project.name.toLowerCase()} / application</span>
        <Icon name="arrow" size={15} />
      </div>
      {project.image ? (
        <div className="project-screen">
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            width={1920}
            height={900}
          />
        </div>
      ) : (
        <div
          className="gig-cover"
          aria-label="GigIntel workflow: research, diagnose, optimize"
        >
          <span className="gig-cover-label">GIG INTELLIGENCE</span>
          <p>
            Good listings
            <br />
            start with
            <br />
            <em>good research.</em>
          </p>
          <div>
            {["Research", "Diagnose", "Optimize"].map((text, i) => (
              <span key={text}>
                <small>0{i + 1}</small>
                {text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
function ProjectCard({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  return (
    <article className={`project ${featured ? "project-feature" : ""}`}>
      <div className="project-visual min-w-0">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-image-link"
            aria-label={`Open ${project.name} live website`}
          >
            <ProjectImage project={project} />
          </a>
        ) : (
          <ProjectImage project={project} />
        )}
      </div>
      <div className="project-info">
        <div className="project-meta">
          <span>/{project.number}</span>
          <span>{project.category}</span>
        </div>
        <h3>{project.name}</h3>
        <p className="project-subtitle">{project.subtitle}</p>
        <p className="project-description">{project.description}</p>
        <ul className="project-stack flex flex-wrap" aria-label="Technologies">
          {project.stack.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <div className="project-actions">
          {project.url ? (
            <a
              className="text-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit project
              <Icon name="arrow" size={16} />
            </a>
          ) : (
            <span className="project-in-development">In development</span>
          )}
          {project.repo && (
            <a
              className="text-link secondary"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
              <Icon name="arrow" size={16} />
            </a>
          )}
          <details className="project-details">
            <summary>
              Build notes
              <Icon name="plus" size={15} />
            </summary>
            <ul>
              {project.details.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("")
  const [introVisible, setIntroVisible] = useState(true)
  const [filter, setFilter] = useState<Filter>("All work")
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const hero = document.getElementById("hero")
    const heroObserver = new IntersectionObserver(([entry]) =>
      setIntroVisible(entry.isIntersecting),
    )
    if (hero) heroObserver.observe(hero)
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.1, 0.3] },
    )
    document
      .querySelectorAll("section[data-nav]")
      .forEach((section) => sectionObserver.observe(section))
    return () => {
      heroObserver.disconnect()
      sectionObserver.disconnect()
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        document.getElementById("menu-toggle")?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setCopyError(false)
      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopyError(true)
    }
  }
  const filtered = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  )
  const featured = filtered.find((project) => project.number === "01")
  const grid = filtered.filter((project) => project.number !== "01")
  const navItems = [
    ["projects", "Selected work"],
    ["about", "About"],
    ["skills", "Capabilities"],
  ]
  return (
    <>
      <a className="skip-link" href="#profile">
        Skip to content
      </a>
      <header
        className={`site-header ${introVisible ? "over-intro" : "over-page"}`}
      >
        <div className="header-inner">
          <a href="#hero" className="wordmark" aria-label="Uzair Gondal home">
            <span className="monogram" aria-hidden="true">
              u.
            </span>
            <span>
              UZAIR
              <br />
              GONDAL
            </span>
          </a>
          <nav
            className={`navigation ${menuOpen ? "is-open" : ""}`}
            id="site-navigation"
            aria-label="Main navigation"
          >
            {navItems.map(([id, label], i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                aria-current={
                  active === id && !introVisible ? "location" : undefined
                }
              >
                <span>0{i + 1}</span>
                {label}
              </a>
            ))}
            <a
              className="navigation-contact"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk
              <Icon name="arrow" size={17} />
            </a>
          </nav>
          <button
            className="menu-toggle icon-button"
            type="button"
            id="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={25} />
          </button>
        </div>
      </header>
      <main>
        <ParticleHero />
        <section
          id="profile"
          className="intro-section page-width"
          aria-labelledby="intro-title"
        >
          <div className="section-eyebrow flex items-center justify-between">
            <span>INDEPENDENT DEVELOPER</span>
            <span className="availability">
              <i aria-hidden="true" />
              Available for freelance
            </span>
          </div>
          <div className="intro-layout grid">
            <h2 id="intro-title">
              Ideas are good.
              <br />
              <span>
                Built is <em>better.</em>
              </span>
            </h2>
            <div className="intro-description">
              <p>
                I’m Muhammad Uzair, a software engineering student and
                full-stack developer. I build web applications and connect AI to
                problems worth solving.
              </p>
              <p>
                From the interface to the API, I like being close to the whole
                product.
              </p>
              <a className="text-link" href="#projects">
                A few things I’ve built
                <Icon name="down" size={17} />
              </a>
            </div>
          </div>
          <div className="intro-bottom">
            <span>Based in Pakistan · Working on the web</span>
            <span>REACT / PYTHON / A BIT OF CURIOSITY</span>
          </div>
        </section>
        <section
          id="projects"
          className="work-section page-width"
          data-nav
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">01 / SELECTED WORK</span>
              <h2 id="work-title">
                Out of my head.
                <br />
                <em>Into the world.</em>
              </h2>
            </div>
            <p>
              A selection of things I’ve designed,
              <br />
              built, and put to work.
            </p>
          </div>
          <div className="work-toolbar">
            <div
              className="work-filters"
              role="group"
              aria-label="Filter projects"
            >
              {(["All work", "AI systems", "Web platforms"] as Filter[]).map(
                (label) => (
                  <button
                    type="button"
                    key={label}
                    className={filter === label ? "selected" : ""}
                    onClick={() => setFilter(label)}
                    aria-pressed={filter === label}
                  >
                    {label}
                    <span>
                      {label === "All work"
                        ? projects.length
                        : projects.filter((p) => p.category === label).length}
                    </span>
                  </button>
                ),
              )}
            </div>
            <span className="work-count" role="status">
              {String(filtered.length).padStart(2, "0")} PROJECTS
            </span>
          </div>
          {featured && <ProjectCard project={featured} featured />}
          <div className="project-grid grid grid-cols-1 md:grid-cols-2">
            {grid.map((project) => (
              <ProjectCard key={project.number} project={project} />
            ))}
          </div>
          <a
            className="github-line"
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>There’s more in the repositories.</span>
            <span>
              Find me on GitHub
              <Icon name="arrow" size={19} />
            </span>
          </a>
        </section>
        <section
          id="about"
          className="about-section"
          data-nav
          aria-labelledby="about-title"
        >
          <div className="about-inner page-width">
            <div className="about-photo">
              <img
                src="/new_transparent_image.jpg"
                alt="Muhammad Uzair wearing a suit"
                loading="lazy"
                width={768}
                height={1024}
              />
              <div className="photo-caption">
                <span>MUHAMMAD UZAIR</span>
                <span>Developer. Builder. Football fan.</span>
              </div>
              <span className="photo-index" aria-hidden="true">
                UG / 01
              </span>
            </div>
            <div className="about-copy">
              <span className="eyebrow">02 / THE PERSON BEHIND THE CODE</span>
              <h2 id="about-title">
                Curious by nature.
                <br />
                <em>Builder by choice.</em>
              </h2>
              <p>
                I’m studying Software Engineering at FAST-NUCES. What keeps me
                interested is the space between learning something new and
                making it useful.
              </p>
              <p>
                I work across the stack: interfaces, APIs, data pipelines, and
                AI integrations. I enjoy figuring out how the pieces fit, then
                getting them into a working product.
              </p>
              <p>
                Outside of code, you’ll usually find me thinking about football.
                That’s how FootballAI started.
              </p>
              <div className="about-facts">
                <div>
                  <span>EDUCATION</span>
                  <p>
                    BS Software Engineering
                    <br />
                    FAST-NUCES
                  </p>
                </div>
                <div>
                  <span>CURRENT FOCUS</span>
                  <p>
                    Full-stack development
                    <br />
                    Applied AI & automation
                  </p>
                </div>
              </div>
              <div className="about-links flex">
                <a
                  className="text-link"
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <Icon name="arrow" size={17} />
                </a>
                <a
                  className="text-link"
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                  <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          id="skills"
          className="skills-section page-width"
          data-nav
          aria-labelledby="skills-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">03 / CAPABILITIES</span>
              <h2 id="skills-title">
                The tools change.
                <br />
                <em>The thinking stays.</em>
              </h2>
            </div>
            <p>
              I choose the stack around the problem,
              <br />
              then make the pieces work together.
            </p>
          </div>
          <div className="capability-list">
            {stack.map((item) => (
              <div className="capability-row" key={item.number}>
                <span className="capability-number">/{item.number}</span>
                <div className="capability-name">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <ul className="capability-tools flex flex-wrap">
                  {item.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="service-note">
            <span>WHAT I CAN HELP WITH</span>
            <p>
              Web applications<span>/</span>Landing pages<span>/</span>AI
              integration<span>/</span>Automation<span>/</span>Bug fixing
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="page-width">
            <div className="contact-top flex justify-between">
              <span className="eyebrow">04 / NEXT UP</span>
              <span className="availability">
                <i aria-hidden="true" />
                Open to new projects
              </span>
            </div>
            <div className="contact-heading">
              <h2 id="contact-title">
                Something
                <br />
                on your <em>mind?</em>
              </h2>
              <a
                className="contact-arrow"
                href={`mailto:${EMAIL}`}
                aria-label="Email Muhammad Uzair"
              >
                <Icon size={64} />
              </a>
            </div>
            <div className="contact-bottom">
              <p>
                Tell me what you’re working on.
                <br />
                Let’s figure out the next step.
              </p>
              <div className="email-block">
                <a href={`mailto:${EMAIL}`} className="email-link">
                  {EMAIL}
                </a>
                <button
                  type="button"
                  className="copy-email"
                  onClick={() => void copyEmail()}
                  aria-label={
                    copied ? "Email address copied" : "Copy email address"
                  }
                >
                  <Icon name={copied ? "check" : "copy"} size={17} />
                  <span>{copied ? "Copied" : "Copy address"}</span>
                </button>
                <span className="copy-status" role="status">
                  {copyError
                    ? "Copy unavailable. Use the email link above."
                    : copied
                      ? "Email address copied."
                      : ""}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <a href="#hero" className="footer-mark" aria-label="Back to top">
          u.
        </a>
        <p>© {new Date().getFullYear()} Muhammad Uzair</p>
        <div>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">
            GitHub
            <Icon size={13} />
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <Icon size={13} />
          </a>
          <a href="#hero">
            Back to top
            <Icon
              name="down"
              size={13}
              style={{ transform: "rotate(180deg)" }}
            />
          </a>
        </div>
      </footer>
      {!introVisible && <PortfolioAssistant />}
    </>
  )
}
