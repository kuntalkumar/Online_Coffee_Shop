import React, { useEffect, useState } from 'react'
import './Product.css'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { handleLoading, handleProductData } from '../../Redux/action'
import topimage from './topimage.PNG'
import { Center, Spinner } from '@chakra-ui/react';
import { Pagination } from '../Pagination/Pagination';
import { Link } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const Product = () => {
  const [sorting, setsorting] = useState('');
  const [btn, setbtn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast()


  useEffect(() => {
    let url = `https://mymock-sl72.onrender.com/products`;
    if (currentPage) {
      url += `?_limit=9&_page=${currentPage}`
    }
    else if (sorting && btn) {
      url += `?type=${btn}&_sort=price&_order=${sorting}`
    }

    else if (sorting) {
      url += `?_sort=price&_order=${sorting}`
    }
    else if (btn) {
      url += `?type=${btn}`
    }
    fetching(url)

  }, [btn, sorting, currentPage]);

  const dispatch = useDispatch();
  const { ProductData, loading } = useSelector((store) => store.productReducer)

  const fetching = (url) => {
    dispatch(handleLoading());
    axios.get(url)
      .then((resp) => { dispatch(handleProductData(resp.data)) })
      .catch((error) => {
        console.log(error)
      })



  }
  const handlebtn = (value) => {
    switch (value) {
      case "all": return setbtn('');
      case "coffee": return setbtn('coffee');
      case "coffee Maker": return setbtn('coffee Maker');
      case "Espresso Machines": return setbtn('Espresso Machines');
      case "accessories": return setbtn('accessories');
      default: throw new Error("invalid")
    }
  }

  const handlePageChange = (pageNumber) => {

    setCurrentPage(currentPage + pageNumber);

  };

  return (
    <div style={{ padding: "10px 20px 10px 20px " }} >
      <img style={{padding:"10px 0px 10px 0px"}}  src={topimage} alt="" />
      <div className='Product_Top_Button_Div' >
        <button value="all" onClick={(e) => { handlebtn(e.target.value) }}  >ALL</button>
        <button value="coffee" onClick={(e) => { handlebtn(e.target.value) }} >COFFEE</button>
        <button value="coffee Maker" onClick={(e) => { handlebtn(e.target.value) }} >COFFEE MAKER</button>
        <button value="Espresso Machines" onClick={(e) => { handlebtn(e.target.value) }} >ESPRESSO MACHINE</button>
        <button value="accessories" onClick={(e) => { handlebtn(e.target.value) }} >ACCESSORIES</button>
      </div>
      <div className='Product_Filter_Div'  >
        <select onChange={(e) => { setsorting(e.target.value) }} >
          <option value="" >SORTING</option>
          <option value="asc" >PRICE(LOWEST FIRST) </option>
          <option value="desc">PRICE(HIGHEST FIRST)</option>
        </select>
      </div>
      <div className='Product_Heading_Div' >
        <h1>{btn ? btn.toUpperCase() : "ALL"}</h1>
        <div className='Product_Heading_InnerDiv' >
          <p>A PERFECT COMBINATION OF FLAVORS AND AROMAS</p>
          <p>TOTAL 1-{ProductData.length} OF {ProductData.length}</p>
        </div>
      </div>
      {
        loading ? <Center><Spinner padding={"10px"} speed={'0.65s'} size={'xl'} /></Center>
          : <div>
            <div className='Product_Items_Div'>{
              ProductData?.map((ele, ind) => {
                return <div className='Product_Item' key={ind} >
                  <Link to={`/product/${ele.id}`} >
                    <div className='Product_Image_Div' ><img src={ele.image} alt={ele.title} /></div>
                    <div className='Product_title_Div' >
                      <h4>{ele.title}</h4>
                      <h4>{ele.price}$</h4>
                    </div>
                  </Link>
                </div>
              })

            }

            </div>
            {
              sorting || btn ? "" : <Pagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            }
          </div>
      }
    </div>
  )
}
