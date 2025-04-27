
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface FormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  loading?: boolean;
}

export function FormSheet({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  children,
  submitLabel = "Salvar",
  loading = false
}: FormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto" side="right">
        <form onSubmit={onSubmit} className="h-full flex flex-col">
          <SheetHeader className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          
          <div className="flex-1 py-6">
            {children}
          </div>

          <SheetFooter className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
