import { useEffect, useRef, useState } from "react"
import { askLeo } from "../services/ai"
import Icon from "./Icon"

interface Message {
  role: "user" | "assistant"
  text: string
}
const clean = (text: string) =>
  text.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "").trim()

export default function PortfolioAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [voice, setVoice] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "I'm Leo. Ask me about Uzair’s projects, skills, or how to get in touch.",
    },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const history = useRef<HTMLDivElement>(null)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    }
  }, [])
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])
  useEffect(() => {
    if (open && history.current)
      history.current.scrollTop = history.current.scrollHeight
  }, [messages, pending, open])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        if ("speechSynthesis" in window) window.speechSynthesis.cancel()
        launcher.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])
  const close = () => {
    setOpen(false)
    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    launcher.current?.focus()
  }
  async function send(text: string) {
    if (pending || !text.trim()) return
    setInput("")
    setPending(true)
    setMessages((prev) => [
      ...prev.slice(-28),
      { role: "user", text: text.trim() },
    ])
    let answer: string
    try {
      answer = clean(await askLeo(text.trim()))
    } catch {
      answer =
        "I couldn’t answer that just now. You can reach Uzair at muhammaduzairgondal10@gmail.com."
    }
    if (!alive.current) return
    setMessages((prev) => [...prev, { role: "assistant", text: answer }])
    setPending(false)
    if (voice && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer))
    }
    inputRef.current?.focus()
  }
  return (
    <aside className="portfolio-assistant">
      {open && (
        <div
          className="assistant-panel"
          role="dialog"
          aria-labelledby="assistant-title"
        >
          <header className="assistant-header">
            <div className="leo-avatar" aria-hidden="true">
              10
            </div>
            <div>
              <h2 id="assistant-title">Ask Leo</h2>
              <p>Uzair’s portfolio assistant</p>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={close}
              aria-label="Close assistant"
            >
              <Icon name="close" />
            </button>
          </header>
          <div
            className="assistant-history"
            ref={history}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message, i) => (
              <div className={`assistant-message ${message.role}`} key={i}>
                <span>{message.role === "assistant" ? "LEO" : "YOU"}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {pending && (
              <div className="assistant-thinking" role="status">
                Leo is thinking<span>…</span>
              </div>
            )}
          </div>
          {messages.length === 1 && (
            <div className="assistant-prompts">
              {["What projects has Uzair built?", "What are his skills?"].map(
                (text) => (
                  <button
                    type="button"
                    key={text}
                    onClick={() => void send(text)}
                    disabled={pending}
                  >
                    {text}
                    <Icon name="arrow" size={13} />
                  </button>
                ),
              )}
            </div>
          )}
          <form
            className="assistant-form"
            onSubmit={(e) => {
              e.preventDefault()
              void send(input)
            }}
          >
            <label className="sr-only" htmlFor="leo-question">
              Your question
            </label>
            <input
              id="leo-question"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects or skills…"
              maxLength={600}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label="Send question"
            >
              <Icon name="send" size={18} />
            </button>
          </form>
          <footer className="assistant-footer">
            <span>A little football. A lot of code.</span>
            {"speechSynthesis" in window && (
              <button
                type="button"
                aria-pressed={voice}
                onClick={() => {
                  setVoice(!voice)
                  window.speechSynthesis.cancel()
                }}
              >
                <Icon name="volume" size={13} />
                Voice {voice ? "on" : "off"}
              </button>
            )}
          </footer>
        </div>
      )}
      <button
        ref={launcher}
        type="button"
        className={`assistant-launcher ${open ? "is-open" : ""}`}
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-label={open ? "Close Leo assistant" : "Open Leo assistant"}
      >
        <span className="leo-mini" aria-hidden="true">
          10
        </span>
        <span>Ask Leo</span>
        <Icon name={open ? "close" : "plus"} size={16} />
      </button>
    </aside>
  )
}
