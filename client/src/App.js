import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom'
import { Login, Home, Public, Blog, DetailProduct, FAQ, Service, Products, FinalRegister, ResetPassword, DetailCart, Checkout } from './pages/public'
import path from './utils/path'
import { getCategories } from './store/asyncAction'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import { Cart, Modal } from './components';
import { AdminLayout, CreateProduct, DashBoard, ManageOrder, ManageProduct, ManageUser } from './pages/admin';
import { History, MemberLayout, Personal, WishList } from './pages/member';
import { showCart } from 'store/appSlice';

function App() {
  const dispatch = useDispatch()
  const { isOpenModal, modalContent, isShowCart } = useSelector((state) => state.app)
  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])
  return (
    <div className="relative h-screen font-main">
      {isShowCart && <div onClick={() => dispatch(showCart({ isShowCart: false }))} className='absolute inset-0 z-50 flex justify-end bg-overlay'>
        <Cart />
      </div>}
      {isOpenModal && <Modal>{modalContent}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.BLOGS} element={<Blog />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.FAQ} element={<FAQ />} />
          <Route path={path.SERVICE} element={<Service />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
          <Route path={path.ALL} element={<Home />} />
          <Route path={path.ALL_PRODUCTS} element={<Products />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>


        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<DashBoard />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
          <Route path={path.MANAGE_PRODUCT} element={<ManageProduct />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
        </Route>

        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.MY_CART} element={<DetailCart />} />
          <Route path={path.WISH_LIST} element={<WishList />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.PERSONAL} element={<Personal />} />
        </Route>

        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
        <Route path={path.LOGIN} element={<Login />} />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
