import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Typed versions — always use these instead of raw useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector)
