interface UserProfileCardProps {
  name: string;
  role: string;
}

export default function UserProfileCard({ name, role }: UserProfileCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mt-4">
      <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg">{initials}</div>
      <div>
        <div className="font-semibold text-blue-900 text-sm">{name}</div>
        <div className="text-xs text-gray-500">{role}</div>
      </div>
    </div>
  );
} 