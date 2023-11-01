import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import Header from "./Header";
import "./App.css";

type FormValues = {
  listName: string;
  cart: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

let renderCount = 0;

const Total = ({ control }: { control: Control<FormValues> }) => {
  const formValues = useWatch({
    name: "cart",
    control
  });
  const total = formValues.reduce(
    (acc, current) => acc + (current.price) * (current.quantity),
    0
  );
  return <p>Загалом: {total}</p>;
};

export default function App() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      cart: [{ name: "Продукт", quantity: 1, price: 10 }]
    },
    mode: "onBlur"
  });
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control
  });
  const onSubmit = (data: FormValues) => console.log(data);
  renderCount++;

  return (
    <div>
      <Header
        renderCount={renderCount}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("listName")} placeholder="Product list" />
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section className={"section"} key={field.id}>
                <label>Назва
                <input
                  placeholder="name"
                  {...register(`cart.${index}.name` as const, {
                    required: true
                  })}
                  className={errors?.cart?.[index]?.name ? "error" : ""}
                  defaultValue={field.name}
                /></label>
                <label>Кількість
                <input
                  placeholder="quantity"
                  type="number"
                  {...register(`cart.${index}.quantity` as const, {
                    valueAsNumber: true,
                    required: true
                  })}
                  className={errors?.cart?.[index]?.quantity ? "error" : ""}
                  defaultValue={field.quantity}
                /></label>
                <label>Вартість
                <input
                  placeholder="value"
                  type="number"
                  {...register(`cart.${index}.price` as const, {
                    valueAsNumber: true,
                    required: true
                  })}
                  className={errors?.cart?.[index]?.price ? "error" : ""}
                  defaultValue={field.price}
                /></label>
                <button type="button" onClick={() => remove(index)}>
                  Видалити
                </button>
              </section>
            </div>
          );
        })}

        <Total control={control} />

        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              quantity: 1,
              price: 1
            })
          }
        >
          Додати продукт
        </button>
        <input type="submit" />
      </form>
    </div>
  );
}