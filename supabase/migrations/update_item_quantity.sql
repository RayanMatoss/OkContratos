
CREATE OR REPLACE FUNCTION update_item_quantity(p_item_id UUID, p_quantidade DECIMAL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE itens
  SET quantidade_consumida = quantidade_consumida + p_quantidade
  WHERE id = p_item_id;
END;
$$;
