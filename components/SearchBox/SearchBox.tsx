import { ActionIcon, Autocomplete, Center, SegmentedControl } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { searchEngines, SearchEngine } from './constants';
import { getCompletions, handleSearch } from './search';

const SearchBox = () => {
  const [completions, setCompletions] = useState<string[]>([]);
  const [searchEngine, setSearchEngine] = useState('baidu');
  const [query, setQuery] = useState('');

  const handleQueryChange = async (newQuery: string) => {
    setQuery(newQuery);
    setCompletions(await getCompletions(newQuery));
  };

  return (
    <>
      <Center sx={{ marginBottom: '20px' }}>
        <SegmentedControl
          data={searchEngines}
          size="sm"
          onChange={setSearchEngine}
          value={searchEngine}
        />
      </Center>
      <Autocomplete
        data={completions}
        value={query}
        onChange={handleQueryChange}
        variant="filled"
        size="lg"
        rightSection={
          <ActionIcon
            size={32}
            variant="filled"
            color="indigo"
            onClick={() => {
              handleSearch(searchEngine as SearchEngine, query);
            }}
          >
            <IconSearch size={18} stroke={1.5} />
          </ActionIcon>
        }
        rightSectionWidth={42}
        onKeyUp={(e) => {
          if (e.key !== 'Enter') return;
          handleSearch(searchEngine as SearchEngine, query);
        }}
        placeholder="Search the web..."
      />
    </>
  );
};

export default SearchBox;
