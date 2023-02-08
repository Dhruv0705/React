import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const onHandleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      navigate(`/search/${searchTerm}`);

      setSearchTerm('');
    }
  };

  return (
    <Paper 
        component='form' 
        onSubmit={onHandleSubmit} 
        sx={{ borderRadius: 20, border: '2px solid 	#585858', pl: 2, boxShadow: 'none', mr: { sm: 5 }, backgroundColor: 'transparent'}}
    >
        <input 
            className='search-bar' 
            placeholder='Search...' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            sx={{ color: 'red' }} 
        />
            <IconButton  
                type='submit' 
                sx={{ p: '10px', color: 'red' }} 
                aria-label='search'
            >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar; 