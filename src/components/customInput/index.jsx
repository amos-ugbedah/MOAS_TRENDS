import { useController } from "react-hook-form";

const CustomInput = ({ label, type, name, placeholder, className , control}) => {

    const {
        field,
        formState: { errors },
      } = useController({
        name,
        control,
        rules: { required: true },
       
      })
    console.log(errors)
  const  styleClass=`w-full p-2 border-purple-500 border rounded-md outline-none ${className}`
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor="title" className="text-black font-medium capitalize">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
        type={type}
        name={name}
        id={name}
        className={styleClass}
        placeholder={placeholder}
        rows={5}
        {...field}
        ></textarea>
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          className={styleClass}
          placeholder={placeholder}
          {...field}
        />
      )}
       {errors && <p className="text-red-500 text-xs">{errors[name]?.message}</p>}
    </div>
  );
};

export default CustomInput;
