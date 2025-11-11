import React, { useEffect, useState } from 'react'
import bannershop2 from "../../assets/bannershop2.jpg"
import shopping5 from "../../assets/shopping5.jpg"
import { Button } from '@/components/ui/button';
import { Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { getFeatureImages } from '@/store/common-slice';

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
]

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
]

export default function ShoppingHome({showToast}) {

  // const slides = [bannershop2, shopping5];
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(state => state.shopProducts)
  const {featureImageList} = useSelector(state=> state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector(state => state.auth)
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  // const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section]: [getCurrentItem.id]
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate("/shop/listing")
  }

   useEffect(()=>{
       dispatch(getFeatureImages())
     }, [dispatch])

  function handleGetProductDetails(getCurrentProductId) {

    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddToCart(getCurrentProductId) {

    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
      .then(data => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id))
          // toast({
          //   title: 'Product is added to cart',

          // })
         showToast(data.payload.message, "success")
        }else{
          showToast(data?.payload?.message, "error")
        }
      });
  }

   useEffect(()=>{
       if(productDetails !== null){
        setOpenDetailsDialog(true);
       }
    },[productDetails])

  useEffect(() => {
    const timer = setInterval(() => {

      setCurrentSlide((prevSlide)=> featureImageList && featureImageList.length > 0
    ? (prevSlide + 1) % featureImageList.length : 0)
    }, 3000)
    return () => clearInterval(timer);
  }, [featureImageList])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }))
  }, [dispatch])


  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[600px] overflow-hidden'>
        {
          featureImageList && featureImageList.length > 0 ?  featureImageList.map((slide, index) => 
          <img
            src={slide?.image}
            key={index}
            className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />) : null
        }
        <Button variant="outline" size="icon"
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className='w-4 h-4' />
        </Button>
        <Button variant="outline" size="icon"
          onClick={() => setCurrentSlide((nextSlide) => (nextSlide + 1) % featureImageList.length)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className='w-4 h-4' />
        </Button>
      </div>
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop by Category</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {
              categoriesWithIcon.map(categoryItem => <Card onClick={() => handleNavigateToListingPage(categoryItem, 'category')} key={categoryItem.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className='w-12 h-12 mb-4 text-primary' />
                  <span className='font-bold'>{categoryItem.label}</span>
                </CardContent>
              </Card>)
            }
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop by Brand</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {
              brandsWithIcon.map(brandItem => <Card
                onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className='w-12 h-12 mb-4 text-primary' />
                  <span className='font-bold'>{brandItem.label}</span>
                </CardContent>
              </Card>)
            }
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Feature Products
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {
              productList && productList.length > 0 ? productList.map(productItem => <ShoppingProductTile
                handleGetProductDetails={handleGetProductDetails}
                key={productItem._id}
                product={productItem}
                handleAddToCart={handleAddToCart} />) : null
            }
          </div>
        </div>
      </section>
      <ProductDetailsDialog open={openDetailsDialog} 
                            setOpen={setOpenDetailsDialog} 
                            productDetails={productDetails} 
                            showToast={showToast}/>
    </div>
  )
}
