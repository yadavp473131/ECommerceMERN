import ProductDetailsDialog from '@/components/shopping-view/product-details';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { Input } from '@/components/ui/input'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { fetchProductDetails } from '@/store/shop/products-slice';
import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const SearchProducts = ({showToast}) => {
  const [keyword, setKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const {searchResults } = useSelector(state=>state.shopSearch)
  const {cartItems } = useSelector(state=>state.shopCart)
  const { user } = useSelector(state=>state.auth)
  const { productDetails } = useSelector(state=>state.shopProducts)
  const dispatch = useDispatch();
//   const {toast} = useToast();

  useEffect(()=>{
    if(keyword && keyword.trim() !== "" && keyword.trim().length > 3){
        setTimeout(()=>{
           setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
           dispatch(getSearchResults(keyword));
        },1000)
    } else{
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
        dispatch(resetSearchResults())
    }
  },[keyword])

   function handleAddToCart(getCurrentProductId, getTotalStock){
  
         let getCartItems = cartItems.items || [];
         if(getCartItems.length){
          const indexOfCurrentItem = getCartItems.findIndex(item=>item.productId === getCurrentProductId);
          if(indexOfCurrentItem > -1){
            const getQuantity = getCartItems[indexOfCurrentItem].quantity;
            if(getQuantity + 1 > getTotalStock){
              //  toast({
              //   title: `Only ${getTotalStock} quantity can be added for this item`
              //   variant: "destructive"
              //  })
              showToast(`Only ${getTotalStock} quantity can be added for this item`);
              return;
            }
          }
  
         }
         
         dispatch(addToCart({userId: user?.id, productId: getCurrentProductId, quantity:1}))
         .then(data=>{
          if(data?.payload?.success){
              dispatch(fetchCartItems(user?.id))
              // toast({
              //   title: 'Product is added to cart',
                
              // })
              showToast('Product is added to cart');
          }
         });
    }

    function handleGetProductDetails(getCurrentProductId){
        dispatch(fetchProductDetails(getCurrentProductId))
      }

        useEffect(()=>{
            if(productDetails !== null){
            setOpenDetailsDialog(true);
            }
        },[productDetails])


  return (
    <div className='container px-auto md:px-6 px-4 py-8'>
      <div className='flex justify-center mb-8'>
        <div className='w-full flex items-center'>
            <Input
            value={keyword} name="keyword" onChange={(event)=>setKeyword(event.target.value)}
            placeholder = "Search Products..." className="py-6"
            />
        </div>
      </div>
      
      {
        !searchResults.length ?  <h1 className='text-5xl font-extrabold'>No Product Found</h1>: null
      }
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {
            
            searchResults.map(item=>  <ShoppingProductTile handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails} product={item}/>) 
        }
      </div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
    </div>
  )
}

export default SearchProducts
