export default function SidebarMenuLabel({ label }: { label: string }) {
  if (!label) return null;
  return <div className="text-xs font-semibold text-gray-400  uppercase mb-1 px-4">{label}</div>;
} 