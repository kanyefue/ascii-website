"use client"

import dynamic from 'next/dynamic'

// This dynamically imports the scene and disables Server-Side Rendering (SSR)
const EffectScene = dynamic(
  () => import('../components/effect-scene').then((mod) => mod.EffectScene),
  { ssr: false }
)

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#000000" }}>
      <EffectScene />
    </main>
  )
}