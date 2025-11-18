import ProductImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { fetchAllProducts } from '@/store/admin/products-slice';
import { addFeatureImage, getFeatureImages } from '@/store/common-slice';
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: '',
}

export default function AdminDashboard({showToast}) {

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const {featureImageList} = useSelector(state=> state.commonFeature);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [openCreateProductsDialog, setopenCreateProductsDialog] = useState(false);
  const { productList } = useSelector(state => state.adminProducts)
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    currentEditedId !== null ?
      dispatch(editProduct({
        id: currentEditedId, formData
      })).then((data) => {
        console.log(data, "edit")
        if (data?.payload?.success) {
          //again fetch list of products
          dispatch(fetchAllProducts());
          setFormData(initialFormData)
          setopenCreateProductsDialog(false)
          setCurrentEditedId(null)
          showToast(data.payload.message, "success");
        }else{
          showToast(data?.payload?.message, "error");
        }
      }) :

      dispatch(addNewProduct({
        ...formData,
        image: uploadedImageUrl
      })).then((data) => {
        console.log(data);
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setImageFile(null);
          setFormData(initialFormData);
          setopenCreateProductsDialog(false);
          // toast({
          //   title : 'Product add successfully'
          // })
          showToast(data.payload.message, "success")
        }else{
          showToast(data?.payload.message,"error");
        }
      })
  }

  useEffect(()=>{
    dispatch(getFeatureImages())
  }, [dispatch])
 
  function handleUploadFeatureImage(){
      dispatch(addFeatureImage(uploadedImageUrl)).then(data=>{
        if(data?.payload?.success){
          dispatch(getFeatureImages())
          setImageFile(null)
          setUploadedImageUrl("");
          showToast(data.payload.message,"success");
        }else{
          showToast(data?.payload?.message, "error")
        }

      }
      )
  }
  return (
    <div className='bg-amber-50'>
    
      <ProductImageUpload
          imageFile={imageFile} setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          imageLoadingState={imageLoadingState}
          setImageLoadingState={setImageLoadingState}
          setUploadedImageUrl={setUploadedImageUrl}
          isCustomStyling={true}
          isEditMode={currentEditedId !== null}
          showToast={showToast}
        />
        <Button onClick={handleUploadFeatureImage} className="mt-5 w-full bg-black text-white">Upload</Button>
        <div className='flex flex-col gap-4 mt-5'>
          {
            featureImageList && featureImageList.length > 0 ? 
            featureImageList.map(featureImgItem =>
             <div className='relative' key={featureImgItem?._id}>
                <img 
                src={featureImgItem?.image}
                alt={featureImgItem?.title}
                className='w-full h-[300px] object-cover rounded-t-lg'
                />
            </div>
            
          ) : null
          }
        </div>
    </div>
  )
}
