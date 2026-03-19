"use client";

type Props = {
  spinning: boolean
  onClick: () => void | Promise<void>
}

export default function SpinningRefreshIcon({ spinning, onClick }: Props) {
  return (
    <button onClick={onClick}>
      {spinning ? "Loading..." : "Refresh"}
    </button>
  )
}
