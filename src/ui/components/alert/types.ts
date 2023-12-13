export interface AlertProps {
  message: string;
  show: boolean
  changeDisplay: (value: boolean) => void
}
