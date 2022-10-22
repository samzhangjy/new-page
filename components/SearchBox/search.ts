import { completionService } from '../../config';
import { SearchEngine, searchEngines } from './constants';

export const getCompletions = async (query: string): Promise<string[]> => {
  if (typeof window === "undefined") {
    return [];
  }

  const headers = new Headers();
  headers.append('Content-Type', 'text/plain; charset=UTF-8');
  const res = await fetch(`${completionService.url}/https://suggestion.baidu.com/su?wd=${query}`, {
    headers,
  });
  const decoder = new TextDecoder('gbk');
  const text = decoder.decode(await res.arrayBuffer());
  try {
    return Function(`return ${text.slice(17, -2)}`)().s;
  } catch {
    return [];
  }
};

export const handleSearch = (searchEngine: SearchEngine, query: string) => {
  const curEngineDetail = searchEngines.find((engine) => engine.value === searchEngine);
  if (!curEngineDetail) return;
  window.open(`${curEngineDetail.url}${query}`, '_blank');
};
