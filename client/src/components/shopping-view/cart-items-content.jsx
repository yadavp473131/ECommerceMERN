import React from 'react'
import { Button } from '../ui/button';
import { MinusIcon, PlusIcon, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice';

const UserCartItemsContent = ({cartItem, showToast}) => {
    const {user} = useSelector(state=>state.auth); 
    const dispatch = useDispatch();
    // const toast = useToast();
    const {cartItems} = useSelector(state=>state.shopCart);
      const { productList } = useSelector((state) => state.shopProducts);

    function handleUpdateQty(getCartItem, typeOfAction){
         if(typeOfAction === 'plus'){
          let getCartItems = cartItems.items || [];
            if(getCartItems.length){
            const indexOfCurrentCartItem = getCartItems.findIndex(item=>item.productId === getCartItem?.productId);
            const getCurrentProductIndex = productList.findIndex(product=> product?._id === getCartItem?.productId);
            const getTotalStock = productList[getCurrentProductIndex].totalStock;
            
                if(indexOfCurrentCartItem > -1){
                  const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                  if(getQuantity + 1 > getTotalStock){
                    //  toast({
                    //   title: `Only ${getTotalStock} quantity can be added for this item`
                    //   variant: "destructive"
                    //  })
                    showToast(`Only ${getTotalStock} quantity can be added for this item`)
                    return;
                  }
                }
            }
         }

         dispatch(updateCartQuantity({userId:user?.id, productId:getCartItem.productId,
           quantity: (typeOfAction==='plus' ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1 )})).then(data=>{
            if(data?.payload?.success){
              //  toast({
              //   title: 'cart item is updated successfully'
              //  })
              showToast('cart item is updated successfully',"success")
            }
          });
        
    }

    function handleCartItemDelete(getCartItem){
          dispatch(deleteCartItem({userId:user?.id, productId: getCartItem?.productId})).then(data=>{
            if(data?.payload?.success){
              //  toast({
              //   title: 'cart item is deleted successfully'
              //  })
              showToast('cart item is deleted successfully',"success")
            }
          })
    }
    
  return (
    <div className='flex items-center space-x-4'>
      <img src={cartItem?.image} alt={cartItem?.title} className='w-20 h-20 rounded object-cover'/>
      <div className='flex-1'>
        <h3 className='font-extrabold'>{cartItem?.title}</h3>
        <div className='flex items-center mt-1 gap-2'>
            <Button className="h-8 w-8 rounded-full"
             variant="outline"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={()=>handleUpdateQty(cartItem,'minus')} >
                <MinusIcon className='w-4 h-4'/>
                <span className='sr-only'>Decrease</span>
            </Button>
            <span className='font-semibold'>{cartItem?.quantity}</span>
            <Button className="h-8 w-8 rounded-full"
             variant="outline"
              size="icon"
              onClick={()=>handleUpdateQty(cartItem,'plus')}>
                <PlusIcon className='w-4 h-4'/>
                <span className='sr-only'>Increase</span>
            </Button>
        </div>
      </div>
      <div className='flex flex-col items-end'>
         <p className='font-semibold'>
            ${(((cartItem.salePrice > 0)? cartItem?.salePrice:cartItem.price)  * cartItem?.quantity).toFixed(2)}
         </p>
         <Trash className='cursor-pointer mt-1' size={20} onClick={()=>handleCartItemDelete(cartItem)}/>
      </div>
    </div>
  )
}

export default UserCartItemsContent;
