"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Geography from "./geography/geography";
import History from "./history/history";
import Statistic from "./statistic/statistic";

export default function TabNavigation() {
  const t = useTranslations("tourisme.geography");
  const [activeTab, setActiveTab] = useState("geography");

  const renderContent = () => {
    switch (activeTab) {
      case "geography":
        return <Geography />;
      case "history":
        return <History />;
      case "statistics":
        return <Statistic />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-12">
          <div
            onClick={() => setActiveTab("statistics")}
            className={`
              px-6 py-3 font-semibold rounded-full cursor-pointer text-center w-full md:w-auto
              ${
                activeTab === "statistics"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              }
            `}
          >
            {t("tabs.key_figures")}
          </div>
          <div
            onClick={() => setActiveTab("history")}
            className={`
              px-6 py-3 font-semibold rounded-full cursor-pointer text-center w-full md:w-auto
              ${
                activeTab === "history"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              }
            `}
          >
            {t("tabs.history")}
          </div>
          <div
            onClick={() => setActiveTab("geography")}
            className={`
              px-6 py-3 font-semibold rounded-full cursor-pointer text-center w-full md:w-auto
              ${
                activeTab === "geography"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
              }
            `}
          >
            {t("tabs.geography")}
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}
