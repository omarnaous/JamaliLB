import type { ReactNode } from 'react'

/**
 * Shopify descriptions here are mostly Sephora-style plain text: "Label: value" lines,
 * "Heading:" lines followed by "- bullet" items. Turn that into readable markup.
 */
export function Description({ text }: { text: string }) {
  const lines = text
    .replace(/ /g, ' ')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^https?:\/\/\S+$/.test(l))

  const blocks: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (!list.length) return
    blocks.push(
      <ul key={blocks.length} className="ml-4 list-disc space-y-1 marker:text-blush">
        {list.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>,
    )
    list = []
  }

  for (const line of lines) {
    const bullet = line.match(/^[-•*]\s*(.+)$/)
    if (bullet) {
      list.push(bullet[1])
      continue
    }
    flush()
    const heading = line.match(/^([^.:]{2,40}):$/)
    const pair = line.match(/^([^.:]{2,40}):\s+(.+)$/)
    if (heading) blocks.push(<p key={blocks.length} className="pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">{heading[1]}</p>)
    else if (pair)
      blocks.push(
        <p key={blocks.length}>
          <b className="font-semibold text-ink">{pair[1]}:</b> {pair[2]}
        </p>,
      )
    else blocks.push(<p key={blocks.length}>{line}</p>)
  }
  flush()

  return blocks.length ? <div className="space-y-2 break-words">{blocks}</div> : null
}

export const hasDescription = (text: string) => text.split('\n').some((l) => l.trim() && !/^https?:\/\/\S+$/.test(l.trim()))
