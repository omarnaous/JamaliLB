import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router'
import { AnnouncementBar } from './components/AnnouncementBar'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Intro } from './components/Intro'
import { ScrollProgress } from './components/ScrollProgress'
import { SearchOverlay } from './components/SearchOverlay'
import { useSmoothScroll } from './hooks/useSmoothScroll'
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
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
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
