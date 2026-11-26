import Categories from "@/components/home/Categories";
import FeaturedServices from "@/components/home/FeaturedServices";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChoose from "@/components/home/WhyChoose";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <FeaturedServices />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </main>
  );
}
