export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aditivos: {
        Row: {
          contrato_id: string
          criado_em: string | null
          id: string
          nova_data_termino: string | null
          percentual_itens: number | null
          tipo: string
        }
        Insert: {
          contrato_id: string
          criado_em?: string | null
          id?: string
          nova_data_termino?: string | null
          percentual_itens?: number | null
          tipo: string
        }
        Update: {
          contrato_id?: string
          criado_em?: string | null
          id?: string
          nova_data_termino?: string | null
          percentual_itens?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "aditivos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aditivos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "vw_contratos_municipio"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          created_at: string
          data_inicio: string
          data_termino: string
          fornecedor_id: string
          fundo_municipal: string[]
          id: string
          municipio_id: string | null
          numero: string
          objeto: string
          status: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_inicio: string
          data_termino: string
          fornecedor_id: string
          fundo_municipal: string[]
          id?: string
          municipio_id?: string | null
          numero: string
          objeto: string
          status?: string
          valor: number
        }
        Update: {
          created_at?: string
          data_inicio?: string
          data_termino?: string
          fornecedor_id?: string
          fundo_municipal?: string[]
          id?: string
          municipio_id?: string | null
          numero?: string
          objeto?: string
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_municipio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          cnpj: string
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          municipio_id: string | null
          municipioid: string | null
          nome: string
          telefone: string | null
        }
        Insert: {
          cnpj: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          municipio_id?: string | null
          municipioid?: string | null
          nome: string
          telefone?: string | null
        }
        Update: {
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          municipio_id?: string | null
          municipioid?: string | null
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      itens: {
        Row: {
          contrato_id: string
          created_at: string
          descricao: string
          fundos: string[] | null
          id: string
          municipio_id: string | null
          quantidade: number
          quantidade_consumida: number
          unidade: string
          valor_unitario: number
        }
        Insert: {
          contrato_id: string
          created_at?: string
          descricao: string
          fundos?: string[] | null
          id?: string
          municipio_id?: string | null
          quantidade: number
          quantidade_consumida?: number
          unidade: string
          valor_unitario: number
        }
        Update: {
          contrato_id?: string
          created_at?: string
          descricao?: string
          fundos?: string[] | null
          id?: string
          municipio_id?: string | null
          quantidade?: number
          quantidade_consumida?: number
          unidade?: string
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "vw_contratos_municipio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_consumidos: {
        Row: {
          created_at: string
          id: string
          item_id: string
          ordem_id: string
          quantidade: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          ordem_id: string
          quantidade: number
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          ordem_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_ordem"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_consumidos_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_consumidos_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          uf: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          uf: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          uf?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          created_at: string
          id: string
          lida: boolean
          mensagem: string
          tipo: string
          titulo: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lida?: boolean
          mensagem: string
          tipo: string
          titulo: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lida?: boolean
          mensagem?: string
          tipo?: string
          titulo?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      OkContratos: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      ordens: {
        Row: {
          contrato_id: string
          created_at: string
          data_emissao: string
          id: string
          municipio_id: string | null
          numero: string
          status: string
        }
        Insert: {
          contrato_id: string
          created_at?: string
          data_emissao: string
          id?: string
          municipio_id?: string | null
          numero?: string
          status?: string
        }
        Update: {
          contrato_id?: string
          created_at?: string
          data_emissao?: string
          id?: string
          municipio_id?: string | null
          numero?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "vw_contratos_municipio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          cargo: string | null
          created_at: string | null
          fundo_municipal: string[] | null
          id: string
          municipio_id: string | null
          nome: string
          perfil: string
          permissao: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          fundo_municipal?: string[] | null
          id?: string
          municipio_id?: string | null
          nome: string
          perfil?: string
          permissao?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          fundo_municipal?: string[] | null
          id?: string
          municipio_id?: string | null
          nome?: string
          perfil?: string
          permissao?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_contratos_municipio: {
        Row: {
          created_at: string | null
          data_inicio: string | null
          data_termino: string | null
          fornecedor_id: string | null
          fornecedor_nome: string | null
          fundo_municipal: string[] | null
          id: string | null
          municipio_id: string | null
          municipio_nome: string | null
          municipio_uf: string | null
          numero: string | null
          objeto: string | null
          status: string | null
          valor: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "vw_fornecedores_municipio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_fornecedores_municipio: {
        Row: {
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string | null
          municipio_id: string | null
          municipio_nome: string | null
          municipio_uf: string | null
          nome: string | null
          telefone: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      aplicar_aditivo_valor: {
        Args: { p_contrato_id: string; p_percentual: number }
        Returns: undefined
      }
      get_contratos_municipio: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          numero: string
          fornecedor_id: string
          valor: number
          data_inicio: string
          data_fim: string
          status: string
          municipio_id: string
        }[]
      }
      get_fornecedores_municipio: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          cnpj: string
          email: string
          telefone: string
          endereco: string
          municipio_id: string
        }[]
      }
      get_municipio_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          municipio_id: string
          municipio_nome: string
          municipio_uf: string
        }[]
      }
      get_next_ordem_numero: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_municipio: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      recalcular_consumo_itens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      },
      salvar_contrato_com_itens: {
        Args: {
          p_numero: string,
          p_fundo_municipal: string[],
          p_objeto: string,
          p_valor: number,
          p_data_inicio: string,
          p_data_termino: string,
          p_fornecedor_id: string,
          p_itens: any // ou ajuste conforme o tipo real esperado
        },
        Returns: any // ajuste conforme o retorno real
      }
      salvar_contrato_com_itens: {
        Args:
          | {
              p_numero: string
              p_fornecedor_id: string
              p_fundo_municipal: string[]
              p_objeto: string
              p_valor: number
              p_data_inicio: string
              p_data_termino: string
              p_itens: Json
            }
          | {
              p_numero: string
              p_fundo_municipal: string[]
              p_objeto: string
              p_valor: number
              p_data_inicio: string
              p_data_termino: string
              p_fornecedor_id: string[]
              p_itens: Json
            }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
