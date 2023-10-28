import { Button } from '../../components/ui/button'
import pizza from '../../assets/Vector.svg'
import './statusColor.css'
import delivey from '../../assets/delivery.png'
import deliveyOrange from '../../assets/delivery-orange.png'
import pickup from '../../assets/delivered.png'
import pickupOrange from '../../assets/pickup-orange.png'
import whatsapp from '../../assets/whatsapp.svg'
import { useEffect, useState } from 'react'
import { api } from '../../utils/axios'
import { Check, CheckCheck, ChefHat, ClipboardCheck, Package } from 'lucide-react'
import { Orders } from '../../@types/interface'
import socket from '../../utils/socketIO'
import { useParams } from 'react-router-dom'
import { priceFormatter } from '../../utils/formatter'
import { ModalHandleCancelOrder } from './components/ModalHandleCancelOrder'
import { notify } from '../../utils/toast'
import { parseCookies } from 'nookies'

export default function Tracking() {
  const [status, setStatus] = useState('WAITING')
  const [order, setOrder] = useState<Orders>()
  const [openModalCancelOrder, setOpenModalCancelOrder] = useState(false)


  socket.on('statusUpdate', (data: any) => {
    
    setStatus(data.status)

  })

  const { id } = useParams();
  const getOrder = async () => {
    const response = await api.get(`/order/${id}`)

    setOrder(response.data.order)
    setStatus(response.data.order.status)

  }

  const handleFinishedOrder = async () => {
    await api.put('/order', {
      id: order?.id,
      totalPrice: order?.totalPrice,
      customerId: order?.customer.id,
      payment: order?.payment,
      methodDelivery: order?.methodDelivery,
      status: 'FINISHED',
      itensOrder: [
        {
          product: order?.itensOrder[0].product,
          quantity: order?.itensOrder[0].quantity,
          size: order?.itensOrder[0].size,
          mode: order?.itensOrder[0].mode,
          price: order?.itensOrder[0].price
        }
      ]
    },
      {
        headers: {
          Authorization: `Bearer ${parseCookies().accessToken}`
        }
      }
    )
    notify(`Entrega efetuada com sucesso`, 'bottom')


  }


  useEffect(() => {
    getOrder()
  }, [])
  console.log(order?.methodDelivery);

  return (
    <div className="mb-10 w-full flex items-center justify-center">
      <div className='w-11/12 flex flex-col items-center justify-center'>
        <header className='w-full flex items-center  justify-center mt-6 font-semibold text-2xl text-gray-500'>
          <h2>Status do pedido</h2>
        </header>
        <div className='w-full'>
          <div className='w-full mt-10 flex items-center justify-start gap-5 p-2 bg-white'>
            <img src={pizza} alt="" />
            <div className='flex flex-col items-start gap-2 text-gray-500 font-semibold text-lg'>
              <span >Seus pedidos</span>
              <span className='font-bold'>{priceFormatter.format(Number(order?.totalPrice))}</span>
              <span className={`${status === 'CANCELED' ? 'text-red-500 bg-red-100' : 'text-orange-500 bg-orange-100'}  text-base  font-semibold rounded-md p-1`}>
                {status === 'WAITING' && 'AGUARDE'}
                {status === 'ACCEPTED' && 'ACEITO'}
                {status === 'PREPARING' && 'PREPARANDO'}
                {status === 'DELIVERY' && 'SAIU PARA ENTREGA'}
                {status === 'FINISHED' && 'ENTREGUE'}
                {status === 'CANCELED' && 'CANCELADO'}
              </span>
            </div>
          </div>
          <div className='mt-14 flex flex-col items-start  text-gray-500 font-semibold text-lg'>
            <div className='flex items-center justify-center gap-3'>
              {
                status === 'WAITING'
                  ? (
                    <ClipboardCheck
                      size={38}
                      strokeWidth={1}
                      className={` text-orange-500`}
                    />
                  )
                  : (
                    <ClipboardCheck
                      size={38}
                      strokeWidth={1}
                      className={`text-gray-500`}
                    />
                  )
              }

              <span className={`${status === "WAITING" ? 'text-orange-500' : 'text-gray-500'}`}>Aguardando recebimento</span>
            </div>
            <div className='ml-4 h-10 w-[2px] bg-gray-600' />
            <div className=' flex items-center justify-center gap-3'>
              {status === 'ACCEPTED' ? <CheckCheck size={38} strokeWidth={1} className='text-orange-500' /> : <CheckCheck size={38} strokeWidth={1} />}
              <span className={`${status === 'ACCEPTED' ? 'text-orange-500' : 'text-gray-500'}`} >Pedido em aceito</span>
            </div>
            <div className='ml-4 h-10 w-[2px] bg-gray-600' />
            <div className=' flex items-center justify-center gap-3 my-1'>
              {status === 'PREPARING' ? <ChefHat size={38} strokeWidth={1} className='text-orange-500' /> : <ChefHat size={38} strokeWidth={1} />}
              <span className={`${status === 'PREPARING' ? 'text-orange-500' : 'text-gray-500'}`} >Pedido em producao</span>
            </div>
            {order?.methodDelivery === 'DELIVERY' && (
              <>
                <div className='ml-4 h-10 w-[2px] bg-gray-600' />
                <div className=' flex items-center justify-center gap-3'>
                  {status === 'DELIVERY' ? <img src={deliveyOrange} className='w-10' alt="" /> : <img src={delivey} className='w-10' alt="" />}
                  <span className={`${status === 'DELIVERY' ? 'text-orange-500' : 'text-gray-500'}`} >Saiu para entrega</span>
                </div>
              </>

            )}
            <div className='ml-4 h-10 w-[2px] bg-gray-600' />
            <div className='mt-1 flex items-center justify-center gap-3'>
              {order?.methodDelivery === 'PICKUP'
                ? (
                  <>
                    {status === 'FINISHED'
                      ? < Check size={35} className="bg-emerald-500 text-gray-50 rounded-full p-1" />
                      : < Check size={35} className="bg-gray-200 text-gray-500 rounded-full p-1" />}
                    <span className={`${status === 'FINISHED' ? 'text-orange-500' : 'text-gray-500'}`}>Pedido pronto</span>
                  </>
                )
                : (
                  <>
                    {status === 'FINISHED' ? <img src={pickupOrange} className='w-10' alt="" /> : <img src={pickup} className='w-10' alt="" />}
                    <span className={`${status === 'FINISHED' ? 'text-orange-500' : 'text-gray-500'}`}>Entrega efetuada</span>
                  </>

                )}
            </div>
          </div>

          <div className='w-full flex flex-col  items-center justify-center gap-2 mt-10'>
            {(status === 'WAITING' || status === 'ACCEPTED') && (
              <Button onClick={() => setOpenModalCancelOrder(true)} className='w-full  bg-gray-200 text-gray-700 hover:bg-gray-400 text-lg'>Cancelar Pedido</Button>
            )}
            {(status === 'DELIVERY') && (
              <Button onClick={handleFinishedOrder} className='w-full  bg-gray-700 text-gray-100 hover:bg-gray-400 text-lg'>Confirmar Entrega</Button>
            )}

            <ModalHandleCancelOrder
              openModalCancelOrder={openModalCancelOrder}
              setOpenModalCancelOrder={setOpenModalCancelOrder}
              order={order!}
            />
            <Button
              className='w-full bg-orange-500 text-gray-100 hover:bg-orange-600 text-lg flex gap-4'
              onClick={() => {
                const phoneNumber = '9992242967'; // Substitua pelo número de telefone que deseja abrir no WhatsApp
                const whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
                window.open(whatsappURL, '_blank');
              }}
            >
              <img src={whatsapp} className='w-6' alt='' />
              Pizzaria
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}