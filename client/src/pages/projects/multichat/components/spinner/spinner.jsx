import spinner from '../../assets/images/spinner.png';

export default function Spinner({ className }) {
  return (
    <img className={`animate-spinner ${className}`} src={spinner}/>
  )
}