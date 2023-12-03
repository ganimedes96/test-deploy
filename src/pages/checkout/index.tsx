import { useEffect, useState } from "react";
import { ContextCartApp } from "../../context/cart-context";
import { HeaderOrder } from "../../components/HeaderOrder";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { CardAddress } from "../../components/CardAddress";
import pickupOrange from '../../assets/pickup-orange.png'
import pix from '../../assets/pix.svg'
import { NavLink, useNavigate } from "react-router-dom";
import { Summary } from "../cart/components/summary";
import { api } from "../../utils/axios";
import { CalculatePrice } from "../../utils/calculate-price";
import { ToastContainer } from "react-toastify";
import mc from '../../assets/mc.svg'
import visa from '../../assets/visa.png'
import elo from '../../assets/elo.png'
import money from '../../assets/money.png'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import uuid from "react-uuid";
import { OrderProps } from "../../@types/interface";


const observationSchemaBody = z.object({
  observation: z.string().optional()
})

type ObservationSchema = z.infer<typeof observationSchemaBody>

interface PaymentProps {
  methodPayment: string
  flag?: string
  typeCard?: string
}


export default function Checkout() {

  const [getPayment, setGetPayment] = useState<PaymentProps>({ methodPayment: 'Pix', typeCard: 'Pix' });
  const [methodDelivery, setMethodDelivery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false)
  const { productToCart, clearCart } = ContextCartApp()
  const totalPrice = CalculatePrice();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm<ObservationSchema>({
    resolver: zodResolver(observationSchemaBody),
  })

  const handleFinishOrder = async (data: ObservationSchema) => {
    
    
    try {

      setIsLoading(true)
      const token = parseCookies().accessToken;
      if (getPayment.methodPayment === 'Pix') {
        setCookie(undefined, 'observation', JSON.stringify(data.observation), {
          maxAge: 60 * 60 * 24 * 30,
        });
        navigate(`/pix/${uuid()}`)
      } else {
        const order: OrderProps = {
          payment: {
            methodPayment: getPayment.methodPayment,
            flag: getPayment.flag,
            typeCard: getPayment.typeCard
          },
          totalPrice: await totalPrice,
          status: 'WAITING',
          methodDelivery: methodDelivery,
          observation: data.observation,
          itensOrder: productToCart.map((item) => ({
            mode: item.mode,
            size: item.size,
            image_url: item.image_url ? item.image_url : '',
            price: item.price,
            product: item.product.map(item => item.name),
            quantity: item.quantityProduct
          }))
        }

       const response = await api.post('/order', order, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        destroyCookie(null, 'product')
        destroyCookie(null, 'payment')
        destroyCookie(null, 'delivery')
        clearCart()
        navigate(`/success/${response.data.id}`)

      }

    } catch (error) {
      console.error(error);
      setIsLoading(false)

    }
  }

  const getDataCookies = () => {
    setGetPayment(() => {
      const storaged = parseCookies().payment
      return storaged ? JSON.parse(storaged) : { methodPayment: 'Pix', typeCard: 'Pix' }
    })

    setMethodDelivery(() => {
      const storaged = parseCookies().delivery
      return storaged ? JSON.parse(storaged) : []
    })
  }
  useEffect(() => {
    getDataCookies()
  }, [])

  return (
    <>
      <HeaderOrder activeLink="CHECKOUT" leftLink="/delivery" />
      <div className="w-full bg-white flex flex-col items-center justify-center pt-5">

        <div className="w-11/12">
          <div className="w-full flex items-center justify-between">
            <h2 className="w-full text-start  text-lg font-medium ">Metodo de Entrega</h2>
            <NavLink className='text-red-500 text-sm' to='/delivery'>
              Trocar
            </NavLink>
          </div>
          {methodDelivery === 'DELIVERY'
            ? (
              <div className="w-full bg-white mt-5 flex items-center justify-center">
                <CardAddress className="w-full" />
              </div>
            ) : (
              <div className="w-full flex items-center justify-between mt-5">
                <div className=" flex items-center justify-center gap-5">
                  <div className="rounded-full bg-gray-100 p-2">
                    <img src={pickupOrange} alt="" className="w-8" />
                  </div>
                  <span className="text-gray-500 text-sm  font-semibold">Ritirar na loja</span>
                </div>

              </div>
            )}
          <div className="w-full h-[1px] bg-gray-200 mt-6" />
          <div className="w-full flex items-center justify-between">
            <h2 className="w-full text-start  text-lg font-medium my-5">{getPayment.methodPayment === 'Pix' ? 'Pagamento pelo app' : 'Pagamento na entrega'}</h2>
            <NavLink className='text-red-500 text-sm' to='/payment'>
              Trocar
            </NavLink>
          </div>
          <div className="w-full flex items-center justify-between ">
            <div className="flex items-center text-lg justify-start gap-3 text-gray-500 font-semibold">
              {getPayment.methodPayment === 'Card'
                ? <img
                  className="w-11 p-2  bg-gray-100 rounded-full"
                  src={getPayment.flag === 'Visa' ? visa : getPayment.flag === 'Mastercard' ? mc : elo}
                  alt=""
                />
                : getPayment.methodPayment === 'Pix'
                  ? (<img src={pix} className="w-11  p-2 bg-gray-100 rounded-full" alt='' />)
                  : <img src={money} className="w-11 p-2 bg-gray-100 rounded-full" alt="" />}

              <div className="flex flex-col text-sm">
                <span className="text-gray-600">{getPayment.typeCard}</span>
                <span className="text-gray-400 text-xs font-light">{getPayment.flag}</span>
              </div>
            </div>

          </div>
        </div>
        <div className="w-11/12 h-[1px] bg-gray-200 mt-6" />
        <form
          onSubmit={handleSubmit(handleFinishOrder)}
          className="mt-4 w-full"
        >
          <div className="px-4 mb-2 flex flex-col items-start justify-center gap-2">
            <Label className='text-gray-500'>Observação</Label>
            <Textarea className="flex items-center justify-center" {...register('observation')} maxLength={60} minLength={5} />
          </div>

          <button 
            type="submit" 
            className="bg-orange-500 w-full fixed bottom-0  py-4  text-gray-50 font-medium text-lg   hover:bg-orange-600"
          >
            {isLoading ? 'Carregando...' : 'Finalizar pedido'}
          </button>

        </form>

      </div>
      <div className="mb-16 w-full flex flex-col items-center justify-center">
        <Summary />
      </div>



      <ToastContainer />
    </>
  )
}