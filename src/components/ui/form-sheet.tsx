
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
  footer?: React.ReactNode;
  step?: number;
  totalSteps?: number;
}

export function FormSheet({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
  children,
  submitLabel = "Salvar",
  loading = false,
  footer,
  step,
  totalSteps
}: FormSheetProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto" side="right">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader className="space-y-2">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
            
            {step && totalSteps && (
              <div className="flex items-center justify-center mt-2">
                <div className="flex gap-1">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-2 w-10 rounded ${
                        index + 1 === step ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  Passo {step} de {totalSteps}
                </span>
              </div>
            )}
          </SheetHeader>
          
          <div className="flex-1 py-6">
            {children}
          </div>

          <SheetFooter className="flex justify-end gap-2 pt-2">
            {footer ? (
              footer
            ) : (
              <>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : submitLabel}
                </Button>
              </>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
