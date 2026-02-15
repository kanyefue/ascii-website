"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Vector2, Mesh, MeshStandardMaterial, Color } from "three"
import { AsciiEffect } from "./ascii-effect"

export function EffectScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState(new Vector2(0, 0))
  const [resolution, setResolution] = useState(new Vector2(1920, 1080))

  // --- LINKS CONFIGURATION ---
  // Replace the '#' with your actual profile URLs
  const links = [
    { label: 'Twitter', href: 'https://twitter.com/Kfuecs' },
    { label: 'Steam',   href: 'https://steamcommunity.com/id/dualipalover' },
    { label: 'CSFloat', href: 'https://csfloat.com/stall/76561199099189972' },
  ]

  // Load the custom model
  const { scene } = useGLTF("/model.glb")

  // Force Material Update
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh
        mesh.material = new MeshStandardMaterial({
          color: new Color("#B9A9FE"), // Lighter Purple
          roughness: 0.4,
          metalness: 0.1,
        })
      }
    })
  }, [scene])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = rect.height - (e.clientY - rect.top)
        setMousePos(new Vector2(x, y))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      const rect = container.getBoundingClientRect()
      setResolution(new Vector2(rect.width, rect.height))
      const handleResize = () => {
        const rect = container.getBoundingClientRect()
        setResolution(new Vector2(rect.width, rect.height))
      }
      window.addEventListener("resize", handleResize)
      return () => {
        container.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh", position: "relative" }}>
      
      {/* --- ASCII LINKS OVERLAY --- */}
      <div style={{
        position: 'absolute',
        bottom: '40%', // MOVED UP from 15% to 40%
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '40px',
        zIndex: 10,
        pointerEvents: 'auto',
      }}>
        {links.map((link) => (
          <a 
            key={link.label} 
            href={link.href}
            target="_blank"            // Opens in new tab
            rel="noopener noreferrer"  // Security best practice
            style={{
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              color: '#F5A962',
              textDecoration: 'none',
              letterSpacing: '2px',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(245, 169, 98, 0.5)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            [{link.label}]
          </a>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "#5C5C5C" }} 
      >
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={1.5} /> 
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, 3, -5]} intensity={1.2} />

        <primitive 
          object={scene} 
          scale={0.9} 
          position={[0, 1.5, 0]} // MOVED UP by 1.5 units
          rotation={[0, 0, 0]} 
        />

        <OrbitControls 
          enableDamping 
          enableZoom={false} 
          autoRotate={true} 
          autoRotateSpeed={0.5}
          target={[0, 1.5, 0]} // Focus camera on the new model height
        />

        <EffectComposer>
          <AsciiEffect
            style="standard"
            cellSize={6}
            invert={false}
            color={true}
            resolution={resolution}
            mousePos={mousePos}
            postfx={{
              colorPalette: 5,
              scanlineIntensity: 0,
              scanlineCount: 200,
              targetFPS: 0,
              jitterIntensity: 0,
              jitterSpeed: 1,
              mouseGlowEnabled: false,
              mouseGlowRadius: 200,
              mouseGlowIntensity: 1.5,
              vignetteIntensity: 0,
              vignetteRadius: 0.8,
              curvature: 0,
              aberrationStrength: 0,
              noiseIntensity: 0,
              noiseScale: 1,
              noiseSpeed: 1,
              waveAmplitude: 0,
              waveFrequency: 10,
              waveSpeed: 1,
              glitchIntensity: 0,
              glitchFrequency: 0,
              brightnessAdjust: 0,
              contrastAdjust: 1,
            }}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}