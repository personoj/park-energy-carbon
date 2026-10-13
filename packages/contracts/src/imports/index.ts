export type ImportState =
  | 'uploaded'
  | 'parsed'
  | 'mapped'
  | 'validated'
  | 'previewed'
  | 'committed'
  | 'failed'
  | 'cancelled'
  | 'reversed';
