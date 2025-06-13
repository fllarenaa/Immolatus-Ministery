import { useEffect, useState } from 'react';

export type LiturgiaData = {
  data: string;
  cor: string;
  liturgia: {
    dia: string;
    tempo: string;
    semana: string;
  };
  leitura1: {
    referencia: string;
    texto: string;
  };
  salmo: {
    referencia: string;
    texto: string;
  };
  evangelho: {
    referencia: string;
    texto: string;
  };
};

export function useLiturgia() {
  const [liturgia, setLiturgia] = useState<LiturgiaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://liturgia.up.railway.app/v2/')
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao buscar a liturgia');
        return response.json();
      })
      .then((data) => {
        setLiturgia(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { liturgia, loading, error };
}
