import { Controller } from "react-hook-form";

interface AppTextField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  rules: object;
  placeholder: string;
  type?: string;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  dataAos?: string;
  dataAosDelay?: string | number;
}

const AppTextField: React.FC<AppTextField> = (props) => {
  return (
    <Controller
      data-aos={props.dataAos}
      data-aos-delay={props.dataAosDelay}
      name={props.name}
      control={props.control}
      rules={props.rules}
      render={({ field, fieldState }) => (
        <>
          <input
            {...field}
            onBlur={props.onBlur}
            value={field.value ?? ""}
            type={props.type || "text"}
            placeholder={props.placeholder}
            onChange={(e) => {
              field.onChange(e.target.value);
              props.onChange?.(e.target.value);
            }}
            className={`w-full p-3 border rounded-2xl font-poppins ${
              props.className
            } text-black font-poppins ${
              fieldState.invalid ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldState.error && (
            <p className="text-sm text-red-500  font-poppins">
              {fieldState.error.message}
            </p>
          )}
        </>
      )}
    />
  );
};

export default AppTextField;
