import React, { useEffect, useState } from "react";
import Card from "./card/Card";
import Filter from "./filter/Filter";
import { CardsContainer, ReactPaginateContainer } from "./CardsStyles";
import Pagination from "./pagination/Pagination";

import ReactPaginate from "react-paginate";

import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../redux/reducers/index";
import { getProducts } from "../../../redux/actions/products";
import { Product } from "../../../redux/interface";
import Loading from "../../loading/Loading";
import Categories from "../categories/Categories";
import { ProductsContainer } from "../ProductsStyles";
import NotFound from "../../notFound/NotFound";
import { chargeFilter, filterProducts, removeFilter, resetFilterProducts } from "../../../redux/actions/filterByCategory";
import { execPath } from "process";
import { filterByBrand } from "../../../redux/actions/filterByBrand";
export interface IData {
  length: number;
  page: (numberOfPage: number) => void;
}

export interface ORDER {
  page: (numberOfPage: number) => void;
  orders: (typeorder: string) => void;
}

export interface FILTER_BOX {
  subcategory: string,
  brand: string
}

const Cards = (): JSX.Element => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [load, setLoad] = useState<boolean>(false)
  const [order, setOrder] = useState<string>("");
  const [filterBox, setFilterBox] = useState<FILTER_BOX>({
    subcategory: "",
    brand: ""
  })
  const productsList = useSelector((state: State) => state.products.products);
  const copyProductsList = useSelector((state: State) => state.products.copyProducts)
  const filteredProductList = useSelector((state: State) => state.filteredProducts.filteredProducts);
  const allSubcategories = useSelector((state: State) => state.categories.subcategories);
  const notFound = useSelector((state: State) => state.products.not_found);
  const pageState = useSelector((state: State) => state.page);

  const page = (numberOfPage: number): void => {
    setCurrentPage(numberOfPage);
  };
  const orders = (typeorder: string): void => {
    if (typeorder !== 'asc-price order' && typeorder !== 'des-price order' && typeorder !== 'des-name order' && typeorder !== 'asc-name order' && typeorder !== 'Order by order') {
      let existCat = allSubcategories.filter((e: any) => e.name === typeorder)
      if (existCat.length === 1) {
        setFilterBox({ ...filterBox, subcategory: typeorder })
        dispatch(chargeFilter(copyProductsList))
        if (filterBox.brand.length !== 0) {
          console.log('Hay brand')
          dispatch(filterByBrand(filterBox.brand))
        }
        dispatch(filterProducts(typeorder))
      }
      else {
        setFilterBox({ ...filterBox, brand: typeorder })
        dispatch(chargeFilter(copyProductsList))
        if (filterBox.subcategory.length !== 0) {
          console.log('Hay subcategory')
          dispatch(filterProducts(filterBox.subcategory))
        }
        dispatch(filterByBrand(typeorder))
      }
    }
    setOrder(typeorder);
  };



  const LoadCharge = (bool: boolean): void => {
    setLoad(bool)
    console.log(load)
  }

  useEffect(() => {
    setTimeout(() => {
      LoadCharge(true)
    }, 500)
  }, [setLoad])
  const finalProduct = currentPage * 32;
  const firstProduct = finalProduct - 32;
  let newProductsList: Product[] = [];
  let auxiliar: string = "Load";
  // (newProductsList = productsList.slice(firstProduct, finalProduct));
  // let newProductsList: Product[] = [];
  filteredProductList.length > 0
    ? (newProductsList = filteredProductList.slice(firstProduct, finalProduct))
    : (newProductsList = productsList.slice(firstProduct, finalProduct))

  // implementing react paginate

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected + 1);
  };

  const resetFilter = (e: any): void => {
    e.preventDefault()
    console.log(filterBox)
    console.log(e.target.value)
    if (filterBox.subcategory.length === 0 || filterBox.brand.length === 0) {
      dispatch(chargeFilter(copyProductsList))
    } else if (filterBox.subcategory === e.target.value) dispatch(removeFilter(filterBox.brand))
    else dispatch(removeFilter(filterBox.subcategory))
    let existCat = allSubcategories.filter((s: any) => s.name === e.target.value)
    console.log("existe ", existCat)
    if (existCat.length === 0) setFilterBox({ ...filterBox, brand: "" })
    else setFilterBox({ ...filterBox, subcategory: "" })
  }

  const eliminateFilters = (): void => {
    setFilterBox({
      ...filterBox,
      subcategory: "",
      brand: ""
    })
  }

  return (
    <ProductsContainer className="row row-cols-xl-2 row-cols-md-1 mx-auto">
      <div className="col-xl-3 col-sm-12">
        <Categories page={page} orders={orders} />
      </div>
      <div className="col-xl-9 col-md-12">
        <CardsContainer className="w-100 ">
          <Filter page={page} orders={orders} />

          {
            load === false ?
              <Loading></Loading>
              :
              filteredProductList.length > 0 ?
                <>
                  {filterBox.subcategory.length !== 0 ? <span><button value={filterBox.subcategory} onClick={(e) => resetFilter(e)} className="btn btn-primary mt-2 mr-2">{filterBox.subcategory}</button></span> : ""}
                  {filterBox.brand.length !== 0 ? <span><button value={filterBox.brand} onClick={(e) => resetFilter(e)} className="btn btn-primary mt-2 mr-2">{filterBox.brand}</button></span> : ""}
                  <div className="mt-3 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xxl-4 g-4 d-flex justify-content-center">
                    {newProductsList.map((e: Product) => {
                      return (
                        <div className="col" key={e.id}>
                          <Card
                            name={e.name}
                            image={e.image}
                            price={e.price}
                            id={e.id}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <ReactPaginateContainer>
                    <Pagination
                      productList={filteredProductList.length}
                      handlePageClick={handlePageClick}
                    ></Pagination>
                    {/* <ReactPaginate
                  pageCount={Math.ceil(productsList.length / 32)}
                  nextLabel={">"}
                  previousLabel={"<"}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                ></ReactPaginate> */}
                  </ReactPaginateContainer>
                </> : (
                  <NotFound eliminateFilters={eliminateFilters}></NotFound>
                )

          }
          {/* {
          filteredProductList.length !== 0 ? (
            <>
              <span><button onClick={(e) => resetFilter(e)} className="btn btn-primary mt-2">{filterBox ? filterBox : ""}</button></span>
              <div className="mt-3 row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 d-flex justify-content-center">
                {newProductsList.map((e: Product) => {
                  return (
                    <div className="col" key={e.id}>
                      <Card
                        name={e.name}
                        image={e.image}
                        price={e.price}
                        id={e.id}
                      />
                    </div>
                  );
                })}
              </div>
              <ReactPaginateContainer>
                <ReactPaginate
                  pageCount={Math.ceil(filteredProductList.length / 32)}
                  nextLabel={">"}
                  previousLabel={"<"}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                  pageRangeDisplayed={2}
                ></ReactPaginate>
              </ReactPaginateContainer>
            </>
          ) : newProductsList.length !== 0 ? (
            <>
              <div className="mt-3 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xxl-4 g-4 d-flex justify-content-center">
                {newProductsList.map((e: Product) => {
                  return (
                    <div className="col" key={e.id}>
                      <Card
                        name={e.name}
                        image={e.image}
                        price={e.price}
                        id={e.id}
                      />
                    </div>
                  );
                })}
              </div>
              <ReactPaginateContainer>
                <ReactPaginate
                  pageCount={Math.ceil(productsList.length / 32)}
                  nextLabel={">"}
                  previousLabel={"<"}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                  pageRangeDisplayed={2}
                ></ReactPaginate>
              </ReactPaginateContainer>
            </>
          ) : (
            <Loading></Loading>
          )} */}
        </CardsContainer>
      </div>
    </ProductsContainer>
  );
};
export default Cards;
