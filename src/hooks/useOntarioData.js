import useSWR from 'swr';

import json from '../store/data.json';
import OntarioService from '../api/OntarioService';

export default function useOntarioData() {
  const url = OntarioService.getQueryUrl();
  // const { data, error } = useSWR(url, {});

  console.log(url);
  const error = null;
  const data = json;

  return { data, error };
}
