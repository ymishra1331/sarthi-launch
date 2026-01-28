'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Configurable countdown duration in seconds (2 minutes = 120 seconds)
const COUNTDOWN_DURATION = 31


interface CountdownTime {
  minutes: number
  seconds: number
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  duration: number
  delay: number
  xOffset1: number
  xOffset2: number
}

interface FirecrackerBurst {
  id: number
  x: number
  y: number
  particles: BurstParticle[]
  createdAt: number
  startDelay?: number
}

interface BurstParticle {
  id: number
  angle: number
  distance: number
  color: string
  size: number
}

export default function Home() {
  // Initialize with the countdown duration
  const initialMinutes = Math.floor(COUNTDOWN_DURATION / 60)
  const initialSeconds = COUNTDOWN_DURATION % 60
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ minutes: initialMinutes, seconds: initialSeconds })
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [bursts, setBursts] = useState<FirecrackerBurst[]>([])

  // Function to start the timer
  const startTimer = () => {
    setHasStarted(true)
  }

  // Generate firecracker particles and bursts only after timer completes
  useEffect(() => {
    if (!isComplete) return

    const firecrackerColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFD93D', '#6BCB77']
    const burstColors = ['#FF6B6B', '#FF0000', '#FFE66D', '#FFD700', '#FF8B94', '#FF4500', '#FFA500', '#FFD93D', '#FF6347', '#FF1493']

    // Generate falling particles
    const generateParticle = (): Particle => {
      const randomX = Math.random() * 100
      const xOffset1 = (Math.random() - 0.5) * 20
      const xOffset2 = (Math.random() - 0.5) * 30
      return {
        id: Math.random(),
        x: randomX,
        y: -10, // Start above viewport
        color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
        size: Math.random() * 10 + 5, // Size between 5-15px
        duration: Math.random() * 2.5 + 2.5, // Duration between 2.5-5 seconds
        delay: Math.random() * 0.3, // Random delay
        xOffset1,
        xOffset2,
      }
    }

    // Generate initial particles
    const initialParticles: Particle[] = []
    for (let i = 0; i < 25; i++) {
      initialParticles.push(generateParticle())
    }
    setParticles(initialParticles)

    // Continuously add new particles
    const particleInterval = setInterval(() => {
      setParticles((prev) => {
        // Remove old particles (keep only last 40)
        const filtered = prev.filter((p) => p.id > 0).slice(-39)
        // Add new particle
        return [...filtered, generateParticle()]
      })
    }, 150) // Add new particle every 150ms for more continuous effect

    // Generate burst explosions
    const createBurst = (): FirecrackerBurst => {
      const x = Math.random() * 100 // Random X position
      const y = Math.random() * 100 // Random Y position
      const particleCount = 12 + Math.floor(Math.random() * 8) // 12-20 particles per burst

      const burstParticles: BurstParticle[] = []
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5 // Distribute evenly with some randomness
        burstParticles.push({
          id: Math.random(),
          angle,
          distance: 80 + Math.random() * 40, // Distance particles travel
          color: burstColors[Math.floor(Math.random() * burstColors.length)],
          size: Math.random() * 8 + 4, // Size between 4-12px
        })
      }

      return {
        id: Math.random(),
        x,
        y,
        particles: burstParticles,
        createdAt: Date.now(),
      }
    }

    // Continuously create new bursts
    const burstInterval = setInterval(() => {
      setBursts((prev) => {
        // Remove bursts older than 1.5 seconds
        const now = Date.now()
        const filtered = prev.filter((b) => now - b.createdAt < 1500)
        // Add new burst
        return [...filtered, createBurst()]
      })
    }, 600) // Create new burst every 600ms for more frequent celebrations

    return () => {
      clearInterval(particleInterval)
      clearInterval(burstInterval)
    }
  }, [isComplete])

  useEffect(() => {
    // Only start countdown when hasStarted is true
    if (!hasStarted) return

    let totalSeconds = COUNTDOWN_DURATION

    const interval = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60

      setTimeLeft({ minutes, seconds })

      if (totalSeconds <= 0) {
        clearInterval(interval)
        setIsComplete(true)
        // Create multiple celebration bursts when countdown completes
        // Batch generate all celebration bursts to avoid re-rendering 15 times in 1 second
        const firecrackerColors = ['#FF6B6B', '#FF0000', '#FFE66D', '#FFD700', '#FF8B94', '#FF4500', '#FFA500', '#FFD93D', '#FF6347', '#FF1493']
        const newBursts: FirecrackerBurst[] = []

        for (let i = 0; i < 15; i++) {
          const x = 15 + Math.random() * 70
          const y = 20 + Math.random() * 60
          const particleCount = 18 + Math.floor(Math.random() * 10)

          const burstParticles: BurstParticle[] = []
          for (let j = 0; j < particleCount; j++) {
            const angle = (Math.PI * 2 * j) / particleCount + Math.random() * 0.6
            burstParticles.push({
              id: Math.random(),
              angle,
              distance: 120 + Math.random() * 60,
              color: firecrackerColors[Math.floor(Math.random() * firecrackerColors.length)],
              size: Math.random() * 12 + 6,
            })
          }

          newBursts.push({
            id: Math.random(),
            x,
            y,
            particles: burstParticles,
            createdAt: Date.now(),
            startDelay: i * 0.08, // Stagger animations via prop instead of setTimeout
          })
        }

        setBursts((prev) => [...prev, ...newBursts])
      } else {
        totalSeconds--
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [hasStarted])

  // App Preview Carousel Logic
  const [currentScreen, setCurrentScreen] = useState(0)
  const appScreens = [
    "/Animation1.png",
    "/Animation2.png", // Placeholder: Replace with your second screenshot
    "/Animation3.png"  // Placeholder: Replace with your third screenshot
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % appScreens.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      {/* Firecracker Celebration Effect - Only after timer completes */}
      {isComplete && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
              initial={{
                y: -10,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: '110vh',
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1.2, 0],
                x: [
                  `${particle.x}%`,
                  `${particle.x + particle.xOffset1}%`,
                  `${particle.x + particle.xOffset2}%`,
                ],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Firecracker Burst Explosions */}
          {bursts.map((burst) => (
            <div key={burst.id} className="absolute" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
              {/* Central flash effect */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#FFD700',
                  boxShadow: '0 0 30px #FFD700, 0 0 60px #FFD700',
                  left: '-10px',
                  top: '-10px',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
                transition={{ duration: 0.3, delay: burst.startDelay || 0 }}
              />

              {/* Burst particles */}
              {burst.particles.map((particle) => {
                const endX = Math.cos(particle.angle) * particle.distance
                const endY = Math.sin(particle.angle) * particle.distance

                return (
                  <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      backgroundColor: particle.color,
                      boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}`,
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 0,
                    }}
                    animate={{
                      x: endX,
                      y: endY,
                      opacity: [1, 1, 0.8, 0],
                      scale: [0, 1.8, 1.2, 0],
                    }}
                    transition={{
                      duration: 1,
                      ease: 'easeOut',
                      delay: burst.startDelay || 0,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Header with Company Logos */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white py-4 sm:py-10 px-4 sm:px-6 lg:px-10">

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Your Company Logo - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Image
              src="/Linearloop-logo.svg"
              alt="Your Company Logo"
              width={120}
              height={40}
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              priority
            />
          </motion.div>

          {/* Client Company Logo - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Image
              src={isComplete ? "/sarthi-logo.png" : "/white-icon-sarthi.png"}
              alt="Client Company Logo"
              width={120}
              height={40}
              className={isComplete ? "h-8 sm:h-10 md:h-10 w-auto object-contain" : "h-8 sm:h-10 md:h-14 w-auto object-contain"}
              // className="h-8 sm:h-10 md:h-14 w-auto object-contain"
              priority
            />
          </motion.div>
        </div>

      </header>

      {/* Landing / Countdown Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Light gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-24">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4 flex justify-center"
                >
                  <Image
                    src="/sarthi-logo.png"
                    alt="SarthiTrans Logo"
                    width={400}
                    height={120}
                    className="w-64 sm:w-80 md:w-96 lg:w-[400px] h-auto"
                    priority
                  />
                </motion.div>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-12"
                >
                  India's Leading Truck Booking Platform
                </motion.p>

                {/* Countdown Timer */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center justify-center gap-6 mb-8"
                >
                  {/* Timer Display */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6">
                    <motion.div
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-600 rounded-lg px-6 sm:px-8 py-4 sm:py-6 border border-blue-700 shadow-lg"
                    >
                      <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-sm sm:text-base text-blue-100 mt-2">MIN</div>
                    </motion.div>

                    <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800">:</div>

                    <motion.div
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-blue-600 rounded-lg px-6 sm:px-8 py-4 sm:py-6 border border-blue-700 shadow-lg"
                    >
                      <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-sm sm:text-base text-blue-100 mt-2">SEC</div>
                    </motion.div>
                  </div>

                  {/* Start Timer Button - Only show when timer hasn't started */}
                  {!hasStarted && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startTimer}
                      className="px-10 mt-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      🚀 Click to Launch
                    </motion.button>
                  )}
                </motion.div>

                {/* Countdown Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-lg sm:text-xl text-gray-600"
                >
                  {hasStarted ? 'Get ready to move logistics at the speed of trust' : 'Click the button to start the countdown!'}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="launch-complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Celebratory Animation - Glow Pulse */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block"
                >
                  <div className="text-6xl sm:text-6xl md:text-7xl mb-6 pt-6">🎉</div>
                </motion.div>

                {/* Launch Complete Heading */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                >
                  SarthiTrans App is Officially Launched
                </motion.h2>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
                >
                  The Beta Version of SarthiTrans is now live on Google Play Store for real users testing
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-4 justify-center items-center"
                >
                  {/* Top Row - Two Active Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {/* Visit Website Button */}
                    <motion.a
                      href="https://www.sarthitrans.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg text-center"
                    >
                      Visit Our Website
                    </motion.a>

                    {/* View App Features Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={scrollToFeatures}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg"
                    >
                      View App Features
                    </motion.button>
                  </div>

                  {/* Bottom Row - Coming Soon Button */}
                  <motion.a
                    href="https://play.google.com/store/apps/details?id=com.sarthitrans.sarthitrans"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 mt-4 py-4 bg-black hover:bg-gray-600 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg text-center"
                  >
                    Explore application now
                  </motion.a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section id="features" className="py-20 sm:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12 sm:mb-16"
          >
            Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: '📦',
                title: 'Load Management',
                description: 'Efficiently manage and track all your logistics loads in one place.',
              },
              {
                icon: '📍',
                title: 'Load Tracking',
                description: 'Monitor shipments and vehicles with real-time statuses and path visibility using Google Maps.',
              },
              {
                icon: '💳',
                title: 'Secure Payments',
                description: 'Safe and secure payment processing for all transactions.',
              },
              {
                icon: '👥',
                title: 'Customer, Driver & Transporter Workflow',
                description: 'Streamlined workflows for drivers and transporters.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo / Preview Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12 sm:mb-16"
          >
            App Preview
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            {/* Phone Mockup */}
            <div className="relative w-64 sm:w-80 md:w-96">
              <div className="bg-gray-800 rounded-[3rem] p-4 sm:p-6 shadow-2xl">
                <div className="bg-gray-900 rounded-[2.5rem] overflow-hidden">
                  {/* Screen */}
                  <div className="aspect-[9/19.5] relative overflow-hidden bg-white">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScreen}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={appScreens[currentScreen]}
                          alt={`App Screen ${currentScreen + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                {/* Home Indicator */}
                <div className="flex justify-center mt-4">
                  <div className="w-32 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>


          <motion.a
            // href="https://workdrive.zohoexternal.com/file/nf47wb2dc1c3293a34612843ae47dabc6e6da"
            href="https://play.google.com/store/apps/details?id=com.sarthitrans.sarthitrans"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="block text-center text-blue-600 mt-12 sm:mt-16 text-xl sm:text-2xl font-semibold hover:underline cursor-pointer"
          >
            Click here to discover SarthiTrans in action.
          </motion.a>


        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 py-12 sm:py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            SarthiTrans Logistics
          </h3>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            The final, searchable version of the app will be available shortly after final compliance approval.
          </p>
        </div>
      </footer>
    </main>
  )
}
