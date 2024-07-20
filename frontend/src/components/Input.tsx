
const Input = ({
    value,
    onInput,
    label
}: {
    value?:string,
    onInput: (e: any) => void,
    label: string
}) => {
  return (
    <div className='mt-4'>
      <label htmlFor="input" className='text-[#D5E2FF] text-sm font-semibold '>{label}</label>
      <input
          type="text"
          placeholder="https://github.com/xyz/repo.git"
          name='input'
          required
          className="rounded-md border-[#d9defc33] border-[2px]  focus:border-[#405eb2] bg-[#111113] outline-none w-full h-10 z-10 mt-1 p-[3px] text-[#D5E2FF] font-sans  placeholder:text-[#d9edfe25]"
          autoComplete="off"
          onChange={(e) =>onInput(e)}
        value={value}
        />
    </div>
  )
}

export default Input
