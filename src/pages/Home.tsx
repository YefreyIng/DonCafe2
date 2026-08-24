import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/sections/Hero";
import Story from "../components/sections/Story";
import Products from "../components/sections/Products";
import Benefits from "../components/sections/Benefits";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Story />
      <Products />
      <Benefits />
    </MainLayout>
  );
}