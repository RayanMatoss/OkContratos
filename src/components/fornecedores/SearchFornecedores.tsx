
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFornecedoresProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

export const SearchFornecedores = ({ searchTerm, onSearch }: SearchFornecedoresProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar fornecedores..."
        className="w-full pl-8"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};
