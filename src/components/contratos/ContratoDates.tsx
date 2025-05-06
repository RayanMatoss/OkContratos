import DatePickerField from "./DatePickerField";

interface ContratoDatesProps {
  dataInicio: Date;
  dataTermino: Date;
  onDateChange: (field: "data_inicio" | "data_termino", date: Date) => void;
}

const ContratoDates = ({ dataInicio, dataTermino, onDateChange }: ContratoDatesProps) => {
  return (
    <div className="space-y-4">
      <DatePickerField 
        label="Data de Início" 
        date={dataInicio} 
        onDateChange={date => onDateChange("data_inicio", date || new Date())} 
      />
      <DatePickerField 
        label="Data de Término" 
        date={dataTermino} 
        onDateChange={date => onDateChange("data_termino", date || new Date())} 
      />
    </div>
  );
};

export default ContratoDates;
