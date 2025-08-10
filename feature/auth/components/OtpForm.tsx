// Composant OTP désactivé car le flow OTP n'est plus utilisé
/*
"use client";

import { useState } from "react";

export default function OtpForm({
  email,
  onValidate,
  onCancel,
}: {
  email: string;
  onValidate: (otpCode: string) => void;
  onCancel: () => void;
}) {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError("Code requis");
      return;
    }
    onValidate(otpCode);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Entrez le code OTP</h3>
      <input
        type="text"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        className="input input-bordered px-4 py-2 rounded-lg"
        placeholder="Code OTP"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="text-sm text-gray-500">
          Annuler
        </button>
        <button type="submit" className="btn bg-blue-500 text-white px-4 py-2 rounded-md">
          Vérifier
        </button>
      </div>
    </form>
  );
}
*/
