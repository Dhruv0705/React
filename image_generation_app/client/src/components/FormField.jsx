import React from 'react'


const FormField = ({ labelName, name, type, placeholder, value, handleChange, surpriseMe, handleSurpriseMe}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label
          htmlFor='{name}'
          className="block text-sm font-medium text-gray-900"  
        >
          {labelName}
        </label>
        {surpriseMe && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="font-semibold text-xs bg-[#ECECF1] py-1 px-2 rounder-[5px] text-black">
            Surprise Me
          </button>
          )}
      </div>

      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
        className="bg-grey-50 border-grey-300 text-gray-900 text-sm rounder-lg focus:ring-[#3639ff] outline-none block w-full p-3"
      />
    </div>
  )
}

export default FormField