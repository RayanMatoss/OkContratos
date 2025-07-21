import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Configuracoes = () => {
  // Estados de exemplo para cada configuração
  const [ordemExibicao, setOrdemExibicao] = useState("data");
  const [contratosPorPagina, setContratosPorPagina] = useState(10);
  const [notificarVencimento, setNotificarVencimento] = useState(true);
  const [notificarRenovacao, setNotificarRenovacao] = useState(true);
  const [notificarPrazos, setNotificarPrazos] = useState(true);
  const [idioma, setIdioma] = useState("pt-BR");
  const [fusoHorario, setFusoHorario] = useState("America/Sao_Paulo");
  const [frequenciaBackup, setFrequenciaBackup] = useState("diario");
  const [localBackup, setLocalBackup] = useState("nuvem");
  const [tags, setTags] = useState(["Urgente", "Renovação", "Pendente"]);
  const [novaTag, setNovaTag] = useState("");
  const [moeda, setMoeda] = useState("R$");
  const { theme, setTheme } = useTheme();
  // Bloco de notas
  const [blocoNotas, setBlocoNotas] = useState("");
  useEffect(() => {
    const salvo = localStorage.getItem("blocoNotas");
    if (salvo) setBlocoNotas(salvo);
  }, []);
  useEffect(() => {
    localStorage.setItem("blocoNotas", blocoNotas);
  }, [blocoNotas]);

  const adicionarTag = () => {
    if (novaTag && !tags.includes(novaTag)) {
      setTags([...tags, novaTag]);
      setNovaTag("");
    }
  };
  const removerTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="flex w-full">
      <div className="max-w-2xl p-6 space-y-8 w-full">
        <h1 className="text-2xl font-bold mb-4">Configurações</h1>

        {/* Preferências de Exibição */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Preferências de Exibição</h2>
          <label className="block">Ordem de exibição:
            <select className="ml-2 bg-background text-foreground border border-border rounded px-2 py-1" value={ordemExibicao} onChange={e => setOrdemExibicao(e.target.value)}>
              <option value="data">Por data</option>
              <option value="tipo">Por tipo</option>
              <option value="status">Por status</option>
            </select>
          </label>
          <label className="block">Contratos por página:
            <Input
              type="number"
              min={1}
              max={100}
              value={contratosPorPagina}
              onChange={e => setContratosPorPagina(Number(e.target.value))}
              className="w-24 ml-2 bg-background text-foreground border border-border"
            />
          </label>
        </section>

        {/* Notificações Básicas */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Notificações Básicas</h2>
          <label className="flex items-center gap-2">
            <Switch checked={notificarVencimento} onCheckedChange={setNotificarVencimento} />
            Alertas de vencimento de contratos
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={notificarRenovacao} onCheckedChange={setNotificarRenovacao} />
            Alertas de renovação
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={notificarPrazos} onCheckedChange={setNotificarPrazos} />
            Alertas de prazos importantes
          </label>
        </section>

        {/* Idioma e Localização */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Idioma e Localização</h2>
          <label className="block">Idioma:
            <select className="ml-2 bg-background text-foreground border border-border rounded px-2 py-1" value={idioma} onChange={e => setIdioma(e.target.value)}>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">Inglês (EUA)</option>
              <option value="es-ES">Espanhol</option>
            </select>
          </label>
        </section>

        {/* Alternância de Tema */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Tema</h2>
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/80 transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
          </button>
        </section>

        {/* Definir Moeda Padrão */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Moeda Padrão</h2>
          <label className="block">Moeda:
            <select className="ml-2 bg-background text-foreground border border-border rounded px-2 py-1" value={moeda} onChange={e => setMoeda(e.target.value)}>
              <option value="R$">Real (R$)</option>
              <option value="US$">Dólar (US$)</option>
              <option value="€">Euro (€)</option>
            </select>
          </label>
        </section>
      </div>
      {/* Bloco de Notas */}
      <div className="flex-1 p-6 min-w-[600px] max-w-4xl flex flex-col items-center">
        <div className="notebook-container relative w-full max-w-xl min-h-[400px] mt-8 mb-4">
          <div className="notebook-spirals">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="notebook-spiral" />
            ))}
          </div>
          <div className="notebook-lines">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="notebook-line" />
            ))}
          </div>
          <textarea
            className="notebook-textarea"
            value={blocoNotas}
            onChange={e => setBlocoNotas(e.target.value)}
            placeholder="Digite suas anotações aqui..."
          />
        </div>
        <button
          className="self-end px-3 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/80 transition"
          onClick={() => setBlocoNotas("")}
        >
          Limpar bloco de notas
        </button>
      </div>
    </div>
  );
};

export default Configuracoes; 