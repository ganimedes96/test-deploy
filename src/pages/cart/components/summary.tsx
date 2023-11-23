import { ContextCartApp } from "../../../context/cart-context"
import { cn } from "../../../utils/cn"
import { priceFormatter } from "../../../utils/formatter"

interface taxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tax: string
}

export const Summary = ({ tax, className }: taxProps) => {


  const { cartProductsTotalPrice } = ContextCartApp()

  const totalPriceProduct = (cartProductsTotalPrice).toFixed(2)
  const totalPrice = (parseFloat(totalPriceProduct) + parseFloat(tax)).toFixed(2)

  return (

    <div className={cn(` font-medium text-gray-900 text-base flex flex-col py-3 items-center justify-center gap-2 w-11/12`, className)}>
      <h2 className="w-full text-start text-lg font-medium">Resumo de valores</h2>
      <div className="flex items-center  justify-between w-full">
        <span>Subtotal</span>
        <span >{totalPriceProduct ? priceFormatter.format(Number(totalPriceProduct)) : "0,00"}</span>
      </div>
      <div className="flex items-center text-gray-400 justify-between w-full">
        <span>Taxa de entrega</span>
        <span>{tax ? priceFormatter.format(Number(tax)) : priceFormatter.format(Number('0.00'))}</span>
      </div>
      <div className="flex items-center justify-between w-full">
        <span>Total</span>
        <span className="text-gray-700 ">{totalPrice ? priceFormatter.format(Number(totalPrice)) : priceFormatter.format(Number("0.00"))}</span>
      </div>
    </div>

  )
}