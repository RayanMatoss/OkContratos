
interface RelatoriosHeaderProps {
  children: React.ReactNode;
}

export const RelatoriosHeader = ({ children }: RelatoriosHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise e visualização dos dados do sistema
        </p>
      </div>
      {children}
    </div>
  );
};
