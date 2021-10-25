import React, {useState, useEffect} from 'react';

import Autosuggest from 'react-autosuggest'
import { BsSearch } from 'react-icons/bs'
import styles from './searchSuggest.module.scss';


const SearchSuggest = ({filterLoading, data, placeholder, filterResult, renderSuggestion, searchInputValue}) => {
  const [inputValue, setInputValue] = useState(searchInputValue)
  const [suggestions, setSuggestions] = useState([])
  const [searchType, setSearchType] = useState('')


  useEffect(() => {
    handleSearch('initial')
  }, [data])

  useEffect(() => {
    setInputValue(searchInputValue)
  }, [searchInputValue])


  useEffect(() => {

    const newInputValue = inputValue.trim().toUpperCase()

    if (newInputValue === '') {
      filterResult(data, inputValue)
    }

    if (searchType === 'search' || searchType === 'initial') {
      const curList = data.filter(market => {
        if (market.name.toUpperCase().includes(newInputValue)) {
          return true;
        }
        return false;
      })
      filterResult(curList, inputValue)
      setSearchType('')
    }

  }, [inputValue, searchType])


  const handleSearch = (type) => {
    if (inputValue === '') {
      filterResult(data, inputValue)
    } else if (type === 'search' || type === 'initial') {
      setSearchType(type)
    }
  }



  const _renderInputComponent = inputProps => (
    <div className={styles.inputContainer}>
      <input {...inputProps} />
      <span className={styles.searchBtn}>
        <BsSearch onClick={() => handleSearch('search')}/>
      </span>
    </div>
  );

  const _renderSuggestion = suggestion => {
    return renderSuggestion ? renderSuggestion(suggestion) : (
      <div className={styles.suggList}>{suggestion.name}</div>
    )
  }



  const handleFetchList = ({ value }) => {
    const inputValue = value.trim().toUpperCase();
    const inputLength = inputValue.length;

    const list = inputLength === 0 ? [] : data.filter(market =>
      market.name.toUpperCase().slice(0, inputLength) === inputValue
    )
    setSuggestions(list)
  };

  const handleSelected = (event, {suggestionValue}) => {
    setSearchType('search')
    setInputValue(suggestionValue)
  }


  const inputProps = {
    placeholder,
    value: inputValue,
    onChange: (event, { newValue }) => {
      setInputValue(newValue)
    },
  };

  return (
    <div className={styles.searchWrap}>
      <Autosuggest
        inputProps={inputProps}
        suggestions={suggestions}
        getSuggestionValue={suggestion => suggestion.name}
        renderInputComponent={_renderInputComponent}
        renderSuggestion={_renderSuggestion}
        onSuggestionsFetchRequested={handleFetchList}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionSelected={handleSelected}
      />
    </div>
  )

}


export default SearchSuggest;
