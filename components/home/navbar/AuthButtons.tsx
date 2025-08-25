"use client";
import { Link } from "@/i18n/navigation";
import { User, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const AuthButtons = () => {
  const t = useTranslations("header");

  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-full opacity-50">
        <User size={16} />
        <span className="text-sm font-medium">{t("loading")}</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/espace-client/dashboard">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors">
            <Settings size={16} />
            <span className="text-sm font-medium">{t("myAccount")}</span>
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">{t("disconnect")}</span>
        </button>
      </div>
    );
  }

  return (
    <Link href="/auth">
      <button className="flex items-center gap-2 bg-secondary hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors">
        <User size={16} />
        <span className="text-sm font-medium">{t("connexion")}</span>
      </button>
    </Link>
  );
};

export default AuthButtons;
