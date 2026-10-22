import { BrandStrip } from '../sections/BrandStrip'
import { CategoryScroller } from '../sections/CategoryScroller'
import { FlushFinder } from '../sections/FlushFinder'
import { Hero } from '../sections/Hero'
import { Manifesto } from '../sections/Manifesto'
import { Newsletter } from '../sections/Newsletter'
import { PinkOctober } from '../sections/PinkOctober'
import { ProductTabs } from '../sections/ProductTabs'
import { Reels } from '../sections/Reels'
import { HudaSpotlight, SolSpotlight } from '../sections/Spotlight'
import { Perks, Reviews } from '../sections/Trust'

const isOctober = new Date().getMonth() === 9

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <Manifesto />
      <ProductTabs />
      <CategoryScroller />
      <FlushFinder />
      <HudaSpotlight />
      <SolSpotlight />
      <Reels />
      <Perks />
      <Reviews />
      {isOctober && <PinkOctober />}
      <Newsletter />
    </>
  )
}
