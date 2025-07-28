import Hero from "@/components/home/hero/hero";
// import Presentation from "@/components/home/presentation/presentation";
import Event from "@/components/home/event/event";
import Service from "@/components/home/service/service";
import About from "@/components/home/about/about";
import President from "@/components/tourisme/president/president";



export default function Home() {
  return (
    <div>
      <Hero />
      {/* <Presentation/> */}
      <President />
      <Event />
      <Service />
      <About />
    </div>
  );
}

