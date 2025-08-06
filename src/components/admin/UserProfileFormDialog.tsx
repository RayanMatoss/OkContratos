import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FundoMunicipalSelector from '@/components/contratos/FundoMunicipalSelector';

interface UserProfileFundosFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (fundos: string[]) => Promise<void>;
  loading: boolean;
  fundos?: string[];
}

export const UserProfileFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  fundos = []
}: UserProfileFundosFormDialogProps) => {
  const [selectedFundos, setSelectedFundos] = useState<string[]>(fundos);

  useEffect(() => {
    setSelectedFundos(fundos);
  }, [fundos, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(selectedFundos);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Selecionar Fundos/Secretarias</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <FundoMunicipalSelector
            selectedFundos={selectedFundos}
            onChange={setSelectedFundos}
          />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 