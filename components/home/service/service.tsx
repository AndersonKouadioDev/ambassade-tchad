import { Button, Link } from "@nextui-org/react";
import Image from "next/image";

type Service = {
  picture: string;
  title: string;
  link: string;
};

const service: Service[] = [
  {
    picture:
      "/assets/images/illustrations/page-accueil/card-items-1.png",
    title: "VISA",
    link: "#",
  },
  {
    picture:
      "/assets/images/illustrations/page-accueil/card-items-2.png",
    title: "PASSEPORT",
    link: "#",
  },
  {
    picture:
      "/assets/images/illustrations/page-accueil/card-items-3.png",
    title: "CARTE CONSULAIRE",
    link: "#",
  },
  {
    picture:
      "/assets/images/illustrations/page-accueil/card-items-4.png",
    title: "SERVICE ECONOMIQUE",
    link: "#",
  },
  {
    picture:
      "/assets/images/illustrations/page-accueil/card-items-5.png",
    title: "SERVICE CULTUREL",
    link: "#",
  },
  {
    picture:
      "/assets/images/illustrations/page-accueil/card-items-6.png",
    title: "AUTRES DOCUMENTS",
    link: "#",
  },
  
];
export default function Service() {
  return (
    <div className="flex flex-col justify-around bg-muted p-6 lg:p-20">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex flex-col md:flex-row justify-between my-4 sm:gap-4 gap-0 lg:gap-4">
          <div className="md:text-lg lg:text-4xl text-center font-semibold md:text-start text-secondary sm:my-2 my-0 lg:my-2">
            NOS SERVICES
          </div>
          <Button color="default" className="mt-4 text-secondary">
              Voir plus
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-around items-stretch gap-4 flex-wrap mt-3 lg:mt-10">
        {service.map((items) => {
          return (
            <div
              key={items.title} 
              className="flex flex-col mt-4 self-stretch rounded-xl shadow-2xl w-72 bg-card"
            >
              <div className="overflow-hidden rounded-xl relative">
                <Image
                    className="w-full h-60 object-cover"
                    src={items.picture}
                    alt={items.title}
                    width={300} 
                    height={160} 
                    objectFit="cover" 
                />
                <Button color="secondary" href={items.link} className="text-white mx-auto w-4/5 absolute inset-x-0 bottom-4">{items.title}</Button>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}