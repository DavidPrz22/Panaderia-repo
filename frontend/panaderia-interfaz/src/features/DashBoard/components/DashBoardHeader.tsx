import { Button }  from '@/components/ui/button'
import { BellRingIcon, LayoutDashboardIcon } from 'lucide-react'
import { useDashBoardContext } from '@/context/DashBoardContext'

export const DashBoardHeader = () => {
    const { setShowNotificaciones, showNotificaciones } = useDashBoardContext();

    const handleNotificacionesClick = () => {
        setShowNotificaciones(!showNotificaciones);
    }

    return (
        <div className='flex justify-between items-center '>
            <h1 className='text-2xl font-bold'>Panel de Control</h1>
            {showNotificaciones ? (
                <Button 
                    onClick={handleNotificacionesClick}
                    size="lg" variant={"outline"} className='cursor-pointer font-semibold hover:bg-blue-500 hover:text-white tracking-wide hover:border-transparent'>
                        <LayoutDashboardIcon className="size-5 mr-1" /> 
                        Dashboard
                    </Button>
            ) : (
                <Button 
                onClick={handleNotificacionesClick}
                size="lg" variant={"outline"} className='cursor-pointer  font-semibold hover:bg-blue-500 hover:text-white tracking-wide hover:border-transparent'>
                    <BellRingIcon className="size-5 mr-1" />
                    Notificaciones
                </Button>
            )}
        </div>
    )
}