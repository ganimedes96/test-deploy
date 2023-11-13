import { useEffect, useState } from "react"
import { Orders } from "../../@types/interface"
import { api } from "../../utils/axios"
import { parseCookies } from "nookies"
import delivery from '../../assets/delivery-orange.png'
import { Check, CheckCheck, ChefHat, ClipboardCheck, ExternalLink, StickyNote, XCircle } from "lucide-react"
import { dateFormatter } from "../../utils/formatter"
import { NavLink } from "react-router-dom"
import { ColorRing } from "react-loader-spinner"

export default function OrdersCustomer() {
  const [orders, setOrders] = useState<Orders[]>([])
  const [loading, setLoading] = useState(true);
  const getOrders = async () => {
    const token = parseCookies().accessToken;
    try {
      const response = await api.get('/order', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos", error);
    } finally {
      setLoading(false); // Defina o estado de carregamento como falso após a conclusão
    }

  }
  useEffect(() => {
    getOrders()
  }, [])

  return (
    <>
     
      <div className="w-full flex flex-col items-center justify-center mb-10 mt-36">
        <h2 className="text-2xl font-semibold text-gray-500">Meus pedidos</h2>
        {loading ? ( // Mostra o spinner enquanto os pedidos estão sendo carregados
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={['#f59e0b', '#f59e0b', '#f59e0b', '#f59e0b', '#f59e0b']}
            />
          </div>
        ) : (
          orders.length > 0 ? (
              orders.map((order) => (
                <NavLink to={`/tracking/${order.id}`} className="bg-white w-11/12 mt-5 rounded">
                  {order.status === 'FINISHED' && (

                    <div className=" flex items-center justify-start gap-2 p-4 w-11/12">
                      <Check size={25} className="bg-emerald-500 text-gray-50 rounded-full p-1" />
                      <span>Pedido concluido</span>
                    </div>

                  )}
                  {order.status === 'ACCEPTED' && (
                    <div className=" flex items-center justify-start gap-2 p-4 w-11/12">
                      <CheckCheck size={28} className=" text-orange-500" />
                      <span>Pedido aceito</span>
                    </div>

                  )}

                  {order.status === 'WAITING' && (
                    <div className=" flex items-center justify-start gap-2 p-4 w-11/12">
                      <ClipboardCheck
                        size={28}
                        className={` text-orange-500`}
                      />
                      <span>Aguardando</span>
                    </div>

                  )}
                  {order.status === 'DELIVERY' && (
                    <div className=" flex items-center justify-start gap-2 p-4 w-11/12">
                      <img src={delivery} alt="" className="w-9" />
                      <span>Saiu para entrega</span>
                    </div>

                  )}
                  {order.status === 'CANCELED' && (
                    <div className=" flex items-center justify-start gap-2 p-4 w-11/12">
                      <XCircle size={28} className="text-red-500" />
                      <span>Pedido cancelado</span>
                    </div>

                  )}
                  {order.status === 'PREPARING' && (
                    <div className=" flex items-center justify-start gap-2 p-4 w-11/12">
                      <ChefHat size={28} className="text-red-500" />
                      <span>Em preparação</span>
                    </div>

                  )}
                  <div className="flex items-center justify-start gap-2 px-6 mb-3">
                    {order.itensOrder.length}
                    <span>Pedidos</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-6  border-t-[1px]  border-gray-300">
                    <span>{dateFormatter(order.createdAt)}</span>
                    <ExternalLink size={25} className="text-orange-500" />
                  </div>
                </NavLink>
              ))
              ) : (
            <div className="mt-36 w-full flex flex-col items-center justify-center gap-5">
              <StickyNote size={85} className="text-gray-300" />
              <p className="text-center text-gray-500 text-xl font-semibold">Sua lista de pedidos está vazia!</p>
            </div>
          )
        )}
      </div>
    </>
  )
}