import './input.css'

export default function Input({ className, type, name, placeholder, onChange }) {
  return (
    <input className={`w-100 p-2 pl-3 border-gray-500 transition ease-in-out focus:outline-none focus:shadow-md focus:border-blue-500 focus:shadow-blue-500 focus:drop-shadow-lg ${className}`} type={type} name={name} placeholder={placeholder} onChange={onChange}/>
  )
}