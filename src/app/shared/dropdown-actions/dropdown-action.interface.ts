export interface DropdownAction<T = unknown> {
  name: string;
  label: string;
  action: (context?: T) => void;
  danger?: boolean;
  hide?: (context?: T) => boolean;
}
