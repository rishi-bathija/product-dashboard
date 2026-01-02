import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortOption } from '@/types/product';

interface FiltersState {
  searchQuery: string;
  category: string;
  sortOption: SortOption;
}

const initialState: FiltersState = {
  searchQuery: '',
  category: 'all',
  sortOption: 'none',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.category = 'all';
      state.sortOption = 'none';
    },
  },
});

export const { setSearchQuery, setCategory, setSortOption, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;



