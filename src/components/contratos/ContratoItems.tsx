import React, { useState } from "react";
import { FundoMunicipal } from "@/types";
import Select from "react-select";
import { formatCurrency } from "@/lib/utils";

// Novo tipo de item com todos os campos necessários
type Item = {
  descricao: string;
  quantidade: number;
  unidade: string;
  valor_unitario: number;
  fundos: FundoMunicipal[];
};

type ContratoItemsProps = {
  items: Item[];
  onAddItem: (item: Item) => void;
  onRemoveItem: (index: number) => void;
  fundosMunicipais: FundoMunicipal[];
};

const ContratoItems: React.FC<ContratoItemsProps> = ({ items, onAddItem, onRemoveItem, fundosMunicipais }) => {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [fundosSelecionados, setFundosSelecionados] = useState<FundoMunicipal[]>([]);

  const valorTotal = (parseFloat(quantidade) || 0) * (parseFloat(valorUnitario) || 0);

  const handleAdd = () => {
    if (
      descricao &&
      quantidade &&
      !isNaN(Number(quantidade)) &&
      unidade &&
      valorUnitario !== "" &&
      !isNaN(Number(valorUnitario)) &&
      fundosSelecionados.length > 0
    ) {
      onAddItem({
        descricao,
        quantidade: Number(quantidade),
        unidade,
        valor_unitario: Number(valorUnitario),
        fundos: fundosSelecionados
      });
      setDescricao("");
      setQuantidade("");
      setUnidade("");
      setValorUnitario("");
      setFundosSelecionados([]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium mb-2">Itens do Contrato</h3>
      <div className="bg-muted/10 p-4 rounded-lg space-y-2">
        {/* Primeira linha: Descrição, Quantidade, Unidade */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <div className="flex flex-col md:col-span-2 w-full mb-2">
            <label className="text-xs mb-1">Descrição</label>
            <input
              className="border rounded px-2 py-1 bg-background text-foreground w-full text-sm"
              placeholder="Descrição"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full md:w-20 mb-2">
            <label className="text-xs mb-1">Quantidade</label>
            <input
              className="border rounded px-2 py-1 bg-background text-foreground w-full text-sm"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="Qtd"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value.replace(/[^0-9.,]/g, "").replace(",", "."))}
            />
          </div>
          <div className="flex flex-col w-full md:w-20 mb-2">
            <label className="text-xs mb-1">Unidade</label>
            <input
              className="border rounded px-2 py-1 bg-background text-foreground w-full text-sm"
              placeholder="Unidade"
              value={unidade}
              onChange={e => setUnidade(e.target.value)}
            />
          </div>
        </div>
        {/* Segunda linha: Valor Unitário, Valor Total */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
          <div className="flex flex-col w-full mb-2">
            <label className="text-xs mb-1">Valor Unitário</label>
            <input
              className="border rounded px-2 py-1 bg-background text-foreground w-full text-sm"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder="Valor Unitário"
              value={valorUnitario}
              onChange={e => setValorUnitario(e.target.value.replace(/[^0-9.,]/g, "").replace(",", "."))}
            />
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="text-xs mb-1">Valor Total</label>
            <input
              className="border rounded px-2 py-1 bg-background text-foreground w-full text-sm"
              type="text"
              placeholder="Valor Total"
              value={isNaN(valorTotal) ? "" : formatCurrency(valorTotal)}
              disabled
            />
          </div>
        </div>
        {/* Linha de Fundos */}
        <div className="flex flex-col w-full mb-2">
          <label className="text-xs mb-1">Fundos</label>
          <Select
            isMulti
            options={fundosMunicipais.map(fundo => ({ value: fundo, label: fundo }))}
            value={fundosMunicipais
              .filter(fundo => fundosSelecionados.includes(fundo))
              .map(fundo => ({ value: fundo, label: fundo }))}
            onChange={selected => setFundosSelecionados(selected.map(opt => opt.value))}
            placeholder="Selecione os fundos..."
            className="w-full max-w-xs"
            classNamePrefix="select"
            noOptionsMessage={() => "Nenhum fundo disponível"}
            theme={theme => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: '#22223b',
                primary: '#2563eb',
                neutral0: '#18181b',
                neutral80: '#fff',
                neutral20: '#3f3f46',
                neutral30: '#2563eb',
                neutral10: '#23232b',
                neutral5: '#23232b',
                danger: '#ef4444',
                dangerLight: '#7f1d1d',
              }
            })}
            styles={{
              control: (base) => ({ ...base, minHeight: 28, height: 28, borderRadius: 6, borderColor: '#27272a', backgroundColor: '#18181b', color: '#fff', boxShadow: 'none', paddingLeft: 8, paddingRight: 8 }),
              valueContainer: (base) => ({ ...base, minHeight: 28, height: 28, padding: '0 4px' }),
              input: (base) => ({ ...base, margin: 0, padding: 0, color: '#fff' }),
              indicatorsContainer: (base) => ({ ...base, height: 28 }),
              multiValue: (base) => ({ ...base, backgroundColor: '#23232b', color: '#fff', borderRadius: 4, minHeight: 22, height: 22, alignItems: 'center', margin: '2px 2px', padding: '0 4px' }),
              multiValueLabel: (base) => ({ ...base, color: '#fff', fontSize: 13, padding: '0 4px' }),
              multiValueRemove: (base) => ({ ...base, color: '#fff', ':hover': { backgroundColor: '#ef4444', color: '#fff' }, borderRadius: 4, padding: 2 }),
              option: (base, state) => ({ ...base, minHeight: 28, height: 28, backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#22223b' : '#18181b', color: '#fff', fontSize: 14 }),
              menu: (base) => ({ ...base, backgroundColor: '#18181b', color: '#fff', borderRadius: 6, marginTop: 2 }),
            }}
          />
        </div>
        <button
          type="button"
          className="w-32 bg-primary text-white rounded px-2 py-1 mt-1 hover:bg-primary/90 transition text-base font-semibold mx-auto"
          onClick={handleAdd}
        >
          Adicionar
        </button>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((item, idx) => (
          <li key={`item-${idx}-${item.descricao}`} className="flex flex-col md:flex-row md:items-center gap-1 border-b pb-1 text-sm">
            <span className="flex-1 font-medium">{item.descricao}</span>
            <span className="w-20">Qtd: {item.quantidade}</span>
            <span className="w-20">Un: {item.unidade}</span>
            <span className="w-32">V. Unit: {formatCurrency(item.valor_unitario)}</span>
            <span className="w-32">Total: {formatCurrency(item.quantidade * item.valor_unitario)}</span>
            <span className="w-40">Fundos: {Array.isArray(item.fundos) ? item.fundos.join(", ") : item.fundos}</span>
            <button type="button" className="text-red-500 ml-2" onClick={() => onRemoveItem(idx)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContratoItems;
