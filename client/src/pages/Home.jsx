import { SectionWrapper } from "../hoc"
import { Hero, LatestCollection, BestSeller, OurPolicy, NewsLetterBox } from "../components"

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  )
}

export default SectionWrapper(Home, "home")