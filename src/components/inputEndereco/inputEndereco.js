import React, {useCallback, useEffect, useRef, useState} from 'react';
import {OpenStreetMapProvider} from 'leaflet-geosearch';
import {Form, ListGroup} from 'react-bootstrap';
import {obterBairroLocalizacaoPorLatLong} from "../../app/service/mapService";

export default function InputEndereco  ({registro, setRegistro})  {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLabel, setSelectedLabel] = useState('');
  const provider = new OpenStreetMapProvider();
  const containerRef = useRef(null);

  // efetuar pesquisa através do leaflet-geosearch
  // https://www.npmjs.com/package/leaflet-geosearch
  useEffect(() => {
    const search = async () => {
      if (query.length > 2 && query !== selectedLabel) {
        const results = await provider.search({ query: `Florianópolis ${query}` });
        setSuggestions(results);
        setShowSuggestions(true);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // fechar sugestões ao clicar fora do componente
  const handleClickOutside = useCallback((event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // ao selecionar uma sugestão, atualizar o input e atuaalizar o registro
  const handleSelect = async (result) => {
    setQuery(result.label);
    setShowSuggestions(false);
    const [bairro] = await obterBairroLocalizacaoPorLatLong(result.y, result.x);
    setRegistro({...registro, latitude: result.y, longitude: result.x, localizacao: result.label, bairro: bairro});
  };

  return (
    <div ref={containerRef} className="position-relative flex-grow-1">

      {/*input*/}
      <Form.Control
        type="search"
        placeholder="Digite o endereço ou ponto de referência"
        value={query || registro.localizacao}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
          setRegistro({...registro, localizacao: e.target.value});
        }}
        aria-label="Pesquisar endereço"
        aria-haspopup="listbox"
      />

      {/*sugestões*/}
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
