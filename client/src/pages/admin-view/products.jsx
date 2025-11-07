import ProductImageUpload from '@/components/admin-view/image-upload';
import AdminProductTile from '@/components/admin-view/product-tile';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { addProductFormElements } from '@/config';
import { fetchAllProducts, addNewProduct, editProduct, deleteProduct } from '@/store/admin/products-slice';
import React, { Fragment, useEffect, useState } from 'react'
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



export default function AdminProducts() {
  const [openCreateProductsDialog, setopenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const { productList } = useSelector(state => state.adminProducts)
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  // const {toast} = useToast();

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
          setFormData(inititalFormData)
          setopenCreateProductsDialog(false)
          setCurrentEditedId(null)
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
        }
      })
  }

  function handleDelete(getCurrentProductId) {
    
    dispatch(deleteProduct(getCurrentProductId)).then(data=>{
      if(data?.payload?.success){
          dispatch(fetchAllProducts());
      }
    })
  }

  function isFormValid() {
    return Object.keys(formData)
      .map(key => formData[key] !== '')
      .every(item => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts())

  }, [dispatch])


  return <Fragment>
    <div className='mb-5 w-full flex justify-end'>
      <Button onClick={() => setopenCreateProductsDialog(true)}>Add New Product</Button>
    </div>
    <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
      {
        productList && productList?.length > 0 ?
          productList.map(productItem => <AdminProductTile key={productItem._id}
            setFormData={setFormData}
            setopenCreateProductsDialog={setopenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            product={productItem}
            handleDelete={handleDelete}

             />) : null
      }
    </div>

    <Sheet open={openCreateProductsDialog} onOpenChange={() => {
      setopenCreateProductsDialog(false);
      setCurrentEditedId(null)
      setFormData(inititalFormData)
    }}>
      <SheetContent side="right" className="overflow-auto bg-white">
        <SheetHeader>
          <SheetTitle>
            {
              currentEditedId !== null ? 'Edit Product' : 'Add New Product'
            }
          </SheetTitle>
        </SheetHeader>
        <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          imageLoadingState={imageLoadingState}
          setImageLoadingState={setImageLoadingState}
          setUploadedImageUrl={setUploadedImageUrl}
          isEditMode={currentEditedId !== null}
        />
        <div className='py-6 ml-4 mr-3.5'>
          <CommonForm formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? 'Edit' : 'Add'} onSubmit={onSubmit}
            formControls={addProductFormElements}
            isBtnDisabled={!isFormValid()}
          />
        </div>
      </SheetContent>
    </Sheet>

  </Fragment>
}
