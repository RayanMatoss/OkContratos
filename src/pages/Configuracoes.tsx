import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimbreSelector } from "@/components/ui/timbre-selector";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

const Configuracoes = () => {
  // Estados de exemplo para cada configuração
  const [ordemExibicao, setOrdemExibicao] = useState("data");
  const [contratosPorPagina, setContratosPorPagina] = useState(10);
  const [notificarVencimento, setNotificarVencimento] = useState(true);
  const [notificarRenovacao, setNotificarRenovacao] = useState(true);
  const [notificarPrazos, setNotificarPrazos] = useState(true);
  const [idioma, setIdioma] = useState("pt-BR");
  const [moeda, setMoeda] = useState("R$");
  
  // Configuração de timbres
  const [timbrePadrao, setTimbrePadrao] = useState("prefeitura");
  
  // Bloco de notas
  const [blocoNotas, setBlocoNotas] = useState("");
  
  // Hooks
  const { secretariaAtiva, setSecretariaAtiva, fundosSelecionados } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Salvar secretaria ativa no localStorage quando mudar
  useEffect(() => {
    if (secretariaAtiva) {
      localStorage.setItem('secretariaAtiva', secretariaAtiva);
    }
  }, [secretariaAtiva]);

  useEffect(() => {
    // Carregar bloco de notas
    const salvo = localStorage.getItem("blocoNotas");
    if (salvo) setBlocoNotas(salvo);
  }, []);

  useEffect(() => {
    // Salvar bloco de notas
    localStorage.setItem("blocoNotas", blocoNotas);
  }, [blocoNotas]);

  return (
    <div className="flex w-full">
      <div className="max-w-2xl p-6 space-y-8 w-full">
        <h1 className="text-2xl font-bold mb-4">Configurações</h1>

        {/* Configuração de Timbres - Movida para o topo */}
        {fundosSelecionados.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Configuração de Timbres</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Secretaria Ativa:</label>
                <TimbreSelector
                  value={secretariaAtiva || 'prefeitura'}
                  onValueChange={setSecretariaAtiva}
                  className="w-48"
                />
                <p className="text-xs text-muted-foreground">
                  Esta secretaria será usada automaticamente nos PDFs das ordens de fornecimento
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Preferências de Exibição */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Preferências de Exibição</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Ordem de exibição:</label>
            <Select value={ordemExibicao} onValueChange={setOrdemExibicao}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data">Por data</SelectItem>
                <SelectItem value="tipo">Por tipo</SelectItem>
                <SelectItem value="status">Por status</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Contratos por página:</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={contratosPorPagina}
              onChange={e => setContratosPorPagina(Number(e.target.value))}
              className="w-24"
            />
          </div>
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">Idioma:</label>
            <Select value={idioma} onValueChange={setIdioma}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">Inglês (EUA)</SelectItem>
                <SelectItem value="es-ES">Espanhol</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Alternância de Tema */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Tema</h2>
          <Button
            onClick={toggleTheme}
            variant="default"
            className="w-48"
          >
            {theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
          </Button>
        </section>

        {/* Definir Moeda Padrão */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Moeda Padrão</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Moeda:</label>
            <Select value={moeda} onValueChange={setMoeda}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R$">Real (R$)</SelectItem>
                <SelectItem value="US$">Dólar (US$)</SelectItem>
                <SelectItem value="€">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>


      </div>

      {/* Bloco de Notas */}
      <div className="flex-1 p-6 min-w-[600px] max-w-4xl flex flex-col items-center">
        <div className="relative w-full max-w-xl min-h-[400px] mt-8 mb-4">
          {/* CSS inline para o bloco de notas */}
          <style jsx>{`
            .notebook-container {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border: 2px solid #dee2e6;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              position: relative;
              overflow: hidden;
            }
            
            .notebook-spirals {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 20px;
              background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 8px,
                #6c757d 8px,
                #6c757d 12px
              );
            }
            
            .notebook-lines {
              position: absolute;
              left: 30px;
              right: 20px;
              top: 20px;
              bottom: 20px;
              background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 29px,
                #e9ecef 29px,
                #e9ecef 30px
              );
            }
            
            .notebook-textarea {
              position: absolute;
              left: 30px;
              right: 20px;
              top: 20px;
              bottom: 20px;
              background: transparent;
              border: none;
              outline: none;
              resize: none;
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 30px;
              color: #495057;
              padding: 0;
              z-index: 10;
            }
            
            .notebook-textarea::placeholder {
              color: #adb5bd;
            }
          `}</style>
          
          <div className="notebook-container">
            <div className="notebook-spirals"></div>
            <div className="notebook-lines"></div>
            <textarea
              className="notebook-textarea"
              value={blocoNotas}
              onChange={e => setBlocoNotas(e.target.value)}
              placeholder="Digite suas anotações aqui..."
            />
          </div>
        </div>
        <Button
          onClick={() => setBlocoNotas("")}
          variant="destructive"
          className="self-end"
        >
          Limpar bloco de notas
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes; 