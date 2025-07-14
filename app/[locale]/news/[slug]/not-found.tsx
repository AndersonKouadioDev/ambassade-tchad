import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/react";
import { ArrowLeft, FileX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FileX className="mx-auto h-24 w-24 text-gray-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Actualité non trouvée
        </h1>
        
        <p className="text-gray-600 mb-8">
          L&apos;actualité que vous recherchez n&apos;existe pas ou a été supprimée.
        </p>
        
        <div className="space-y-4">
          <Link href="/news">
            <Button 
              color="primary"
              size="lg"
              startContent={<ArrowLeft size={20} />}
              className="w-full"
            >
              Retour aux actualités
            </Button>
          </Link>
          
          <Link href="/">
            <Button 
              variant="bordered"
              size="lg"
              className="w-full border-gray-300 hover:border-primary hover:text-primary"
            >
              Retour à l&apos;accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
