import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTestView() {
  const [viewData, setViewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testView = async () => {
    setLoading(true);
    try {
      // Testar a view vw_contratos_limpos
      const { data, error } = await supabase
        .from("vw_contratos_limpos")
        .select("*")
        .limit(3);

      if (error) {
        console.error("Erro na view:", error);
        return;
      }

      setViewData(data);

    } catch (err) {
      console.error("Erro ao testar view:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void testView();
  }, []);

  return { viewData, loading, testView };
} 