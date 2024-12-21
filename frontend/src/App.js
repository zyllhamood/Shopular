import React, { useEffect, useState } from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import InfoProduct from './screens/InfoProduct';
import Checkout from './screens/Checkout';
import Seller from './screens/Seller';
import ChangeProfile from './screens/ChangeProfile';
import AddProduct from './screens/AddProduct';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { get_info } from './store/authSlice';
import ChangePassword from './screens/ChangePassword';
import Users from './screens/Users';
import EditProduct from './screens/EditProduct';
import ManageProducts from './screens/ManageProducts';
import ProductsAdmin from './screens/ProductsAdmin';
import Payment from './screens/Payment';
import Orders from './screens/Orders';
import AllOrders from './screens/AllOrders';
import Navbar2 from './Old/Navbar2';
import Navbar3 from './components/Navbar3';
import Footer from './components/Footer';
import Error from './screens/Error';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const dispatch = useDispatch();
  const access_token = Cookies.get('access_token');
  const { isLogged, isAdmin } = useSelector((state) => state.auth);
  useEffect(() => {
    if (access_token !== undefined) {
      dispatch(get_info(access_token));
    }
  }, [access_token])




  return (
    <ChakraProvider>


      <Flex
        flex={1}
        minH={'100vh'}
        width={'100%'}
        flexDir={'column'}
        alignItems={'center'}

      >
        <Navbar />
        <ScrollToTop />
        <Routes>

          <Route exact path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/product/:id' element={<InfoProduct />} />
          <Route path='/checkout' element={<Checkout />} />

          {<Route path="/:username" element={<Seller />} />}


          <Route path='/payment/:code' element={<Payment />} />

          {/* <Route path='/csrf' element={<TestCsrf />} /> */}

          {isLogged && (
            <>
              <Route path='/settings' element={<ChangeProfile />} />
              <Route path='/add-product' element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path='/change-password' element={<ChangePassword />} />
              <Route path='/manage-products' element={<ManageProducts />} />
              <Route path='/orders' element={<Orders />} />
            </>
          )}





          {isAdmin && <Route path='/admin-products' element={<ProductsAdmin />} />}
          {isAdmin && <Route path='/all-orders' element={<AllOrders />} />}
          {isAdmin && <Route path='/users' element={<Users />} />}


          <Route path="*" element={<Error />} />



        </Routes>

      </Flex>
      <Footer />


    </ChakraProvider>
  );
}

export default App;
