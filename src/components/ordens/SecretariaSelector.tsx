import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SecretariaSelectorProps {
  fundos: string[];
  selectedSecretaria: string | null;
  onSecretariaChange: (secretaria: string) => void;
  required?: boolean;
}

export const SecretariaSelector: React.FC<SecretariaSelectorProps> = ({
  fundos,
  selectedSecretaria,
  onSecretariaChange,
  required = false
}) => {
  if (fundos.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Nenhuma secretaria disponível para este usuário.
        </AlertDescription>
      </Alert>
    );
  }

  if (fundos.length === 1) {
    return (
      <div className="space-y-2">
        <Label>Secretaria</Label>
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          {fundos[0]}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="secretaria-select">
        Secretaria {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={selectedSecretaria || ''} onValueChange={onSecretariaChange}>
        <SelectTrigger id="secretaria-select">
          <SelectValue placeholder="Selecione uma secretaria" />
        </SelectTrigger>
        <SelectContent>
          {fundos.map((fundo) => (
            <SelectItem key={fundo} value={fundo}>
              {fundo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {required && !selectedSecretaria && (
        <p className="text-sm text-red-500">
          Selecione uma secretaria para continuar.
        </p>
      )}
    </div>
  );
};
