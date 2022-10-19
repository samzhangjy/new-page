export type SearchEngine = 'baidu' | 'google' | 'bing' | 'github';

export type SearchEngineDetail = {
  label: string;
  url: string;
  value: SearchEngine;
};

export const searchEngines: SearchEngineDetail[] = [
  {
    label: 'Baidu',
    url: 'https://www.baidu.com/s?wd=',
    value: 'baidu',
  },
  {
    label: 'Google',
    url: 'https://www.google.com/search?q=',
    value: 'google',
  },
  {
    label: 'Bing',
    url: 'https://cn.bing.com/search?q=',
    value: 'bing',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/search?q=',
    value: 'github',
  },
];
