import useSWR from 'swr';

import OntarioService from '../api/OntarioService';

export default function useOntarioData() {
  const url = OntarioService.getQueryUrl();
  const { data, error } = useSWR(url, {});

  console.log(url);

  return { data, error };
}
