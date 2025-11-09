import React, { useEffect, useState } from 'react'
import ProductFilter from "@/components/shopping-view/filter"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { ArrowUpDownIcon } from 'lucide-react'
import { sortOptions } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'

function createSearchParamsHelper(filterParams){
     const queryParams = [];
     
     for(const [key, value] of Object.entries(filterParams)){
      if(Array.isArray(value) && value.length > 0){
        const paramValue = value.join(',')
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
      }
     }
     return queryParams.join('&');
}

export default function ShoppingListing({showToast}) {

  const dispatch = useDispatch()
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const {user} = useSelector(state=>state.auth)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  //setSearchParams is dispatch method to help to update searchParams
  const [searchParams, setSearchParams] = useSearchParams();
  // const {toast} = useToast();
  const categorySearchParam = searchParams.get("category");
  const {cartItems} = useSelector(state=>state.shopCart);

  function handleSort(value){
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption){
         console.log(getCurrentOption, getSectionId)

         let cpyFilters = {...filters};
         const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

         if(indexOfCurrentSection === -1){
          //no filter is added for any category
          cpyFilters = {
            ...cpyFilters,
            [getSectionId]: [getCurrentOption]
          }
         }else{
          const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
          if(indexOfCurrentOption === -1){
            cpyFilters[getSectionId].push(getCurrentOption);
          }else{
            //remove it 
            cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
          }
         }
         
         setFilters(cpyFilters)
         sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId){
    dispatch(fetchProductDetails(getCurrentProductId))
  }

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
            showToast(`Only ${getTotalStock} quantity can be added for this item`,"info")
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
            showToast("Product is added to cart");
        }
       });
  }

  //To get filter options checked on page refresh
  useEffect(()=>{
     setSort('price-lowtohigh')
     setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
  },[categorySearchParam])

  useEffect(()=>{
      if(filters && Object.keys(filters).length > 0){
        const createQueryString = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(createQueryString))
      }
  },[filters])
 
  // fetch list of products
  useEffect(() => {
    if(filters !== null && sort !==null){
     
      dispatch(fetchAllFilteredProducts({filterParams: filters, sortParams: sort}))
    }
  }, [dispatch, sort, filters]);

  useEffect(()=>{
     if(productDetails !== null){
      setOpenDetailsDialog(true);
     }
  },[productDetails])

  // console.log( "filters   ",  filters, " searchParams ", searchParams.toString());
  // console.log("productList ",productList)  
  

  return <div className='grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6'>
    <ProductFilter filters={filters} handleFilter={handleFilter}/>
    <div className='bg-background w-full rounded-lg shadow-sm'>
      <div className='p-4 border-b flex items-center justify-between'>
        <h2 className='text-lg font-extrabold'>All Products</h2>
        <div className='flex items-center gap-3'>
          <span className='text-muted-foreground'>{productList?.length} Products</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDownIcon className='h-4 w-4' />
                <span>Sort by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='w-[200px] bg-white'>
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {
                  sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>{sortItem.label}</DropdownMenuRadioItem>)
                }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {
            productList && productList.length > 0 ?
              productList.map(productItem => <ShoppingProductTile 
                                      handleGetProductDetails={handleGetProductDetails} 
                                      handleAddToCart={handleAddToCart}
                                      product={productItem} 
                                      key={productItem._id}/>) : null
          }
        </div>
    </div>
  </div>
}
