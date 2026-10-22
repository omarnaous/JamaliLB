import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router'
import { AnnouncementBar } from './components/AnnouncementBar'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Intro } from './components/Intro'
import { ScrollProgress } from './components/ScrollProgress'
import { SearchOverlay } from './components/SearchOverlay'
import { scrollToTop, useSmoothScroll } from './hooks/useSmoothScroll'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductPage from './pages/Product'
import Shop from './pages/Shop'
import Wishlist from './pages/Wishlist'

export default function App() {
  const location = useLocation()
  useSmoothScroll()

  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      {/* Opacity only: a transform here would re-anchor every position:fixed child (buy bar, filter sheet). */}
      <AnimatePresence mode="wait" onExitComplete={() => scrollToTop()}>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collections/:handle" element={<Shop />} />
            <Route path="/products/:handle" element={<ProductPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
    </MotionConfig>
  )
}
