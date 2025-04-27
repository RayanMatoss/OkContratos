
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  showDelete?: boolean;
  showEdit?: boolean;
  disableDelete?: boolean;
  disableEdit?: boolean;
  deleteTooltip?: string;
  editTooltip?: string;
}

export const TableActions = ({ 
  onEdit, 
  onDelete, 
  showDelete = true,
  showEdit = true,
  disableDelete = false,
  disableEdit = false,
  deleteTooltip,
  editTooltip
}: TableActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {showEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => !disableEdit && onEdit()}
                disabled={disableEdit}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </div>
          </TooltipTrigger>
          {editTooltip && disableEdit && (
            <TooltipContent>
              <p>{editTooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      )}
      
      {showDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => !disableDelete && setShowDeleteDialog(true)}
                disabled={disableDelete}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Excluir</span>
              </Button>
            </div>
          </TooltipTrigger>
          {deleteTooltip && disableDelete && (
            <TooltipContent>
              <p>{deleteTooltip}</p>
            </TooltipContent>
          )}
        </Tooltip>
      )}

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
    </div>
  );
};
