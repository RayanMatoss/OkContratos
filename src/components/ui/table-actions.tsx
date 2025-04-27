
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  showDelete?: boolean;
  showEdit?: boolean;
}

export const TableActions = ({ 
  onEdit, 
  onDelete, 
  showDelete = true,
  showEdit = true 
}: TableActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {showEdit && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      )}
      
      {showDelete && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Excluir</span>
          </Button>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete();
                    setShowDeleteDialog(false);
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};
