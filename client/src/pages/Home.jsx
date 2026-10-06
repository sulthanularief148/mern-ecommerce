import { SectionWrapper } from "../hoc"
import {
  Hero, TrustBar, CategoryShowcase, LatestCollection, EditorsPicks, PromoBanner,
  BestSeller, StatsGrid, SustainabilityBanner, Testimonials, OurPolicy, NewsLetterBox
} from "../components"

const Home = () => {
  return (
    <div>
      <Hero />
      <TrustBar />
      <CategoryShowcase />
      <LatestCollection />
      <EditorsPicks />
      <PromoBanner />
      <BestSeller />
      <StatsGrid />
      <SustainabilityBanner />
      <Testimonials />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  )
}

export default SectionWrapper(Home, "home")
