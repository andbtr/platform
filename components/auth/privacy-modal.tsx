"use client"

import { X } from "lucide-react"

type PrivacyModalProps = {
  open: boolean
  onClose: () => void
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0F1B2E] rounded-2xl p-8 max-w-2xl w-full m-4 border border-white/10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Política de Privacidad</h2>
        <div className="text-white/80 space-y-4">
          <p>
            Al completar este formulario, el usuario autoriza a Morenada Huajsapata a recopilar y tratar sus datos personales (como DNI, nombres, correo electrónico y teléfono) con la finalidad de gestionar su registro, coordinar pagos y brindar los servicios ofrecidos.
          </p>
          <p>
            Los datos serán almacenados de manera segura y conservados únicamente durante el tiempo necesario para cumplir con las finalidades descritas.
          </p>
          <p>
            El usuario otorga su consentimiento libre, previo, informado y expreso.
          </p>
          <p>
            Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO) mediante comunicación con los responsables de Morenada Huajsapata.
          </p>
        </div>
      </div>
    </div>
  )
}
