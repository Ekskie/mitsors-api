/**
 * Livestock Types and Breeds Data
 * Complete list of pig breeds and livestock types
 */

export interface BreedOption {
  value: string
  label: string
}

export const livestockTypes: BreedOption[] = [
  { value: 'fattener', label: 'Fattener' },
  { value: 'piglet', label: 'Piglet' },
  { value: 'breeder', label: 'Breeder' },
  { value: 'gilt', label: 'Gilt' },
  { value: 'boar', label: 'Boar' },
  { value: 'sow', label: 'Sow' },
];

export const pigBreeds: BreedOption[] = [
  // Commercial/Hybrid Breeds
  { value: 'Large White', label: 'Large White (Yorkshire)' },
  { value: 'Landrace', label: 'Landrace' },
  { value: 'Duroc', label: 'Duroc' },
  { value: 'Hampshire', label: 'Hampshire' },
  { value: 'Pietrain', label: 'Pietrain' },
  { value: 'Chester White', label: 'Chester White' },
  { value: 'Berkshire', label: 'Berkshire' },
  { value: 'Poland China', label: 'Poland China' },
  { value: 'Spotted', label: 'Spotted' },
  { value: 'Yorkshire', label: 'Yorkshire' },
  
  // Hybrid/Crossbreeds
  { value: 'LY', label: 'LY (Landrace x Yorkshire)' },
  { value: 'YL', label: 'YL (Yorkshire x Landrace)' },
  { value: 'DLY', label: 'DLY (Duroc x Landrace x Yorkshire)' },
  { value: 'DYL', label: 'DYL (Duroc x Yorkshire x Landrace)' },
  { value: 'Hypor', label: 'Hypor' },
  { value: 'PIC', label: 'PIC (Pig Improvement Company)' },
  { value: 'Fast Genetics', label: 'Fast Genetics' },
  { value: 'Topigs', label: 'Topigs' },
  { value: 'Choice Genetics', label: 'Choice Genetics' },
  { value: 'Genesus', label: 'Genesus' },
  
  // Asian/Local Breeds
  { value: 'Native', label: 'Native/Indigenous' },
  { value: 'Native Black', label: 'Native Black' },
  { value: 'Korobuta', label: 'Korobuta (Berkshire)' },
  { value: 'Jinhua', label: 'Jinhua' },
  { value: 'Meishan', label: 'Meishan' },
  { value: 'Vietnamese Pot-bellied', label: 'Vietnamese Pot-bellied' },
  
  // Other Breeds
  { value: 'Tamworth', label: 'Tamworth' },
  { value: 'Belgian Landrace', label: 'Belgian Landrace' },
  { value: 'British Landrace', label: 'British Landrace' },
  { value: 'American Landrace', label: 'American Landrace' },
  { value: 'German Landrace', label: 'German Landrace' },
  { value: 'Dutch Landrace', label: 'Dutch Landrace' },
  { value: 'Red Wattle', label: 'Red Wattle' },
  { value: 'Gloucestershire Old Spots', label: 'Gloucestershire Old Spots' },
  { value: 'Mangalitsa', label: 'Mangalitsa' },
  { value: 'Kunekune', label: 'Kunekune' },
  { value: 'Hereford', label: 'Hereford' },
  { value: 'Large Black', label: 'Large Black' },
  { value: 'Middle White', label: 'Middle White' },
  { value: 'Welsh', label: 'Welsh' },
  { value: 'Lacombe', label: 'Lacombe' },
  { value: 'British Saddleback', label: 'British Saddleback' },
  
  // Crossbred/Mixed
  { value: 'Crossbred', label: 'Crossbred (Mixed)' },
  { value: 'F1', label: 'F1 Hybrid' },
  { value: 'F2', label: 'F2 Hybrid' },
  
  // Others option
  { value: 'Others', label: 'Others' },
];

export function getLivestockTypeOptions(): BreedOption[] {
  return [...livestockTypes].sort((a, b) =>
    a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })
  );
}

export function getPigBreedOptions(): BreedOption[] {
  return [...pigBreeds].sort((a, b) =>
    a.label.localeCompare(b.label, 'en', { sensitivity: 'base' })
  );
}
