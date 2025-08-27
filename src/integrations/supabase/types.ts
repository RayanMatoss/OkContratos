export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aditivos: {
        Row: {
          id: string
          contrato_id: string
          tipo: string
          nova_data_termino?: string
          percentual_itens?: number
          criado_em: string
        }
        Insert: {
          id?: string
          contrato_id: string
          tipo: string
          nova_data_termino?: string
          percentual_itens?: number
          criado_em?: string
        }
        Update: {
          id?: string
          contrato_id?: string
          tipo?: string
          nova_data_termino?: string
          percentual_itens?: number
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "aditivos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          }
        ]
      }
      contratos: {
        Row: {
          id: string
          numero: string
          fornecedor_id: string
          fundo_municipal: string[]
          objeto: string
          valor: number
          data_inicio: string
          data_termino: string
          status: string
          municipio_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          numero: string
          fornecedor_id: string
          fundo_municipal: string[]
          objeto: string
          valor: number
          data_inicio: string
          data_termino: string
          status?: string
          municipio_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          numero?: string
          fornecedor_id?: string
          fundo_municipal?: string[]
          objeto?: string
          valor?: number
          data_inicio?: string
          data_termino?: string
          status?: string
          municipio_id?: string
          created_at?: string
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
            foreignKeyName: "contratos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
      fornecedores: {
        Row: {
          id: string
          nome: string
          cnpj: string
          email?: string
          telefone?: string
          endereco?: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj: string
          email?: string
          telefone?: string
          endereco?: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string
          email?: string
          telefone?: string
          endereco?: string
          created_at?: string
        }
        Relationships: []
      }
      itens: {
        Row: {
          id: string
          contrato_id: string
          descricao: string
          quantidade: number
          unidade: string
          valor_unitario: number
          quantidade_consumida: number
          fundos?: string[]
          created_at: string
        }
        Insert: {
          id?: string
          contrato_id: string
          descricao: string
          quantidade: number
          unidade: string
          valor_unitario: number
          quantidade_consumida?: number
          fundos?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          contrato_id?: string
          descricao?: string
          quantidade?: number
          unidade?: string
          valor_unitario?: number
          quantidade_consumida?: number
          fundos?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          }
        ]
      }
      itens_consumidos: {
        Row: {
          id: string
          ordem_id: string
          item_id: string
          quantidade: number
        }
        Insert: {
          id?: string
          ordem_id: string
          item_id: string
          quantidade: number
        }
        Update: {
          id?: string
          ordem_id?: string
          item_id?: string
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_consumidos_ordem_id_fkey"
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
          }
        ]
      }
      municipios: {
        Row: {
          id: string
          nome: string
          uf: string
          codigo_ibge?: string
        }
        Insert: {
          id?: string
          nome: string
          uf: string
          codigo_ibge?: string
        }
        Update: {
          id?: string
          nome?: string
          uf?: string
          codigo_ibge?: string
        }
        Relationships: []
      }
      ordens: {
        Row: {
          id: string
          numero: string
          contrato_id: string
          data_emissao: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          numero: string
          contrato_id: string
          data_emissao: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          numero?: string
          contrato_id?: string
          data_emissao?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          }
        ]
      }
      ordem_solicitacoes: {
        Row: {
          id: string
          contrato_id: string
          solicitante: string
          secretaria: string
          justificativa?: string
          quantidade?: number
          status: string
          criado_em: string
          decidido_por?: string
          decidido_em?: string
          motivo_decisao?: string
        }
        Insert: {
          id?: string
          contrato_id: string
          solicitante?: string
          secretaria?: string
          justificativa?: string
          quantidade?: number
          status?: string
          criado_em?: string
          decidido_por?: string
          decidido_em?: string
          motivo_decisao?: string
        }
        Update: {
          id?: string
          contrato_id?: string
          solicitante?: string
          secretaria?: string
          justificativa?: string
          quantidade?: number
          status?: string
          criado_em?: string
          decidido_por?: string
          decidido_em?: string
          motivo_decisao?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordem_solicitacoes_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_solicitacoes_solicitante_fkey"
            columns: ["solicitante"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_solicitacoes_decidido_por_fkey"
            columns: ["decidido_por"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      itens_solicitacao: {
        Row: {
          id: string
          solicitacao_id: string
          item_id: string
          quantidade: number
          created_at: string
        }
        Insert: {
          id?: string
          solicitacao_id: string
          item_id: string
          quantidade: number
          created_at?: string
        }
        Update: {
          id?: string
          solicitacao_id?: string
          item_id?: string
          quantidade?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_solicitacao_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "ordem_solicitacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_solicitacao_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens"
            referencedColumns: ["id"]
          }
        ]
      }
      perfis: {
        Row: {
          id: string
          nome: string
          descricao?: string
          permissoes?: string[]
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string
          permissoes?: string[]
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          permissoes?: string[]
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          id: string
          email: string
          nome?: string
          perfil_id?: string
          municipio_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          nome?: string
          perfil_id?: string
          municipio_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string
          perfil_id?: string
          municipio_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      vw_contratos_municipio: {
        Row: {
          id: string
          numero: string
          fornecedor_id: string
          fundo_municipal: string[]
          objeto: string
          valor: number
          data_inicio: string
          data_termino: string
          status: string
          municipio_id?: string
          created_at: string
          municipio_nome?: string
          municipio_uf?: string
          fornecedor_nome?: string
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
            foreignKeyName: "contratos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      get_next_ordem_numero: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_by_username: {
        Args: {
          username: string
        }
        Returns: {
          id: string
          email: string
          nome?: string
          perfil_id?: string
          municipio_id?: string
          created_at: string
        }[]
      }
      recalcular_consumo_itens: {
        Args: Record<PropertyKey, never>
        Returns: void
      }
    }
    Enums: {
      status_contrato: "Ativo" | "Expirado" | "A Vencer" | "Em Aprovação"
      status_ordem: "Pendente" | "Concluída"
      tipo_aditivo: "periodo" | "valor"
    }
  }
}
