import React, { useState } from "react";
import { C } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export function AuthScreen() {
  const { setUserRole } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "admin123") setUserRole("admin");
    else if (user === "cajero" && pass === "cajero123") setUserRole("cajero");
    else setErr("Credenciales incorrectas");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] px-8" style={{ background: C.bg }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: C.green2 }}><span className="text-4xl">🌿</span></div>
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: C.green }}>Frutería del Hogar</h1>
      <p className="text-sm mb-8 text-center" style={{ color: C.txt2 }}>Ingresa tus credenciales para continuar</p>
      
      <div className="w-full max-w-sm flex flex-col gap-4 mb-6">
        <input placeholder="Usuario (admin o cajero)" value={user} onChange={e=>setUser(e.target.value)} className="w-full h-12 rounded-xl px-4 border outline-none" style={{ background: "#fff", borderColor: C.border, color: C.txt1 }} />
        <input type="password" placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} className="w-full h-12 rounded-xl px-4 border outline-none" style={{ background: "#fff", borderColor: C.border, color: C.txt1 }} />
      </div>
      {err && <p className="text-sm font-bold text-red-500 mb-4">{err}</p>}
      
      <button onClick={handleLogin} className="w-full max-w-sm h-14 rounded-full text-white font-bold text-lg active:scale-95 transition-transform" style={{ background: C.green }}>Entrar</button>
    </div>
  );
}
