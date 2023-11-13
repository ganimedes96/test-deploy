import * as React from "react"
import { cn } from "../utils/cn"
import { ContextApp } from "../context/context-app"
import { NavLink } from "react-router-dom"





export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  link?: string
}

const ButtonCheckout = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, name, link, ...props }, ref) => {

    const { productToCart, isAuthenticated } = ContextApp()
    return (
      <button
        {...props}
        disabled={productToCart.length === 0}
        className={cn('absolute bottom-0 w-full flex items-center justify-center rounded-[0px] text-gray-100 text-lg py-4 bg-orange-500 hover:bg-orange-600 ', className)}
        ref={ref}
      >
        {link ? (
          <NavLink to={isAuthenticated ? `${link}` : '/sign-in'}>
            {name}
          </NavLink>
        ): (
          <>{name}</>
        )}
      </button>
    )
  }
)

export { ButtonCheckout }





// import { NavLink } from "react-router-dom"
// import { Button } from "./ui/button"
// import { ContextApp } from "../context/context-app"


// interface ButtonCheckoutProps {

//   link: string
//   name: string
// }

// export const ButtonCheckout = ({link, name}: ButtonCheckoutProps) => {
// const {isAuthenticated, productToCart} = ContextApp()

//  return (
//     <div className={'fixed bottom-0 w-full flex items-center justify-center'} >
//       <Button  disabled={productToCart.length === 0} className="rounded-[0px] text-gray-100 text-lg py-6 w-full bg-orange-500 hover:bg-orange-600 ">
//         <NavLink to={isAuthenticated ? `${link}` : '/sign-in'}>
//           {name}
//         </NavLink>
//       </Button>
//     </div>
//   )
// }