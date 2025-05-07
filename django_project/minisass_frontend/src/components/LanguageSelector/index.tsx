import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl } from '@mui/material';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<{ value: unknown }>) => {
    const lang = event.target.value as string;
    i18n.changeLanguage(lang);
    localStorage.setItem('userLanguage', lang);
  };

  return (
    <FormControl variant="outlined" size="small" className="LanguageSelector">
      <Select
        value={i18n.language}
        onChange={changeLanguage}
        style={{
          backgroundColor: 'white',
          minWidth: '120px',
          borderRadius: '4px'
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pt">Portugese</MenuItem>
        <MenuItem value="zu">isiZulu</MenuItem>
        <MenuItem value="id">Indonesian</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
