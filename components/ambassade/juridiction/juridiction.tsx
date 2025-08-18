import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Juridictions(){
    const t = useTranslations("ambassade.juridiction");
    return(
        <div className="font-mulish py-16 px-8 mb-96">
            <div className="flex flex-col">
                <div className="ml-0 md:ml-24 text-center md:text-start" >
                    {t("description")}
                </div>
            <div className="flex flex-col md:flex-row justify-center gap-2 py-4">
                <div className="bg-primary text-white px-2 md:px-40 py-1 font-medium rounded-full md:rounded-b-md cursor-pointer text-center">Ambassades et représentations permanentes</div>
                <div className="bg-gray-300 text-white px-2 md:px-40 py-1 rounded-full md:rounded-b-md hover:bg-gray-400 cursor-pointer text-center">Postes consulaires</div>
            </div>
            <div className="relative flex items-center justify-between w-full h-[calc(100vh-90px)]">
                  <Image
                    className="absolute hidden md:block inset-0 w-full h-full object-cover shrink-0"
                    src="/assets/images/backgrounds/background.png"
                    alt="herosection"
                    fill
                  />
                  <div className="absolute hidden md:block w-full h-full bg-blue-800/50 px-4"></div>

            
                  <div className="absolute px-4 pt-4 inset-0 flex flex-col bottom-2 items-start justify-start md:justify-center text-left gap-20 lg:gap-32">
                    {/* Texte principal */}
                    <div className=" mx-auto relative w-full h-full md:w-auto md:h-auto py-8 px-24 top-0 md:top-60 flex bg-white flex-col gap-0 md:gap-6">

                        <div className="flex flex-row md:flex-wrap justify-center md:justify-between px-0 md:px-6 gap-8">
                        {/* Première colonne */}
                        <div className="flex-1">
                            <ol className="space-y-2 list-none pl-0 md:pl-5">
                            <li>1. {t("algerie")}</li>
                            <li>2. {t("afrique_du_sud")}</li>
                            <li>3. {t("cote_d_ivoire")}</li>
                            <li>4. {t("emirats_arabe_unis")}</li>
                            <li>5. {t("belgique")}</li>
                            <li>6. {t("bresil")}</li>
                            <li>7. {t("burkina_faso")}</li>
                            <li>8. {t("cameroun")}</li>
                            <li>9. {t("canada")}</li>
                            <li>10. {t("suisse")}</li>
                            <li>11. {t("congo")}</li>
                            <li>12. {t("egypte")}</li>
                            <li>13. {t("etats_unis")}</li>
                            <li>14. {t("Côte d'Ivoire")}</li>
                            <li>15. {t("ethiopie")}</li>
                            <li>16. {t("federation_de_russie")}</li>
                            <li>17. {t("gabon")}</li>
                            <li>18. {t("guinee_equatoriale")}</li>
                            
                            </ol>
                        </div>

                        {/* Deuxième colonne */}
                        <div className=" flex-1">
                            <ol className="space-y-2 list-none pl-0 md:pl-5">
                            <li>19. {t("inde")}</li>
                            <li>20. {t("japon")}</li>
                            <li>21. {t("koweit")}</li>
                            <li>22. {t("libye")}</li>
                            <li>23. {t("mali")}</li>
                            <li>24. {t("niger")}</li>
                            <li>25. {t("nigeria")}</li>
                            <li>26. {t("qatar")}</li>
                            <li>27. {t("new_york")}</li>
                            <li>28. {t("republique_centrafricaine")}</li>
                            <li>29. {t("republique_democratique_du_congo")}</li>
                            <li>30. {t("republique_populaire_de_chine")}</li>
                            <li>31. {t("royaume_maroc")}</li>
                            <li>32. {t("norvege")}</li>
                            <li>33. {t("soudan")}</li>
                            <li>34. {t("turquie")}</li>
                            </ol>
                        </div>
                        </div>

                    
                    </div>
            
                    
                  </div>
            
                  
                </div>
            </div>
        </div>
    );
}