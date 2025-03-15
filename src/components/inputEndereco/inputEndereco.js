import React, {useCallback, useEffect, useRef, useState} from 'react';
import {OpenStreetMapProvider} from 'leaflet-geosearch';
import {Form, ListGroup} from 'react-bootstrap';

const InputEndereco = ({onSelect, initialAddress = ''}) => {
  const [query, setQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState('');
  const provider = new OpenStreetMapProvider();
  const containerRef = useRef(null);

  useEffect(() => {
    const search = async () => {
      if (query.length > 2 && query !== selectedLabel) {
        const results = await provider.search({query});
        setSuggestions(results);
        setShowSuggestions(true);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleClickOutside = useCallback((event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleSelect = (result) => {
    setQuery(result.label);
    setShowSuggestions(false);
    onSelect({
      address: result.label,
      latitude: result.y,
      longitude: result.x
    });
  };

  return (
    <div ref={containerRef} className="position-relative">
      <Form.Control
        type="search"
        placeholder="Digite o endereço..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        aria-label="Pesquisar endereço"
        aria-haspopup="listbox"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ListGroup
          as="ul"
          className="position-absolute w-100 mt-1 shadow"
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000
          }}
          role="listbox"
        >
          {suggestions.map((result, index) => (
            <ListGroup.Item
              as="li"
              key={index}
              action
              active={index === selectedIndex}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => {
                setSelectedIndex(index);
                setSelectedLabel(result.label);
              }}
              role="option"
              className="cursor-pointer"
              style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minHeight: '40px'}}
            >
              {result.label}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default InputEndereco;