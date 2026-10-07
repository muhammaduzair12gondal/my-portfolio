import type { CSSProperties } from "react"

type IconName = "arrow" | "down" | "plus" | "close" | "menu" | "send" | "copy" | "check" | "volume"
const paths: Record<IconName, string[]> = {
  arrow: ["M5 19 19 5", "M5 5h14v14"],
  down: ["M12 4v16", "m5 13 7 7 7-7"],
  plus: ["M12 5v14", "M5 12h14"],
  close: ["m6 6 12 12", "m18 6-12 12"],
  menu: ["M4 8h16", "M4 16h16"],
  send: ["m4 4 17 8-17 8 4-8-4-8Z", "M8 12h13"],
  copy: ["M9 9h11v11H9Z", "M5 15H4V4h11v1"],
  check: ["m5 12 4 4L19 6"],
  volume: [
    "M11 5 6 9H3v6h3l5 4V5Z",
    "M15 8a6 6 0 0 1 0 8",
    "M18 5a10 10 0 0 1 0 14",
  ],
}
export default function Icon({
  name = "arrow",
  size = 20,
  style,
}: {
  name?: IconName
  size?: number
  style?: CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name].map((d, i) => (
        <path d={d} key={i} />
      ))}
    </svg>
  )
}
