<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, FundoMunicipal } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContratos = async () => {
    try {
      setLoading(true);
      
      // Buscar contratos com fornecedores usando a nova estrutura
      const { data, error } = await supabase
        .from("contratos")
        .select(`
          *,
          contrato_fornecedores(
            fornecedor_id,
            fornecedores(
              id,
              nome,
              cnpj,
              email,
              telefone,
              endereco
            )
          ),
          itens(
            id,
            descricao,
            quantidade,
            unidade,
            valor_unitario,
            quantidade_consumida,
            fundos,
            created_at
          )
        `);

      if (error) throw error;

      const formattedContratos = data.map(contrato => {
        // Extrair fornecedores do relacionamento
        const fornecedores = contrato.contrato_fornecedores?.map((cf: any) => ({
          id: cf.fornecedores.id,
          nome: cf.fornecedores.nome,
          cnpj: cf.fornecedores.cnpj,
          email: cf.fornecedores.email || "",
          telefone: cf.fornecedores.telefone || "",
          endereco: cf.fornecedores.endereco || "",
          createdAt: new Date()
        })) || [];

        const fornecedorIds = fornecedores.map(f => f.id);

        // Extrair itens do contrato
        const itens = contrato.itens?.map((item: any) => ({
          id: item.id,
          contratoId: contrato.id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorUnitario: item.valor_unitario,
          quantidadeConsumida: item.quantidade_consumida || 0,
          createdAt: new Date(item.created_at),
          fundos: item.fundos || []
        })) || [];

        return {
          id: contrato.id,
          numero: contrato.numero,
          fornecedorIds: fornecedorIds,
          fornecedores: fornecedores,
          fundoMunicipal: Array.isArray(contrato.fundo_municipal) 
            ? contrato.fundo_municipal 
            : [],
          objeto: contrato.objeto,
          valor: contrato.valor,
          dataInicio: new Date(contrato.data_inicio),
          dataTermino: new Date(contrato.data_termino),
          status: contrato.status,
          createdAt: new Date(contrato.created_at),
          itens: itens
        };
      });

      setContratos(formattedContratos);
    } catch (error: any) {
      console.error('Erro ao buscar contratos:', error);
    } finally {
      setLoading(false);
<<<<<<< HEAD
=======

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato } from "@/types";

export const useContratos = () => {
  const { toast } = useToast();
  const [contratos, setContratos] = useState<Contrato[]>([]);

  const fetchContratos = async () => {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('id, numero, objeto, fornecedor_id, fundo_municipal, valor, data_inicio, data_termino, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the Contrato type
      const formattedContratos: Contrato[] = data.map(contrato => ({
        id: contrato.id,
        numero: contrato.numero,
        fornecedorId: contrato.fornecedor_id,
        fundoMunicipal: contrato.fundo_municipal as any,
        objeto: contrato.objeto,
        valor: contrato.valor,
        dataInicio: new Date(contrato.data_inicio),
        dataTermino: new Date(contrato.data_termino),
        status: contrato.status as any,
        createdAt: new Date(contrato.created_at),
        itens: []
      }));
      
      setContratos(formattedContratos);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
  return { contratos, loading, fetchContratos };
=======
  return { contratos, fetchContratos };
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
  return { contratos, loading, fetchContratos };
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
};
